import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { isValidSessionID } from '../utils/sessionHelper.js';
import { createRegistration, getAttendeeRegistration } from '../utils/registrationHelper.js';


router.get('/registration/edit', (req, resp) => {
    db.all("select * from attendee order by lastname;", [], (err, attendeeRows) => {
        if (err) {
            return resp.status(500).json({error: err.message});
        }

        db.all("select _id, description from session", [], (err, sessionRows) => {
            if (err) {
                return resp.status(500).json({error: err.message});
            }
            resp.render("edit_session", { sessions: sessionRows, attendees: attendeeRows });
        });
    });
});


router.get('/:id/registrations', (req, resp) => {
    getAttendeeRegistration(db, req.params.id, (err, result) => {
        if (err){
            return resp.status(err.status).json(err)
        }
        return resp.json(result)
    })
});

router.post('/:id/registrations', (req, resp) => {
    let sessionID = req.body.sessionID 
    let attendeeID = req.params.id
    createRegistration(db, attendeeID, sessionID, (err, result) =>{
        if (err){
            return resp.status(err.status).json(err);
        }
        return (resp.json(result));
    })
});

router.put('/:id/registrations', (req, resp) => {
    if (req.headers["content-type"] != "application/json"){
        return resp.status(400).json({ error: 'Content-Type must be application/json' });
    }
    let prevSessionID = req.body.prevSessionID 
    let nextSessionID = req.body.nextSessionID
    let attendeeID = req.params.id
    const attendee = req.body
    if (!isValidSessionID(nextSessionID)){
        return resp.status(404).json({ error: `Session not found` });
    }  
    db.get(`SELECT * from registration where session_id = ? and attendee_id = ?;`, [nextSessionID, attendeeID], (err, row) => {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        if (row){
            return resp.status(200).json({ success: true, message: "Already Registred" });
        }   

        db.run(`update registration set session_id = ? where attendee_id = ? and session_id = ?;`, 
            [nextSessionID, attendeeID, prevSessionID], function (err) {
            if (err) {
                console.error(err.message);
                return resp.status(500).json({ error: err.message });
            }
            db.all(`select attendee.firstname, attendee.lastname, attendee.displayname, session_id, session.description
                    from attendee join registration on attendee._id = registration.attendee_id
                    join session on session._id = registration.session_id
                    where attendee._id = ?;`, [req.params.id], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return resp.status(500).json({ error: err.message });
                }
                if (rows.length == 0){
                    return resp.status(404).json({ error: "Registration info not found" });
                }
                let first_row = rows[0];
                const attendeSessionData = {firstname: first_row.firstname, lastname: first_row.lastname,
                                            displayname: first_row.displayname, attendeeID: req.params.id}
                const sessionsData = [];
                rows.forEach(row => {
                    sessionsData.push({id: row.session_id, description: row.description})
                });
                attendeSessionData.sessions = sessionsData
                attendeSessionData.success = true

                resp.json(attendeSessionData);
            });
        })
    });
});

router.delete('/:id/registrations', (req, resp) => {
    if (req.headers["content-type"] != "application/json"){
        return resp.status(400).json({ error: 'Content-Type must be application/json' });
    }
    let sessionID = req.body.sessionID
    let attendeeID = req.params.id
    db.get(`SELECT session_id FROM attendee join registration on attendee._id = registration.attendee_id
            where session_id = ? and attendee._id = ?;`, [sessionID, req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        if (!row){
            return resp.status(200).json({ success: true, message: "Already Unregistered" });
        }  
        db.run(`delete from registration where attendee_id = ? and session_id = ?;`, 
            [attendeeID, sessionID], function (err) {
            if (err) {
                console.error(err.message);
                return resp.status(500).json({ error: err.message });
            }
            db.all(`select attendee.firstname, attendee.lastname, attendee.displayname, session_id, session.description
                    from attendee join registration on attendee._id = registration.attendee_id
                    join session on session._id = registration.session_id
                    where attendee._id = ?;`, [req.params.id], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return resp.status(500).json({ error: err.message });
                }
                if (rows.length == 0){
                    return resp.status(200).json({ success: "true", message: "Attendee succesfully unregistered; Attendee has no more sessions"});
                }
                let first_row = rows[0];
                const attendeSessionData = {firstname: first_row.firstname, lastname: first_row.lastname,
                                            displayname: first_row.displayname, attendeeID: req.params.id}
                const sessionsData = [];
                rows.forEach(row => {
                    sessionsData.push({id: row.session_id, description: row.description})
                });
                attendeSessionData.sessions = sessionsData;
                attendeSessionData.success = true;
                attendeSessionData.message = "Attendee Successfully Unregistered";

                resp.status(200).json(attendeSessionData);
            });
        }) 
    })
})

export default router