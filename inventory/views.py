from rest_framework import viewsets, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
import csv
import traceback
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
import pandas as pd
from .models import Product, Inventory, Transaction, Forecast, Warehouse
from .serializers import (
    ProductSerializer, InventorySerializer, TransactionSerializer,
    ForecastSerializer, WarehouseSerializer
)
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from .ai_module import forecast_product_demand  # 🔁 GỌI MÔ-ĐUN AI THẬT
from rest_framework.exceptions import ValidationError
# ------------------ CRUD ViewSets ----------------------

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class InventoryViewSet(ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        default_user = User.objects.filter(username="NewThanh").first()
        if not default_user:
            raise ValidationError("Default user not found")
        serializer.save(user=default_user)


class ForecastViewSet(ModelViewSet):
    queryset = Forecast.objects.all().order_by('-date')  # 🟢 Quan trọng
    serializer_class = ForecastSerializer
    
class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer   
    
class CSVUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'Không có file nào được tải lên'}, status=400)

        try:
            df = pd.read_csv(file_obj)
            imported = 0
            skipped = 0

            # ✅ Gán user mặc định cho transaction
            from django.contrib.auth.models import User
            default_user = User.objects.first()

            # -------------------- THÊM SẢN PHẨM --------------------
            if {'name', 'description', 'category'}.issubset(df.columns):
                for _, row in df.iterrows():
                    name = str(row.get('name', '')).strip()
                    if not name:
                        skipped += 1
                        continue

                    _, created = Product.objects.get_or_create(
                        name=name,
                        defaults={
                            'description': str(row.get('description', '')).strip(),
                            'category': str(row.get('category', '')).strip()
                        }
                    )
                    if created:
                        imported += 1

            # -------------------- THÊM GIAO DỊCH --------------------
            elif {'product', 'quantity', 'date', 'transaction_type'}.issubset(df.columns):
                for _, row in df.iterrows():
                    product_name = str(row.get('product', '')).strip()
                    quantity = row.get('quantity')
                    date_str = row.get('date', '')
                    transaction_type = str(row.get('transaction_type', '')).strip().upper()

                    if not product_name or pd.isna(quantity) or not date_str or transaction_type not in ['IN', 'OUT']:
                        skipped += 1
                        continue

                    product_obj = Product.objects.filter(name=product_name).first()
                    if not product_obj:
                        skipped += 1
                        continue

                    try:
                        date_obj = pd.to_datetime(date_str)
                        quantity_val = int(quantity)
                    except Exception:
                        skipped += 1
                        continue

                    Transaction.objects.create(
                        product=product_obj,
                        quantity=quantity_val,
                        date=date_obj,
                        transaction_type=transaction_type,
                        user=default_user
                    )
                    imported += 1

                    # 🔁 Cập nhật tồn kho
                    inventory = Inventory.objects.filter(product=product_obj).first()
                    if inventory:
                        if transaction_type == 'IN':
                            inventory.quantity += quantity_val
                        elif transaction_type == 'OUT':
                            inventory.quantity -= quantity_val
                        inventory.save()

            # -------------------- THÊM KHO --------------------
            elif {'location', 'capacity', 'status'}.issubset(df.columns):
                for _, row in df.iterrows():
                    location = str(row.get('location', '')).strip()
                    capacity = row.get('capacity')
                    status = str(row.get('status', 'Active')).strip()

                    if not location:
                        skipped += 1
                        continue

                    try:
                        capacity_val = int(capacity) if not pd.isna(capacity) else None
                    except ValueError:
                        skipped += 1
                        continue

                    Warehouse.objects.create(
                        location=location,
                        capacity=capacity_val,
                        status=status
                    )
                    imported += 1

            else:
                return Response({'error': '❌ CSV không đúng định dạng. Vui lòng kiểm tra cột tiêu đề.'}, status=400)

            return Response({
                'message': '✅ Tải lên thành công',
                'rows_imported': imported,
                'rows_skipped': skipped
            }, status=200)

        except Exception as e:
            return Response({'error': f'Lỗi xử lý: {str(e)}'}, status=500)
# ------------------ Summary API for Dashboard ----------------------

@api_view(['GET'])
def summary(request):
    total_products = Product.objects.count()
    total_warehouses = Warehouse.objects.count()
    total_transactions = Transaction.objects.count()
    return Response({
        "total_products": total_products,
        "total_warehouses": total_warehouses,
        "total_transactions": total_transactions
    })

# ------------------ API GET Forecast Data for Frontend ----------------------

@api_view(['GET'])
def demand_forecast(request):
    product_id = request.query_params.get('product_id')
    horizon = int(request.query_params.get('horizon', 7))
    model_type = request.query_params.get('model', 'ARIMA')

    if not product_id:
        return Response({'error': 'Thiếu product_id'}, status=400)

    try:
        predictions = forecast_product_demand(product_id=int(product_id), model_type=model_type, horizon=horizon)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    return Response(predictions)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_csv(request):
    file_obj = request.FILES.get('file')
    if not file_obj:
        return Response({'error': 'No file provided'}, status=400)

    try:
        df = pd.read_csv(file_obj)
        # 👉 xử lý thêm nếu muốn ghi vào DB
        return Response({'message': 'Upload thành công', 'rows': len(df)})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def inventory_alerts(request):
    alerts = []
    for inventory in Inventory.objects.select_related('product').all():
        if inventory.quantity < inventory.min_quantity:
            alerts.append({
                "product": inventory.product.name,
                "current_quantity": inventory.quantity,
                "min_qty": inventory.min_quantity  #
            })
    return Response(alerts)
    
    
# ------------------ API cho WMS gọi dự báo mới (POST) ----------------------

class ForecastRequestView(APIView):
    def get_product(self, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None

    def handle_forecast(self, product_id, model_type, horizon):
        product_obj = self.get_product(product_id)
        if not product_obj:
            return Response({'error': f'Product ID {product_id} not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            predictions = forecast_product_demand(product_id=product_id, model_type=model_type, horizon=horizon)
        except ValueError as ve:
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("⚠️ Forecast error:", traceback.format_exc())
            return Response({'error': f'Model error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save to database
        for item in predictions:
            Forecast.objects.update_or_create(
                product=product_obj,
                date=item['date'],
                defaults={'predicted_quantity': item['predicted_quantity']}
            )

        return Response({
            "product": product_obj.name,
            "horizon": horizon,
            "model_used": model_type,
            "predictions": predictions
        }, status=status.HTTP_200_OK)

    def get(self, request):
        product_id = request.GET.get('product_id')
        model_type = request.GET.get('model', 'ARIMA')
        horizon = int(request.GET.get('horizon', 30))

        if not product_id:
            return Response({'error': 'Missing product_id'}, status=status.HTTP_400_BAD_REQUEST)

        return self.handle_forecast(product_id, model_type, horizon)

    def post(self, request):
        product_id = request.data.get('product_id')
        model_type = request.data.get('model', 'ARIMA')
        horizon = int(request.data.get('horizon', 30))

        if not product_id:
            return Response({'error': 'Missing product_id'}, status=status.HTTP_400_BAD_REQUEST)

        return self.handle_forecast(product_id, model_type, horizon)
    
    
    
    
    