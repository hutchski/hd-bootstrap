
var thdOnlineCommon = {};

thdOnlineCommon.cookie = {};

thdOnlineCommon.cookie.channel = {
		
	cookieexpiry : 1,
	elementSysAlias : "E1",
	elementOSType : "E2",
	elementOSVersion : "E3",
	elementAppType : "E4",
	elementAppVersion : "E5",

	sysAlias_Other : "S1",
	sysAlias_mobileWeb : "S2",
	sysAlias_Tablet : "S3",
	sysAlias_WCS : "S4",
	sysAlias_kiosk : "S5",
	sysAlias_PIP2_APP : "S6",
	syaAliasS_PLP_APP : "S7",

	elementDelimiter : "::",
	elementKeySeperator : "=",
	channelCookieName : "THD_ONLINE_CHANNEL",
	persistCookieName : "THD_PERSIST",
	persistCookie_Crumb40 : "C40",
	channelCookieValue : "",
	channelValueDelimiter : ":",

	clientApp_proNative : "PNative",
	clientApp_consumerNative : "CNative",
	clientApp_kiosk : "kiosk",

	osAndroid : "Android",
	osIOS : "IOS",
	osWP : "WP",

	proTablet : "PRO_tabletWeb",
	proMobile : "PRO_mobileWeb",
	proDesktop : "PRO_DesktopWeb",
	tabletWeb : "Tablet Web",
	proAndroid : "PRO_Android",
	proIphone : "PRO_iPhone",
	mobileWeb : "Mobile Web",
	mobileWP7 : "Mobile - WP7",
	mobileAndroid : "Mobile - Android",
	mobileIphone : "Mobile - iPhone",
	httpDevice : "Http Device",
	b2bExternal : "B2B External",
	telesales : "telesales",
	kiosk : "kiosk",
	physicalStore : "Physical Store",
	webChannel : "Web Channel",

	HDP : "P",

	CreateChannelCookie: function(sysAlias, osType, osVersion, appType, appVersion){
		this.channelCookieValue = this.generateChannelCookieValue(sysAlias,osType,osVersion,appType,appVersion);
		var currentChannelCookieValue = this.getCookie(this.channelCookieName);
		if(currentChannelCookieValue == ""){
			this.channelCookieValue = this.channelCookieValue.replace(new RegExp(this.elementDelimiter + '$'), '');
			this.CreateCookie(this.channelCookieName, this.channelCookieValue, this.cookieexpiry, cookieDomain);
		} else {
			this.channelCookieValue = "";
			var currentSysAlias = null;
			var currentOSType = null;
			var currentOSVersion = null;
			var currentAppType = null;
			var currentAppVersion = null;
			var cookieValues = currentChannelCookieValue.split(this.elementDelimiter);
			for (var i = 0; i < cookieValues.length; i++) {
			    var elements = cookieValues[i].split(this.elementKeySeperator);
			    if(elements[0] == this.elementSysAlias){
			    	currentSysAlias = elements[1];
			    }else if(elements[0] == this.elementOSType){
			    	currentOSType = elements[1];
		    	}else if(elements[0] == this.elementOSVersion){
			    	currentOSVersion = elements[1];
		    	}else if(elements[0] == this.elementAppType){
			    	currentAppType = elements[1];
		    	}else if(elements[0] == this.elementAppType){
			    	currentAppVersion = elements[1];
		    	}
			}
			if((currentSysAlias == null || currentSysAlias != sysAlias) && sysAlias != undefined && sysAlias != ""){
				currentSysAlias = sysAlias;
			}
			if((currentOSType == null || currentOSType != osType) && osType != undefined && osType != ""){
				currentOSType = osType;
			}
			if((currentOSVersion == null || currentOSVersion != osVersion) && osVersion != undefined && osVersion != ""){
				currentOSVersion = osVersion;
			}
			if((currentAppType == null || currentAppType != appType) && appType != undefined && appType != ""){
				currentAppType = appType;
			}
			if((currentAppVersion == null || currentAppVersion != appVersion) && appVersion != undefined && appVersion != ""){
				currentAppVersion = appVersion;
			}
			this.channelCookieValue = this.generateChannelCookieValue(currentSysAlias,currentOSType,currentOSVersion,currentAppType,currentAppVersion);
			if(this.channelCookieValue != ""){
				this.channelCookieValue = this.channelCookieValue.replace(new RegExp(this.elementDelimiter + '$'), '');
				this.CreateCookie(this.channelCookieName, this.channelCookieValue, this.cookieexpiry, cookieDomain);
			}
		}
	},
	generateChannelCookieValue: function(sysAlias,osType,osVersion,appType,appVersion){
		this.channelCookieValue = "";
		if(sysAlias != undefined && sysAlias != ""){
			this.channelCookieValue += this.elementSysAlias+this.elementKeySeperator+sysAlias+this.elementDelimiter;
		}
		if(osType != undefined && osType != ""){
			this.channelCookieValue += this.elementOSType+this.elementKeySeperator+osType+this.elementDelimiter;
		}
		if(osVersion != undefined && osVersion != ""){
			this.channelCookieValue += this.elementOSVersion+this.elementKeySeperator+osVersion+this.elementDelimiter;
		}
		if(appType != undefined && appType != ""){
			this.channelCookieValue += this.elementAppType+this.elementKeySeperator+appType+this.elementDelimiter;
		}
		if(appVersion != undefined && appVersion != ""){
			this.channelCookieValue += this.elementAppVersion+this.elementKeySeperator+appVersion;
		}
		return this.channelCookieValue;
	},
	CreateCookie: function(cookieName, cookieValue, expirationDays, domain){
		var expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + expirationDays);
		var cookieString = cookieName + "=" + escape(cookieValue) + "; expires=" + ((expirationDays == null) ? "" : expirationDate.toUTCString()) + '; path=/; domain=' + domain;
		document.cookie = cookieString;
	},
	getCookie: function(cookieName){
	    if (document.cookie.length > 0) {
	        cookieStart = document.cookie.indexOf(cookieName + this.elementKeySeperator);
	        if (cookieStart != -1) {
	        	cookieStart = cookieStart + cookieName.length + 1;
	            cookieEnd = document.cookie.indexOf(";", cookieStart);
	            if (cookieEnd == -1) {
	            	cookieEnd = document.cookie.length;
	            }
	            cookieValue = unescape(document.cookie.substring(cookieStart, cookieEnd));
	            return cookieValue;
	        }
	    }
	    return "";
	},
	getCookieCrumb: function(cookie, name){
	    var nameEquals = name + "=";
	    var crumbs=cookie.split(':;');
	    for (var i = 0; i<crumbs.length; i++) {
	        var crumb = crumbs [i];
	        if (crumb.indexOf(nameEquals) == 0) {
	        	return unescape (crumb.substring(nameEquals.length, crumb.length));
	        }
	    }
	    return null;
	},
	getBusinessChannelName: function() {
		var systemAlias="";
		var osType = "";
		var osVersion = "";
		var clientApp  = "";
		var clientAppVersion = "";
		var currentChannelCookieValue = this.getCookie(this.channelCookieName);
		var persistCookie = this.getCookie(this.persistCookieName);
		var persistCookie_Crumb40_Value = this.getCookieCrumb(persistCookie,this.persistCookie_Crumb40);
		if(currentChannelCookieValue != null)
		{
			var channelCookievalues = currentChannelCookieValue.split(this.elementDelimiter);
			if(channelCookievalues != null)
			{
				var channelCookieValueMap = {};
				for(var i=0;i<channelCookievalues.length;i++)
				{
					var channelCookieArray = channelCookievalues[i].split(this.elementKeySeperator);
					if(channelCookieArray[0] != "" && channelCookieArray[1] != ""){
						channelCookieValueMap[channelCookieArray[0]] = channelCookieArray[1];
					}
				}
				if(channelCookieValueMap != null)
				{
					if(this.elementSysAlias in channelCookieValueMap)
					{
						systemAlias = channelCookieValueMap[this.elementSysAlias];
					}
					if(this.elementOSType in channelCookieValueMap)
					{
						osType = channelCookieValueMap[this.elementOSType];
					}
					if(this.elementOSVersion in channelCookieValueMap)
					{
						osVersion = channelCookieValueMap[this.elementOSVersion];
					}
					if(this.elementAppType in channelCookieValueMap)
					{
						clientApp = channelCookieValueMap[this.elementAppType];
					}
					if(this.elementAppVersion in channelCookieValueMap)
					{
						clientAppVersion = channelCookieValueMap[this.elementAppVersion];
					}
				}
				if (clientApp.toLowerCase() == this.clientApp_proNative.toLowerCase()
						&& osType.toLowerCase() == this.osAndroid.toLowerCase()) {
					return this.proAndroid;
				} else if (clientApp.toLowerCase() == this.clientApp_proNative.toLowerCase()
						&& osType.toLowerCase() == this.osIOS.toLowerCase()) {
					return this.proIphone;
				} else if (clientApp.toLowerCase() == this.clientApp_consumerNative.toLowerCase()
						&& osType.toLowerCase() == this.osWP.toLowerCase()) {
					return this.mobileWP7;
				} else if (clientApp.toLowerCase() == this.clientApp_consumerNative.toLowerCase()
						&& osType.toLowerCase() == this.osAndroid.toLowerCase()) {
					return this.mobileAndroid;
				} else if (clientApp.toLowerCase() == this.clientApp_consumerNative.toLowerCase()
						&& osType.toLowerCase() == this.osIOS.toLowerCase()) {
					return this.mobileIphone;
				} else if (clientApp.toLowerCase() == this.clientApp_kiosk.toLowerCase()) {
					return this.kiosk;
				} else if (systemAlias.toLowerCase() == this.sysAlias_mobileWeb.toLowerCase() && persistCookie_Crumb40_Value != null && persistCookie_Crumb40_Value.toLowerCase() == this.HDP.toLowerCase()) {
					return this.proMobile;
				} else if (systemAlias.toLowerCase() == this.sysAlias_mobileWeb.toLowerCase()) {
					return this.mobileWeb;
				} else if (systemAlias.toLowerCase() == this.sysAlias_Tablet.toLowerCase() && persistCookie_Crumb40_Value != null && persistCookie_Crumb40_Value.toLowerCase() == this.HDP.toLowerCase()) {
					return this.proTablet;
				} else if (systemAlias == this.sysAlias_Tablet) {
					return this.tabletWeb;
				} else if (systemAlias != ""
						&& systemAlias.toLowerCase() != this.sysAlias_mobileWeb.toLowerCase()
						&& systemAlias.toLowerCase() != this.sysAlias_Tablet.toLowerCase() && persistCookie_Crumb40_Value != null && persistCookie_Crumb40_Value.toLowerCase() == this.HDP.toLowerCase()) {
					return this.proDesktop;
				} else if (systemAlias != ""
					&& systemAlias.toLowerCase() != this.sysAlias_mobileWeb.toLowerCase()
					&& systemAlias.toLowerCase() != this.sysAlias_Tablet.toLowerCase()){
					return this.webChannel;
				} else {
					return this.physicalStore;
				}
			}
		}
	}
}