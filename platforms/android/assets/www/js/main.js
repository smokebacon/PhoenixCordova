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
$(document).on("pageinit", function(){

        var rootURL="http://10.0.2.2/sites/PhoenixSlim/";

        console.log("jQuery working");

        var storage = window.localStorage;
        var value = localStorage.getItem('Auth');
        var ID = localStorage.getItem('ID');
        var Email = localStorage.getItem('Email');

		//TODO separated Account info, Password page

        // Billk added code
        if(pageinited){return;} else{pageinited= true;}
        // end added code
        
        // Homepage Event Handlers
        $("#homepage").live("pagebeforeshow", function(){

        if(localStorage.getItem('Auth') === null)
        {
            console.log("No users found, please register");
            jQuery.mobile.changePage('#register',{transition:"none"});
        }else{
            jQuery.mobile.changePage('#homepage',{transition:"none"});
        }

        }); // end homepage live beforepageshow

        //Tourlist preload functions
          $("#tourList").live("pagebeforeshow",function(){

              var Auth = localStorage.getItem('Auth');
              console.log("in tourlist preload with user auth : "+Auth);

              $.ajax({
                  type:"GET",
                  url: rootURL + 'tour/all',
                  dataType:"json"})
                  .done(function(data){
                  if(data && data.length>0){
                      populateTour(data);
                      }else{
                      console.log("no data present");
                      }
                  }).fail(function(data){
                                    /* Execute when ajax falls over */
                                    alert("Error connecting to Webservice.\nTry again");
                                  });//end Ajax

          });
        //
         function populateTour(data) {
             //TODO this method will populate tour data using html insertion from returned array
             console.log("in populate Tour");
             var str = "";
             for(var i=0;i<data.length;i++){
                 //Header
                 str += "<ul data-role='listview' data-inset='true' class='card'>";

                 //Tour name on top
                 str += "<li data-role='list-divider'><h1 id='tour"+i+"header'>"+ data[i].Tour_No + " : " + data[i].Tour_Name +"</h1></li>";
                 str += "<li>";

                 str += "<div>" +
                     "<a href='' data-role='button' data-theme='c' id='btnViewIt"+data[i].Tour_No+"'>View Itinerary</a>"+
                     "<a href='' data-role='button' data-theme='c' id='btnBook"+data[i].Tour_No+"'>Book This Trip</a>"+
                     "</div>";

                 str += "</li>";
                 str += "</ul>";

                 // console.log(data[i].Tour_No + " " + data[i].Tour_Name);
             }
             $("#populateTourData").html(str).trigger("create");
             console.log("End populate tour");
         }

		$("#account").live("pagebeforeshow",function(){
            //send Ajax GET request to retrieve all customer data
            var Auth = localStorage.getItem('Auth');
            console.log(Auth);
//            alert(customer);

            //clear password field
            $("#EtxfNewPass").val("");
            $("#EtxfNewPassConfirm").val("");

            $.ajax({
                type: 'GET', //GET,POST,PUT or DELETE
                url: rootURL + 'customer/'+Auth, //the URI of the WS
                dataType: "JSON" //json,xml,etc
              })
              .done(function(data){
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
              .always(function() {
               })
              .fail(function(data){
                /* Execute when ajax falls over */
                alert("Error connecting to Webservice.\nTry again");
              });//end Ajax


		});

		$("#EbtnSubmit").on("click",function(){

		    console.log('Submitting edit form');
		    var Email = $("#EtxfEmail").val();

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/edit/' + Email,
                dataType:'JSON',
                data: editJSON(),
            }).done(function(data){
                console.log('account updated successfully');
                console.log(editJSON().toString());
                jQuery.mobile.changePage('#homepage',{transition:"none"});
            }).fail(function(data){alert("registration failed");});

            function editJSON(){
                return JSON.stringify({
            "First_Name":$("#EtxfName").val(),
            "Middle_Initial":$("#EtxfMiddle").val(),
            "Last_Name":$("#EtxfLast").val(),
            "Street_No":$("#EtxfStreetNo").val(),
            "Street_Name":$("#EtxfStreetName").val(),
            "Suburb":$("#EtxfSuburb").val(),
            "Postcode":$("#EtxfPost").val(),
            "Phone":$("#EtxfPhone").val()
            });

            }


		});

		$("#EbtnChangePassword").on("click",function(){

		    console.log('in Change password');
		    //function will run only when users enter the new password correctly twice
		    if($("#EtxfNewPass").val() == $("#EtxfNewPassConfirm").val()){

		        $.ajax({
                    type: "POST",
                    contentType: 'application/json',
                    url: rootURL + 'customer/changepassword',
                    dataType:'JSON',
                    data: passJSON()
                }).done(function(data){
                    console.log('account password updated successfully');
                    console.log('old auth : ' + localStorage.getItem('Auth'));
                    console.log('new auth : ' + data.Auth);
                    //set new auth as a localstorage data
                    localStorage.setItem('Auth',data.Auth);
                    //redirect back to the main page
                    jQuery.mobile.changePage('#homepage',{transition:"none"});
                }).fail(function(data){alert("password change: server failed");}); //end Ajax

		        function passJSON(){
                  return JSON.stringify({
                    "Customer_Id":$("#EtxfID").val(),
                    "Email":$("#EtxfEmail").val(),
                    "Password":$("#EtxfNewPass").val()
                    });

                };

		    }else{
		        alert("Confirm password field does not match the new password");
		    }


		});


        $("#btnRegister").on("click",function(){

            console.log('submit clicked');

            if($("#txfPassword").val() == $("#txfConfirmPassword").val()){
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/add',
                dataType:'JSON',
                data: registerJSON()
            }).done(function(data){

            localStorage.setItem('Auth',data.Auth);

            console.log("Auth generated! : " + localStorage.getItem('Auth'));

            jQuery.mobile.changePage('#homepage',{transition:"none"});

            }).fail(function(data){alert("registration failed");});

            function registerJSON(){
                   return JSON.stringify({
                      "First_Name":$('#txfName').val(),
                      "Middle_Initial":$('#txfMiddle').val(),
                      "Last_Name":$('#txfLast').val(),
                      "Street_No":$('#txfStreetNo').val(),
                      "Street_Name":$('#txfStreetName').val(),
                      "Suburb":$('#txfSuburb').val(),
                      "Postcode":$('#txfPost').val(),
                      "Email":$('#txfEmail').val(),
                      "Phone":$('#txfPhone').val(),
                      "Password":$('#txfPassword').val()
                      });
                }
             }else{
                alert("Password not match");
                $("#txfPassword").focus();
             }

        });






});  // end document on pageinit
///////////////////////////////////////// END jquery On Document Ready
