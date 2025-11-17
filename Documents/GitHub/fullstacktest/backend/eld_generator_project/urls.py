from django.urls import path, include

urlpatterns = [
    path('api/', include('eld_generator.urls')),
]

