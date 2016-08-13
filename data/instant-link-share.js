/**
 * Instant Link Share
 * 
 * @package Instant Link Share
 * @copyright 2016 Mostafa Ziasistani ( https://mostafazs.github.io )
 *  
 */
//console.log(document.getElementById("facebook"));
function check(id) {
    document.getElementById(id).checked = true;
}
function uncheck(id) {
    document.getElementById(id).checked = false;
}
function isCheck(id){
	return document.getElementById(id).checked;
}
function IsNothingCkeck(){
	if(!isCheck("facebook") && !isCheck("twitter") &&!isCheck("gplus") && !isCheck("linkedin")){
		return true;
	}else{
		return false;
	}
}
function getAttribute(id){
	var attribute_value = document.getElementById(id).getAttribute("data-url");
	return attribute_value;
}
function getShareLink(){
	var Input_Id = "link";
	var share_link = document.getElementById(Input_Id).value;
	return share_link;
}
function checkArray(arr){
	if(arr instanceof Array){
		return true;
	}else{
		return false;
	}
}
function remove_duplicates(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    arr = [];
    for (var key in obj) {
        arr.push(key);
    }
    return arr;
}
function remove_duplicates_safe(arr) {
    var obj = {};
    var arr2 = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in obj)) {
            arr2.push(arr[i]);
            obj[arr[i]] = true;
        }
    }
    return arr2;

}
function checkEmptyLink(){
	var LI = document.getElementById("link");
	var VAL = LI.value;
	if(VAL == "" || VAL == " " || VAL == undefined){
		addon.port.emit("alert-first-link");
		return true;
	}else{
		LI.disabled="disabled";
		return false;
	}
}
function fillInput(input_id,new_value){
	document.getElementById(input_id).value = new_value;
}
function remove_uncheck_link(SocialId){
	/**
	* If link unchaeck while previously checked...delete previous link
	* Here we get link and delete it
	* @see todo Line:6
	*/
	var social_url = getAttribute(SocialId);
	var user_link = getShareLink();
	var social_complete_url = social_url + user_link;
	//console.log(social_complete_url);
	//Remove link from array
	var index = Links.indexOf(social_complete_url);
	//console.log(index);
	if (index > -1) {
	Links.splice(index, 1);
	}
//console.log(Links);
}
var Links = new Array();

document.getElementById("facebook").onclick=function(){
	if(!checkEmptyLink()){
	if(isCheck("facebook")){
		
		var att = getAttribute("facebook");
		var share = getShareLink();
		var link = att+share;
		//console.log(link);
		Links.push(link);
		//console.log(Links);
		
	}else{
		remove_uncheck_link("facebook");
		//console.log("Else..user unckeck facebook");
	}
	
	}
}
document.getElementById("twitter").onclick=function(){
	if(!checkEmptyLink()){
	if(isCheck("twitter")){
		var att = getAttribute("twitter");
		var share = getShareLink();
		var link = att+share+"&original_referer=Instant-Link-Share";
		//console.log(link);
		Links.push(link);
		//console.log(Links);
	}else{
		remove_uncheck_link("twitter");
		//console.log("Else");
	}
	}
}
document.getElementById("gplus").onclick=function(){
	if(!checkEmptyLink()){
	if(isCheck("gplus")){
		var att = getAttribute("gplus");
		var share = getShareLink();
		var link = att+share;
		//console.log(link);
		Links.push(link);
		//console.log(Links);
	}else{
		remove_uncheck_link("gplus");
		//console.log("Else");
	}
	}
}
document.getElementById("linkedin").onclick=function(){
	if(!checkEmptyLink()){
	if(isCheck("linkedin")){
		var att = getAttribute("linkedin");
		var share = getShareLink();
		var link = att+share+"&source=LinkedIn";
		//console.log(link);
		Links.push(link);
		//console.log(Links);
	}else{
		remove_uncheck_link("linkedin");
		//console.log("Else");
	}
	}
}
//console.log(Links);
//var OKLinks = remove_duplicates_safe(Links);

document.getElementById("share_it").onclick=function(){
	//Now show all links in seperated tab on browser
	
	//console.log(OKLinks);
	if(getShareLink() == ""){
		//alert("No social sharing service selected");
		addon.port.emit("alert-url");
	}else if(Links.length == 0 ){
		//alert("Please enter your desire sharing link");
		addon.port.emit("alert-length");
	}else if(IsNothingCkeck() && Links.length > 0){
		//Now user save some data..now clean make Links array empty..or dont need because of deleting duplicated with a function
		//alert("Please select one social network");
		addon.port.emit("alert-length");
	}else {
		//Delete Suplicated Links From Array
		Links = remove_duplicates_safe(Links);
		//console.log("Removed:");
		//console.log(Links);
	var i;
	for(i=0;i<Links.length;i++){
		//console.log(Links[i]);
		addon.port.emit("open-tab",Links[i]);
	}
    }
}

addon.port.on("reload-panel",function(){
	//Reload panel on each panel hide
	window.location.reload();
});

document.getElementById("get_current_tab_url").onclick=function(){
	//addon.port.emit("get_current_tab_url");
	//console.log("Get Current Page Clicked");
	addon.port.emit("get-tab-url");
}

addon.port.on("current_page_back_url",function(data_back_url){
	//Now get back URl of current page to aded to input value
	//console.log("Back URL");
	fillInput("link",data_back_url);
});