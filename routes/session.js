import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { isValidSessionID } from '../utils/sessionHelper.js';

router.get('/', (req, resp) => {
    db.all(`SELECT * FROM session`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        let sessions = []
        rows.forEach(row => {
            sessions.push({id: row._id, description: row.description})
        });

        resp.json(sessions);
    });
});

router.get('/:id', (req, resp) => {
    let sessionID = req.params.id
    if (!isValidSessionID(sessionID)){
        return resp.status(404).json({ error: "Session not found"});
    }
    db.all(`select attendee.firstname, attendee.lastname, attendee.displayname 
            from session join registration on session._id = registration.session_id
            join attendee on attendee._id = registration.attendee_id
            where session._id = ?;`, 
            [sessionID], (err, rows) => {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        let sessions = []
        rows.forEach(row => {
            sessions.push({firstname: row.firstname, lastname: row.lastname, displayname: row.displayname})
        });

        resp.json(sessions);
    });
});

export default router;