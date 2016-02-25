import observable = require("data/observable");
import pages = require("ui/page");
import frameModule = require("ui/frame");
import progressModule = require("ui/progress");

import geolocation = require("nativescript-geolocation");


// Event handler for Page "loaded"
export function pageLoaded(args: observable.EventData) {

    var page = <pages.Page>args.object;
    page.bindingContext = { progress : 10 };

    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }

    page.bindingContext = { progress : 15 };


    var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).
	then(function(loc) {
		if (loc) {
//			model.locations.push(loc);
			console.log( loc );
			page.bindingContext = { progress : 75 };

			var topmost = frameModule.topmost();
    		topmost.navigate("views/eat/map-bestfavoritedish");
		}
	}, function(e){
		console.log("Error: " + e.message);
	});
/*
    var topmost = frameModule.topmost();
    topmost.navigate("views/eat/map-bestfavoritedish");
*/
}