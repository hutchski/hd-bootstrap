
//Tablet/Mobile Web common objects
var thdTouchCommon = {};
thdTouchCommon.localization = {}; 
thdTouchCommon.sf = {};
thdTouchCommon.utils = {};
thdTouchCommon.utils.analytics = {};
thdTouchCommon.cookie = {};

//Global Constants
thdTouchCommon.sf.RADIUS_SEARCH = 50; //Default radius for store search
thdTouchCommon.sf.GPS_TIMEOUT = 5000;	//GPS time out
thdTouchCommon.sf.AUTO_LOCALIZE_STORE = 121;	//Auto-localization store
thdTouchCommon.sf.IOS_DIRECTION_URL = "http://maps.apple.com/?daddr=";	//iOS Direction URL
//Local Ad URL
thdTouchCommon.sf.LOCAL_AD_URL = "http://localad.homedepot.com/homedepot/?StoreRef=";


/*
 * Service Checkboxes
 * field - name  of service field on the page
 * db - the name of the field in the database
 * name = name to display
 * value - the checkbox value
 * width - the width of the text/checkbox parent element
 * onm - the onminiture value
 */
thdTouchCommon.sf.StoreServices = [
	{ field: "truckRental", compressedName: 'u15', db: 'user15', name: "Truck Rental", value: "1", width: 148, onm: 'home depot truck rental'},	
	{ field: "keyCutting", compressedName: 'u13', db: 'user13', name: "Key cutting", value: "1", width: 145, onm: 'key cutting' },	
	{ field: "toolRental", compressedName: 'u17', db: 'user17', name: "Tool Rental", value: "1", width: 145, onm: 'tool rental center' },	
	{ field: "freeWifi", compressedName: 'u14', db: 'user14', name: "Free Wifi", value: "1", width: 148, onm: 'free wifi' },	
	{ field: "hasPropane", compressedName: 'u16', db: 'user16', name: "Has Propane", value: "1", width: 145, onm: '24/7 propane exchange' },	
	{ field: "penskeRental", compressedName: 'u18', db: 'user18', name: "Penske Rental", value: "1", width: 145, onm: 'penske truck rental' }
];

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* LOCALIZATION */

//Gets location of user by GPS
thdTouchCommon.localization.initGPS = function(){
	navigator.geolocation.getCurrentPosition(thdTouchCommon.localization.gpsSuccess,thdTouchCommon.localization.gpsError, {timeout : thdTouchCommon.sf.GPS_TIMEOUT});
}

/*
 * Handles GPS errors
 */
thdTouchCommon.localization.gpsError = function(error) {
	switch (error.code) {
	case error.PERMISSION_DENIED: 
		thdTablet.log("user did not share geolocation data");
		break;
	case error.POSITION_UNAVAILABLE: 
		thdTablet.log("could not detect current position");
		break;
	case error.TIMEOUT: 
		thdTablet.log("retrieving position timed out");
		break;
	default: 
		thdTablet.log("unknown error");
		break;
	}
	//Auto-Localize
	var wsParams = {
			id : thdTouchCommon.sf.AUTO_LOCALIZE_STORE
		};
	
	thdTouchCommon.localization.getStore('get-store-by-id', wsParams);
}

/*
 * Handles GPS success
 */
thdTouchCommon.localization.gpsSuccess = function(position) {
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	var wsParams = {
			latitude : lat,
			longitude : lon,
			radius : 50,
			maxMatches : 1
		};
	
	thdTouchCommon.localization.getStore('get-stores-by-latlng', wsParams);
}

/*
 * Makes webservice call
 */

thdTouchCommon.localization.getStore = function(methodName, wsParams){
	wsParams['key'] = apiKey;
	var serviceUrl = storeSearchWSUrl + methodName + '/json?';
	$.ajax({
		url: serviceUrl,
		data: wsParams,
		dataType: 'JSONP',
		success: function(data) {
			if(data != undefined) {
				if(methodName == 'get-stores-by-latlng') {
					thdTouchCommon.localization.setStore(data.stores[0]);
				} else if (methodName == 'get-store-by-id')
					thdTouchCommon.localization.setStore(data.store);
			}
		}
	});
};

/*
 * Set Store
 */
thdTouchCommon.localization.setStore = function(store) {
	var storeNum = store.fields.RecordId;
	var storeZip = store.fields.postal;
	var storeName = store.fields.N;
	var storeCity = store.fields.city;
	var storeState = store.fields.state;
	var storeDetails = storeNum + '+' + storeName + ' - ' + storeCity + ', ' + storeState + '+';
	createCookie('THD_LOCSTORE', storeDetails, '365');
	createCookie('THD_STRFINDERZIP', storeZip, '365');
	thdTouchCommon.cookie.setCookie('THD-LOC-STORE', storeNum, 365,cookieDomain);
	if (reqlocalization != undefined && reqlocalization != false) {
		window.location.reload();
	}
}

//Gets Store Number from Cookie
//Accepts Nothing
thdTouchCommon.localization.getStoreNum = function() {
	var locStoreStr = readCookie('THD_LOCSTORE');
	var locStoreNum;
	if (locStoreStr != null && locStoreStr.length != 0) {
		var sepLocStoreStr = locStoreStr.split('+');
		locStoreNum = sepLocStoreStr[0];
	}
	if (locStoreNum != null) {
		return locStoreNum;
	} else {
		thdTouchCommon.localization.initGPS();
	}
}

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* Cookies */

/*
 * Set Cookie
 */
thdTouchCommon.cookie.setCookie = function (cookieName, cookieValue, expirationDays, domain) {
	var expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + expirationDays);
	var cookieString = cookieName + "=" + escape(cookieValue) + "; expires="
			+ ((expirationDays == null) ? "" : +expirationDate.toUTCString())
			+ '; path=/; domain=' + domain;
	document.cookie = cookieString;
}

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* STORE FINDER */

/*
 * Returns In-Store layout URL for input store
 */
thdTouchCommon.sf.getStoreLayoutUrl = function(storeId){	
	var url = "";
	if(contentDomain)
		url += contentDomain;
	return url + '/StoreAssets/StoreMaps/' + thdTouchCommon.utils.pad(storeId, 4) + '.pdf';
};

/*
 * Returns Get Directions URL for input address
 */
thdTouchCommon.sf.getStoreDirectionUrl = function(address, city, state, zip) {
	return thdTouchCommon.sf.IOS_DIRECTION_URL + address + ', ' + city + ', ' + state + ', ' + zip;
}

/*
 * Returns Shop Local URL
 */
thdTouchCommon.sf.getLocalAdUrl = function(storeId) {
	return thdTouchCommon.sf.LOCAL_AD_URL + storeId;
}

/*
 * Convert DB Time to display time for hours. Taken from HD.com
 */
thdTouchCommon.sf.convertTime = function(tmpTime) {		
	if (tmpTime=="0:00" || tmpTime=="23:59") {
		return "12:00am";
	}		
	var timeToken=new Array();
	timeToken=tmpTime.split(':');
	var tmpHour = parseInt(timeToken[0]);
	var tmpMinutes = timeToken[1];
	//noon is pm, midnight is am
	if (tmpHour<12) {
		if (tmpHour==0) {
			tmpHour=12;
		}
		return tmpHour+":"+tmpMinutes+"am";
	} else {
		if (tmpHour>12) {
		tmpHour=tmpHour-12;
		}
		return tmpHour+":"+tmpMinutes+"pm";
	}
};

/**
 * Convert DB hours field to formatted hours display, taken from HD.com
 */
thdTouchCommon.sf.getStoreHours = function(varUser6) {
	var storeHours = "";
   	if(varUser6 != "") {	  
   		var timeArray=new Array(); 
   		if(varUser6 != null) {
			timeArray = varUser6.split(';');
			for(var index=0; index<timeArray.length; index=index+2) {
   		  		if(timeArray[index] == 1) {
   		  			timeArray[index] = "Mon";
   		  		} else if(timeArray[index] == 2){
   		  			timeArray[index] = "Tue";
   		  		} else if(timeArray[index] == 3) {
   		  			timeArray[index] = "Wed";
   		  		} else if(timeArray[index] == 4) {
   		  			timeArray[index] = "Thur";
   		  		} else if(timeArray[index] == 5) {
   		  			timeArray[index] = "Fri";
   		  		} else if(timeArray[index] == 6) {
   		  			timeArray[index] = "Sat";
   		  		} else if(timeArray[index] == 7) {
   		  			timeArray[index] = "Sun";
   		  		}
   		  		var tmpDay = timeArray[index];
				var tmpHours = timeArray[index+1];
				var hrsArray=new Array();
   		  		hrsArray=timeArray[index+1].split('-');
   		  		var tmpOpenTime = hrsArray[0];
				var tmpCloseTime = hrsArray[1];
				var completeHours="";
				if (tmpOpenTime == "0:00" && tmpCloseTime == "0:00") {
					completeHours = "Closed";
				} else if (tmpOpenTime == "0:00" && tmpCloseTime == "23:59") {
		  			completeHours="Open 24 Hours";
				} else {
					tmpOpenTime = thdTouchCommon.sf.convertTime(tmpOpenTime);
					tmpCloseTime = thdTouchCommon.sf.convertTime(tmpCloseTime);
					completeHours = tmpOpenTime + "-" + tmpCloseTime;
				}
				timeArray[index+1]=completeHours;
				if(index > 1) {
		 			if(timeArray[index-1] == completeHours)	{
		  				var origTitle = timeArray[index-2];
		  				var origToken = new Array();
		  				origToken=origTitle.split('-');
		      			var newTitle;
			  			if (origToken.length == 2) {
			   				newTitle=origTitle.substring(0,origTitle.indexOf('-')+1)+tmpDay;
			  			} else {
			  				newTitle=origTitle+"-"+tmpDay;
			  			}
			  			timeArray[index-2] = "";
			            timeArray[index] = newTitle;
			  			continue;	
		 			}
		 		}
   			}
		}          
        for(var index=0; index<timeArray.length; index=index+2) {
           	if(timeArray[index] != "") {
   		  		storeHours = storeHours + timeArray[index] + ": " + timeArray[index+1] + "<br />";
   		  	}
		}
	}
	return storeHours;
};

/*
 * Check if country supports make this my store
 */
thdTouchCommon.sf.hasMakeThisMyStore = function(stateProvince) {
	switch(stateProvince){
	case "GU":
	case "US":
		return true;
	default:
		return false;
	}
};

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* UTILS */
/*
 * Pad out number to a string length, filling in empty zeros in front of number
 */
thdTouchCommon.utils.pad = function(number, length) {
	var str = '' + number; 
	while (str.length < length) { 
		str = '0' + str;
	} 
	return str;
};

/*
 * Format cell for tap to call
 */
thdTouchCommon.utils.formatPhone = function(phone){
	if(!phone || phone == '')
		return '';
	return phone.replace(")", "").replace("-", "").replace("(", "");
}

/*
 * Check if input text has numbers
 */
thdTouchCommon.utils.hasNumbers = function(t) {
	return /\d/.test(t);
}

thdTouchCommon.utils.getURLParameters = function() {
	var s1 = location.search.substring(1, location.search.length).split('&'),
	r = {}, s2, i;
	for (i = 0; i < s1.length; i += 1) {
		s2 = s1[i].split('=');
		r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
	}
	return r;
}

//trim method that actually works in IE and Android 2.1, or use this one replace(/^\s+|\s+$/g, ""); ?
String.prototype.trimMe = function() {
	var regEx = /(^[\s\xA0]+|[\s\xA0]+$)/g;
	var a = this.replace(regEx, '');
	return a;
};

thdTouchCommon.utils.analytics.hdDataCallBack = function() {
	if(window.hddataReady){window.hddataReady();} ishddataReady = true;
}