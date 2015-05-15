var map;
var mapOptions;



$(document).ready(function(){
	initialize();
});



function initialize() {
// Map Styles
  mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(-34.397, 150.644)
  };

// New map
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);


}


var waitAllimages = function() { // Wait dom ready
    var $img = $('img'), // images collection
        totalImg = $img.length,
        waitImgDone = function() {
            totalImg--;
            // console.log(totalImg +" that number");
            if (!totalImg) {
                console.log($img.length+" image(s) chargée(s) !");
            }
        };
    $img.each(function() {
        if (this.complete) waitImgDone(); // already here..
        else $(this).load(waitImgDone).error(waitImgDone); // completed...
    });
};

$.ajax({
    dataType: 'jsonp',
    url: 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?', // Here our distant webservice
    data: {tags: 'tanks', tagmode:'any', format: 'json'},
    error: function() {
        console.log(arguments);  
    },
    success: function(data) {
        console.log('data.items', data.items);
        $.each(data.items, function(i, obj) {
            console.log('src', obj.media.m);
            $('<img src="'+obj.media.m+'" title="'+obj.title+'"/>').appendTo('.pictures');
        });
        waitAllimages();
    }
});
