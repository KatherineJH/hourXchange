from prophet import Prophet
import pandas as pd

def predict_sales(history, periods=7):
    """
    history: [{ "ds": "2024-01-01", "y": 100 }, ...]
    periods: 며칠 예측할지 (default: 7일)
    """
    df = pd.DataFrame(history)
    df['ds'] = pd.to_datetime(df['ds'])

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)

    # 예측 결과 중 필요한 정보만 반환
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
    return result.to_dict(orient="records")
