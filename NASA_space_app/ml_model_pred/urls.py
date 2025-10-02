from django.urls import path
from .views import PredictAPIView, DivisionListAPIView

urlpatterns = [
    path('predict/', PredictAPIView.as_view(), name='predict'),
    path('divisions/', DivisionListAPIView.as_view(), name='division-list'),
]
