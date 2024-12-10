from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, InventoryViewSet, TransactionViewSet, demand_forecast

# Tạo một router duy nhất
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'transactions', TransactionViewSet)

# Định nghĩa urlpatterns
urlpatterns = [
    path('', include(router.urls)),             # Bao gồm tất cả các URL từ router
    path('forecasts/', demand_forecast, name='demand_forecast'),  # URL riêng cho dự báo
]
