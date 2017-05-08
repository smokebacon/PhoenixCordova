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

        var rootURL="http://10.0.2.2/sites/PhoenixSlim/"

//        var CustomerID;
//        var Email;
//        var Password;
//        var Name;
//        var Middle;
//        var Last;
//        var StreetNo;
//        var StreetName;
//        var Suburb;
//        var Postcode;
//        var Phone;

        var storage = window.localStorage;
        var value = localStorage.getItem('Auth');
        var ID = localStorage.getItem('ID');
        var Email = localStorage.getItem('Email');



        // Billk added code
        if(pageinited){return;} else{pageinited= true;}
        // end added code
        
        // Homepage Event Handlers
        $("#homepage").live("pagebeforeshow", function(){

        if(localStorage.getItem('Auth') == null)
        {
            alert("No users found, please register");
            jQuery.mobile.changePage('#register',{transition:"none"});
        }else{
            jQuery.mobile.changePage('#homepage',{transition:"none"});
            $('#txfLoginCustID').val(localStorage.getItem('ID'));
            $('#txfLoginEmail').val(localStorage.getItem('Email'));
        }

        }); // end homepage live beforepageshow

        $("#btnSignIn").on("click",function(){
//                  alert('On signin button');
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/getAuth',
                dataType: 'JSON',
                data: loginJSON(),
            })
            .done(function(data){
//              alert('completed, now comparing localstorage...');
                value = storage.getItem('Auth');
//              alert(value);
//              alert(data.Auth);
                if(value != data.Auth){
                    alert('Incorrect login, Please try again');
                }else{
                    jQuery.mobile.changePage('#yourTrip',{transition:"none"});
                }
            })
            .fail(function(data){
                alert("Error passing data to SLIM");
            });//End Ajax

            function loginJSON(){
                  return JSON.stringify({
                         "Customer_Id":$('#txfLoginCustID').val(),
                         "Email":$('#txfLoginEmail').val(),
                         "Password":$('#txfLoginPassword').val()
                         });
                  }

        });

		$("#account").live("pagebeforeshow",function(){
            //send Ajax GET request to retrieve all customer data
            //id for route controller
            var customer = localStorage.getItem('ID');
//            alert(customer);

            $.ajax({
                type: 'GET', //GET,POST,PUT or DELETE
                url: rootURL + 'customer/'+customer, //the URI of the WS
                dataType: "JSON", //json,xml,etc
              })
              .done(function(data){
              //execute when ajax successfully completes
//                alert("prefill forms");
                $("#EtxfID").val(data[0].Customer_Id);
                $("#EtxfEmail").val(data[0].Email);
                $("#EtxfName").val(data[0].First_Name);
                $("#EtxfMiddle").val(data[0].Middle_Initial);
                $("#EtxfLast").val(data[0].Last_Name);
                $("#EtxfStreetNo").val(data[0].Street_No);
                $("#EtxfStreetName").val(data[0].Street_Name);
                $("#EtxfSuburb").val(data[0].Suburb);
                $("#EtxfPost").val(data[0].Postcode);
                $("#EtxfPhone").val(data[0].Phone);


              })
              .always(function() {
               })
              .fail(function(data){
                /* Execute when ajax falls over */
                alert("Error connecting to Webservice.\nTry again");
              });//end Ajax




		});

		$("#EbtnSubmit").on("click",function(){

		    alert('Submitting edit form');



		})


        $("#btnSubmit").on("click",function(){

            alert('submit clicked');

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + 'customer/add',
                dataType:'JSON',
                data: registerJSON(),
            }).done(function(data){

            alert(data.Auth);

            var ID = $("#txfCustomerID").val();
            var Email = $("#txfEmail").val();

            localStorage.setItem('Auth',data.Auth);
            localStorage.setItem('ID',ID);
            localStorage.setItem('Email',Email);

            alert(localStorage.getItem('Auth'));
            alert(localStorage.getItem('ID'));
            alert(localStorage.getItem('Email'));

            jQuery.mobile.changePage('#homepage',{transition:"none"});

            }).fail(function(data){alert("registration failed");});

            function registerJSON(){
                   return JSON.stringify({
                      "Customer_Id":$('#txfCustomerID').val(),
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
                };

        });






});  // end document on pageinit
///////////////////////////////////////// END jquery On Document Ready
