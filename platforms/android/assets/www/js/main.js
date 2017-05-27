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
            jQuery.mobile.changePage('#register', {transition: "fade"});
        } else {
            jQuery.mobile.changePage('#homepage', {transition: "fade"});
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

        $("#populateTourData .it").on('click', function () {
            target = $(this).attr("data-tourno");
            console.log("setting tourno localstorage" + target);
            localStorage.setItem('tourno', target);
            jQuery.mobile.changePage('#viewIt', {transition: "fade"});
            console.log("leaving viewIt class listener");
        });

        $("#populateTourData .btnShowTrip").on('click', function () {
            target = $(this).attr("data-tourno");
            console.log("setting tourno localstorage" + target);
            localStorage.setItem('tourno', target);
            jQuery.mobile.changePage('#tripList', {transition: "fade"});
            console.log("leaving btnShowTrip class listener");
        });

        console.log("End populate tour");
    }

    //Tourlist preload functions
    $("#reviewList").live("pagebeforeshow", function () {

        var Auth = localStorage.getItem('Auth');
        console.log("in reviewList preload with user auth : " + Auth);

        $.ajax({
            type: "GET",
            url: rootURL + 'review/all',
            dataType: "json"
        })
            .done(function (data) {
                if (data && data.length > 0) {
                    populateReview(data);
                } else {
                    console.log("no data present");
                }
            }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        });//end Ajax

    });

    function populateReview(data) {
        console.log("in populate Review");
        var str = "";
        for (var i = 0; i < data.length; i++) {
            //Header
            // console.log(data[i].Tour_No);
            str += "<ul data-role='listview' data-inset='true' class='card'>" +
                "<li data-role='list-divider'>" +
                "<h1 id='lblreview" + i + "'>" + data[i].Tour_Name + "</h1>" +
                "</li>" +
                "<li class='wrap'><h3 align='center'>Trip Date: " + data[i].Departure_Date + "</h3>" +
                "<h3 align='center'>Rating : "+data[i].Rating+"</h3>" +
                "<div align='center'>" +
                "<a class='review' data-tourno='" + data[i].Tour_No + "' data-tripid='" + data[i].Trip_Id + "'" +
                " data-role='button' data-theme='c'>Write a review</a>" +
                "</div>" +
                "</li>" +
                "</ul>";
        }

        $("#populateReviewData").html(str).trigger("create");

        $('#populateReviewData .review').on('click', function () {
            target = $(this).attr("data-tripid");
            localStorage.setItem('tripid', target);
            jQuery.mobile.changePage('#newReview', {transition: "fade"});
            console.log("on review class listener trip no : " + target);
        });
    }



    /**
     * Search listener to find out any header, description to match with the input field
     */
    $(function () {
        $("#btnSearchTour").on("click", function () {
            console.log("in btnSearchTour function")
            var g = $("#txfSearchTour").val().toLowerCase();
            $("ul li h1").each(function () {
                var s = $(this).text().toLowerCase();
                $(this).closest('.card')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
            });
            $("ul li h3").each(function () {
                var s = $(this).text().toLowerCase();
                $(this).closest('.card')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
            });
        });
    });

    /**
     * Show every tour back when users tap the clear button
     */
    $(document).on('click', '.ui-input-clear', function () {
        $("ul li h1").each(function () {
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
                console.log("in populate sending ajax, some data exists");
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
        console.log("in populate data");
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
                str += "<h1 style='color: darkred;'>Payment due : " + remaining + "</h1>";
                str += "<a data-role='button' data-theme='c' id='payFor" + data[i].Booking_No + "'>Complete" +
                    " Payment</a>";
            } else {

                if (today <= new Date(data[i].Departure_Date)) {
                    str += "<h3 style='color: green;' align='center'>Payment confirmed. Don't be late!</h3>";
                    str += "<a class='it' data-tourno='" + data[i].Tour_No + "' data-role='button'" +
                        " data-theme='c'>View Itinerary</a>";
                } else {
                    str += "<h3 style='color:green;' align='center'>Cheers! That was fun.</h3>";
                    str += "<a class='review' data-tourno='" + data[i].Tour_No + "' data-tripid='"+data[i].Trip_Id+"' data-role='button' data-theme='b'>Write a review</a>";
                }

            }
            str += "</div></li></ul>";
        }

        $("#populateBookingData").html(str).trigger("create");

        $('#populateBookingData .it').off('click').on('click', function () {
            target = $(this).attr("data-tourno");
            localStorage.setItem('tourno', target);
            jQuery.mobile.changePage('#viewIt', {transition: "fade"});
            console.log("on viewIt class listener");
        });

        $('#populateBookingData .review').off('click').on('click', function () {
            target = $(this).attr("data-tripid");
            localStorage.setItem('tripid', target);
            jQuery.mobile.changePage('#newReview', {transition: "fade"});
            console.log("on review class listener trip no : " + target);
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

    $("#newReview").live("pagebeforeshow",function() {
        target = localStorage.getItem('tripid');
        console.log("getting tripid from localstorage = " + target);
        $.ajax({
            type: "GET",
            url: rootURL + 'trip/' + target,
            dataType: "json"
        }).done(function (data) {
            console.log(data);
            setReviewStr(data);
        }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        })//end Ajax

    })

    function setReviewStr(data) {

        console.log("in setReviewStr()");
        console.log(data.Trip_Id);
        var str = "";

        $("#lblReviewForTour").text(data.Tour_Name);
        $("#lblReviewTripDate").text(data.Departure_Date);

        console.log("getting previous review record = " + data.Trip_Id);
        console.log(rootURL+'review/');
        $.ajax({
            type: "GET",
            url: rootURL + 'review/',
            dataType: "json"
        }).done(function (data) {
            console.log("found previous review entry,moving to editReviewStr() "+data);
            editReviewStr(data);
        }).fail(function (data) {
            /* Execute when ajax falls over */
            console.log("Cannot find previous review data, using create page as is");
            addReviewStr();
        })//end Ajax



    }

    function editReviewStr(data){
        console.log("in editReviewStr()");
        var str="";

        $("#txaGeneral").val(data.General_Feedback);
        $("#txaLikes").val(data.Likes);
        $("#txaDislikes").val(data.Dislikes);

        $("#btnSubmitReview").off('click').on('click',function(){
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/review/edit/'+localStorage.getItem('tripid'),
                dataType: 'json',
                data: editReviewJSON(),
            }).done(function (data) {
                console.log('account updated successfully');
                console.log(data);
                jQuery.mobile.changePage('#homepage', {transition: "fade"});
            }).fail(function (data) {
                alert("Edit failed");
            });

            function editReviewJSON() {

                var radioValue = $("input[name='radio-choice-b']:checked").val();
                var feedback = $("#txaGeneral").val();
                var likes = $("#txaLikes").val();
                var dislikes = $("#txaDislikes").val();

                return JSON.stringify({
                    "Rating": radioValue,
                    "General_Feedback": feedback,
                    "Likes": likes,
                    "Dislikes": dislikes
                });

            }
        })

    }

    function addReviewStr(){
        $("#txaGeneral").val();
        $("#txaLikes").val();
        $("#txaDislikes").val();

        $("#btnSubmitReview").off('click').on('click',function(){

            var radioValue = $("input[name='radio-choice-b']:checked").val();
            var feedback = $("#txaGeneral").val();
            var likes = $("#txaLikes").val();
            var dislikes = $("#txaDislikes").val();

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/review/',
                dataType: 'json',
                data: newReviewJSON(),
            }).done(function (data) {
                console.log('account updated successfully');
                console.log(data);
                jQuery.mobile.changePage('#homepage', {transition: "fade"});
            }).fail(function (data) {
                alert("registration failed");
            });

            function newReviewJSON() {
                return JSON.stringify({
                    "Trip_Id": localStorage.getItem('tripid'),
                    "Rating": radioValue,
                    "General_Feedback": feedback,
                    "Likes": likes,
                    "Dislikes": dislikes
                });

            }

        })
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
        var target;

        for (var i = 0; i < data.length; i++) {

            remaining = data[i].Max_Passengers - data[i].Seats_Taken;

            str += "<ul data-role='listview' data-inset='true' class='card'>" +
                "<li data-role='list-divider'>" +
                "<h1 id='lblTripDate" + data[i].Trip_Id + "'> Date : " + data[i].Departure_Date + "</h1></li><li>" +
                "<h3 id='lblStandard" + data[i].Trip_Id + "' align='center'>Adult : $" + data[i].Standard_Amount + "</h3>" +
                "<h3 id='lblConcession" + data[i].Trip_Id + "' align='center'>Concession : $" + data[i].Concession_Amount + "</h3>";
            if (remaining <= 0) {
                str += "<h1 style='color: red;' id='lblSeats" + data[i].Trip_Id + "' align='center'>No seats left!</h1>" +
                    " <div align='center'>" +
                    "<a href='tel:0484740282' rel='external' data-role='button'" +
                    " data-inline='true'" +
                    " data-inset='true'" +
                    " data-theme='c'>Contact" +
                    " Staff</a>";
            } else {
                str += "<p style='text-align: center;' id='lblSeatsRemaining" + data[i].Trip_Id + "' align='center'>" +
                    " Seats available for : " + remaining + " person!</p>" +
                    "<div align='center'><a href='#newBooking' data-rel='popup' data-transition='pop' data-role='button' data-inset='true' data-theme='b' data-inline='true'  data-position-to='window'" +
                    " data-tripid='" + data[i].Trip_Id + "' class='book'>Book this trip</a>";
            }

            str += "</div></li></ul>";
        }

        $("#populateTripList").html(str).trigger("create");

        $("#populateTripList .book").on('click', function () {
            target = $(this).attr("data-tripid");
            localStorage.setItem('tripid', target);
            console.log("saved tripid data to localstorage");
            populateTripBookingDialog();
        });

    }

    function populateTripBookingDialog() {
        console.log("in populateTripbookingDialog");
        var id = localStorage.getItem('tripid');
        console.log("id = " + id);

        $.ajax({
            type: "GET",
            url: rootURL + 'trip/' + id,
            dataType: "json"
        }).done(function (data) {
            console.log(data);
            setStr(data);
        }).fail(function (data) {
            /* Execute when ajax falls over */
            alert("Error connecting to Webservice.\nTry again");
        });//end Ajax


    }

    function setStr(data) {

        console.log("in setStr()");
        var str = "";
        var remaining = data.Max_Passengers - data.Seats_Taken;
        var target;
        var choose;

        $("#seatsRemaining").text(remaining + " Seats left");
        $("#lblPriceAdult").text(data.Standard_Amount);
        $("#lblPriceConcession").text(data.Concession_Amount);
        str = "<button id='btnConfirmBooking' data-tripid='"+data.Trip_Id+"' class='confirmbook' data-role='button' data-theme='c' >Confirm</button>";

        $("#btnConfirmBooking").html(str).trigger("create");

        $("#sldAdult,#sldConcession").on('slidestop', function () {
            var sum = (data.Standard_Amount * $("#sldAdult").val()) + (data.Concession_Amount * $("#sldConcession").val());

            $("#sumAmount").text("Summary : $ " + sum);

            choose = parseInt($("#sldAdult").val()) + parseInt($("#sldConcession").val());
            console.log(choose);

            if (choose > remaining) {
                str ="";
                $("#btnConfirmBooking").html(str).trigger("create");
                // $("button .confirmbook").hide();
                $("#errorMessage").text("Not enough seats !");
            } else {
                str = "<button id='btnConfirmBooking' data-tripid='"+data.Trip_Id+"' class='confirmbook' data-role='button' data-theme='c' >Confirm</button>";

                $("#btnConfirmBooking").html(str).trigger("create");
                $("#errorMessage").text("");
            }

        });

    }


    $("#btnConfirmBooking").on('click',function(){
        var tripid = localStorage.getItem('tripid');
        console.log(bookJSON());

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: rootURL + 'customer/book/',
            dataType: 'json',
            data: bookJSON()
        }).done(function (data) {
            console.log("done!");
            jQuery.mobile.changePage('#homepage', {transition: "fade"});

        }).fail(function (data) {
            alert("registration failed");
        });

        function bookJSON() {
            return JSON.stringify({
                "Trip_Id": tripid,
                "Num_Concessions":$("#sldConcession").val(),
                "Num_Adults":$("#sldAdult").val()
            });
        }
    })


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
            jQuery.mobile.changePage('#homepage', {transition: "fade"});
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
                jQuery.mobile.changePage('#homepage', {transition: "fade"});
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

                jQuery.mobile.changePage('#homepage', {transition: "fade"});

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
