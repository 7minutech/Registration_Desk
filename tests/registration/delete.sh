curl -X DELETE http://localhost:8080/attendees/1/registrations \
    -H "Content-Type: application/json" \
    -d '{"sessionID": "4"}'