import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { isValidSessionID } from '../utils/sessionHelper.js';

router.get('/:id/registrations', (req, resp) => {
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

        resp.json(attendeSessionData);
    });
});

router.post('/:id/registrations', (req, resp) => {
    let sessionID = req.body.sessionID 
    let attendeeID = req.params.id
    db.get(`SELECT session_id FROM attendee join registration on attendee._id = registration.attendee_id
            where session_id = ? and attendee._id = ?;`, [sessionID, req.params.id], (err, row) => {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        if (row){
            return resp.status(400).json({ error: `attendeeID: ${attendeeID} already has sessionID: ${sessionID}` });
        }   

        db.run(`insert into registration (attendee_id, session_id) values (?, ?);`, [attendeeID, sessionID], (err) => {
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
            return resp.status(400).json({ error: `attendeeID: ${attendeeID} already has sessionID: ${nextSessionID}` });
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

export default router