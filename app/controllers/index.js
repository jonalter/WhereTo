// function doClick(e) {  
    // alert($.label.text);
// }
// 
// $.index.open();

var mapView = null;

$.tab1.addEventListener('focus', function(){
	if(!mapView){
		mapView = Alloy.createController("map", {tab: $.tab1});
		$.win1.add(mapView.view)
	}
});

$.tabGroup.open();
