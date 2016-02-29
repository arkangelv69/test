import pages = require("ui/page");
import actionBarModule = require("ui/action-bar");
import switchModule = require("ui/switch");
import mapsModule = require("nativescript-google-maps-sdk");


import observable = require("data/observable");
import frameModule = require("ui/frame");
import Image = require("ui/image");
// import vmModule = require("./main-view-model");


export function pageLoaded( args: observable.EventData ) {
    var page = <pages.Page> args.object;
//vmModule.mainViewModel.set( "someProperty", true );
//    page.bindingContext = vmModule.mainViewModel;
/*
    var obj = new observable.Observable();
    obj.set("someProperty", false);
    page.bindingContext = obj;
*/
}

export function onMapReady( args: observable.EventData ) {

}
export function onMarkerSelect( args: observable.EventData ) {

}
export function onCameraChanged( args: observable.EventData ) {

}