$("#btn1").on("click", function(){
    $.getJSON("/articles", function(data) {
        console.log("response is " + data);
        // For each one
        for (var i = 0; i < data.length; i++) {

        $("#articles").append("<p data-id='" + data[i]._id + "'>" + "Title: " + data[i].title + "<br />" + "Link: " + data[i].link + "<br />" + "Summary: " + data[i].summary + "</p>");
    
        }
        
      });
 
});

// Grab the articles as a json


  $(document).on("click", "p", function() {
    $("#notes").empty();
    // alert("hello");
    var id = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + id
    }).then(function(data){
        console.log(data);

        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<h4>");
        // $("#notes").append("<button id='delete'>Delete</button>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
            $("#titleinput").val("");
            // $("#bodyinput").val(data.note.body);
            $("h4").html("<span id='noteTitle'>" + data.note.title + "</span>" + "<button data-id='" + data._id + "' class='btn btn-danger' id='delete'>Delete</button>");

            $(document).on("click", "#noteTitle", function() {
                $("#bodyinput").val(data.note.body);
            });
        }
    });
});

$(document).on("click", "#delete", function(){

    var id = $(this).attr("data-id");
    console.log(id);

    $.ajax({
        method: "DELETE",
        url: "/articles/" + id,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    
        // On successful call
        .then(function(data) {
            console.log(data);
            $("#notes").empty();
        });
        $("#titleinput").val("");
        $("#bodyinput").val("");
});

// $("#savenote").on("click", function(){
$(document).on("click", "#savenote", function() {
    var id = $(this).attr("data-id");
    // alert("hello");
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }

    })
    .then(function(data) {
        console.log(data);
        $("#notes").empty();
    });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});