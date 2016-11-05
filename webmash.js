// Put your zillow.com API key here

var username = "pushpak0890";
var request = new XMLHttpRequest();
var requestReverse = new XMLHttpRequest();
var markersArray = [];
var map,xml,temperature,windSpeed,lat;
var disResult = new Array();
var count=0;
var markerContent;

var marker;


        //initMap() which initiates map to a location
        function initMap() {
     	document.getElementById("details").value="";
	    //define center of a map
	   	 var  geocoder = new google.maps.Geocoder();
         var infowindow = new google.maps.InfoWindow;

         var latlng = new google.maps.LatLng(32.75, -97.13);   

	    //initialize map
       	var mapCanvas = document.getElementById("map");
	    var mapOptions = {zoom: 17,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP };
        map = new google.maps.Map(mapCanvas, mapOptions);

		
		reversegeocode(latlng,geocoder, map, infowindow,32.75, -97.13);

		
		
        //Initialize a mouse click event on map which then calls reversegeocode function
         google.maps.event.addListener(map, "click", function(event)
            {
                
     
                 count=count+1;     
            	   reversegeocode(event.latLng,geocoder, map, infowindow,event.latLng.lat(),event.latLng.lng());
            
			});
			
}
	 
	 
	 
	  function placeMarker(location) {
            // first remove all markers if there are any
            deleteOverlays();
           				
             marker = new google.maps.Marker({
                position: location, 
                map: map
            });
          // add marker in markers array--> array is used to preserve the marker
           markersArray.push(marker);
		  
    	  }
 	
        // Deletes all markers in the array by removing references to them
        function deleteOverlays() {
			
            if (markersArray) {
                for (i in markersArray) {
                    markersArray[i].setMap(null);
                }
            markersArray.length = 0;
            }
        }
	
	


       // Reserse Geocoding 
       function reversegeocode(latlongi,geocoder, map, infowindow,lat,longi) 
        {
        var latL=lat;
        var longiL=longi;
        //get the latitude and longitude from the mouse click and get the address.
        //call geoname api asynchronously with latitude and longitude 
        geocoder.geocode({'location': latlongi}, function(results, status){
	    if (status === 'OK') {
        deleteOverlays();    
	    marker = new google.maps.Marker({
        position: latlongi,
		animation:google.maps.Animation.BOUNCE,
        map: map
			});
        markerContent=results[0].formatted_address;
	    markersArray.push(marker);
  
        sendRequest(latL,longiL);
         }
		 else {
        window.alert('Geocoder failed due to: ' + status);
          }

       });

      }// end of geocodeLatLng()



       function displayResult () {
	
       if (request.readyState == 4) {
	  
	   //alert(request.responseText);    
       var  xml=request.responseXML;
   	 
	  
	  var temperature=xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
	  var clouds=xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
	  var windSpeed=xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
	 

      
      markerContent+=", Temperature: "+temperature+", Clouds:"+clouds+", Wind Speed:"+windSpeed;;	 
	  var infowindow = new google.maps.InfoWindow({
      content: markerContent
 	
             });
			infowindow.open(map,marker);
		if(count>0)
		 document.getElementById("details").value +=count+"]"+markerContent+"\n \n";
		 
		
	  }
	}

        function sendRequest (latin,longin) {
	    request.onreadystatechange = displayResult;

        var lat = latin;
        var lng = longin;
        request.open("GET","http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username,true);
          
        request.send();
	
    }
	
     function eraseText() {
     document.getElementById("details").value = "";
	 disResult.length=0;
	 count=0;
	 deleteOverlays();
      }
