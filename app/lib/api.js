var Log = require('log');

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

exports.ServerCall = ServerCall;

