var Log = require('log');
var API = require('api');

/**
 * Every response must be converted into this format
 * {
		name: bus.name,
		icon: bus.image_url,
		formatted_address: addressArray.join(","),
		geometry: {
			location: {
				lat: bus.location.coordinate.latitude,
				lng: bus.location.coordinate.longitude
			}
		}
		
	}
 */

exports.engines = {
	google: {
		title: "Google",
		id: "google",
		apiCall: function(params) {
			Log.Info("API.searchGooglePlaces");
			
			param = params || {};
			var query = params.query,
				lat = params.lat,
				lng = params.lng,
				callback = params.callback;
		
			var requestUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?' +
				'key=AIzaSyAdhjqIoFvE-vdjunvfr6WjRKz6CTsl2bo' +
				'&location=' + lat + ',' + lng + 
				'&radius=50000' + 
				'&sensor=false' +
				'&query=' + query;
		
			API.ServerCall({
				requestUrl : requestUrl
			}, function(json, passthrough){
				callback && callback(json, passthrough);
			});
		},
		parseResponse: function(json, callback) {
			if (json && json.status === "OK" && json.results && json.results.length) {
				callback && callback(json);
			}
		}
	},
	yelp: {
		title: "Yelp",
		id: "yelp",
		apiCall: function(params) {
			var Yelp = require("jsOAuth").OAuth({
				consumerKey : "rs7TEh2KCZD1F92432YBgw",
				consumerSecret : "3zZuKJ02j8ZLOBV0lN-alOpQhpk",
				accessTokenKey : "dnVL6qE6-ToQcPbDxmhXhv2Tkylx7U1n",
				accessTokenSecret : "FGq9kzrlKdWOX6df_srw7zBrqmE",
			})
			
			param = params || {};
			var query = params.query,
				lat = params.lat,
				lng = params.lng,
				callback = params.callback;
		
			var requestUrl = "http://api.yelp.com/v2/search?term=" + query + 
				"&limit=10&sort=1&" + 
				"ll=" + lat + "," + lng
		
			Yelp.get(requestUrl,
				// success 
				function(json) {
					callback && callback(json);
				},
				// fail 
				function(json) {
					
				});
		},
		parseResponse: function(txt, callback) {
			Log.Info('Yelp Response: '+JSON.stringify(JSON.parse(txt.text)));
			var json = JSON.parse(txt.text);
			
			if (json && json.businesses && json.businesses.length) {
				var busList = json.businesses,
					bus, 
					addressArray,
					data = {
						results: []
					};	
				
				for (var i = 0, j = busList.length; i < j; i++) {
					bus = busList[i];
					addressArray = [];
					for (var k = 0, l = bus.location.address.length; k < l; k++) {
						addressArray.push(bus.location.address[k].trim());
					}
					addressArray.push(bus.location.city.trim());
					addressArray.push(bus.location.state_code.trim());
					addressArray.push(bus.location.postal_code.trim());
					
					data.results[i] = {
						name: bus.name,
						icon: bus.image_url,
						formatted_address: addressArray.join(","),
						geometry: {
							location: {
               					lat: bus.location.coordinate.latitude,
               					lng: bus.location.coordinate.longitude
            				}
						}
						
					};
				}
				
				callback && callback(data);
			}

		}
	},
	bing: {
		title: "Bing",
		id: "bing",
		apiCall: function(params) {
			var alertDialog = Ti.UI.createAlertDialog({
				title: 'Really?',
				message: "c'mon, no one cares about bing"
			});
			alertDialog.addEventListener('click', function() {
				Ti.Media.createSound({
					url: 'pretty_shitty_maan.m4a'
				}).play();
			});
			alertDialog.show();
		},
		parseResponse: function(json, callback) {
			
		}
	}
};

// var gogle = {
   // "html_attributions" : [],
   // "results" : [
      // {
         // "formatted_address" : "San Jose, CA 95128, USA",
         // "geometry" : {
            // "location" : {
               // "lat" : 37.31891490,
               // "lng" : -121.94162260
            // },
            // "viewport" : {
               // "northeast" : {
                  // "lat" : 37.3381410,
                  // "lng" : -121.9132880
               // },
               // "southwest" : {
                  // "lat" : 37.294360,
                  // "lng" : -121.95240190
               // }
            // }
         // },
         // "icon" : "http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
         // "id" : "0ec01c1f94f8ca3a888850f4be32e55417af3ac7",
         // "name" : "95128",
         // "reference" : "CnRtAAAA4pgPg0p4Kdb3pVFVTCJPN_SJ8e3nnFbXa15-7_jFWQSmv-QxONsrd5z31t0lm3RugJMzatZh1ed01v3cmSErFuY3M9RGTrSiwwguAwkEN42BD0Ylk3ij4yzD7eT5btdV45BNTv__VlNIEoAgphpjkxIQ9q9cSekC6H5YH028dMSqJhoUEk8eEDSOqw9iW_pyXX6KMnlp3hc",
         // "types" : [ "postal_code" ]
      // }
   // ],
   // "status" : "OK"
// }











