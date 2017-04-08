var map; // Global variable used for initializing the map object.
var InfoWindow;// Instead of using multiple infowindows we can just use one since it is unncessary in this situation.

// This is the constructor function for the map.
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
  center : {lat: 40.7413549, lng: -73.9980244},
  zoom: 13,
});
infowindow = new google.maps.InfoWindow();
ko.applyBindings(new ViewModel());
}

function ajaxRequestData() {
  var foursquareUrl = "https://api.foursquare.com/v2/venues/search?client_id=AYDF0KKIFOA4SPMINSUXZWVJXP23OJYCYRPVOAV1HOK4LLRL&client_secret=M32BTG24T3GYTNGFKKZ5HEAG4XAE2BJ50LRYDE30VED5VODO&v=20130815&ll=20,76&query=pizza";
   $.ajax({
    url: foursquareUrl;
    success : function(receive) {
     console.log(receive);
    }
  })
}

ajaxRequestData();

// This represents the view in the MVVM pattern.
var Place = function(data) {
 var self = this;
 this.name = ko.observable(data.title);
 // this.address = ko.observable(data.address);
 // this.phone = ko.observable(data.phone);
 this.latitude = ko.observable(data.location.lat);
 this.longitude = ko.observable(data.location.lng);

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
    self.openInfo();
    self.bounce();
    });

  this.openInfo = function() {
     infowindow.open(map,this.marker);
     infowindow.setContent('<div>' + marker.title + '</div>');
    }

  this.bounce = function() {
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
    this.marker.setAnimation(null);
  },5000);
  }

  this.selected = function() {
    this.marker.setIcon(newMarker);
    this.marker.setVisible(True);
  }
}


var ViewModel = function() {
  var self = this;
  this.locs = ko.observableArray(locations);
  this.currentLocation = ko.observable("");
  this.query = ko.observable("");

  this.filterLocations = ko.computed(function() {
    var query = self.query().toLowerCase();
      console.log(query);
      if (!query) {
        return self.locs();
      } else  {
        return ko.utils.arrayFilter(self.locs(),function(locs) {
          return ko.utils.stringStartsWith(locs.title().toLowerCase(), query);
        });
      }
    },this);

  this.setCurrentLocation = function(clickedLoc) {
      self.currentLocation(clickedLoc);
  }

 this.currentShow = function(selectedLoc) {
  selectedLoc.selected();
  selectedLoc.bounce();
  selectedLoc.openInfo();
}

}
