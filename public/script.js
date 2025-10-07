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
        console.log("delete click")
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
    $("#registrationListButton").click(function(e){
        console.log("clicked list");
        $("#attending_table").empty();
        e.preventDefault();
        const mount = "/sessions"
        const sessionName = $("#session option:selected").text();
        console.log(sessionName)
        const sessionID = $("#session").val();
        const getSessionsUrl = mount + `/${sessionID}`;
        $.ajax({
            url: getSessionsUrl,
            method: "GET",
            dataType: "json",
            success: function(resp){
                let row = document.createElement("tr");
                let header = document.createElement("th");
                $(row).append(header);
                $(header).text(sessionName);
                $("#attending_table").append(row)
                resp.forEach(session => {
                    let row = document.createElement("tr");
                    let col = document.createElement("td")
                    $(col).text(session["displayname"])
                    $(row).append(col)
                    $("#attending_table").append(row)
                });
            },
            error: function(_, status, error){
                console.log(`Request faild status: ${status}, error: ${error}`);
                alert("Failed to get list")
            }
        });
    });
    $("#registartionUpdateButton").click(function(e){
        e.preventDefault();
        const mount = $("#sessionForm").attr("action")
        const attendeeID = $("#attendee").val();
        const sessionID = $("#session").val();
        console.log(attendeeID)
        console.log(sessionID)
        const sessionData = {sessionID: sessionID}
        const updateRegistrationUrl = mount + `/${attendeeID}/registrations`;

        $.ajax({
            url: updateRegistrationUrl,
            method: "POST",
            data: JSON.stringify(sessionData),
            contentType: "application/json",
            dataType: "json",
            success: function(resp){
                if (resp.success){
                    alert("Attendee updated successfully"); 
                    window.location.href = mount + `/${attendeeID}/show`;
                } else{
                    alert("Attendee update failed");
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
