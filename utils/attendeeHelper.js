import { db } from "../store/db.js"


export function isEnrolled(attendeeID, callback){
    db.all(`select * from registration where registration.attendee_id = ${attendeeID}`, [], (err, rows) =>{
        if (err) {
            return callback(err);
        }
        callback(null, rows.length > 0);
    });
}

export function badgeNumber(attendeeID){
    let badgeNumber = `${attendeeID}`
    badgeNumber = badgeNumber.padStart(6, "0");
    badgeNumber = "R" + badgeNumber;
    return badgeNumber;
}
