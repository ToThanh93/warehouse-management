from rest_framework import viewsets
from .models import Product, Inventory, Transaction
from rest_framework.viewsets import ModelViewSet
from .serializers import ProductSerializer, InventorySerializer, TransactionSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ai_module import get_demand_forecast

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()  # Truy vấn bảng đúng
    serializer_class = ProductSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

@api_view(['GET'])
def demand_forecast(request):
    forecasts = get_demand_forecast()
    return Response(forecasts)