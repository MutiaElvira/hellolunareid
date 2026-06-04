import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

print("Starting API test for direct messaging endpoints using urllib...")

def make_request(url, data=None, headers=None, method="GET"):
    if headers is None:
        headers = {}
    
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            return status, json.loads(body) if body else None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body) if body else None
    except Exception as e:
        print("Request failed:", e)
        return 0, str(e)

# 1. Register a test user
test_user = {
    "username": "test_user_dm_1",
    "email": "test_dm_1@example.com",
    "password": "password123"
}

status, body = make_request(f"{BASE_URL}/register", data=test_user, method="POST")
print("Registration response:", status, body)

# 2. Login to get token
status, body = make_request(f"{BASE_URL}/login", data={
    "email": test_user["email"],
    "password": test_user["password"]
}, method="POST")

if status != 200:
    print("Login failed:", status, body)
    sys.exit(1)

token = body["access_token"]
print("Login successful! Token obtained.")

headers = {"Authorization": f"Bearer {token}"}

# 3. Fetch contacts
status, body = make_request(f"{BASE_URL}/messages/contacts", headers=headers, method="GET")
print("Contacts response status:", status)
if status == 200:
    print("Contacts count:", len(body))
    print("Contacts:", body)
else:
    print("Contacts failed:", body)

# 4. Send a message to ourselves (receiver_id is our own ID or 1)
# Let's see: we can fetch our profile first to get our user ID
status_prof, body_prof = make_request(f"{BASE_URL}/profile", headers=headers, method="GET")
our_id = body_prof["id"] if status_prof == 200 else 1
print("Our User ID:", our_id)

payload = {
    "receiver_id": our_id,
    "text": "Hello, this is a test message to myself!",
    "img_url": None
}
status, body = make_request(f"{BASE_URL}/messages", data=payload, headers=headers, method="POST")
print("Send message response status:", status)
if status == 200:
    print("Sent message content:", body)
    
    # 5. Fetch history
    status_hist, body_hist = make_request(f"{BASE_URL}/messages/{our_id}", headers=headers, method="GET")
    print("History response status:", status_hist)
    if status_hist == 200:
        print("Chat history count:", len(body_hist))
else:
    print("Send message failed:", body)
