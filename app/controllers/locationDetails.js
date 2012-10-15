var args = arguments[0] || {},
	itemData = args.itemData;

var rows;

var header = createHeader({
	icon: itemData.icon,
	name: itemData.name
});
rows.push(Ti.UI.createTableViewSection({
	headerView:header
}));

rows.push();
	
function createKeyValueRow(params) {
	var view = Ti.UI.createView({
		height: 44
	});
	var keyLabel = Ti.UI.createLabel({
		text: params.key,
		left: 5,
		width: 75,
		height: 44
	});
	var valueLabel = Ti.UI.createLabel({
		text: params.value,
		left: 100,
		right: 0,
		height: 44
	});
	
	// TODO; continue
	
	var section = Ti.UI.createTableViewSection().add(Ti.UI.createTableViewRow().add())
	
	return section;
}

function createHeader(params) {
	var view = Ti.UI.creatView({
		height: 100,
	
	});
	
	var imageView = Ti.UI.creatImageView({
		left: 20, 
		width: 60,
		height: 60,
		borderRadius: 5,
		image: params.icon
	});
	
	var nameLabel = Ti.UI.createLabel({
		left: 100,
		right: 20,
		height: 60,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		text: params.name
	})
	
	view.add(imageView);
	view.add(nameLabel);
	
	return view;
}
