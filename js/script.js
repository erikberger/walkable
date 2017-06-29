function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.952583,
            lng: -75.165222
        },
        scrollwheel: false,
        zoom: 14,

    });

    var geocoder = new google.maps.Geocoder;
    var bounds = new google.maps.LatLngBounds();

    document.getElementById('start').addEventListener('change', function () {
        var $this = $(this);
        geocodePlaceId(geocoder, map, $this, bounds);
    });

    document.getElementById('end').addEventListener('change', function () {
        var $this = $(this);
        geocodePlaceId(geocoder, map, $this, bounds);

    });

}



var markers = [];
// This function is called when the user clicks the UI button requesting
// a reverse geocode.
function geocodePlaceId(geocoder, map, $this, bounds) {

    var placeId = $this.val();

    geocoder.geocode({
        'placeId': placeId
    }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                bounds.extend(results[0].geometry.location);

                if($($this).attr("id") == 'start'){ // prevent adding new marker if #start is changed
                  deleteMarkers();
                };

                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });

                map.fitBounds(bounds);
                var zoom = map.getZoom();
                map.setZoom(zoom > 14 ? 14 : zoom);
                map.setCenter(bounds.getCenter());
                markers.push(marker);

            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });

}


$("#start").change(function () {

    $("#end").prop("disabled", false);


    var startValue = $(this).val();
    $("#end option[value='"+startValue+"']").prop("disabled", true);

});

function round(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

function getMiles(i) {
    return round(i * 0.000621371192, 2);
}

function getMinutes(i) {
    return round(i / 60, 0);
}

$(document).ready(function () {
    $('#end').change(function () {
        //event.preventDefault();
        //  $("#go").submit();
        $.ajax({
                type: 'POST',
                url: 'walk.php',
                dataType: 'json',
                data: $("#go").serialize()
            })
            .success(function (data) {


                var meters = data.rows[0].elements[0].distance.value;
                var seconds = data.rows[0].elements[0].duration.value;

                $(".miles").text(getMiles(meters) + " miles");
                $(".minutes").text(getMinutes(seconds) + " minutes");

            })

            .error(function (xhr, status, error) {
                alert(xhr.responseText);
            })

        $("#start, #end").prop("disabled", true);
        $(".reset").css("display", "inline");
    });
});

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

$(".reset").click(function () {
    deleteMarkers();
    $(this).hide();
    $(".miles, .minutes").text("");
    $("#start, #end").prop({
        "disabled": false,
        selectedIndex: 0
    });
    $("#end option").prop("disabled", false);
    $("#end").prop("disabled", true);
})
