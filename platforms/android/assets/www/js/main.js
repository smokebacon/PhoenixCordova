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
        // Billk added code
        if(pageinited){return;} else{pageinited= true;}
        // end added code
        
        // Homepage Event Handlers
        $("#homepage").live("pagebeforeshow", function(){
//             alert("Before show homepage");
        }); // end homepage live beforepageshow
          
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
                                     

             
});  // end document on pageinit
///////////////////////////////////////// END jquery On Document Ready
