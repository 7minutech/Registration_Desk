$(document).ready(function(){
    $("#attendeeForm").submit(function(e){
        e.preventDefault();
        const attendeesUrl = $("#attendeeForm").attr("action")
        const attendeeData = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            displayname: $("#displayname").val()
        };
        createNewAttendee(attendeesUrl, attendeeData)
        
    });
    $("#updateAttendeeForm").submit(function(e){
        e.preventDefault();
        const attendeesUrl = $("#updateAttendeeForm").attr("action")
        const attendeeData = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            displayname: $("#displayname").val(),
            attendeeID: $("#attendee").val()
        };
        updateAttendee(attendeesUrl, attendeeData)
        
    });
});

function createNewAttendee(attendeesUrl, attendeeData){
    $.ajax({
            url: attendeesUrl,
            method: "POST",
            data: JSON.stringify(attendeeData),
            contentType: "application/json",
            dataType: "json",
            success: function(resp){
                if (resp.success){
                    alert("Attendee created");
                } else{
                    alert("Attendee creation failed")
                }
            
                const sessionData = {
                    sessionID: $("#sessions").val(),
                }
                if (sessionData.sessionID == 0 || !(resp.success)){
                    return
                }
                $.ajax({
                    url: attendeesUrl + `/${resp.attendeeID}/registrations` ,
                    method: "POST",
                    data: JSON.stringify(sessionData),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(resp){
                        if (resp.success){
                            alert("Attendee registered");
                        } else{
                            alert("Attendee registeration failed")
                        }
                    }
                });
            }
        });
}

function updateAttendee(attendeesUrl, attendeeData){
    $.ajax({
            url: attendeesUrl + `/${attendeeData.attendeeID}`,
            method: "PUT",
            data: JSON.stringify(attendeeData),
            contentType: "application/json",
            dataType: "json",
            success: function(resp){
                if (resp.success){
                    alert("Attendee update");
                } else{
                    alert("Attendee update failed")
                }
            }
        });
}
