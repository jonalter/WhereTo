var NAVIBRIDGE = require('ti.navibridge');
NAVIBRIDGE.SetApplicationID('ICiAV4Ay');

var args = arguments[0] || {},
	itemData = args.itemData;

var rows = [];

var data = [
	[
		{
			type: 'header',
			name: itemData.name,
			icon: itemData.icon
		}
	],
	[
		{
			type: 'keyValue',
			key: 'address'	,
			value:  itemData.formatted_address
		}
	],
	[
		{
			type: 'button',
			title: 'Send Location To Device',
			itemData: itemData,
			onClick: sendCordsToDevice
		}	
	]
];

var group,
	item,
	curSec;
	
for (var i = 0, j = data.length; i < j; i++) {
	curSec = Ti.UI.createTableViewSection();
	group = data[i];
	for (var k = 0, l = group.length; k < l; k++) {
		item = group[k];
		switch (item.type) {
			case 'header':
				curSec.headerView = createHeader({
					icon: item.icon,
					name: item.name
				});
				break;
			case 'keyValue':
				curSec.add(createKeyValueRow({
					key: item.key,
					value: item.value
				}));
				break;
			case 'button':
				curSec.add(createButtonRow({
					title: item.title,
					itemData: item.itemData,
					onClick: item.onClick
				}));
				break;
			default: 
				break;
		}
	}
	rows.push(curSec);
	curSec = null;
}

$.tableView.data = rows;

function sendCordsToDevice(e){
	Ti.API.info(JSON.stringify(e));
	if(e && e.row && e.row.itemData){
		var data = e.row.itemData;
		if(data.geometry && data.geometry.location){
			// send cords to device
			NAVIBRIDGE.addPOI({ 
				lat: data.geometry.location.lat, 
				lon: data.geometry.location.lng
			}); 
		}else if( data.formatted_address){
			Ti.Geolocation.forwardGeocoder(data.formatted_address,function(evt) {
				// alert("lat:"+evt.latitude+", long:"+evt.longitude);
				// send cords to device
				NAVIBRIDGE.addPOI({ 
					lat: evt.latitude, 
					lon: evt.longitude
				}); 
			});
		}
	}
}

function createButtonRow(params) {
	var row = Ti.UI.createTableViewRow({
		itemData: params.itemData,
	});
	
	var titleLabel = Ti.UI.createLabel({
		text: params.title,
		top: 0,
		bottom: 0,
		height: 44,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: {
			fontSize: 12,
			fontWeight: 'bold'
		},
		color: '#50668E'
	});
	
	params.onClick && row.addEventListener('click', params.onClick);
	
	row.add(titleLabel);
	
	return row;
}
	
function createKeyValueRow(params) {
	var row = Ti.UI.createTableViewRow({
		// selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var keyLabel = Ti.UI.createLabel({
		text: params.key,
		left: 5,
		width: 75,
		height: 44,
		top: 0,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		color: '#50668E',
		font: {
			fontSize: 12,
			fontWeight: 'bold'
		}
	});
	
	var valueLabel = Ti.UI.createLabel({
		text: params.value.split(',').join('\n'),
		left: 100,
		right: 0,
		top: 13,
		bottom: 13,
		height: Ti.UI.SIZE,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		font: {
			fontSize: 16
		}
	});
	
	row.add(keyLabel);
	row.add(valueLabel);
	
	return row;
}

function createHeader(params) {
	var view = Ti.UI.createView({
		height: 60
	});
	
	var imageView = Ti.UI.createImageView({
		image: params.icon,
		left: 20, 
		width: 60,
		height: 60,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#808080',
		backgroundColor: '#FFF'
	});
	
	var nameLabel = Ti.UI.createLabel({
		text: params.name,
		left: 100,
		right: 20,
		height: 60,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		shadowColor: '#FFF',
  		shadowOffset: {x:0, y:2},
		font: {
			fontSize: 18,
			fontWeight: 'bold'
		}
	})
	
	view.add(imageView);
	view.add(nameLabel);
	
	return view;
}
