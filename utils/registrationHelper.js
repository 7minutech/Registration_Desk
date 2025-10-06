export function createRegistration(db, attendeeID, sessionID, callback){
    db.get(`SELECT session_id FROM attendee join registration on attendee._id = registration.attendee_id
            where session_id = ? and attendee._id = ?;`, [sessionID, attendeeID], (err, row) => {
        if (err) {
            console.error(err.message);
            return (callback({ error: err.message, status: 500 }));
        }
        if (row){
            return (callback({ error: `attendeeID: ${attendeeID} already has sessionID: ${sessionID}`, status: 400}));
        }   

        db.run(`insert into registration (attendee_id, session_id) values (?, ?);`, [attendeeID, sessionID], (err) => {
            if (err) {
                console.error(err.message);
                return (callback({ error: err.message, status: 500 }));
            }
            db.all(`select attendee.firstname, attendee.lastname, attendee.displayname, session_id, session.description
                    from attendee join registration on attendee._id = registration.attendee_id
                    join session on session._id = registration.session_id
                    where attendee._id = ?;`, [attendeeID], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return (callback({ error: err.message, status: 500 }));
                }
                if (rows.length == 0){
                    return (callback({ error: "Registration info not found", status: 404 }));
                }
                let first_row = rows[0];
                const attendeSessionData = {firstname: first_row.firstname, lastname: first_row.lastname,
                                            displayname: first_row.displayname, attendeeID: attendeeID}
                const sessionsData = [];
                rows.forEach(row => {
                    sessionsData.push({id: row.session_id, description: row.description})
                });
                attendeSessionData.sessions = sessionsData
                attendeSessionData.success = true

                return callback(null, attendeSessionData);
            });
        })
    });
}

export function getAttendeeRegistration(db, attendeeID, callback){
    db.all(`select attendee.firstname, attendee.lastname, attendee.displayname, session_id, session.description
            from attendee join registration on attendee._id = registration.attendee_id
            join session on session._id = registration.session_id
            where attendee._id = ?;`, [attendeeID], (err, rows) => {
        if (err) {
            console.error(err.message);
            return callback({error: err.message, status: 500});
        }
        if (rows.length == 0){
            return callback({error: "Attendee not found or has no registrations", status: 404});
        }
        let first_row = rows[0];
        const attendeSessionData = {firstname: first_row.firstname, lastname: first_row.lastname,
                                    displayname: first_row.displayname, attendeeID: attendeeID}
        const sessionsData = [];
        rows.forEach(row => {
            sessionsData.push({id: row.session_id, description: row.description})
        });
        attendeSessionData.sessions = sessionsData

        return callback(null, attendeSessionData);
    });
}