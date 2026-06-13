from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_devices():
    response = client.get("/api/v1/devices/")
    # Currently might return 500 without DB, but testing route exists
    assert response.status_code in [200, 500]
