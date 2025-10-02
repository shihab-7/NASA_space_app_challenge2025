from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decouple import config
from langchain.prompts import PromptTemplate
from huggingface_hub import InferenceClient


SECRECT_KEY = config("HUGGINGFACE_API_KEY")
REPO_ID = "mistralai/Mistral-7B-Instruct-v0.3"

def get_llm_suggestion(regression, classification):
	messages = [
		{"role": "system", "content": "You are an environment specialist that gives clear, practical suggestions based on data analysis results."},
		{"role": "user", "content": f"Given the regression results: {regression} as average night_light, NDVI, population density and classification: '{classification}', provide brief actionable 5 tips or steps to improve the light pollution situation."}
	]
	llm = InferenceClient(model=REPO_ID, token=SECRECT_KEY)
	response = llm.chat_completion(
		messages=messages,
		max_tokens=300,
		temperature=0.7
	)
	return response.choices[0].message["content"]

