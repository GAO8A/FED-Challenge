// Globals...

var map;
var mapOptions;
var map_styles = [
  {
    "elementType": "geometry",
    "stylers": [
      { "hue": "#e44d26" }
    ]
  },{
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
  }
];

 var marker_list = [];



$(document).ready(function(){
	initialize();
    console.log(marker_list);
});



function get_locations() {


};



function initialize() {

$.ajax({
    dataType: 'jsonp',
    url: 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?', 
    data: {tags: 'geotagged', tagmode:'any', format: 'json'},
    error: function() {
        console.log(arguments);  
    },
    success: function(data) {
        //console.log('data.items doop', data.items);
        $.each(data.items, function(i, obj) {

            //image url 
            //console.log('src', obj.media.m);

            // takes the image id.
            // console.log(obj.link.split("/")[5]);

            // geolocation request

            $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=a5e95177da353f58113fd60296e1d250&photo_id='+obj.link.split("/")[5]+'&format=json&nojsoncallback=1',
                function(data){
                    if(data.stat != 'fail') {
                        // Lats & longs
                        //console.log('Lat: ' + data.photo.location.latitude + ' Lon: ' + data.photo.location.longitude);
                        
                        marker_list.push(data.photo);

                        for (i in marker_list){
                            console.log(marker_list[i]);

                            templatlon = new google.maps.LatLng(marker_list[i].location.latitude, marker_list[i].location.longitude);   

                            var marker = new google.maps.Marker({
                                map: map,
                                position: templatlon,
                                title: marker_list[i].id
                            });
                        }



                        //console.log(templatlon);

                        // marker_list.push(data.photo);
                        // console.log(marker_list);

                    }
                });

            $('<img src="'+obj.media.m+'" title="'+obj.title+'"/>').appendTo('.pictures');
        });
        waitAllimages();
    }
});
  
    mapload();

};


function mapload() {

    mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(-34.397, 150.644),
        styles: map_styles
    };
    
    
    // New map
      map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);


};



function waitAllimages() { // Wait dom ready
    var $img = $('img'); // images collection

    var totalImg = $img.length;

    var waitImgDone = function() {
            totalImg--;
            // console.log(totalImg +" that number");
            if (!totalImg) {
                console.log($img.length);
            }
        };
        
    $img.each(function() {
        if (this.complete) waitImgDone(); // already here..
        else $(this).load(waitImgDone).error(waitImgDone); // completed...
    });
};



