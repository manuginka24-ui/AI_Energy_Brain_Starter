import numpy as np
from sklearn.linear_model import LinearRegression
# Demonstration values only. Replace with daily totals from your own database.
days=np.array([1,2,3,4,5,6,7]).reshape(-1,1)
kwh=np.array([4.2,4.5,4.1,4.8,5.0,4.7,5.2])
model=LinearRegression().fit(days,kwh)
print(f"Predicted usage for day 8: {model.predict([[8]])[0]:.2f} kWh")
print("Demo model only: validate with a larger historical dataset.")
