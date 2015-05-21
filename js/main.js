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
	get_images();
});



function get_images() {

    var info =  new google.maps.InfoWindow({
            content: ''
                    });

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

            // geolocation request

            $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=a5e95177da353f58113fd60296e1d250&photo_id='+obj.link.split("/")[5]+'&format=json&nojsoncallback=1',
                function(data){
                    if(data.photo.location != undefined) {
                        // Lats & longs
                        console.log(data.photo);
                        marker_list.push(data.photo);

                        for (i in marker_list){
                            

                            //console.log(marker_list[i].id);

                            templatlon = new google.maps.LatLng(marker_list[i].location.latitude, marker_list[i].location.longitude);   

                            var marker = new google.maps.Marker({
                                map: map,
                                position: templatlon,
                                title: marker_list[i].title._content
                            });

                            infowindow(marker, map, info, '<img src="http://farm'+marker_list[i].farm+'.static.flickr.com/'+marker_list[i].server+'/'+marker_list[i].id+'_'+marker_list[i].secret+'_m.jpg" title="'+marker_list[i].title._content+'"/>');


                        }

                    }
                });

        });
        waitAllimages();
    }
});
  
    mapload();

};


function mapload() {

    mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(38.118492, -39.555226),
        styles: map_styles,
        disableDefaultUI: true
    };
    
    
    // New map
      map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

      $('#map-canvas').height($('#body').height());


};

function infowindow(marker, map, infowindow, html){

            google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(html);
            infowindow.open(map, marker);
        });

}


function waitAllimages() { // Wait for DOM ready
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


//

function base_encode(num) {
    var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var base_count = alphabet.length;
    var encoded = '';
    while (num >= base_count) {
        var div = num/base_count;
        var mod = (num-(base_count*intval(div)));
        encoded = alphabet.charAt(mod) + encoded;
        num = intval(div);
    }
    if (num) encoded = alphabet.charAt(num) + encoded;
    return encoded;
}




//for flickr short link base58 encoding above.

function intval(mixed_var, base) {
  //  discuss at: http://phpjs.org/functions/intval/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: stensi
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Rafał Kukawski (http://kukawski.pl)


  var tmp;

  var type = typeof mixed_var;

  if (type === 'boolean') {
    return +mixed_var;
  } else if (type === 'string') {
    tmp = parseInt(mixed_var, base || 10);
    return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
  } else if (type === 'number' && isFinite(mixed_var)) {
    return mixed_var | 0;
  } else {
    return 0;
  }
};

