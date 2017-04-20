var map; // Global variable used for initializing the map object.
var InfoWindow;// Instead of using multiple infowindows we can just use one since it is unncessary in this situation.

// This is the constructor function for the map.
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
  center : {lat: 19.0176, lng: 72.8562},
  zoom: 12,
});
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
    success : function(receivedData) {
    var placeItem = receivedData.response.venues;
     placeItem.forEach(function(venue) {
        data.push(new Place(venue));
     });
    },
    // Error handling method for ajax request
    error : function(jqXHR, textStatus, errorThrown) {
      window.alert("An error occured, please press Ctrl+Shift+I for more details");
      console.log("jqXHR:" + jqXHR);
      console.log("TextStatus:" + textStatus);
      console.log("ErrorThrown:" + errorThrown);
    }
  });
}

// Error handling for google maps apis
function errorHandler() {
  var errorMessage = '<h2>Sorry, Google Maps is not working</h2>';
  console.log(errorMessage);
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
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));

 var newMarker = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "001188",
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.latitude,this.longitude),
    map: map,
    title: this.name,
    icon: originalMarker,
    animation : google.maps.Animation.DROP,
   });

   this.marker.addListener('click', function() {
    self.marker.setIcon(newMarker);
    self.openInfo();
    self.bounce();
    });

  this.openInfo = function() {
     infowindow.open(map,this.marker);
     infowindow.setContent('<div>' + this.name + '</div>' +
                            '<div>' + this.address + '</div>' +
                            '<div>' + this.phone + '</div>' +
                             '<div>' + this.pincode + '</div>');
    }

  this.bounce = function() {
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
    this.marker.setAnimation(null);
   },5000);
  }

}


var ViewModel = function() {
  var self = this;
  this.locs = ko.observableArray([]);
  ajaxRequestData(this.locs);
  this.currentLocation = ko.observable("");
  this.query = ko.observable("");
  this.filterLocations = ko.computed(function() {
    var query = self.query().toLowerCase();
      if (!query) {
        return self.locs();
      } else  {
        return ko.utils.arrayFilter(self.locs() ,function(loc) {
           var match = loc.name.toLowerCase().indexOf(query) !=  -1;
           loc.marker.setVisible(match);
           return match;
        });
      }
    },this);

   this.default = function() {
   for (i=0; i<this.locs().length; i++) {
   // This is the separate for loop to handle displaying of the markers when the page loads.
   var position = this.locs()[i].Place.location.labeledLatLngs;
   var title = this.locs()[i].Place.name;
   }
  }
}

// Here I created a new instance of the class ViewModel to access its properties and methods directly
var viewModel = new ViewModel();
