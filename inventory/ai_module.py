from .models import Transaction, Forecast
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

# ARIMA
from statsmodels.tsa.arima.model import ARIMA

# LSTM
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense

# Lấy dữ liệu theo product
def get_sales_series(product_id):
    qs = Transaction.objects.filter(
        product_id=product_id, transaction_type='OUT'
    ).order_by('date').values('date', 'quantity')
    
    df = pd.DataFrame.from_records(qs)
    if df.empty:
        return None

    df['date'] = pd.to_datetime(df['date']).dt.date
    df = df.groupby('date').sum().asfreq('D', fill_value=0)
    return df['quantity']

# Hàm dự báo chung
def forecast_product_demand(product_id, model_type="ARIMA", horizon=7):
    sales_series = get_sales_series(product_id)
    if sales_series is None or len(sales_series) < 10:
        raise ValueError("Not enough data to forecast")

    today = datetime.today().date()

    if model_type == "ARIMA":
        model = ARIMA(sales_series, order=(2, 1, 2))
        model_fit = model.fit()
        forecast_values = model_fit.forecast(steps=horizon)

    elif model_type == "LSTM":
        scaler = MinMaxScaler()
        scaled = scaler.fit_transform(sales_series.values.reshape(-1, 1))

        if len(scaled) < 6:
            raise ValueError("Not enough data for LSTM")

        X, y = [], []
        for i in range(len(scaled) - 5):
            X.append(scaled[i:i + 5])
            y.append(scaled[i + 5])
        X, y = np.array(X), np.array(y)
        X = X.reshape((X.shape[0], X.shape[1], 1))

        model = Sequential()
        model.add(LSTM(50, input_shape=(X.shape[1], 1)))
        model.add(Dense(1))
        model.compile(loss='mse', optimizer='adam')
        model.fit(X, y, epochs=50, verbose=0)

        last_seq = scaled[-5:].reshape(1, 5, 1)
        forecast_values = []
        for _ in range(horizon):
            next_val = model.predict(last_seq, verbose=0)[0][0]
            inv_val = scaler.inverse_transform([[next_val]])[0][0]
            forecast_values.append(inv_val)
            last_seq = np.append(last_seq[:, 1:, :], [[[next_val]]], axis=1)

    elif model_type == "HYBRID":
        # ARIMA forecast
        model_arima = ARIMA(sales_series, order=(2, 1, 2)).fit()
        forecast_arima = model_arima.forecast(steps=horizon).values

        # LSTM forecast
        scaler = MinMaxScaler()
        scaled = scaler.fit_transform(sales_series.values.reshape(-1, 1))
        if len(scaled) < 6:
            raise ValueError("Not enough data for LSTM")

        X, y = [], []
        for i in range(len(scaled) - 5):
            X.append(scaled[i:i + 5])
            y.append(scaled[i + 5])
        X = np.array(X).reshape((len(X), 5, 1))
        y = np.array(y)

        model = Sequential([
            LSTM(50, activation='relu', input_shape=(5, 1)),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        model.fit(X, y, epochs=50, verbose=0)

        last_seq = scaled[-5:].reshape(1, 5, 1)
        forecast_lstm = []
        for _ in range(horizon):
            next_val = model.predict(last_seq, verbose=0)[0][0]
            inv_val = scaler.inverse_transform([[next_val]])[0][0]
            forecast_lstm.append(inv_val)
            last_seq = np.append(last_seq[:, 1:, :], [[[next_val]]], axis=1)

        # Combine ARIMA and LSTM predictions
        w1, w2 = 0.3, 0.7
        forecast_values = w1 * np.array(forecast_arima) + w2 * np.array(forecast_lstm)

    else:
        raise ValueError("Invalid model type")

    forecast_list = []
    for i, val in enumerate(forecast_values):
        forecast_date = today + timedelta(days=i)
        forecast_list.append({
            "date": str(forecast_date),
            "product": product_id,
            "predicted_quantity": round(float(val))
        })

    return forecast_list





