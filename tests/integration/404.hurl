# Request route that doesn't exist test
GET http://localhost:8080/no-such-route

# We should get back an HTTP 404 response
HTTP/1.1 404