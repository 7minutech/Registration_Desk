$(document).ready(function(){
    $("#attendeeForm").submit(function(e){
        e.preventDefault();

        const attendeeData = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            displayname: $("#displayname").val()
        };
        $.ajax({
            url: $("#attendeeForm").attr("action"),
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
            }
        });
    });
});
