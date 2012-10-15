var API = require('api');

var args = arguments[0] || {},
	tab = args.tab;
	
var currentRegion = null;

$.searchField.addEventListener('return', function(e) {
	// alert('Search: '+JSON.stringify(currentRegion));
	var lat = (currentRegion) ? currentRegion.latitude : 37.390749,
		lng = (currentRegion) ? currentRegion.longitude : -122.081651;
	
	e.source.value && API.searchGooglePlaces({
		query: e.source.value,
		lat: lat,
		lng: lng,
		callback: function(json) {
			$.map.annotations = createAnnotations({
				json: json
			});
		}
	});
	
});

$.map.addEventListener('click', function(e) {
    Ti.API.info("Annotation " + e.title + " clicked, id: " + e.annotation.itemData);
	
    if (e.clicksource == 'rightButton') {
        Ti.API.info("Annotation " + e.title + ", right button clicked.");
        tab.open(Alloy.createController('locationDetails', {itemData: e.annotation.itemData}).win);
    } 
});

$.map.addEventListener('regionChanged', function(e) {
	currentRegion = e;
});

function createAnnotations(params) {
	params = params || {};
	var json = params.json;
	
	var annotations = [],
		item;
	
	if(json.results){
		
		for (var i = 0, j = json.results.length; i < j; i++) {
			item = json.results[i],
			
			annotations.push(Ti.Map.createAnnotation({
				title: item.name,
				latitude: item.geometry.location.lat,
				longitude: item.geometry.location.lng,
				itemData: item,
				rightButton: Ti.UI.iPhone.SystemButton.DISCLOSURE
			}));
		}
	}
	
	return annotations;
}