from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Kho hàng
class Warehouse(models.Model):
    location = models.CharField(max_length=255)
    capacity = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return self.location

# Sản phẩm
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)

    # ➕ Thêm ngưỡng cảnh báo tối thiểu tồn kho
    min_qty = models.PositiveIntegerField(default=0, verbose_name="Mức tồn kho tối thiểu")

    def __str__(self):
        return self.name

# Tồn kho – có thể có nhiều kho cho 1 sản phẩm
class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(default=0)
    min_quantity = models.IntegerField(default=0)
    max_quantity = models.IntegerField(default=0)

    def __str__(self):
        warehouse_name = self.warehouse.location if self.warehouse else "Chưa gán kho"
        return f"{self.product.name} - {self.quantity} tại {warehouse_name}"

# Giao dịch nhập / xuất
TRANSACTION_TYPES = (
    ('IN', 'Nhập kho'),
    ('OUT', 'Xuất kho'),
)

class Transaction(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, null=True, blank=True)
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        warehouse_name = self.warehouse.location if self.warehouse else "Chưa gán kho"
        return f"{self.transaction_type} - {self.product.name} ({self.quantity}) tại {warehouse_name}"

# Dự báo nhu cầu
class Forecast(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    predicted_quantity = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} tại {self.warehouse.location} - {self.date} → {self.predicted_quantity}"
