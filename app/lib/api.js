var Log = require('log');

exports.searchGooglePlaces = function(params) {
	Log.Info("API.searchGooglePlaces");
	
	param = params || {};
	var query = params.query,
		lat = params.lat,
		lng = params.lng,
		callback = params.callback;

	var requestUrl = Alloy.CFG.googleAPIUrl +
		'key=' + Alloy.CFG.googleAPIKey +
		'&location=' + lat + ',' + lng + 
		'&radius=50000' + 
		'&sensor=false' +
		'&query=' + query;

	ServerCall({
		requestUrl : requestUrl
	}, function(json, passthrough){
		callback && callback(json, passthrough);
	});
}

function ServerCall(params,callback,progress) {
	var requestUrl = params.requestUrl;
	var passthrough = params.passthrough;
	var verb = params.verb || "GET";
	var parameters = params.parameters;
	
	var xhr = Ti.Network.createHTTPClient();

	var timeOut = params.timeout || 20000;
	xhr.setTimeout(timeOut);

	xhr.onload = function(){
		Log.Info('XHR: onload()');
		try{
			Log.Server.PARSE(this.responseText);
			var json = JSON.parse(this.responseText);
			
			if(json){
				
				// // Saving cookie data to be sent with future requests
				// if(Platform.name === 'mobileweb'){
				// 	var cookiesString = document.cookie;
				// }else{
				// 	// iOS
				// 	var cookiesString = xhr.getResponseHeader('Set-Cookie');
				// }
				// COOKIES = Utils.convertSetCookieToObject(cookiesString, COOKIES);
								
				callback( json, passthrough );
			}else{
				Log.Error(' - - - - - - - 1 - - - - - - - -');
				callback();
			}
		}catch(e){
			Log.Server.ERROR(e);
			Log.Server.ERROR(this.responseText);
			Log.Error(' - - - - - - - 2 - - - - - - - -');
			xhr = null;
			callback();
			
			testForHtml(this.responseText);
		}
	};

	xhr.onerror = function(e){
		testForHtml(this.responseText);
		callback();
		
		Log.Server.ERROR('XHR: onerror()');
		Log.Server.ERROR(e.error);
		Log.Server.ERROR(this.responseText);
		Log.Server.ERROR(JSON.stringify(e));
		Log.Error(' - - - - - - - 3 - - - - - - - -');
		xhr = null;
	};
	if(progress){
		xhr.ondatastream = function(e){
			progress(e.progress);
		};
	}
	
	Log.Server.URL('XHR: verb = ' + verb + ', requestUrl = '+requestUrl);

	xhr.open(verb, requestUrl);

	if (Ti.Network.online == true){	
		if(verb == 'POST' && parameters){
			Log.Info('POST parameters ::: \n' + JSON.stringify(parameters));
			xhr.send(JSON.stringify(parameters));
		}else{
			xhr.send();
		}
		
	} else {
		callback();
	}
}