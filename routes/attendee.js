import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { badgeNumber, isEnrolled } from '../utils/attendeeHelper.js';

router.get('/:id', (req, resp) => {
    let attendeeID = req.params.id
    db.all(`SELECT * FROM attendee where attendee._id = ?`, [attendeeID], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        if (rows.length == 0){
            return resp.status(404).json({ error: "Attendee not found"});
        }
        let attendeeRecord = rows[0];
        let attendee = {firstname: attendeeRecord.firstname, lastname: attendeeRecord.lastname, displayname: attendeeRecord.displayname}
        isEnrolled(attendeeRecord._id, (err, enrolled) => {
            if (err){
                console.error(err.message);
                return;
            }
            if (enrolled){
                attendee.badgeNumber = badgeNumber(attendeeRecord._id)
            }
            resp.json(attendee);
        })
    });
});

router.post('/', (req, resp) => {
    if (req.headers["content-type"] != "application/json"){
        return resp.status(400).json({ error: 'Content-Type must be application/json' });
    }
    const attendee = req.body
    db.run(`insert into attendee (firstname, lastname, displayname) VALUES (?, ?, ?);`, 
        [attendee.firstname, attendee.lastname, attendee.displayname], function (err) {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        resp.status(201).json({ success: "true", id: this.lastID})
    });
});

export default router;