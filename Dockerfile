FROM python:3.11-slim

# Cài các gói hệ thống cần thiết (có thêm git)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    git \
    && apt-get clean

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép requirements.txt
COPY requirements.txt .

# Cài pip và requirements
RUN pip install --upgrade pip && pip install -r requirements.txt

# Sao chép mã nguồn
COPY . .

# (Tùy chọn) collect static nếu dùng Django
RUN python manage.py collectstatic --noinput || true

# Mở cổng
EXPOSE 8000

# Khởi động server
CMD ["gunicorn", "warehouse_management.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
