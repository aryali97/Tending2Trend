// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

var markers = []
var latlngs = []
var map = null;
var heatmap = null;
var searchBox = null; 
var selectedMarker = null;
var oldIcon = null;
var json_global = "unchanged";
currentmark = null;
function setGlobal(newstring)
{
    json_global = newstring;
}
function sendMessage(message)
{
    document.getElementById("message").innerHTML = message;
    document.getElementById("search").value = "";
    document.getElementById("search").focus();
}

function toggleMarkers() {
    for(marker of markers) {
        if(marker.map == null) {
            marker.setMap(map);
        } else 
            marker.setMap(null);
        }
    }
}

function orderByDate(geo_list)
{
    geo_list.sort(function(x, y) {
        datea = dateparse(x[2]);
        dateb = dateparse(y[2]);
        if(datea < dateb){
            return -1;
        }
        if(dateb < datea){
            return 1;
        }
        return 0;
    });
}
function changeHeatMap()
{
    if(heatmap.map == null)
    {
        heatmap.setMap(map);
    }
    else
    {
        heatmap.setMap(null);
    }
}
function dateparse(datestr)
{
    return Date.parse(datestr);
}
function parseData(json_data)
{
    var json = JSON.parse(json_data);
    var cords = [];
    console.log(typeof json.statuses);
    orderByDate(json.statuses);
    for( obj of json.statuses)
    {
        //json_obj = JSON.parse(obj);
        try {
            var tmpArray = obj['geo']['coordinates'];
            tmpArray.push(obj['created_at']);
            cords.push(obj['geo']['coordinates']);
        } catch(Err) {
            try {
                //console.log(obj['place']['full_name']);
            } catch(Err) {  
                //console.log('adags wet');
                continue;
            }
        }
    }
    return cords;
}
function inputSearch() 
{
    var hashtag = document.getElementById("search").value;
    if(hashtag == "")
    {
        sendMessage("Please Enter A Search");
        return;
    }
    var image = {
        //url: place.icon,
        url: 'images/marker_turqoise.png',
        size: new google.maps.Size(75, 100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 38)
    }; 
    var coords = [[38.825, -77.611], [39.8282, -98.5795], [41.3483, -113.9050]];
    var geo_list = [];
    for(coord of coords) {
        var lat = coord[0];
        var lon = coord[1];
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET","scripts/search.php?search="+hashtag+"&"+"lat="+lat+"&"+"lon="+lon, false);
        var json_result = "hello";
        xmlhttp.onload = function (){json_global = this.responseText; setGlobal(this.responseText);};
        xmlhttp.send();
        var newBounds = new google.maps.LatLngBounds();
        var tmp_list = parseData(json_global); 
        for(obj of tmp_list) {
            geo_list.push(obj);
        }
        console.log(geo_list.length); 
        //console.log(json_global);
        /*if(geo_list.length == 0) {
            sendMessage("No results found");
            return;
        }*/
    }
    orderByDate(geo_list);
    var newBounds = new google.maps.LatLngBounds();
    for(var i = 0, mark; mark = markers[i]; i++) {
        mark.setMap(null);
    }
    markers = [];
    for (obj of geo_list)
    {
        console.log(obj);
        console.log("Long: "+obj[0]+", Lat: " + obj[1]);
        var temp_latlng = new google.maps.LatLng(parseFloat(obj[0]),parseFloat(obj[1]));
        var temp_marker = new google.maps.Marker({
            icon: image,
            position: temp_latlng,
            draggable: false,
            animation: google.maps.Animation.DROP
        });
        newBounds.extend(temp_latlng);
        markers.push(temp_marker);
        latlngs.push(temp_latlng);
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: latlngs,
        radius: 35,
        opacity: .5,
    });
    markerIndex = 0;
    var timer = window.setInterval(function(){
        if(markerIndex >= markers.length) {
            window.clearTimeout(timer);
            return;
        }
        console.log('GetWet');
        markers[markerIndex].setMap(map);
        markerIndex++;
    }, 100);
    /*
    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW};
    //var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var line = new google.maps.Polyline({
        path: latlngs,
        icons:[{
            icon: lineSymbol,
            offset: '50%'}],
        map:map
    }); */
    map.fitBounds(newBounds);
    sendMessage("Found Results!")
    console.log("Done adding marker"); 
}


function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true, zoomControl: true
    });

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(38.825, -77.611),
        new google.maps.LatLng(39.000, -77.150));
    map.fitBounds(defaultBounds); 

    //THE BELOW IS VERY VERY UNNECESSARY
    var style = [
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": "-20"
                },
                {
                    "lightness": "5"
                },
                {
                    "color": "#61a8bf"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": "100"
                },
                {
                    "color": "#b1bbcc"
                },
                {
                    "saturation": "0"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": "-30"
                },
                {
                    "lightness": "-50"
                },
                {
                    "color": "#305e80"
                }
            ]
        }
    ]
    map.setOptions({styles: style});
    
    var input = (document.getElementById('input0'));
    searchBox = new google.maps.places.SearchBox((input));
    
    
    var search = document.getElementById('searchPanel');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search);

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        searchBox.setBounds(map.getBounds());
        var places = removeRepeats(searchBox.getPlaces());
        addLocations(places);
    });
    
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
    //THE ABOVE IS VERY VERY UNNECESSARY 


}
    
function addLocations(places) {
    console.log(places);
    if(places.length == 0) {
        return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
    }
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    var image = {
        //url: place.icon,
        url: 'images/marker_turqoise.png',
        size: new google.maps.Size(75, 100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 38)
    };
    for (var i = 0, place; place = places[i]; i++) {
        image.url = 'images/marker_turqoise.png';
        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location,
            draggable: true
        });
        marker.selected=false;
        markers.push(marker);
        bounds.extend(place.geometry.location);
    }
    console.log(bounds.getNorthEast().lat());
    map.fitBounds(bounds);
    if(map.getZoom() > 19) {
        map.setZoom(17);
    }
    searchBox.setBounds(bounds);
    var total = markers.length
}
    
function removeRepeats(places) {
    var i = 0;
    while(i < places.length) {
        var j = 0;
        var boo = 1;
        while(j < i) {
            console.log(i, j);
            console.log(places);
            var latDif = places[j].geometry.location.lat()-places[i].geometry.location.lat();
            var lngDif = places[j].geometry.location.lng()-places[i].geometry.location.lng();
            var mag = latDif*latDif+lngDif*lngDif;
            if(i == 8 && j == 7) {
                console.log(mag);
            }
            if(mag < 0.000005) {
                boo = 0;
            }
            j++;
        }
        if(boo == 0) {
            places.splice(i,1);
        } else {
            i++;
        }
    }
    console.log(places);
    return places;
}
    
function changeColors() {
    for(var i = 0; i < markers.length; i++) {
        var url = 'images/marker_turqoise.png';
        var col = '#ffffff';
        if(i == selectedInput) {
            col = '#4d90fe';
            url = 'images/marker_turqoise.png';
        }
        for(var j = 0, marker; marker = markers[i][j]; j++) {
            marker.icon.url = url;
            marker.setMap(map);
        }
    }
}


google.maps.event.addDomListener(window, 'load', initialize);