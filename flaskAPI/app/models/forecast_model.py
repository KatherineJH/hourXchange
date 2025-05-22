# ## ================= Prophet =================== #
# # from prophet import Prophet
# # import pandas as pd

# # def predict_sales(history, periods=7):
# #     """
# #     history: [{ "ds": "2024-01-01", "y": 100 }, ...]
# #     periods: 며칠 예측할지 (default: 7일)
# #     """
# #     df = pd.DataFrame(history)
# #     df['ds'] = pd.to_datetime(df['ds'])

# #     model = Prophet()
# #     model.fit(df)

# #     future = model.make_future_dataframe(periods=periods)
# #     forecast = model.predict(future)

# #     # 예측 결과 중 필요한 정보만 반환
# #     result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
# #     return result.to_dict(orient="records")

# ## # ================ XGBoost =================== ##
# # from xgboost import XGBRegressor
# # import pandas as pd
# # import numpy as np
# # from datetime import timedelta

# # def predict_sales(history, periods=7):
# #     df = pd.DataFrame(history)
# #     df['ds'] = pd.to_datetime(df['ds'])
# #     df = df.sort_values('ds')

# #     df['day_of_week'] = df['ds'].dt.dayofweek
# #     df['month'] = df['ds'].dt.month
# #     df['day_of_year'] = df['ds'].dt.dayofyear
# #     df['lag_1'] = df['y'].shift(1)
# #     df['lag_7'] = df['y'].shift(7)
# #     df['rolling_mean_7'] = df['y'].rolling(window=7).mean()

# #     df = df.dropna()
# #     features = ['day_of_week', 'month', 'day_of_year', 'lag_1', 'lag_7', 'rolling_mean_7']
# #     X_train = df[features]
# #     y_train = df['y']

# #     model = XGBRegressor(n_estimators=200, learning_rate=0.05, max_depth=4, random_state=42)
# #     model.fit(X_train, y_train)

# #     last_known = df.iloc[-7:].copy()
# #     last_date = df['ds'].max()
# #     forecast = []

# #     for i in range(periods):
# #         date = last_date + timedelta(days=1)
# #         day_of_week = date.dayofweek
# #         month = date.month
# #         day_of_year = date.dayofyear

# #         lag_1 = last_known['y'].iloc[-1]
# #         lag_7 = last_known['y'].iloc[-7] if len(last_known) >= 7 else lag_1
# #         rolling_mean_7 = last_known['y'].tail(7).mean()

# #         X_pred = pd.DataFrame([{
# #             'day_of_week': day_of_week,
# #             'month': month,
# #             'day_of_year': day_of_year,
# #             'lag_1': lag_1,
# #             'lag_7': lag_7,
# #             'rolling_mean_7': rolling_mean_7
# #         }])

# #         y_pred = model.predict(X_pred)[0]
# #         y_pred = max(y_pred, 0)

# #         forecast.append({
# #             'ds': date.strftime('%Y-%m-%d'),  # ✅ Ensure JSON serializable
# #             'yhat': float(y_pred),
# #             'yhat_lower': float(y_pred * 0.9),
# #             'yhat_upper': float(y_pred * 1.1),
# #         })

# #         last_known = pd.concat([
# #             last_known,
# #             pd.DataFrame({'ds': [date], 'y': [y_pred]})
# #         ], ignore_index=True).iloc[-7:]
# #         last_date = date

# #     return forecast

# ## ================ XGBoost + STL Decomposition =================== ##
from xgboost import XGBRegressor
import pandas as pd
import numpy as np
from datetime import timedelta
from statsmodels.tsa.seasonal import STL

def predict_sales(history, periods=7):
    """
    history: [{ "ds": "2024-01-01", "y": 100 }, ...]
    periods: Number of days to predict (default: 7)
    """
    # Convert history to DataFrame
    df = pd.DataFrame(history)
    df['ds'] = pd.to_datetime(df['ds'])
    df = df.sort_values('ds')

    # Ensure continuous dates by filling missing dates with zeros
    date_range = pd.date_range(start=df['ds'].min(), end=df['ds'].max(), freq='D')
    df = df.set_index('ds').reindex(date_range, fill_value=0).reset_index()
    df = df.rename(columns={'index': 'ds', 0: 'y'})

    # Smooth the data to reduce noise
    df['y_smoothed'] = df['y'].rolling(window=3, center=True, min_periods=1).mean()

    # Feature Engineering
    df['day_of_week'] = df['ds'].dt.dayofweek
    df['month'] = df['ds'].dt.month
    df['day_of_year'] = df['ds'].dt.dayofyear
    df['days_since_start'] = (df['ds'] - df['ds'].min()).dt.days  # Trend feature
    df['lag_1'] = df['y_smoothed'].shift(1)
    df['lag_7'] = df['y_smoothed'].shift(7)
    df['lag_14'] = df['y_smoothed'].shift(14)
    df['lag_28'] = df['y_smoothed'].shift(28)
    df['rolling_mean_7'] = df['y_smoothed'].rolling(window=7).mean()

    # Add seasonality indicators (e.g., high-traffic days)
    df['is_high_traffic_day'] = df['day_of_week'].isin([0, 6]).astype(int)  # Example: Mon/Sun

    # Decompose the series to extract trend and seasonality
    stl = STL(df['y_smoothed'], period=7, robust=True)
    result = stl.fit()
    df['trend'] = result.trend
    df['seasonal'] = result.seasonal

    # Drop rows with NaN values
    df = df.dropna()
    features = ['day_of_week', 'month', 'day_of_year', 'days_since_start', 
                'lag_1', 'lag_7', 'lag_14', 'lag_28', 'rolling_mean_7', 
                'is_high_traffic_day', 'trend', 'seasonal']
    X_train = df[features]
    y_train = df['y_smoothed']

    # Train XGBoost model with tuned parameters
    model = XGBRegressor(
        n_estimators=300,
        learning_rate=0.03,
        max_depth=3,
        min_child_weight=2,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Prepare for forecasting
    last_known = df.iloc[-28:].copy()  # Keep last 28 days for lagged features
    last_date = df['ds'].max()
    forecast = []

    # Extend trend and seasonality for future dates
    last_trend_slope = (df['trend'].iloc[-1] - df['trend'].iloc[-7]) / 7  # Weekly trend slope
    last_seasonal = df['seasonal'].tail(7).values  # Last week's seasonality

    for i in range(periods):
        date = last_date + timedelta(days=1)
        day_of_week = date.dayofweek
        month = date.month
        day_of_year = date.dayofyear
        days_since_start = (date - df['ds'].min()).to_timedelta64() / np.timedelta64(1, 'D')

        lag_1 = last_known['y_smoothed'].iloc[-1]
        lag_7 = last_known['y_smoothed'].iloc[-7] if len(last_known) >= 7 else lag_1
        lag_14 = last_known['y_smoothed'].iloc[-14] if len(last_known) >= 14 else lag_1
        lag_28 = last_known['y_smoothed'].iloc[-28] if len(last_known) >= 28 else lag_1
        rolling_mean_7 = last_known['y_smoothed'].tail(7).mean()
        is_high_traffic_day = int(day_of_week in [0, 6])

        # Extrapolate trend and seasonality
        trend = df['trend'].iloc[-1] + last_trend_slope * (i + 1)
        seasonal = last_seasonal[i % 7]

        X_pred = pd.DataFrame([{
            'day_of_week': day_of_week,
            'month': month,
            'day_of_year': day_of_year,
            'days_since_start': days_since_start,
            'lag_1': lag_1,
            'lag_7': lag_7,
            'lag_14': lag_14,
            'lag_28': lag_28,
            'rolling_mean_7': rolling_mean_7,
            'is_high_traffic_day': is_high_traffic_day,
            'trend': trend,
            'seasonal': seasonal
        }])

        y_pred = model.predict(X_pred)[0]
        y_pred = max(y_pred, 0)  # Ensure non-negative predictions
        # y_pred = min(y_pred, 15)  
        y_pred = min(y_pred, df['y'].max() * 1.2)


        forecast.append({
            'ds': date.strftime('%Y-%m-%d'),
            'yhat': float(y_pred),
            'yhat_lower': float(y_pred * 0.9),
            'yhat_upper': float(y_pred * 1.1),
        })

        last_known = pd.concat([
            last_known,
            pd.DataFrame({'ds': [date], 'y': [y_pred], 'y_smoothed': [y_pred], 
                         'trend': [trend], 'seasonal': [seasonal]})
        ], ignore_index=True).iloc[-28:]
        last_date = date

    return forecast