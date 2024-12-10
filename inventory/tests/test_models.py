# inventory/tests/test_models.py

from django.test import TestCase
from inventory.models import Product

class TestProductModel(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='Screwdriver',
            category='Construction tools',
            unit='unit'
        )

    def test_product_creation(self):
        """Kiểm tra xem sản phẩm được tạo có các thuộc tính đúng không"""
        product = Product.objects.get(name='Screwdriver')
        self.assertEqual(product.category, 'Construction tools')
        self.assertEqual(product.unit, 'unit')

    def test_product_has_id(self):
        """Kiểm tra rằng sản phẩm đã được gán ID sau khi tạo"""
        product = Product.objects.get(name='Screwdriver')
        self.assertIsNotNone(product.id)
