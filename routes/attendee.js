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

export default router;