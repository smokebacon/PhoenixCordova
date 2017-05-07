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

        var CustomerID;
        var Email;
        var Password;
        var Name;
        var Middle;
        var Last;
        var StreetNo;
        var StreetName;
        var Suburb;
        var Postcode;
        var Phone;


        // Billk added code
        if(pageinited){return;} else{pageinited= true;}
        // end added code
        
        // Homepage Event Handlers
        $("#homepage").live("pagebeforeshow", function(){

        var auth;
        var storage = window.localStorage;
        var value = storage.getItem(auth);
        if(auth == null)
        {
            alert("null auth");
            jQuery.mobile.changePage("#register");
        }

             alert("Before show homepage");
        }); // end homepage live beforepageshow

          $("#homepage").live("pageaftershow", function(){

          });

		$("#homepage").live("pagebeforehide", function(){
//             alert("Before hide homepage");
        }); // end homepage live pagebeforehide
        // END Homepage Event Handlers             
        

        // Page 1 Event Handlers
        $("#page1").live("pagebeforeshow", function(event){
//              alert("before page1 show");
//			  console.log('before page1 show');
        });
                 
        $("#page1").live("pageshow", function(){
//             alert("page1 show");
//			 console.log('page1 show');
        }); // end  live pageshow
            
     	$("#page1").live("pagebeforehide", function(){
//             alert("Before hide page1");
        }); // end page1 live pagebeforehide
		// End Page 1 Events Handlers

        $("#btnSubmit").on("click",function(){

            alert('submit clicked');
            var url = "customer/add/";
            var c=[];
            c.CustomerID = $("#txfCustomerID").val();
            c.Email = $("#txfEmail").val();
            c.Password = $("#txfPassword").val();
            c.Name = $("#txfName").val();
            c.Middle = $("#txfMiddle").val();
            c.Last = $("#txfLast").val();
            c.StreetNo = $("#txfStreetNo").val();
            c.StreetName = $("#txfStreetName").val();
            c.Suburb = $("#txfSuburb").val();
            c.Postcode = $("#txfPost").val();
            c.Phone = $("#txfPhone").val();

            var settings = {
              "async": true,
              "crossDomain": true,
              "url": rootURL+ "customer/add/",
              "method": "POST",
              "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "8cde29d8-2bf5-16e4-4370-d93b8b324bdf"
              },
              "processData": false,
              "data": "{\"Customer_Id\":\"020304\",\r\n\t\t\"First_Name\":\"First\",\r\n\t\t\"Middle_Initial\":\"m\",\r\n\t\t\"Last_Name\":\"last\",\r\n\t\t\"Street_No\":\"Street\",\r\n\t\t\"Street_Name\":\"Name\",\r\n\t\t\"Suburb\":\"Sub\",\r\n\t\t\"Postcode\":\"1234\",\r\n\t\t\"Email\":\"What@.com\",\r\n\t\t\"Phone\":\"123423123\",\r\n\t\t\"Password\":\"pass\"}"
            }

            $.ajax(settings).done(function (response) {
              alert('done');
            })

//            $.ajax({
//                type: "POST",
//                contentType: 'application/json',
//                url: rootURL + '/customer/add',
//                dataType:'json',
//                data: registerJSON(c),
//            })
//            .done(function(data){
//            localStorage.auth = data.AKEY;
//            localStorage.email = data.email;
//            jQuery.mobile.changePage('#homepage',{transition:"none"});
//            })
//            .fail(function(data){alert("registration failed");});

//            var settings = {
//              "async": true,
//              "crossDomain": true,
//              "url": rootURL + "customer/add/",
//              "method": "POST",
//              "headers": {
//              "content-type": "application/json",
//              "cache-control": "no-cache",
//              },
//              "data": registerJSON(c)
//            }
//
//            $.ajax(settings).done(function (response) {
//              alert(response);
//            });
//


        });
//
//        function registerJSON(c){
//                   return JSON.stringify({
//                      "Customer_Id":c.CustomerID,
//                      "First_Name":c.Name,
//                      "Middle_Initial":c.Middle,
//                      "Last_Name":c.Last,
//                      "Street_No":c.StreetNo,
//                      "Street_Name":c.StreetName,
//                      "Suburb":c.Suburb,
//                      "Postcode":c.Postcode,
//                      "Email":c.Email,
//                      "Phone":c.Phone,
//                      "Password":c.Password,
//                      });
//                }




});  // end document on pageinit
///////////////////////////////////////// END jquery On Document Ready
