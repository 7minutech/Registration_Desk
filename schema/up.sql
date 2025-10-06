INSERT INTO registration (attendee_id, session_id) VALUES (1, 1);
INSERT INTO registration (attendee_id, session_id) VALUES (2, 2);
INSERT INTO registration (attendee_id, session_id) VALUES (3, 1);
INSERT INTO registration (attendee_id, session_id) VALUES (1, 2);


SELECT session_id FROM attendee join registration on attendee._id = registration.attendee_id where session_id = 1 and attendee._id = 1;