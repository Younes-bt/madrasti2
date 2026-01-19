import requests

# Test the stats endpoint
url = "http://localhost:8081/users/enrollments/stats/"

try:
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
    print(f"Response text: {response.text[:500]}")
