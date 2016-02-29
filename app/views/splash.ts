import pages = require("ui/page");
import actionBarModule = require("ui/action-bar");
import progressModule = require("ui/progress");

import observable = require("data/observable");
import frameModule = require("ui/frame");
import geolocation = require("nativescript-geolocation");

function wait(milliSeconds) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
           resolve(milliSeconds);
        }, milliSeconds);
    });
}  /* TODO: Delete me, it's for demo propouses. */

// Event handler for Page "loaded"
export function pageLoaded(args: observable.EventData) {

    var page = <pages.Page>args.object;
    page.bindingContext = { progress : 10 };

    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }

 	wait(3000).then(function() {
    	page.bindingContext = { progress : 55 };
		});  /* TODO: Delete me, it's for demo propouses. */


    var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 5000}).
	then(function(loc) {
		if (loc) {
//			model.locations.push(loc);
			console.log( loc );
			page.bindingContext = { progress : 75 };

			var topmost = frameModule.topmost();
    		topmost.navigate("views/eat/map-bestfavoritedish");
		}
	}, function(e){
		console.log("I<3D Error: " + e.message);
		var topmost = frameModule.topmost();
    		topmost.navigate("views/eat/map-bestfavoritedish");
	});
/*
    var topmost = frameModule.topmost();
    topmost.navigate("views/eat/map-bestfavoritedish");
*/
}