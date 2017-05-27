/*
 Creator:Bill Kascamanidis
 Creation Date: 17/12/2016
 Current Version: 10
 Current Revision: 2
 Last Modified: 04/2/2017 22:00
 Last Modified by: Bill Kascamanidis
 */

/////////////////////////////////////////Variable Declaration
var pageinited = false;


/////////////////////////////////////////jquery On Document Ready
$(document).on("pageinit", function () {

    var rootURL = "http://10.0.2.2/sites/PhoenixSlim/";

    console.log("jQuery working");

    var storage = window.localStorage;
    var value = localStorage.getItem('Auth');
    var ID = localStorage.getItem('ID');
    var Email = localStorage.getItem('Email');
    var target;

    $.ajaxSetup({
        headers: {'Auth': value}
    });

    //TODO separated Account info, Password page

    // Billk added code
    if (pageinited) {
        return;
    } else {
        pageinited = true;
    }
    // end added code

    // Homepage Event Handlers
    $("#homepage").live("pagebeforeshow", function () {

        if (localStorage.getItem('Auth') === null) {
            console.log("No users found, please register");
            jQuery.mobile.changePage('#register', {transition: "none"});
        } else {
            jQuery.mobile.changePage('#homepage', {transition: "none"});
        }

    }); // end homepage live beforepageshow


    //Tourlist preload functions
    $("#tourList").live("pagebeforeshow", function () {

        var Auth = localStorage.getItem('Auth');
        console.log("in tourlist preload with user auth : " + Auth);

        $.ajax({
            type: "GET",
            url: rootURL + 'tour/all',
            dataType: "json"
        })
            .done(function (data) {
                if (data && data.length > 0) {
                    populateTour(data);
                } else {
                    console.log("no data present");
                }
            }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        });//end Ajax

    });

    function populateTour(data) {
        console.log("in populate Tour");
        var str = "";
        JSON.stringify(data)
        for (var i = 0; i < data.length; i++) {
            //Header
            // console.log(data[i].Tour_No);
            str += "<ul data-role='listview' data-inset='true' class='card'>" +
                "<li data-role='list-divider'>" +
                "<h1 id='tour" + i + "header'>" + data[i].Tour_No + " : " + data[i].Tour_Name + "</h1>" +
                "</li>" +
                "<li class='wrap'><h3 align='center'>" + data[i].Description + "</h3><br/>" +
                "<div align='center'>" +
                "<a data-tourno='" + data[i].Tour_No + "' data-role='button' data-inset='true'" +
                " data-theme='c' data-inline='true' class='it'>View Itinerary</a>" +
                "<a data-role='button' data-inset='true' data-theme='b' data-inline='true'" +
                " data-tourno='" + data[i].Tour_No + "' class='btnShowTrip'>Book Now</a>" +
                "</div>" +
                "</li>" +
                "</ul>";
        }
        $("#populateTourData").html(str).trigger("create");

        $('#populateTourData .it').on('click', function () {
            target = $(this).attr("data-tourno");
            console.log("setting tourno localstorage" + target);
            localStorage.setItem('tourno', target);
            jQuery.mobile.changePage('#viewIt', {transition: "fade"});
            console.log("leaving viewIt class listener");
        });

        $('#populateTourData .btnShowTrip').on('click', function () {
            target = $(this).attr("data-tourno");
            console.log("setting tourno localstorage" + target);
            localStorage.setItem('tourno', target);
            jQuery.mobile.changePage('#tripList', {transition: "fade"});
            console.log("leaving btnShowTrip class listener");
        });

        console.log("End populate tour");
    }

    /**
     * Search listener to find out any header, description to match with the input field
     */
    $(function(){
        $("#btnSearchTour").on("click",function(){
            console.log("in btnSearchTour function")
            var g = $("#txfSearchTour").val().toLowerCase();
            $("ul li h1").each(function() {
                var s = $(this).text().toLowerCase();
                $(this).closest('.card')[s.indexOf(g) !== -1 ? 'show':'hide']();
            });
            $("ul li h3").each(function() {
                var s = $(this).text().toLowerCase();
                $(this).closest('.card')[s.indexOf(g) !== -1 ? 'show':'hide']();
            });
        });
    });

    /**
     * Show every tour back when users tap the clear button
     */
    $(document).on('click', '.ui-input-clear', function () {
        $("ul li h1").each(function() {
            $(this).closest('.card').show();
        })
    });



    $("#homepage").live("pagebeforeshow", function () {

        var Auth = localStorage.getItem('Auth');
        console.log("in homepage preload with user auth : " + Auth);

        $.ajax({
            type: "GET",
            url: rootURL + 'booking/getbookingfromauth/',
            dataType: "json"
        }).done(function (data) {
            if (data && data.length > 0) {
                console.log("in populate data");
                populateBooking(data);
            } else {
                var str = "<h1>No Booking entry</h1><br/><a href='#tourList' data-role='button'" +
                    " data-theme='b'>Book a tour now</a>";
                $("#populateBookingData").html(str).trigger("create");
                console.log("no data present");
            }
        }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        });//end Ajax

    });

    function populateBooking(data) {
        console.log("in populate booking");
        var str = "";
        var remaining;

        for (var i = 0; i < data.length; i++) {

            var today = new Date();

            str += "<ul data-role='listview' data-inset='true' class='card'>" +
                "<li data-role='list-divider'>" +
                "<h1 id='lblBooking" + data[i].Booking_No + "'>Booking : " + data[i].Booking_No + "</h1></li><li>" +
                "<h3 id='lblBookingNo" + data[i].Booking_No + "' align='center'>" + data[i].Tour_Name + "</h3>" +
                "<h4 id='lblTripDate" + data[i].Booking_No + "' align='center'>Departure Date : " + data[i].Departure_Date + "</h4><div>";
            if (data[i].Deposit_Amount < data[i].Amount_Due) {
                remaining = data[i].Amount_Due - data[i].Deposit_Amount;
                str += "<h1 style='color: darkred;'>Amount due to complete booking : " + remaining + "</h1>";
                str += "<a data-role='button' data-theme='b' data-icon='info' id='payFor" + data[i].Booking_No + "'>Complete Payment</a>";
            } else {

                if(today <= new Date(data[i].Departure_Date)) {
                    str += "<h3 style='color: green;' align='center'>Payment confirmed. Don't be late!</h3>";
                    str += "<a class='it' data-tourno='" + data[i].Tour_No + "' data-role='button'" +
                        " data-theme='c'>View Itinerary</a>";
                }else{
                    str += "<h3 style='color:green;' align='center'>Cheers! That was fun.</h3>";
                    str += "<a class='review' data-tourno='" + data[i].Tour_No + "' data-role='button'" +
                        " data-theme='c'>Write a review</a>";
                }

            }
            str += "</div></li></ul>";
        }

        $("#populateBookingData").html(str).trigger("create");

        $('#populateBookingData .it').on('click', function () {
            target = $(this).data('tourno');
            localStorage.setItem('tourno', target);
            jQuery.mobile.changePage('#viewIt', {transition: "fade"});
            console.log("on viewIt class listener");
        });

        $('#populateBookingData .review').on('click',function(){
            target = $(this).data('tourno');
            localStorage.setItem('tourno',target);
            jQuery.mobile.changePage('#newReview',{transition: "fade"});
            console.log("on review class listener");
        });

        console.log("End populate booking");

    }

    $("#viewIt").live("pagebeforeshow", function () {
        target = localStorage.getItem('tourno');
        console.log("getting tourno from localstorage = " + target);
        $.ajax({
            type: "GET",
            url: rootURL + '/tour/' + target + '/itinerary/',
            dataType: "json"
        }).done(function (data) {
            if (data && data.length > 0) {
                populateItinerary(data);
            } else {
                var str = "<h1>No Itinerary yet</h1><br/><a href='tel:0484740282' rel='external'" +
                    " data-role='button'" +
                    " data-theme='b' data-inset='true' data='inline'>Contact Staff</a>";
                $("#populateItineraryData").html(str).trigger("create");
                console.log("no data present");
            }
        }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        });//end Ajax

    })//end pagebeforeshow


    function populateItinerary(data) {

        console.log("in populate itinerary");
        var str = "";
        var remaining;

        for (var i = 0; i < data.length; i++) {

            str += "<ul data-role='listview' data-inset='true' class='card'>" +
                "<li data-role='list-divider'>" +
                "<h1 id='lblDayNo" + data[i].Day_No + "'>Day " + data[i].Day_No + "</h1></li><li>" +
                "<h3 id='lblActivities" + data[i].Day_No + "' align='center'>" + data[i].Activities + "</h3>" +
                "<p style='text-align: center;' id='lblMeals" + data[i].Day_No + "' align='center'>" + data[i].Meals + "</p><div>";
            str += "</div></li></ul>";
        }

        $("#populateItineraryData").html(str).trigger("create");
        console.log("End populate booking");

    }

    $("#tripList").live("pagebeforeshow", function () {
        target = localStorage.getItem('tourno');
        console.log("getting tourno from localstorage = " + target);
        $.ajax({
            type: "GET",
            url: rootURL + '/tour/open/' + target,
            dataType: "json"
        }).done(function (data) {
            if (data && data.length > 0) {
                populateTripList(data);
            } else {
                var str = "<h1>No Trip yet</h1><br/><a href='tel:0484740282' rel='external'" +
                    " data-role='button'" +
                    " data-theme='b'>Contact Staff</a>";
                $("#populateTripData").html(str).trigger("create");
                console.log("no data present");
            }
        }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        });//end Ajax

    })//end pagebeforeshow


    function populateTripList(data) {

        console.log("in populate trip");
        var str = "";
        var remaining;

        for (var i = 0; i < data.length; i++) {

            remaining = data[i].Max_Passengers - data[i].Seats_Taken;

            str += "<ul data-role='listview' data-inset='true' class='card'>" +
                "<li data-role='list-divider'>" +
                "<h1 id='lblTripDate" + data[i].Trip_Id+ "'> Date : " + data[i].Departure_Date + "</h1></li><li>" +
                "<h3 id='lblStandard" + data[i].Trip_Id + "' align='center'>Adult : $" + data[i].Standard_Amount+ "</h3>" +
                "<h3 id='lblConcession"+data[i].Trip_Id+"' align='center'>Concession : $" + data[i].Concession_Amount+"</h3>";
            if(remaining <= 0)
            {
                str += "<h1 style='color: red;' id='lblSeats"+data[i].Trip_Id+"' align='center'>No seats left!</h1>" +
                    " <div align='center'>" +
                    "<a href='tel:0484740282' rel='external' data-role='button'" +
                    " data-inline='true'" +
                    " data-inset='true'" +
                    " data-theme='c'>Contact" +
                    " Staff</a>";
            }else{
                str += "<p style='text-align: center;' id='lblSeatsRemaining" + data[i].Trip_Id + "' align='center'>" +
                    " Seats available for : " + remaining + " person!</p>" +
                    "<div align='center'><a data-role='button' data-inset='true' data-theme='b' data-inline='true' " +
                    "data-tripid='" + data[i].Trip_Id + "' class='btnBookTrip'>Book this trip</a>";
            }

            str += "</div></li></ul>";
        }

        $("#populateTripList").html(str).trigger("create");

        //TODO register dialog to input adult, concessions for the booking

        console.log("End populate booking");

    }


    $("#account").live("pagebeforeshow", function () {
        //send Ajax GET request to retrieve all customer data
        var Auth = localStorage.getItem('Auth');
        console.log(Auth);
//            alert(customer);

        //clear password field
        $("#EtxfNewPass").val("");
        $("#EtxfNewPassConfirm").val("");

        $.ajax({
            type: 'GET', //GET,POST,PUT or DELETE
            url: rootURL + 'customer/' + Auth, //the URI of the WS
            dataType: "JSON" //json,xml,etc
        })
            .done(function (data) {
                //execute when ajax successfully completes
//                alert("prefill forms");
                $("#EtxfID").val(data.Customer_Id);
                $("#EtxfEmail").val(data.Email);
                $("#EtxfName").val(data.First_Name);
                $("#EtxfMiddle").val(data.Middle_Initial);
                $("#EtxfLast").val(data.Last_Name);
                $("#EtxfStreetNo").val(data.Street_No);
                $("#EtxfStreetName").val(data.Street_Name);
                $("#EtxfSuburb").val(data.Suburb);
                $("#EtxfPost").val(data.Postcode);
                $("#EtxfPhone").val(data.Phone);
            })
            .always(function () {
            })
            .fail(function (data) {
                /* Execute when ajax falls over */
                alert("Error connecting to Webservice.\nTry again");
            });//end Ajax


    });

    $("#EbtnSubmit").on("click", function () {

        console.log('Submitting edit form');
        var Email = $("#EtxfEmail").val();

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: rootURL + 'customer/edit/' + Email,
            dataType: 'JSON',
            data: editJSON(),
        }).done(function (data) {
            console.log('account updated successfully');
            console.log(editJSON().toString());
            jQuery.mobile.changePage('#homepage', {transition: "none"});
        }).fail(function (data) {
            alert("registration failed");
        });

        function editJSON() {
            return JSON.stringify({
                "First_Name": $("#EtxfName").val(),
                "Middle_Initial": $("#EtxfMiddle").val(),
                "Last_Name": $("#EtxfLast").val(),
                "Street_No": $("#EtxfStreetNo").val(),
                "Street_Name": $("#EtxfStreetName").val(),
                "Suburb": $("#EtxfSuburb").val(),
                "Postcode": $("#EtxfPost").val(),
                "Phone": $("#EtxfPhone").val()
            });

        }


    });

    $("#EbtnChangePassword").on("click", function () {

        console.log('in Change password');
        //function will run only when users enter the new password correctly twice
        if ($("#EtxfNewPass").val() == $("#EtxfNewPassConfirm").val()) {

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/changepassword',
                dataType: 'JSON',
                data: passJSON()
            }).done(function (data) {
                console.log('account password updated successfully');
                console.log('old auth : ' + localStorage.getItem('Auth'));
                console.log('new auth : ' + data.Auth);
                //set new auth as a localstorage data
                localStorage.setItem('Auth', data.Auth);
                //redirect back to the main page
                jQuery.mobile.changePage('#homepage', {transition: "none"});
            }).fail(function (data) {
                alert("password change: server failed");
            }); //end Ajax

            function passJSON() {
                return JSON.stringify({
                    "Customer_Id": $("#EtxfID").val(),
                    "Email": $("#EtxfEmail").val(),
                    "Password": $("#EtxfNewPass").val()
                });

            };

        } else {
            alert("Confirm password field does not match the new password");
        }


    });


    $("#btnRegister").on("click", function () {

        console.log('submit clicked');

        if ($("#txfPassword").val() == $("#txfConfirmPassword").val()) {
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/add',
                dataType: 'JSON',
                data: registerJSON()
            }).done(function (data) {

                localStorage.setItem('Auth', data.Auth);

                console.log("Auth generated! : " + localStorage.getItem('Auth'));

                jQuery.mobile.changePage('#homepage', {transition: "none"});

            }).fail(function (data) {
                alert("registration failed");
            });

            function registerJSON() {
                return JSON.stringify({
                    "First_Name": $('#txfName').val(),
                    "Middle_Initial": $('#txfMiddle').val(),
                    "Last_Name": $('#txfLast').val(),
                    "Street_No": $('#txfStreetNo').val(),
                    "Street_Name": $('#txfStreetName').val(),
                    "Suburb": $('#txfSuburb').val(),
                    "Postcode": $('#txfPost').val(),
                    "Email": $('#txfEmail').val(),
                    "Phone": $('#txfPhone').val(),
                    "Password": $('#txfPassword').val()
                });
            }
        } else {
            alert("Password not match");
            $("#txfPassword").focus();
        }

    });


});  // end document on pageinit
///////////////////////////////////////// END jquery On Document Ready
