// Setup
var Log = require('log');

Ti.App.addEventListener('ti.navibridge.admin.console', function(data) {
	Log.Info('admin.console: "' + data.message + '"');
});
// End Setup

var mapView = null,
	contactList = null;

$.tab1.addEventListener('focus', function(){
	if(!mapView){
		mapView = Alloy.createController("map", {tab: $.tab1});
		$.win1.add(mapView.view)
	}
});

$.tab2.addEventListener('focus', function(){
	if(!contactList){
		contactList = Alloy.createController("contactList", {tab: $.tab2});
		$.win2.add(contactList.view)
	}
});

$.tabGroup.open();
