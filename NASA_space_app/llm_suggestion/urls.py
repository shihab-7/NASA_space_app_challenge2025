from django.urls import path
from .views import SuggestionAPIView

urlpatterns = [
    path('suggest/', SuggestionAPIView.as_view(), name='suggestion'),
]
