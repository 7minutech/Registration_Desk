import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"

router.get('/', (req, resp) => {
    console.log("found route")
    db.all(`SELECT * FROM session`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        let sessions = []
        rows.forEach(row => {
            sessions.push({id: row._id, description: row.description})
        });

        resp.json(sessions);
    });
});

export default router;