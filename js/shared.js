// Shared code needed by all three pages.

// Prefix to use for Local Storage. Is a key in the localStorage
var APP_PREFIX = "monash.eng1003.runChallengeApp";

// Array of saved Run objects.
var savedRuns = [];

// Run Class.
class Run {
    constructor(startLocation, destinationLocation, arrayLocations, startTime, endTime) {
        this._startLocation = startLocation;
		this._destinationLocation = destinationLocation;
        this._arrayLocations = arrayLocations;
        this._startTime = startTime;
        this._endTime = endTime;
    }

    // Below are the set and get functions for all the data that we'll put inside for each new instance
    get startLocation() {
		return this._startLocation;
	}
	set startLocation(value) {
        this._startLocation = value;
    }
	
	get destinationLocation() {
		return this._destinationLocation;
	}
	set destinationLocation(value) {
        this._destinationLocation = value;
    }

	get arrayLocations() {
		return this._arrayLocations;
	}
    set arrayLocations(value) {
        this._arrayLocations = value;
    }

	get startTime() {
		return this._startTime;
	}
    set startTime(value) {
        this._startTime = value;
    }

	get endTime() {
		return this._endTime;
	}
    set endTime(value) {
        this._endTime = value;
    }
//<<<<<<< Updated upstream
	//calculates the total distance travelled
//=======
	
	// Method which calculates the total distance travelled
    get distanceTravelled () {
//>>>>>>> Stashed changes
		return google.maps.geometry.spherical.computeLength(this._arrayLocations);
	}
	
	get travelDuration() {
		return (this._endTime - this._startTime) / 1000;
	}
//<<<<<<< Updated upstream
	//re-intialises objects which was stored from the local storage
    //stores them as 
    //retrieve past runs
//=======
	
    // re-initialised objects which were stored in the local stoage.
	initialiseFromRunPDO(aRun) {
//>>>>>>> Stashed changes
        this._startLocation = new google.maps.LatLng(aRun._startLocation);        
		this._destinationLocation = new google.maps.LatLng(aRun._destinationLocation);
		
		var locationsCount = aRun._arrayLocations.length;
		var locations = [];
//<<<<<<< Updated upstream
		//pushes all locations into an array called locations
		for(var i = 0; i < locationsCount; i++) {
//=======
		
		// pushes all locations into an array called locations
        for(var i = 0; i < locationsCount; i++) {
//>>>>>>> Stashed changes
			locations.push(new google.maps.LatLng(aRun._arrayLocations[i]));
		}
		
        this._arrayLocations = locations;
        this._startTime = new Date(aRun._startTime);
        this._endTime = new Date(aRun._endTime);
    }
}

//Function to store the runs
//storing the runs
function storeRun() {
    if (typeof (Storage) !== "undefined") {
		if(savedRuns !== null) {
			savedRuns.push(newRun);
		} else {
			// defines the data structure of savedRuns as an array
            savedRuns.push(new Array(newRun));
		}
		
        //Stringifying all the data
		var data = JSON.stringify(savedRuns);
		localStorage.setItem(APP_PREFIX + '-runs', data);
			
		location.href = 'index.html';
		
    } else {
        console.log("Error: localStorage is not supported by current browser.");
    }
}