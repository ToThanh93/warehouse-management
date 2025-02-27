from rest_framework import serializers
from .models import Product, Inventory, Transaction

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Inventory
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    user = serializers.StringRelatedField()

    class Meta:
        model = Transaction
        fields = '__all__'
