var API = require('api');
var SearchEngines = require('search_engines');

var args = arguments[0] || {},
	tab = args.tab;
	
var currentRegion = null,
	currentEngine;

// Setting the default or last selected search engine
var oldId = Ti.App.Properties.getString('currentEngineId', null);
oldId = oldId || "google";
setCurrentEngine(SearchEngines.engines[oldId]);

$.searchField.addEventListener('return', function(e) {
	// alert('Search: '+JSON.stringify(currentRegion));
	var lat = (currentRegion) ? currentRegion.latitude : 37.390749,
		lng = (currentRegion) ? currentRegion.longitude : -122.081651;
	
	e.source.value && currentEngine.apiCall({
		query: e.source.value,
		lat: lat,
		lng: lng,
		callback: function(json) {
			currentEngine.parseResponse(json, function(json) {
				$.map.annotations = createAnnotations({
					json: json
				});
				$.map.annotations.length && $.map.selectAnnotation($.map.annotations[0]);
			});
		}
	});
	
});

$.changeSearchEngineButton.addEventListener('click', function(){
	showSearchEngineList(function(engineData){
		setCurrentEngine(engineData);
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
	// Ti.API.info(JSON.stringify(e));
	currentRegion = e;
});

$.map.addEventListener('postlayout', function() {
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (!e.success || e.error) {
			$.map.region = {
				"longitudeDelta":3.515625,
				"longitude":-122.025146484375,
				"latitude":37.19970619616021,
				"latitudeDelta":3.2114288310468737
			};
		} else {
			$.map.region = {
				"longitudeDelta":2,
				"longitude":e.coords.longitude,
				"latitude":e.coords.latitude,
				"latitudeDelta":2
			};
		}
	});
});

function setCurrentEngine(newCurrent) {
	currentEngine = newCurrent;
	$.changeSearchEngineButton.title = newCurrent.title;
	Ti.App.Properties.setString('currentEngineId', currentEngine.id );
}

function showSearchEngineList(callback) {
	var engines = SearchEngines.engines,
		rows = [];
		
	for (var key in engines) {
		rows.push({
			title: engines[key].title,
			itemData: engines[key]
		});
	}
	
	var win = Ti.UI.createWindow();
	var tv = Ti.UI.createTableView({
		data: rows
	});
	tv.addEventListener('click', function(e) {
		if(e && e.row){
			callback && callback(e.row.itemData);
			win.close();
		}
	});
	win.add(tv);
	win.open();
}

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