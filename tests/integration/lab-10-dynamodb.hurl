# tests/integration/lab-10-dynamodb.hurl
# 1. POST a new JSON fragment to http://localhost:8080 as an authorized user. 
# The fragment's body should be the JSON value, { "service": "DynamoDB" }
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a json fragment
Content-Type: application/json
# Body of the request is key value pair
{ 
  "service": "DynamoDB" 
}

# 2. Confirm that the server returns a 201, 
# and capture the Location header value and the fragment's id in variables named fragment1_url and fragment1_id

# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. GET the fragment info (i.e., metadata) for the fragment you just created using the Location URL/info as an authorized user 
# and confirm that the server returns a 200 and that all of the metadata properties match what you expect.
# GET {{fragment1_url}}/info
# Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# HTTP/1.1 200
# [Asserts]
# Our fragment ids use https://www.npmjs.com/package/nanoid
# jsonpath "$.fragment.id" == "{{fragment1_id}}"
# Our ownerId hash is a hex encoded string
# jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
# jsonpath "$.fragment.created" isString
# jsonpath "$.fragment.updated" isString
# jsonpath "$.fragment.type" == "application/json"

# 4. POST a second Markdown fragment to http://localhost:8080 as the same authorized user. 
# The fragment's body should be the Markdown value, DynamoDB is **great**..

# Authenticated POST Markdown to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a Markdown fragment
Content-Type: text/markdown
# Body of the request goes in ```...``` when it's a string
```
DynamoDB is **great**
```

# 5. Confirm that the server returns a 201, 
# and once again capture the Location header value and the second id in variables named fragment2_url and fragment2_id

HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6. GET the fragment info (i.e., metadata) you just created using the url/info as an authorized user 
# and confirm that the server returns a 200 and that all of the metadata properties match what you expect.

# Try to GET the fragment we just posted by its URL
# GET {{fragment2_url}}/info
# Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# HTTP/1.1 200
# [Asserts]
# Our fragment ids use https://www.npmjs.com/package/nanoid
# jsonpath "$.fragment.id" == "{{fragment2_id}}"
# Our ownerId hash is a hex encoded string
# jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
# jsonpath "$.fragment.created" isString
# jsonpath "$.fragment.updated" isString
# jsonpath "$.fragment.type" == "text/markdown"

# 7. GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) 
# and confirm that the list of fragments includes the two id values you captured above

GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
# Our fragment ids use https://www.npmjs.com/package/nanoid

jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"

# 8. DELETE the first fragment you created above
DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 9. Confirm that the server returns a 200
HTTP/1.1 200

# 10. Try to GET the first fragment again using the url you captured above as the authorized user.
GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 11. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404

# 12. GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) a second time, 
# and confirm that the first id is NOT included but that the second id is (i.e., that the second was deleted).
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"
