import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"

router.get('/:id', (req, resp) => {
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
        const attendeSessionData = {firstname: first_row.firstname, lastname: first_row.lastname, displayname: first_row.displayname}
        const sessionsData = [];
        rows.forEach(row => {
            sessionsData.push({id: row.session_id, description: row.description})
        });
        attendeSessionData.sessions = sessionsData

        resp.json(attendeSessionData);
    });
});

export default router