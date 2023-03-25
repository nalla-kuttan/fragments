# tests/integration/post-fragments-unauthenticated.hurl

# Confirm that posting a fragment when not authenticated produces a 401 error

# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# invalid@email.com:invalid
Authorization: Basic aW52YWxpZEBlbWFpbC5jb206aW52YWxpZA==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 401 error
HTTP/1.1 401
