from rest_framework import serializers
from .models import Product, Inventory, Transaction, Forecast, Warehouse
from django.contrib.auth.models import User


class ForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forecast
        fields = '__all__'
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    warehouse = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = '__all__'

    def get_warehouse(self, obj):
        return obj.warehouse.location if obj.warehouse else None

class TransactionSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    date = serializers.DateTimeField(required=False)  #
    class Meta:
        model = Transaction
        fields = ['id', 'product', 'product_id', 'transaction_type', 'quantity', 'date', 'user', 'user_id']
class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'