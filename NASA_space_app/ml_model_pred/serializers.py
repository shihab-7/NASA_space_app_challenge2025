from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    division = serializers.CharField(max_length=100)
    year = serializers.IntegerField()

class PredictionOutputSerializer(serializers.Serializer):
    regression_result = serializers.ListField(child=serializers.FloatField())
    classification_result = serializers.CharField()
    llm_suggestion = serializers.CharField()
