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
    $("#firstname").change(function(){
        const lastName = $("#lastname").val();
        const firstName = $("#firstname").val();
        $("#displayname").val(firstName + " " + lastName);
    });
    $("#lastname").change(function(){
        const lastName = $("#lastname").val();
        const firstName = $("#firstname").val();
        $("#displayname").val(firstName + " " + lastName);
    });
    $("#registrationDeleteButton").click(function(e){
        e.preventDefault();
        const mount = $("#sessionForm").attr("action")
        const attendeeID = $("#attendee").val();
        const sessionID = $("#session").val();
        console.log(attendeeID)
        console.log(sessionID)
        const sessionData = {sessionID: sessionID}
        const deleteRegistrationUrl = mount + `/${attendeeID}/registrations`;

        $.ajax({
            url: deleteRegistrationUrl,
            method: "DELETE",
            data: JSON.stringify(sessionData),
            contentType: "application/json",
            dataType: "json",
            success: function(resp){
                if (resp.success){
                    alert(resp.message); 
                    // window.location.href = mount + `/${attendeeID}/show`
                } else{
                    alert("Attendee Unregistration failed")
                }
            }
        });
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
                            window.location.href = attendeesUrl + `/${resp.attendeeID}/show`
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
                    window.location.href = attendeesUrl + `/${attendeeData.attendeeID}/show`
                } else{
                    alert("Attendee update failed")
                }
            }
        });
}
