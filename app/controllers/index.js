// Setup
var Log = require('log');

Ti.Geolocation.preferredProvider = "gps";
Ti.Geolocation.purpose = "GPS demo";

Ti.App.addEventListener('ti.navibridge.admin.console', function(data) {
	Log.Info('admin.console: "' + data.message + '"');
});
// End Setup

var mapView = null;

$.tab1.addEventListener('focus', function(){
	if(!mapView){
		mapView = Alloy.createController("map", {tab: $.tab1});
		$.win1.add(mapView.view)
	}
});

$.tabGroup.open();
