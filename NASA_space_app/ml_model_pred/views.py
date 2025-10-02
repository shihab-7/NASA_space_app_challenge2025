from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import pandas as pd
import joblib
import os
from .serializers import PredictionInputSerializer, PredictionOutputSerializer
from llm_suggestion.views import get_llm_suggestion

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
CSV_PATH = os.path.join(DATA_DIR, 'combined_data.csv')
REGRESSOR_PATH = os.path.join(DATA_DIR, 'multioutput_regressor.joblib')
CLASSIFIER_PATH = os.path.join(DATA_DIR, 'random_forest_classifier.joblib')

class DivisionListAPIView(APIView):
	def get(self, request):
		try:
			df = pd.read_csv(CSV_PATH)
			divisions = sorted(df['ADM1_NAME'].unique())
		except Exception as e:
			return Response({'error': f'CSV read error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		return Response({'divisions': divisions}, status=status.HTTP_200_OK)

class PredictAPIView(APIView):
	def post(self, request):
		input_serializer = PredictionInputSerializer(data=request.data)
		if not input_serializer.is_valid():
			return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		division = input_serializer.validated_data['division']
		year = input_serializer.validated_data['year']

		try:
			df = pd.read_csv(CSV_PATH)
		except Exception as e:
			return Response({'error': f'CSV read error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		# Get all divisions for one-hot encoding
		all_divisions = sorted(df['ADM1_NAME'].unique())

		# Try to get Shape_Area and Shape_Leng for the division
		division_rows = df[df['ADM1_NAME'] == division]
		if not division_rows.empty:
			shape_area = division_rows['Shape_Area'].mean()
			shape_leng = division_rows['Shape_Leng'].mean()
		else:
			# Use overall mean if division not found
			shape_area = df['Shape_Area'].mean()
			shape_leng = df['Shape_Leng'].mean()

		input_dict = {
			'Year': int(year),
			'Shape_Area': float(shape_area),
			'Shape_Leng': float(shape_leng)
		}
		for div in all_divisions:
			col_name = f'ADM1_NAME_{div}'
			input_dict[col_name] = 1 if div == division else 0

		input_df = pd.DataFrame([input_dict])

		try:
			regressor = joblib.load(REGRESSOR_PATH)
			classifier = joblib.load(CLASSIFIER_PATH)
		except Exception as e:
			return Response({'error': f'Model load error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		expected_cols = regressor.estimators_[0].feature_names_in_ if hasattr(regressor.estimators_[0], 'feature_names_in_') else input_df.columns
		for col in expected_cols:
			if col not in input_df.columns:
				input_df[col] = 0
		input_df = input_df[expected_cols]

		# Predict with regression model
		reg_output = regressor.predict(input_df)[0]

		
		reg_output_arr = np.array(reg_output)
		if reg_output_arr.ndim == 1:
			class_input = reg_output_arr.reshape(1, -1)
		else:
			class_input = reg_output_arr
		class_output = classifier.predict(class_input)[0]

		llm_suggestion = get_llm_suggestion(reg_output, class_output)

		output_serializer = PredictionOutputSerializer(data={
			'regression_result': list(reg_output) if hasattr(reg_output, '__iter__') and not isinstance(reg_output, str) else [reg_output],
			'classification_result': str(class_output),
			'llm_suggestion': llm_suggestion
		})
		output_serializer.is_valid(raise_exception=True)
		return Response(output_serializer.data, status=status.HTTP_200_OK)
