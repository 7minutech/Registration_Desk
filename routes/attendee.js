import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { badgeNumber, isEnrolled } from '../utils/attendeeHelper.js';

router.get('/:id', (req, resp) => {
    let attendeeID = req.params.id
    db.get(`SELECT * FROM attendee where attendee._id = ?`, [attendeeID], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        if (!row){
            return resp.status(404).json({ error: "Attendee not found"});
        }
        let attendee = {firstname: row.firstname, lastname: row.lastname, displayname: row.displayname}
        isEnrolled(row._id, (err, enrolled) => {
            if (err){
                console.error(err.message);
                return;
            }
            if (enrolled){
                attendee.badgeNumber = badgeNumber(row._id)
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
        db.get(`SELECT * FROM attendee where attendee._id = ?`, [this.lastID], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (!row){
                return resp.status(404).json({ error: "Attendee not found"});
            }
            let createdAttendee = {firstname: row.firstname, lastname: row.lastname, displayname: row.displayname, attendeeID: this.lastID}
            isEnrolled(row._id, (err, enrolled) => {
                if (err){
                    console.error(err.message);
                    return;
                }
                if (enrolled){
                    createdAttendee.badgeNumber = badgeNumber(row._id)
                }
                createdAttendee.success = true;
                resp.json(createdAttendee);
            })
        });
    });
});

router.put('/:id', (req, resp) => {
    if (req.headers["content-type"] != "application/json"){
        return resp.status(400).json({ error: 'Content-Type must be application/json' });
    }
    const attendee = req.body
    db.run(`update attendee set firstname = ?, lastname = ?, displayname = ? where _id = ?;`, 
        [attendee.firstname, attendee.lastname, attendee.displayname, req.params.id], function (err) {
        if (err) {
            console.error(err.message);
            return resp.status(500).json({ error: err.message });
        }
        db.get(`SELECT * FROM attendee where attendee._id = ?`, [req.params.id], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (!row){
                return resp.status(404).json({ error: "Attendee not found"});
            }
            let createdAttendee = {firstname: row.firstname, lastname: row.lastname, displayname: row.displayname, attendeeID: req.params.id}
            isEnrolled(row._id, (err, enrolled) => {
                if (err){
                    console.error(err.message);
                    return;
                }
                if (enrolled){
                    createdAttendee.badgeNumber = badgeNumber(row._id)
                }
                createdAttendee.success = true;
                resp.json(createdAttendee);
            })
        });
    });
});

export default router;