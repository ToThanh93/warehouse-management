import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_get_products():
    # Tạo dữ liệu giả
    from inventory.models import Product
    Product.objects.create(
        name="Test Product",
        description="Test Description",
        category="Test Category",
        unit="unit",
    )

    # Kiểm tra API
    client = APIClient()
    response = client.get('/api/products/')
    assert response.status_code == 200
    assert len(response.data) > 0