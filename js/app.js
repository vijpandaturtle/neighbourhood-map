var map; // Global variable used for initializing the map object.
var InfoWindow;// Instead of using multiple infowindows we can just use one since it is unncessary in this situation.

// This is the constructor function for the map.
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
  center : {lat: 40.7413549, lng: -73.9980244},
  zoom: 13,
});
infowindow = new google.maps.InfoWindow();
}

//This data is taken from the google maps apis course by Udacity.
//This is the model containing all the data in the MVVM pattern.
var Locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

// This represents the view in the MVVM pattern.
var Place = function(data) {
  var self = this;
 this.name = ko.observable(data.title);
 this.address = ko.observable(data.address);
 this.phone = ko.observable(data.phone);
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
    title: title,
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
  this.locs = ko.observableArray(Locations);
  this.currentLocation = ko.observable("");
  this.query = function(value) {
      self.locs.removeAll();

    for(var x in locs) {
      if(Locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.locs.push(Locations[x]);
        }
     }
   }

 this.currentShow = function(selectedLoc) {
  selectedLoc.selected();
  selectedLoc.bounce();
  selectedLoc.openInfo();
}

}

// ViewModel.query.subscribe(ViewModel.search);
ko.applyBindings(new ViewModel());
