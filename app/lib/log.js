
var Log = {};
var Debug = {};

// this tells the logger whether they're on or off
// can be changed in the Debug window
Debug = {
	Log: 			Alloy.CFG.DEBUG ? 0 : 0,
	Info:			Alloy.CFG.DEBUG ? 1 : 0,
	Timer:			Alloy.CFG.DEBUG ? 1 : 0,
	Win:			Alloy.CFG.DEBUG ? 1 : 0,
	Error:			Alloy.CFG.DEBUG ? 1 : 0,
	Obj:			Alloy.CFG.DEBUG ? 0 : 0,
	Json:			Alloy.CFG.DEBUG ? 0 : 0,
	Server:{
		URL:		Alloy.CFG.DEBUG ? 1 : 0,
		ERROR:		Alloy.CFG.DEBUG ? 1 : 0,
		PARSE:		Alloy.CFG.DEBUG ? 1 : 0,
		SEND:		Alloy.CFG.DEBUG ? 1 : 0,
		METHOD:		Alloy.CFG.DEBUG ? 1 : 0
	}
};

	var LogArray = [];
	var count = 0;

function Info(e){
	if(Debug.Log){
		LogArray.push('<INFO '+new Date().getTime()+'> '+e+'\n');
		// writeToFileSystem();
	}
	if(Debug.Info){ return Ti.API.info('<INFO '+new Date().getTime()+'> '+e);}
}
function Timer(e){
	if(Debug.Timer){
		LogArray.push('<TIMER '+(count++)+' '+new Date()+'> '+e+'\n');
		writeToFileSystem();
	}
	if(Debug.Timer){ return Ti.API.info('<INFO '+new Date().getTime()+'> '+e);}
}
function Win(e){
	if(Debug.Log){
		LogArray.push('<WINDOW '+new Date().getTime()+'> '+e+'\n');
		// writeToFileSystem();
	}
	if(Debug.Win){ return Ti.API.info('<WINDOW '+new Date().getTime()+'> '+e);}
}
function Error(e){
	if(Debug.Log){
		LogArray.push('<ERROR '+new Date().getTime()+'> '+e+'\n');
		// writeToFileSystem();
	}
	if(Debug.Error){ return Ti.API.error('<ERROR '+new Date().getTime()+'> '+e);}
}
function Obj(a,b){
	if(!b){
		if(Debug.Log){
			LogArray.push('<OBJ stringify '+new Date().getTime()+'> '+JSON.stringify(a)+'\n');
			// writeToFileSystem();
		}
		if(Debug.Obj){ return Ti.API.info('<OBJ stringify '+new Date().getTime()+'> '+JSON.stringify(a));}
	} else {
		if(Debug.Log){
			LogArray.push('<OBJ '+new Date().getTime()+'> '+a+' '+JSON.stringify(b)+'\n');
			// writeToFileSystem();
		}
		if(Debug.Obj){ return Ti.API.info('<OBJ '+new Date().getTime()+'> '+a+' '+JSON.stringify(b));}
	}
}
function Json(e){
	if(Debug.Json){
		try{
			if(Debug.Log){
				LogArray.push('<JSON '+new Date().getTime()+'> '+JSON.stringify(e)+'\n');
				// writeToFileSystem();
			}
			return Ti.API.info(JSON.parse(e));
		} catch(a){
			if(Debug.Log){
				LogArray.push('<JSON '+new Date().getTime()+'> '+JSON.stringify(e)+'\n');
				// writeToFileSystem();
			}
			return Ti.API.info(JSON.parse(JSON.stringify(e)));
		}
	}
}
var Server = {
	METHOD:function(e){
		if(Debug.Log){
			LogArray.push('<SERVER - METHOD '+new Date().getTime()+'> '+e+'\n');
			// writeToFileSystem();
		}
		if(Debug.Server.METHOD){ return Ti.API.info('<SERVER - METHOD '+new Date().getTime()+'> '+e);}
	},
	URL:function(e){
		if(Debug.Log){
			LogArray.push('<SERVER - URL '+new Date().getTime()+'> '+e+'\n');
			// writeToFileSystem();
		}
		if(Debug.Server.URL){ return Ti.API.info('<SERVER - URL '+new Date().getTime()+'> '+e);}
	},
	ERROR:function(e){
		if(Debug.Log){
			LogArray.push('<JSON '+new Date().getTime()+'> '+JSON.stringify(e)+'\n');
			// writeToFileSystem();
		}
		if(Debug.Server.ERROR){ return Ti.API.error('<SERVER - BAD '+new Date().getTime()+'> '+e);}
	},
	PARSE:function(e){
		try{
			var b = JSON.stringify(e);
			b = b.replace(/\"/g, '"');
			if(Debug.Log){
				LogArray.push('<SERVER - PARSE '+new Date().getTime()+'> '+JSON.parse(b)+'\n');
				// writeToFileSystem();
			}
			if(Debug.Server.PARSE) return Ti.API.info('<SERVER - PARSE '+new Date().getTime()+'> '+JSON.parse(b));
		} catch(a){
			if(Debug.Log){
				LogArray.push('<SERVER - PARSE '+new Date().getTime()+'> '+JSON.parse(JSON.stringify(e))+'\n');
				// writeToFileSystem();
			}
			if(Debug.Server.PARSE) return Ti.API.info('<SERVER - PARSE '+new Date().getTime()+'> '+JSON.parse(JSON.stringify(e)));
		}
	},
	SEND:function(e){
		try{
			var b = JSON.stringify(e);
			b = b.replace(/\"/g, '"');
			if(Debug.Log){
				LogArray.push('<SERVER - SEND '+new Date().getTime()+'> '+(JSON.parse(b))+'\n');
				// writeToFileSystem();
			}
			if(Debug.Server.SEND) return Ti.API.info('<SERVER - SEND '+new Date().getTime()+'> '+(JSON.parse(b)));
		} catch(a){
			if(Debug.Log){
				LogArray.push('<SERVER - SEND '+new Date().getTime()+'> '+e+'\n');
				// writeToFileSystem();
			}
			if(Debug.Server.SEND) return Ti.API.info('<SERVER - SEND '+new Date().getTime()+'> '+e);
		}
	}
};
	
function writeToFileSystem(){
	var file = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, 'LogFile.txt');
	file.write('');
	
	if(file.writable){
		for(var i = 0, l = LogArray.length; i < l; i++){
			file.append(LogArray[i]);
		}
	}
};

exports.Info = Info;
exports.Timer = Timer;
exports.Win = Win;
exports.Error = Error;
exports.Obj = Obj;
exports.Json = Json;
exports.Server = Server;