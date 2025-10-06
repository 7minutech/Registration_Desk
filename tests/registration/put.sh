curl -X PUT http://localhost:8080/attendees/2/registrations \
     -H "Content-Type: application/json" \
     -d '{"prevSessionID": "2", "nextSessionID": "3"}'
