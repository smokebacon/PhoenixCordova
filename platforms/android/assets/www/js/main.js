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

            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: rootURL + '/customer/add',
                dataType:'JSON',
                data: registerJSON(),
            })

            .done(function(data){
            alert('done!');
            localStorage.auth = data.AKEY;
            localStorage.email = data.email;
            jQuery.mobile.changePage('#homepage',{transition:"none"});
            })
            .always(function(){})
            .fail(function(data){alert("registration failed");})

            function registerJSON(){
                   return JSON.stringify({
                      "Customer_Id":c.CustomerID,
                      "First_Name":c.Name,
                      "Middle_Initial":c.Middle,
                      "Last_Name":c.Last,
                      "Street_No":c.StreetNo,
                      "Street_Name":c.StreetName,
                      "Suburb":c.Suburb,
                      "Postcode":c.Postcode,
                      "Email":c.Email,
                      "Phone":c.Phone,
                      "Password":c.Password,
                      });
                }

        });






});  // end document on pageinit
///////////////////////////////////////// END jquery On Document Ready
