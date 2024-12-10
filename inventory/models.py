from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    min_quantity = models.IntegerField()
    max_quantity = models.IntegerField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"

TRANSACTION_TYPES = (
    ('IN', 'Nhập kho'),
    ('OUT', 'Xuất kho'),
)

class Transaction(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.transaction_type} - {self.product.name} - {self.quantity}"
