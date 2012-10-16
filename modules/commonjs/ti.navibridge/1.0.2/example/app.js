var NAVIBRIDGE = require('ti.navibridge');
NAVIBRIDGE.SetApplicationID('ICiAV4Ay');

var win = Ti.UI.createWindow({ title : "navibridge" });

var topView = Ti.UI.createView({});
 

var naviView = Ti.UI.createView({ top: 0, height: 600 });
		
		
		var versionLabel = Ti.UI.createLabel({
				top: 0, left: 0, height: 10,
				color: 'black',
				text:"v" + Titanium.App.getVersion() + " ",
				font: {fontSize: 6}
		});//end versionLabel	
		naviView.add( versionLabel );
		
		var InstallButton = Ti.UI.createButton({ top:50, title:'Install NaviBridge', height:40, width:200 });
		InstallButton.addEventListener('click', function(){ NAVIBRIDGE.installNavi();  });
		naviView.add( InstallButton );
		
		var InsertPOIButton = Ti.UI.createButton({ top:95, title:'Insert POI', height:40, width:200 });
		InsertPOIButton.addEventListener('click', function(){ NAVIBRIDGE.addPOI({ lat:37.38922, lon:-122.048496});  });
		naviView.add( InsertPOIButton );
		
		//add the console
		var console = Ti.UI.createLabel({
				top: 200, left: 5, right: 5, height: 160,
				backgroundColor: 'white', color: 'black',
				text:" ... waiting ...",
				font: {fontSize: 12}, verticalAlign: 'top'
		});
		naviView.add( console )
		
		function addMsg(msg) {
			var text = console.text;
			if (text && text.length > 0) {
				text = msg + '\n' + text;
			} else {
				text = msg;
			}
			console.text = text;
		}//end addMsg
		
		Ti.App.addEventListener('ti.navibridge.admin.console', function(data) {
			addMsg('admin.console: "' + data.message + '"');
		});
	
	topView.add( naviView );
	
	win.add( topView );
win.open();