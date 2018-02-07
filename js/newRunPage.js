// Global variable to hold map reference, so we can use it in other functions.
const ACCURACY_THRESHOLD = 21; 
const DISTANCE_THRESHOLD = 10;

var map = null;
var geolocationWatchID = null;
var currentPosition = null;
var destinationPosition = null;
var currentMarker = null;
var destinationMarker = null;
var accuracyCircle = null;
var distanceToDestination = null;
var distanceFromStart = null;
var newRun = null;
var trackRunTimer = null;
var trackDestinationTimer = null;
var runOnce = true;
var oldRun = null;

//obtaining previous runs,if any
if (typeof (Storage) !== "undefined") {
//<<<<<<< Updated upstream
	var runIndex = localStorage.getItem(APP_PREFIX + "-reRun"); //index used to access a run from the stringified JSON array of runs
	savedRuns = JSON.parse(localStorage.getItem(APP_PREFIX + '-runs'));//array of completed runs that are loaded onto the past run screen
	
	if (runIndex !== null) {//if there's already a runIndex stored prior, the old one would be overwriten
		localStorage.removeItem(APP_PREFIX + "-reRun");	
		
		if (savedRuns !== null) {
			oldRun = savedRuns[runIndex]; //old run is stored in the savedRUNS array
//=======
	// runIndex is the index used to access a run from the stringified JSON array of runs
    var runIndex = localStorage.getItem(APP_PREFIX + "-reRun");
	// savedRuns is array of completed runs that are loaded onto the Past Runs screen
    savedRuns = JSON.parse(localStorage.getItem(APP_PREFIX + '-runs'));
	
	// If there is a run index already stored inside the local storage, then they will be overwritten
    if (runIndex !== null) {
		localStorage.removeItem(APP_PREFIX + "-reRun");	
		
		// oldRun is stored as an element in the savedRuns array
        if (savedRuns !== null) {
			oldRun = savedRuns[runIndex];
//>>>>>>> Stashed changes
		}
	}

} else {
	console.log("Error: localStorage is not supported by current browser.");
}

//<<<<<<< Updated upstream
r(function(){ //checking if the function geolocate is ready or not
//=======
// r is a function with no arguments
r(function(){
//>>>>>>> Stashed changes
    geolocate();
});
// Checks if the function r() is ready or not - ie: whether it has been loaded or not
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}


//getting the random destination
function randomDestination(position) {	
	document.getElementById("beginRun").disabled = true;
	
	// NOTE: Distance from current position must 60m to 150m away    
	var randomPosition = null;
	var max = 0.001;
    var min = -0.001;
    var positiveNegativeArray = [-1, 1];
	var rand = null;
	var distance = 0;
	
    //using the do-while loop so that the distance of the destination is always greater than 60m and less than 150m
	do {
//<<<<<<< Updated upstream
		rand = positiveNegativeArray[Math.floor(Math.random() * positiveNegativeArray.length)];//this line should've been omitted
//=======
		// The following line should've been omitted
        rand = positiveNegativeArray[Math.floor(Math.random() * positiveNegativeArray.length)];
//>>>>>>> Stashed changes
        
        
        //formula to calculate the distnace of random destination
		randomPosition = {
			lat: ((Math.random() * (max - min)) + min) + position.lat,
			lng: ((Math.random() * (max - min)) + min) + position.lng
		}
//<<<<<<< Updated upstream
		//method of googlemapsAPI to calculate the linear distance between 2 given points
		distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(currentPosition), new google.maps.LatLng(randomPosition));
//=======
		
		// A method of the Google Maps API that calculates a linear distance between two given points
        distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(currentPosition), new google.maps.LatLng(randomPosition));
//>>>>>>> Stashed changes
    }
    while(distance > 150 || distance < 60);

//<<<<<<< Updated upstream
	document.getElementById("beginRun").disabled = false;//beginrun on html is disbled at first
//=======
	// The beginRun button located inside the HTML document is disabled at first
    document.getElementById("beginRun").disabled = false;
//>>>>>>> Stashed changes
    
	console.log(randomPosition);

    return randomPosition;
}


//creating a function to start a run
function startRun() {
//<<<<<<< Updated upstream
    document.getElementById("selectDestination").disabled = true; //disables select Dest function
    document.getElementById("beginRun").disabled = true; //disables beginRun function

	var startPosition = new google.maps.LatLng(currentPosition);
	newRun = new Run(startPosition, new google.maps.LatLng(destinationPosition), new Array(startPosition) , new Date(), null);
	trackRunTimer = setInterval(trackRun, 1000);//new instance of run. each of the arguments inside it are private attributes, null=end time
    //track runtimer = 
    //variable is declared for a set time interval every 1000millisecond=1sec
    //reason for a variable on this timing event, is to stop the timing aswell
//=======
    // following two lines disable the selectDestination and beginRun elements in the DOM
    document.getElementById("selectDestination").disabled = true;
    document.getElementById("beginRun").disabled = true;

	// startPosition is a new instance of LatLng, accepts the currentPosition object
    var startPosition = new google.maps.LatLng(currentPosition);
	// newRun is a new instance of Run and each of the arguments inside are private attributes of the class. The end time is set to null for the start of the run.
    newRun = new Run(startPosition, new google.maps.LatLng(destinationPosition), new Array(startPosition) , new Date(), null);
	// A variable is declared for the timing event setInterval which calls the trackRun function every 1000 miliseconds. The reason why a variable must be declared for this timing event is so that timer can be stopped later
    trackRunTimer = setInterval(trackRun, 1000);
//>>>>>>> Stashed changes
}

//Creating a function to track a run

function trackRun() {

	//Pushing the current location in the newRun array array
	newRun.arrayLocations.push(new google.maps.LatLng(currentPosition));
	
    map.setCenter({
        lat: currentPosition.lat,
        lng: currentPosition.lng
    });
	
    //Setting the position of current marker
    currentMarker.setPosition({
        lat: currentPosition.lat,
        lng: currentPosition.lng
    });
    
    //calling drawpolyline function that connects points and draws straight lines in between them
	drawPolyLine();
    
    //calculating the distance travelled from start location. Uses the a method from Google Maps API
    distanceFromStart = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(currentPosition), newRun.startLocation);
    
	// displays the distance from start to two decimal places
    document.getElementById("distanceFromStart").innerHTML = distanceFromStart.toFixed(2);

    //If statement to check if the distance to destination is less than or equal to 10 meters to stop the run automatically
    if (distanceToDestination <= DISTANCE_THRESHOLD) {
		stopRun();
        
        // enabling the saveRun element
		document.getElementById("saveRun").disabled = false;
    } else {
        
        //Making the save run button disabled
		document.getElementById("saveRun").disabled = true;
	}
}

//Creating a function which draws a line on the map

function drawPolyLine() {
    // an object from the Google Maps API
    var pathPolyLine = new google.maps.Polyline({
//>>>>>>> Stashed changes
        path: newRun.arrayLocations,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    
    //displays the polyline on the map
    pathPolyLine.setMap(map);
}


//creating a function to stop a run
function stopRun() {

    newRun.endTime = new Date();
	
    // For each time geolocation is used in the map, geolocationWatchID has a number assigned to it. The following line resets geolcation so that it can be used next time.
    navigator.geolocation.clearWatch(geolocationWatchID);
    
    // stops timing events
    clearInterval(trackRunTimer);
    clearInterval(trackDestinationTimer);
    
	displayMessage('Run completed ' + newRun.distanceTravelled + 'm in ' + newRun.travelDuration + 'sec.')
//>>>>>>> Stashed changes
	console.log(newRun.distanceTravelled)
	console.log(newRun.travelDuration)
	console.log("Run stopped.");
}



//<<<<<<< Updated upstream
// Map Initialization callback.  Will be called when Maps API loads.

function initMap() {
//>>>>>>> Stashed changes
    // Enabling new cartography and themes
    google.maps.visualRefresh = true;

    // Initialize map, centered on Melbourne, Australia.
    map = new google.maps.Map(document.getElementById('map'),{
 
        zoom: 17
    });

    // Choosing our marker display and layout
    var currentMarkerOption = {
        position: map.getCenter(),
        icon: {
            fillColor: "blue",
            fillOpacity: 1,
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: "blue",
            scale: 3
        },
        draggable: false,
        map: map
    };

    // Creating the destination marker location
    var destinationMarkerOption = {
        position: map.getCenter(),
        icon: {
            fillColor: "red",
            fillOpacity: 1,
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: "red",
            scale: 3
        },
        draggable: false,
        map: map
    };

    // Displaying the Marker on the Map
    destinationMarker = new google.maps.Marker(destinationMarkerOption);
    currentMarker = new google.maps.Marker(currentMarkerOption);

    // Add circle overlay and bind to marker
    accuracyCircle = new google.maps.Circle({
        map: map,
        fillColor: 'blue',
        strokeColor: 'blue',
        strokeOpacity: 0.5,
        strokeWeight: 2
    });

    accuracyCircle.bindTo('center', currentMarker, 'position');

    // Geolocation is a functionality that comes from the navigator library. This library comes from the Google Maps API
    // this line checks to see whether the device has GPS functionality.
}


// function that finds the position of the user
function geolocate() {
//>>>>>>> Stashed changes
    if ("geolocation"in navigator) {
        // Here, properties are assigned to a new object. These properties are specifiable options which are passed into the geolocationWatchID variable
        var positionOptions = {
            enableHighAccuracy: false,
            timeout: 60000,
            maximumAge: 0
        };
		
        // this variable addresses the watchPosition functionality in geolocation which is in the navigator library. The functionality takes three arguments, as seen below.
        geolocationWatchID = navigator.geolocation.watchPosition(showCurrentPosition, errorHandler, positionOptions);
		displayMessage('Determining location. Please wait...', 1000);		
    } else {
		displayMessage('No GPS detected on device');
        console.log('No GPS detected on device');
    }
}

//Creating a function to get the user's location and accuracy
//Displaying the user's location
function showCurrentPosition(position) {
    console.log(position);
    
    currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.coords.timestamp
    };

    map.setCenter({
        lat: currentPosition.lat,
        lng: currentPosition.lng
    });

    currentMarker.setPosition({
        lat: currentPosition.lat,
        lng: currentPosition.lng
    });

    accuracyCircle.setRadius(currentPosition.accuracy);
	console.log(currentPosition.accuracy);

//Checking if the accuracy is high to make the select Destination button enabled	
	if (currentPosition.accuracy < ACCURACY_THRESHOLD) {

		// runOnce is set as true as long as the accuracy is within the threshold. The following code will run
        if (runOnce) {
			// if there is no run being viewed, then the app allows the user to select a destination
            if(oldRun === null) {
//>>>>>>> Stashed changes
				document.getElementById("selectDestination").disabled = false;
			} else {
				showDestinationPosition({lat: oldRun._destinationLocation.lat, lng: oldRun._destinationLocation.lng});			
			} 
			
			displayMessage("Location now accurate enough.", 1000);
			runOnce = false;
		}

		// Checks if the user is re-running an old run
        if (oldRun !== null) {
			// displays a distance to the start of the oldRun with Google Maps API method
            distanceFromStart = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(currentPosition), new google.maps.LatLng({lat: oldRun._startLocation.lat, lng: oldRun._startLocation.lng}));
			

            // enables the oldRun to be reattemped
			if (true) {
//>>>>>>> Stashed changes
				document.getElementById("beginRun").disabled = false;
				displayMessage('You may begin run.', 1000);	
				oldRun = null;
			}
		}	
	}
	
	return position;
}


//Function to show destination position
function showDestinationPosition(position) {
	destinationPosition = position;
	
	trackRunDestinationTimer = setInterval(trackDestination, 100);
	
	map.setCenter({
        lat: position.lat,
        lng: position.lng
    });
	
    destinationMarker.setPosition({
        lat: position.lat,
        lng: position.lng
    });
}


//for the purpose of displaying on the DOM the distanceToDestination
//>>>>>>> Stashed changes
function trackDestination() {
	distanceToDestination = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(currentPosition), new google.maps.LatLng(destinationPosition));
    document.getElementById("distanceToDestination").innerHTML = distanceToDestination.toFixed(2);	
}

//Creating a function to check different conditions if the browser is not able to get user's location and display error message
function errorHandler(error) {
    var errorType = {
        0: "Unknown Error",
        1: "Permission Denied by user",
        2: "Position of the user isn't available",
        3: "Request timed out"
    };
	
    var errorMessage = errorType[error.code];

	console.log(errorMessage);
}