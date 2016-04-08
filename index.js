/**
 * Main javascript file
 *
 * @copyright 2016 Mostafa Ziasistani ( https://mostafazs.github.io )
 * @author Mostafa Ziasistani
 * @license GPL 3.0 or later
 * @version 1.0.0 * 
 */
var self = require('sdk/self');
var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");

function NotifyUser(Title,Text){
	notifications.notify({
		  title: Title,
		  text: Text,
		  onClick: function (data) {
		    console.log(data);
		    // console.log(this.data) would produce the same result.
		  },
		  iconURL: self.data.url("resource://instant-link-share-at-jetpack/data/icon-64.png")
		});
}

var button = ToggleButton({
    id: "instant-share-btn",
    label: "Instant Share",
    icon: {
        "16": self.data.url('icon-16.png'),
        "32": self.data.url('icon-32.png'),
        "64": self.data.url('icon-64.png')
    },
    onChange: handleChange
});

var panel = panels.Panel({
	width: 540,
	height: 175,
    contentURL: self.data.url("panel.html"),
	//contentScriptFile: self.data.url("shamsi_gregorian_date.js"),
	//contentStyleFile: self.data.url("style.css"),
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
    //call reload panel
    panel.port.emit("reload-panel");
}

panel.port.on('hide', function () {
    panel.hide();
});

//Get data from content-script and open tabs
panel.port.on("open-tab", function (data) {
    //console.log("open tab"+data);
    tabs.open({
    	url: data,
    	inBackground: true
    	});
    panel.hide();
});

panel.port.on("get-tab-url",function(){
	//console.log("Current Page Clicked");
	//Now get current tag url and replace on input
	var URL = tabs.activeTab.url;
	//We can also get current tab title ( Future version )
	//var TITLE = tabs.activeTab.title;
	//console.log(URL);
	panel.port.emit("current_page_back_url",URL);
});

panel.port.on("alert-length",function(){
	//console.log("OK Alert-Length");
	//NotifyUser("Error","Please enter some link");
	NotifyUser("Instant Share","No social sharing service selected");
	panel.hide();
});

panel.port.on("alert-url",function(){
	//console.log("OK URL alert");
	//NotifyUser("Error","Please enter some link");
	NotifyUser("Instant Share","Please first enter a link for share");
	panel.hide();
});

panel.port.on("alert-first-link",function(){
	NotifyUser("Instant Share","Please enter link, then check one of social network");
	panel.hide();
});

