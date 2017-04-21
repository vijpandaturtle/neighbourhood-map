var map; // Global variable used for initializing the map object.

// This is the constructor function for the map.
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 19.0176,
            lng: 72.8562
        },
        zoom: 12,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#523735"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#c9b2a6"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#dcd2be"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#ae9e90"
                }]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#93817c"
                }]
            },
            {
                "featureType": "poi.business",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#a5b076"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#447530"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#fdfcf8"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f8c967"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#e9bc62"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e98d58"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#db8555"
                }]
            },
            {
                "featureType": "road.local",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#806b63"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#8f7d77"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#b9d3c2"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#92998d"
                }]
            }
        ]
    });
    // Instead of using multiple infowindows we can just use one since it is unncessary in this situation.
    infowindow = new google.maps.InfoWindow();
    ko.applyBindings(viewModel);
}

// Function for retrieving data from foursquare API
function ajaxRequestData(data) {
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search?client_id=AYDF0KKIFOA4SPMINSUXZWVJXP23OJYCYRPVOAV1HOK4LLRL&client_secret=M32BTG24T3GYTNGFKKZ5HEAG4XAE2BJ50LRYDE30VED5VODO&v=20130815&ll=19.0176,72.8562&query=pizza";
    // Initialize the parameter data as an array
    $.ajax({
        url: foursquareUrl,
        // The success method defines the procedure to be followed when the ajax request is successful
        success: function(receivedData) {
            var placeItem = receivedData.response.venues;
            placeItem.forEach(function(venue) {
                data.push(new Place(venue));
            });
        },
        // Error handling method for ajax request
        error: function(jqXHR, textStatus, errorThrown) {
            window.alert("An error occured, please press Ctrl+Shift+I for more details");
            console.log("jqXHR:" + jqXHR);
            console.log("TextStatus:" + textStatus);
            console.log("ErrorThrown:" + errorThrown);
        }
    });
}

// Error handling for google maps apis
function errorHandler() {
    var errorMessage = '<h3>Sorry, Google Maps is not working</h3>';
    console.log("Google Maps isn't working");
    $('#map').append(errorMessage);
}

// This represents the view in the MVVM pattern.
var Place = function(data) {
    var self = this;
    this.name = data.name;
    // Just adding an OR operator can handle the situation when data in a certain is missing.
    this.address = data.location.formattedAddress || "Sorry we don't have the info at the time";
    this.phone = data.contact.formattedPhone || "Sorry we don't have the info at the time";
    this.pincode = data.location.postalCode || "Sorry we don't have the info at the time";
    this.latitude = data.location.lat;
    this.longitude = data.location.lng;

    var originalMarker = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "FE7569",
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    var newMarker = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "001188",
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.latitude, this.longitude),
        map: map,
        title: this.name,
        icon: originalMarker,
        animation: google.maps.Animation.DROP,
    });

    this.marker.addListener('click', function() {
        self.marker.setIcon(newMarker);
        self.openInfo();
        self.bounce();
    });

    this.openInfo = function() {
        infowindow.open(map, this.marker);
        infowindow.setContent('<div>' + this.name + '</div>' +
            '<div>' + this.address + '</div>' +
            '<div>' + this.phone + '</div>' +
            '<div>' + this.pincode + '</div>');
    };

    this.bounce = function() {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
        self.marker.setAnimation(null);
        self.marker.setIcon(originalMarker);
      }, 4000);
    };

};


var ViewModel = function() {
   // This is a simple trick that helps keep track of the scope of keyword this. Self means it belongs to the viewModel scope.
    var self = this;
    this.locs = ko.observableArray([]);
    ajaxRequestData(this.locs);
    this.currentLocation = ko.observable("");
    this.query = ko.observable("");
    this.filterLocations = ko.computed(function() {
        var query = self.query().toLowerCase();
        if (!query || query == "") {
          // Displays all locations and markers when the input box is empty
          for (var i=0; i<self.locs().length; i++) {
            self.locs()[i].marker.setVisible(true);
          }
          return self.locs();
        } else {
            return ko.utils.arrayFilter(self.locs(), function(loc) {
                var match = loc.name.toLowerCase().indexOf(query) != -1;
                loc.marker.setVisible(match);
                return match;
            });
        }
    }, this);

    this.setCurrent = function(clickedLocation) {
      self.currentLocation(clickedLocation);
      clickedLocation.marker.setVisible(true);
    };

    this.default = function() {
        for (i = 0; i < this.locs().length; i++) {
            // This is the separate for loop to handle displaying of the markers when the page loads.
            var position = this.locs()[i].location.labeledLatLngs;
            var title = this.locs()[i].name;
        }
    };
};

// Here I created a new instance of the class ViewModel to access its properties and methods directly
var viewModel = new ViewModel();
