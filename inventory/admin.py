from django.contrib import admin
from .models import Product, Warehouse, Inventory, Transaction

admin.site.register(Product)
admin.site.register(Warehouse)
admin.site.register(Inventory)
admin.site.register(Transaction)