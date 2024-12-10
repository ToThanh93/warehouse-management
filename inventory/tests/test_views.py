# inventory/tests/test_views.py

from rest_framework.test import APITestCase
from django.urls import reverse
from inventory.models import Product
from rest_framework import status

class ProductAPITest(APITestCase):
    def setUp(self):
        # Đặt URL cho danh sách sản phẩm
        self.url = reverse('product-list')
        
        # Tạo một sản phẩm mẫu trong cơ sở dữ liệu để kiểm tra
        self.product = Product.objects.create(
            name='Sample Product A',
            category='Category 1',
            unit='Piece'
        )

    def test_get_products(self):
        # Gửi yêu cầu GET tới API
        response = self.client.get(self.url)
        
        # Kiểm tra rằng mã trạng thái trả về là 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Kiểm tra rằng API trả về đúng số lượng sản phẩm
        self.assertEqual(len(response.data), 1)
        
        # Kiểm tra nội dung của sản phẩm đầu tiên trong phản hồi
        product_data = response.data[0]
        self.assertEqual(product_data['name'], 'Sample Product A')
        self.assertEqual(product_data['category'], 'Category 1')
        self.assertEqual(product_data['unit'], 'Piece')
