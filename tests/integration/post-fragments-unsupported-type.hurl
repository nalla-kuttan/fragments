# tests/integration/post-fragments-unsupported-type.hurl
# Confirm that posting an unsupported Content-Type (text/xml) produces a 415 error

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a xml fragment
Content-Type: text/xml
# Body of the request goes in ```...``` 
```<body>This is a fragment</body>```

# We expect to get back a 415 error
HTTP/1.1 415
