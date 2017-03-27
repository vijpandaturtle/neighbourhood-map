var Locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var map;
var infowindow;
var latlngbounds;
var markers =[];
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
  center : {lat: 40.7413549, lng: -73.9980244},
  zoom: 13,
});

infowindow = new google.maps.InfoWindow();
latlngbounds = new google.maps.LatLngBounds();

for(i=0; i<Locations.length; i++) {

  var position = Locations[i].location;
  var title = Locations[i].title;


  var marker = new google.maps.Marker({
  position: position,
  map: map,
  title: title,
  animation : google.maps.Animation.DROP,
  id : i
});
 markers.push(marker);
 latlngbounds.extend(marker.position);
 marker.addListener('click', function() {
  populate(this, infowindow);
 });

 function populate(marker, infowindow) {
   if (infowindow != marker) {
     infowindow.marker = marker;
     infowindow.setContent('<div>' + marker.title + '</div>');
         infowindow.open(map, marker);
         infowindow.addListener('closeclick', function() {
           infowindow.marker = null;
         });
   }
 }
 map.fitBounds(latlngbounds);
}
}

var Place = function(data) {
/* this.name = ko.observable(data.name);
 this.address = ko.observable(data.address);
 this.phone = ko.observable(data.phone);
 this.latitude = data.location.lat;
 this.longitude = data.location.lng; */
}


var ViewModel = function() {
  var self = this;
  this.locations = ko.observableArray([]);
  this.query = ko.observable("");

  this.search = function(value) {
      self.Locations.removeAll();

      for(var x in Locations) {
        if(Locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.beers.push(beers[x]);
        }
      }
    }
}
// ViewModel.query.subscribe(ViewModel.search);
ko.applyBindings(new ViewModel());
