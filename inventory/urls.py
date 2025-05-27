from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, InventoryViewSet, TransactionViewSet, ForecastViewSet, CSVUploadView,
    summary, demand_forecast, ForecastRequestView, WarehouseViewSet, inventory_alerts
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'forecasts', ForecastViewSet)
router.register(r'warehouses', WarehouseViewSet)

urlpatterns = [
    path('', include(router.urls)),                      
    path('summary/', summary),                          
    path('forecasts/', demand_forecast),               
    path('upload-csv/', CSVUploadView.as_view()),
    path('inventory-alerts/',inventory_alerts),
    path('v1/forecast/', ForecastRequestView.as_view()) 
]

