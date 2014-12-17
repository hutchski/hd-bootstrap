/************************************************************** 
	Tablet-Utils.js
**************************************************************/

/* 
	This section will be executed when the file gets loaded
	by the browser
*/
var sFULL = "FULL";
var iCOOKIE_EXP_SESSION = null;
var sCOOKIE_NM_USER_AGENT_OVERRIDE = "THD_USR_AGENT_OVERRIDE";

function setMobileCookie(cookieName,cookieValue,expirationDays,domain){
	var expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + expirationDays);
	var cookieString = cookieName + "=" + escape(cookieValue) + "; expires=" +((expirationDays == null) ? "" : +expirationDate.toUTCString())+'; path=/; domain='+domain;
	document.cookie = cookieString;
}

// Modified WCS 7Up Code Merge 4.6 on 07/22/2011
	var cookieManager = null;
    var nbrOfItemsInCart;
    
    // Onload methods BEGIN
    var HideThePrintLink = null;
    // Onload methods END

	/*
		 Checks to see if cookie exists 
	*/
	function hasBrowserCookie(name) {
		var nameEQ = name;
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++){
			var c = ca[i];
			while (c.charAt(0) == ' '){
				c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) == 0){
				return true;
			}
		}
		return false;
	}
	
	
	/*
		 Returns value of browser cookie
	*/
	function readBrowserCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++){
			var c = ca[i];
			while (c.charAt(0) == ' '){
				c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) == 0){
				return decodeURIComponent(c.substring(nameEQ.length,c.length));
			}
		}
		return "";
	}


	/*
		  Deletes browser cookie by expiring it
	*/
	function deleteBrowserCookie(name, domain) {
		var date = new Date();
 		var expires = "; expires=" + date.toGMTString();
		document.cookie = name + "=" + expires + "; path=/; domain=" + domain;
	}

	/*
		 This will create either a browser cookie or a cookie crumb 
		 this exists inside a master cookie
	*/
	function createCookie(name, value, days){
		cookieManager.createCookie(name, value, days);
	}

	/*
		Don't use the domain value being passed in, just use the default domain
	*/
	function createCookieWDomain(name, value, days, domain) {
		cookieManager.createCookie(name, value, days);
	}
	
	/*
		Determine if the default domain should be used or 
		if the domain of the document should be used instead
		It should be noted that the document.domain will return 
		the fully qualified hostname, not just the domain name. 
		The implication is that the value returned will NOT have
		a leading period.
	*/
	function getCurrentDomain(defaultDomain) {
		var currentDomain = defaultDomain;
		var documentDomain = "." + document.domain;
		
		if(documentDomain.indexOf(currentDomain) == -1){
			currentDomain = document.domain.substr(document.domain.indexOf("."));
		}		
		return currentDomain;
	}
	

		
		
	// Initialize the CookieManager
	function initializeCookieManager(cookieDomain){
		
		//console.log('INT Running');
		 	
		var xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
					+ "<cookieJar>"
					+ "<cookies domain=\"\" path=\"/\" regular_delimiter=\":;\" cache_delimiter=\"_~\" regular_equals=\"=\" cache_equals=\"~\" expiration_suffix=\"_EXP\">"
					+	"<cookie type=\"R\" name=\"THD_PERSIST\" expiration=\"51840000\" path=\"/\"></cookie>"
					+	"<cookie type=\"R\" name=\"THD_SESSION\" expiration=\"-1\" path=\"/\"></cookie>"
					+	"<cookie type=\"C\" name=\"THD_CACHE_NAV_SESSION\" expiration=\"-1\" path=\"/\"></cookie>"
					+	"<cookie type=\"C\" name=\"THD_CACHE_NAV_PERSIST\" expiration=\"51840000\" path=\"/\"></cookie>"
					+"</cookies>"
					+"<crumbs>"
					+	"<crumb type=\"R\" alias=\"THD_BROWSESTATUS\"   name=\"C1\"  exp=\"-1\"></crumb>"
					+	"<crumb type=\"R\" alias=\"CJInfo\"   name=\"C2\"  exp=\"2592000\"></crumb>"
					+	"<crumb type=\"C\" alias=\"THD_KIOSK\"   name=\"C3\"  exp=\"\" cookie=\"THD_CACHE_NAV_PERSIST\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_LOCSTORE\"   name=\"C4\"  exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_LOCSTOREFILTER\"   name=\"C5\"  exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_MINICART\"   name=\"C6\"  exp=\"2592000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_MINILIST\"   name=\"C7\"  exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_REFERRER\"   name=\"C8\"  exp=\"86400\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_REMEMBERME\"   name=\"C9\"  exp=\"51840000\"></crumb>"
					+	"<crumb type=\"C\" alias=\"RPP\"   name=\"C10\" exp=\"\" cookie=\"THD_CACHE_NAV_PERSIST\"></crumb>"
					+	"<crumb type=\"C\" alias=\"THD_SPLASSORT\"   name=\"C11\" exp=\"\" cookie=\"THD_CACHE_NAV_SESSION\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_USEREMAIL\"   name=\"C12\"  exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_USERNAME\"   name=\"C13\"  exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_USERSTATUS\"   name=\"C14\"  exp=\"-1\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_GRMODE\"   name=\"C15\"  exp=\"-1\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_AOL\"   name=\"C16\"  exp=\"-1\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_USERREGTYPE\"   name=\"C17\"  exp=\"86400\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_USERREF\"   name=\"C18\"  exp=\"86400\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_ZIPCODE\"   name=\"C19\"  exp=\"86400\"></crumb>"
					+	"<crumb type=\"C\" alias=\"THD_NAVONLINESTORE\"   name=\"C20\" exp=\"\" cookie=\"THD_CACHE_NAV_SESSION\"></crumb>"
					+	"<crumb type=\"C\" alias=\"THD_NAVLOCALSTORE\"   name=\"C22\" exp=\"\" cookie=\"THD_CACHE_NAV_SESSION\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_STRFINDERZIP\"   name=\"C24\" exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_ADMIN_HOST_INFO\"   name=\"C25\" exp=\"51840000\"></crumb>"
					+	"<crumb type=\"C\" alias=\"THD_USERSORTOPTION\"   name=\"C26\" exp=\"\" cookie=\"THD_CACHE_NAV_SESSION\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_AUTOLOCALIZEZIP\"   name=\"C27\" exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_LITHIUMENCRYTOKEN\"   name=\"C28\"exp=\"51840000\"></crumb>"				
					+	"<crumb type=\"R\" alias=\"THD_AUTOLOCINTERCEPT\"   name=\"C29\" exp=\"-1\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_CA_USER\"   name=\"C30\" exp=\"-1\"></crumb>"					
					+	"<crumb type=\"R\" alias=\"THD_REQUIRED_PARTS_SELECTION\"   name=\"C31\" exp=\"-1\"></crumb>"						
					+	"<crumb type=\"R\" alias=\"THD_PASS_TEMP_VAL\" name=\"C32\"  exp=\"51840000\"></crumb>"
					+   "<crumb type=\"R\" alias=\"THD_PREVIOUS_LOCAL_STORE\"   name=\"C33\" exp=\"51840000\"></crumb>"
					+	"<crumb type=\"R\" alias=\"FEATURE_THROTTLE\"   name=\"C34\"  exp=\"86400\"></crumb>"
					+	"<crumb type=\"R\" alias=\"THD_LIVEPERSON_ERRORCOUNT\"   name=\"C35\"  exp=\"86400\"></crumb>"
					+   "<crumb type=\"R\" alias=\"THD_GEOLOCATION_INFO\" name=\"C36\" exp=\"-1\"></crumb>"
					+ 	"<crumb type=\"R\" alias=\"THD_AUTOLOCALIZED_SESSION\" name=\"C37\" exp=\"-1\"/>"
					+ 	"<crumb type=\"R\" alias=\"THD_LAYOUT\" name=\"C38\" exp=\"51840000\"></crumb>"
					+ 	"<crumb type=\"R\" alias=\"THD_STORE_HOURS\" name=\"C39\" exp=\"3600\"></crumb>"
					+"</crumbs>"
				   +"</cookieJar>";
		

		document.write(xmlString);
		cookieManager = new CookieManager();
		cookieManager.setCookieDomain(getCurrentDomain(cookieDomain));
		
		// Initialize all the master cookies in config
		cookieManager.initializeMasterCookie();
	}
	
	
	
	
	/*
		 Creates a CookieManager object that manages MasterCookie objects
		 PARAMETER: xmlId - The id of the XML island used to reference config data
	*/
	function CookieManager(){
		
		//console.log('Cookie Manager');
		
		this.masterCookies = new Object();
		this.masterCookiesLength = 0;
		this.cookieDomain = "";
		this.path = "";
		this.cookieDelimiter = "";
		this.regularDelimiter = "";
		this.cacheDelimiter = "";
		this.regularEquals = "";
		this.cacheEquals = "";	
		this.expiration_suffix = "";


		CookieManager.prototype.getCookiePath = function(){
			return this.path;
		}
	
		CookieManager.prototype.setCookiePath = function(path){
			this.path = path;
		}
		
		CookieManager.prototype.getCookieExpirationSuffix = function(){
			return this.expiration_suffix;
		}
	
		CookieManager.prototype.setCookieExpirationSuffix = function(suffix){
			this.expiration_suffix = suffix;
		}

		CookieManager.prototype.getRegularDelimiter = function(){
			return this.regularDelimiter;
		}
	
		CookieManager.prototype.setRegularDelimiter = function(delimiter){
			this.regularDelimiter = delimiter;
		}

		CookieManager.prototype.getCacheDelimiter = function(){
			return this.cacheDelimiter;
		}
	
		CookieManager.prototype.setCacheDelimiter = function(delimiter){
			this.cacheDelimiter = delimiter;
		}

		CookieManager.prototype.getCookieDomain = function(){
			return this.cookieDomain;
		}
	
		CookieManager.prototype.setCookieDomain = function(domain){
			this.cookieDomain = domain;
		}


		/*
			Get the crumbType for a given crumb name
		*/
		CookieManager.prototype.getCrumbType = function(crumbName){
			var crumbList = document.getElementsByTagName("crumb");
			var cookieCrumb = null;
			
			// Iterate through all the crumb entries to find the one 
			// that matches the one that the caller wants 
			for (var i=0; i < crumbList.length; i++) {
		    	var crumbNode = crumbList[i];
		    	var currentCrumbName = crumbNode.getAttribute("name");

	    		// Alias name matches what is in config for this cookieName
		    	if(currentCrumbName == crumbName){
		    		return crumbNode.getAttribute("type");
		    	}
		    }
		}
		
		
		/*
			Get the Cookie name for a cache crumb
		*/
		CookieManager.prototype.getCrumbCookieName = function(crumbName){
			var crumbList = document.getElementsByTagName("crumb");
			var cookieCrumb = null;
			
			// Iterate through all the crumb entries to find the one 
			// that matches the one that the caller wants 
			for (var i=0; i < crumbList.length; i++) {
		    	var crumbNode = crumbList[i];
		    	var currentCrumbName = crumbNode.getAttribute("name");

	    		// Alias name matches what is in config for this cookieName
		    	if(currentCrumbName == crumbName){
		    		return crumbNode.getAttribute("cookie");
		    	}
		    }
		}
	
	
		/*
			 This initializes the CookieManager to create the necessary in-memory data structures
			 of the cookies and their associated crumbs.		
		*/
		CookieManager.prototype.initializeMasterCookie = function(){	
			var cookies = document.getElementsByTagName("cookies")[0];
			
			// Uncomment when the domain is dynamic
			//this.setCookieDomain(cookies.getAttribute("domain"));
			
			this.setCookieExpirationSuffix(cookies.getAttribute("expiration_suffix"));
			this.cacheDelimiter = cookies.getAttribute("cache_delimiter");
			this.regularDelimiter = cookies.getAttribute("regular_delimiter");
			this.cacheEquals = cookies.getAttribute("cache_equals");
			this.regularEquals = cookies.getAttribute("regular_equals");
			this.setCookiePath(cookies.getAttribute("path"));
			
			var masterCookieList = document.getElementsByTagName("cookie");
	
			for (var i=0; i < masterCookieList.length; i++) {
		    	var objNode = masterCookieList[i];
		    	var cookieName = objNode.getAttribute("name");
		    	var cookieExpiration;
		    	if(objNode.getAttribute("expiration") != -1){
		    		cookieExpiration = parseInt(objNode.getAttribute("expiration")) * 1000;
		    	}
		    	else{
		    		cookieExpiration = parseInt(objNode.getAttribute("expiration")); 
		    	}
		    	
		    	var cookiePath = this.getCookiePath();
		    	var cookieType = objNode.getAttribute("type");	    	
	
		    	// Check if the cookie exists already
		    	// If not, create it
		    	var cookieValue = readBrowserCookie(cookieName);
	    		var delimiter;
	    		var equals;
	    		
	    		if(cookieType == "R"){
	    			delimiter = this.regularDelimiter;
	    			equals = this.regularEquals;
	    		}
	    		else{
	    			delimiter = this.cacheDelimiter;
	    			equals = this.cacheEquals;
	    		}
	    		
    			this.masterCookies[cookieName] = new MasterCookie(cookieName, cookieValue, cookieType, cookiePath, cookieExpiration, this.cookieDomain, equals, delimiter, this.getCookieExpirationSuffix());
				++this.masterCookiesLength;
		    	
		    	if(!hasBrowserCookie(cookieName)){	    	
					document.cookie = this.masterCookies[cookieName].makeCookieString();
		    	}			    
			}
		}
		
	
		/*
			 Retrieves a cookie crumb value 
			 PARAMETER: cookieName - The alias of a cookie crumb whose value is to be retrieved		
		*/
		CookieManager.prototype.readCookie = function(cookieName){
			var aliasList = document.getElementsByTagName("crumb");
			var crumbFound = false;

			for (var i=0; i < aliasList.length; i++) {
		    	var aliasNode = aliasList[i];
		    	var aliasName = aliasNode.getAttribute("alias"); 	
		    	var crumbName = aliasNode.getAttribute("name");
		    	var cookieCrumb = null;
				
		    	if(aliasName == cookieName){
		    	
		    	  	var crumbType = this.getCrumbType(crumbName);
		    	  	if(crumbType == "R"){
			    	  	// Look through all the master cookies and remove the crumb if found
			    	  	// then retrieve the crumb.	    	  	
						var masterCookieList = document.getElementsByTagName("cookie");
								
						for (var j=0; j < masterCookieList.length; j++) {
					    	var objNode = masterCookieList[j];
					    	var masterCookieName = objNode.getAttribute("name");
	
				    		// Check if alias name matches any entry in the config
				    	    crumbFound = true;
				    	    if(this.masterCookies[masterCookieName] != null){
				    	    	cookieCrumb = this.masterCookies[masterCookieName].getCrumb(crumbName);
					    	    
					    	    // If the crumb is not NULL then we have found it
					    	    // Otherwise continue looking for crumb in based on 
					    	    // Additional aliases if they exist in the config
					    	    if (cookieCrumb != null){			    	    	
				    	    		return decodeURIComponent(cookieCrumb.getValue());
					    	    }		    	    
				    		}   		    		
		    			}
		    		}
		    		else{
			    		// Check if alias name matches any entry in the config
						var masterCookieName = this.getCrumbCookieName(crumbName);
		    	    	cookieCrumb = this.masterCookies[masterCookieName].getCrumb(crumbName);
			    	    crumbFound = true;
			    	    
			    	    // If the crumb is not NULL then we have found it
			    	    // Otherwise continue looking for crumb in based on 
			    	    // Additional aliases if they exist in the config
			    	    if (cookieCrumb != null){			    	    	
		    	    		return decodeURIComponent(cookieCrumb.getValue());
			    	    }		    	    		    		
		    		}
		    	
		    	}
		    }
		    
		    // CookieName parameter doesn't match any alias names in config
		    // so it must be a real cookie being requested
		    if(crumbFound && cookieCrumb == null){
		    	return "";
		    }	    
		    
		    if(!crumbFound){
		    	return readBrowserCookie(cookieName);
		    }
		}
	
	
		/*
			This function determines if the expirations are the same length, i.e. they are both
			session or both actual expiration values
			PARAMETER: expirationValue1 - The expiration of the master cookie 		
			PARAMETER: expirationValue2 - The expiration to the cookie crumb				
		*/
		CookieManager.prototype.hasSameExpiration = function(expirationValue1, expirationValue2){		
	
		  	if(expirationValue1 == -1 && expirationValue2 == -1){
				return true;
			}
		  	if(expirationValue1 == -1 && expirationValue2 == 0){
				return true;
			}
		  	if(expirationValue1 > 0 && expirationValue2 > 0){
				return true;
			}
			
			return false;				
		}
	
	
		/*
			Create a new cookie based on parameters
			PARAMETER: cookieName - The alias of the cookie crumb to be created
			PARAMETER: cookieValue - The value of the cookie crumb to be created
			PARAMETER: cookieExpiration - The expiration in days of the cookie crumb to be created
		*/
		CookieManager.prototype.createCookie = function(cookieName, cookieValue, cookieExpiration){
			
			var aliasList = document.getElementsByTagName("crumb");
			var cookieCrumb = null;
			
			// Iterate through all the alias entries to fins the one 
			// that matches the one that the caller wants to add
			for (var i=0; i < aliasList.length; i++) {
		    	var aliasNode = aliasList[i];
		    	var aliasName = aliasNode.getAttribute("alias");
		    	var crumbName = aliasNode.getAttribute("name");
	    		// Alias name matches what is in config for this cookieName
		    	if(aliasName == cookieName){
		    	  	
		    	  	var crumbType = this.getCrumbType(crumbName);
		    	  	if(crumbType == "R"){
			    	  	// Convert the expiration to -1 from empty string since the server code is interpreting 
			    	  	// a session crumb in that manner.
			    	  	if(cookieExpiration == "" || cookieExpiration == null){
			    	  		cookieExpiration = -1;
			    	  	}
			    	  	
			    	  	// Look through all the master cookies and remove the crumb if found
			    	  	// then add the crumb to the appropriate cookie.	    	  	
						var masterCookieList = document.getElementsByTagName("cookie");
				
						for (var j=0; j < masterCookieList.length; j++) {
					    	var objNode = masterCookieList[j];
					    	var masterCookieName = objNode.getAttribute("name");
			    	  		
			    	  		// Always attempt to remove crumb
			    	  		this.masterCookies[masterCookieName].removeCrumb(cookieName);
			    	  	
				    	  	// Check if the expirations are the same.
				    	  	// If so, add the new crumb to the master cookie
				    	  	if(this.hasSameExpiration(this.masterCookies[masterCookieName].getConfigExpiration(), cookieExpiration)){
					    		cookieCrumb = new CookieCrumb(crumbName, cookieValue, cookieExpiration);
					
								//console.log(crumbName+' | '+cookieValue+' | '+cookieExpiration);
					
					    	    this.masterCookies[masterCookieName].addCrumb(cookieCrumb);

					    	    // Recreate the new master cookie in the browser.
					    	    document.cookie = this.masterCookies[masterCookieName].makeCookieString();	
					    	    break;    
				    	  	}
				    	}   
		    	  	}
		    	  	else{
						var masterCookieName = this.getCrumbCookieName(crumbName);
					    cookieCrumb = new CookieCrumb(crumbName, cookieValue, cookieExpiration);
					    this.masterCookies[masterCookieName].addCrumb(cookieCrumb);					    	

			    	    // Recreate the new master cookie in the browser.
			    	    document.cookie = this.masterCookies[masterCookieName].makeCookieString();	    
		    	  	}

		    	  	
		    		break;
		    	}
		    }									
		}
	
		
		/*
			 Removes a cookie crumb object
			 PARAMETER: cookieName - The alias of a cookie crumb to be deleted
		*/
		CookieManager.prototype.removeCookie = function(cookieName){		
			var aliasList = document.getElementsByTagName("crumb");
			var crumbFound = false;

			for (var i=0; i < aliasList.length; i++) {
		    	var aliasNode = aliasList[i];
		    	var aliasName = aliasNode.getAttribute("alias"); 	
		    	var crumbName = aliasNode.getAttribute("name");
		    	var cookieCrumb = null;
				
	    		// Check if alias name matches any entry in the config
		    	if(aliasName == cookieName){	    			    	  	
		    	  	var crumbType = this.getCrumbType(crumbName);
		    	  	if(crumbType == "R"){
			    	  	// Look through all the master cookies and remove the crumb if found
			    	  	// A crumb should only exist in one master cookie at a time   	  	
						var masterCookieList = document.getElementsByTagName("cookie");
								
						for (var j=0; j < masterCookieList.length; j++) {
					    	var objNode = masterCookieList[j];
					    	var masterCookieName = objNode.getAttribute("name");
			    	  		
				    	    crumbFound = true;
				    	    cookieCrumb = this.masterCookies[masterCookieName].removeCrumb(crumbName);
				    	    break;			    	    
				    	}   
					}
					else{
						var masterCookieName = this.getCrumbCookieName(crumbName);
			    	    cookieCrumb = this.masterCookies[masterCookieName].removeCrumb(crumbName);
			    	    crumbFound = true;
					}
		    		break;					
		    	}
		    }
		    
		    // CookieName parameter doesn't match any alias names in config
		    // so it must be a real cookie being requested
		    if(!crumbFound){
		    	return deleteBrowserCookie(cookieName);
		    }			
		}
		
	}


	/*
	 Creates a MasterCookie object that contains CookieCrumb objects
	 Expiration for each master cookie is stored in milliseconds where the value will be
	 cookie expiration = expiration(milliseconds) + current time(milliseconds). 
	 PARAMETER: name - The name of a MasterCookie that should be in configuration
	 PARAMETER: value - The unparsed value of a MasterCookie that the  browser contains
	 					The value parameter is parsed and CookieCrumb objects are created.
	 PARAMETER: type - The type of the MasterCookie, R - Regular, C - Cache
	 PARAMETER: path - The path of the MasterCookie which should come from configuration
	 PARAMETER: expiration - The number of milliseconds from now the master cookie is set to expire
	 PARAMETER: domain - The domain of the cookie
	 PARAMETER: equals - The value used to separate the crumb name and its value
	 PARAMETER: delimiter - The delimiter used to separate cookie crumbs	 
	 PARAMETER: expSuffix - The expiration suffix used for cookie crumbs
	*/
	function MasterCookie(name, value, type, path, expiration, domain, equals, delimiter, expSuffix){
	    this.crumbArray = new Array();
		this.name = name;
		this.value = value;
		this.type = type
		this.path = path;


		this.expiration = expiration;
		this.configExpiration = expiration;


		this.equals = equals;
		this.delimiter = delimiter;
		this.cookieDomain = domain;
		this.expirationSuffix = expSuffix;
			
		MasterCookie.prototype.getExpiration = function(){
			return this.expiration;
		}		
	
		MasterCookie.prototype.getConfigExpiration = function(){
			return this.configExpiration;
		}		
	
		MasterCookie.prototype.isRegularType = function(){
			if(this.type == "R"){
				return true;
			}
			else{
				return false;
			}
		}		
		
		MasterCookie.prototype.isCacheType = function(){
			if(this.type == "C"){
				return true;
			}
			else{
				return false;
			}
		}		

	
		/*
			Adjust the master cookie expiration to the latest expiration
			of the crumbs contained within it. This only applies to Regular Cookies.
		*/
		MasterCookie.prototype.updateToLatestExpiration = function(){
			// The master cookie my be a session cookie so check for empty string
			if(this.expiration != -1){
				var date = new Date();
				var currentExpirationValue = this.expiration;
				
				if(this.isRegularType()){
					// Get the crumb with the latest expiration
					for(var i=0; i < this.crumbArray.length; i++){
						if(currentExpirationValue < (this.crumbArray[i].getExpiration())){
							currentExpirationValue = this.crumbArray[i].getExpiration();
						}
					}				
				}
							
				if((parseInt(currentExpirationValue) - date.getTime() > ( 24 * 60 * 60 * 1000))){
					// Convert milliseconds back into days	
					this.expiration = currentExpirationValue;
				}
				else{
				    // Expire cookies after one day
					this.expiration = date.getTime() + ( 24 * 60 * 60 * 1000);
				}		
			}
		}	
					
		/*
			This function will check if the crumb already exists
			and then attempt to remove it. Then it will add the crumb 
			to the master cookie 
		*/
		MasterCookie.prototype.addCrumb = function(crumb){
			var crumbExists = false;
			if(crumb != null && crumb instanceof CookieCrumb){
				var crumbName = crumb.getName();
				for(i=0;i < this.crumbArray.length; i++){
					if(this.crumbArray[i].getName() == crumbName){
						this.removeCrumb(crumbName);
					}
				}
				this.crumbArray.push(crumb);
				this.updateToLatestExpiration();
			}
		}
	
	
		/*
			This function will remove a crumb from the master cookie
			and adjust the expiration date based on the cooies inside of it.
		*/
		MasterCookie.prototype.removeCrumb = function(crumbName){
			for(i=0;i < this.crumbArray.length; i++){
				if(this.crumbArray[i].getName() == crumbName){
					this.crumbArray.splice(i,1);
				}
			}
			
   			if(this.isRegularType()){
				// Set expiration of master cookie to default value defined in config
				// if there are no crumbs left
				if(this.crumbArray.length == 0){
					this.expiration = new Date().getTime() + (this.configExpiration * 1000);
				}
				else{
					this.updateToLatestExpiration();	
				}		
			}
		}
	
		/*
			Returns the requested crumb to the caller
			If not found, returns null.
		*/
		MasterCookie.prototype.getCrumb = function(crumbName){
			for(var i=0;i < this.crumbArray.length; i++){
				if(this.crumbArray[i].getName() == crumbName){   	    	
	    			if(this.isRegularType()){
		    	    	// Remove the crumb if it has already expired
		    	    	if(this.crumbArray[i].getExpiration() != -1){
				   	    	var date = new Date();
			    	    	if(this.crumbArray[i].getExpiration() < date.getTime()){
				    	    	this.crumbArray.splice(i,1);
				    	    	break;
				    	    }
		    	    	}
	    			}				
					return this.crumbArray[i];
				}
			}
			// Crumb was not found or has expired
			return null;
		}
	
		/*
			This will convert the string representation of the current
			master cookie instance into a browser cookie
		*/
		MasterCookie.prototype.makeCookieString = function(){
			var expiresValue = "";
		
			if (this.expiration != null && this.expiration != "" && parseInt(this.expiration) > 0){
				var date = new Date();
				date.setTime(parseInt(this.expiration));
				expiresValue = "; expires=" + date.toGMTString();
			}
			else {
				if(parseInt(this.expiration) == -1){
					expiresValue = "; expires=-1";
				}
				else{
					expiresValue = ";";
				}			
			}
			
					
			if (this.path != null && this.path != ""){
				var pathValue = "; path=" + this.path;
			}
			else {
				var pathValue = ";";
			}		
			
			if (this.cookieDomain != null && this.cookieDomain != ""){
				var domainValue = "; domain=" + this.cookieDomain;
			}
			else {
				var domainValue = ";";
			}		
			
			return this.name + "=" + encodeURIComponent(this.makeCookieCrumbString()) + pathValue + domainValue + expiresValue;
		}
		
		
		/*
			Sort the crumbs based on name	
		*/
		MasterCookie.prototype.sortCrumbs = function(a,b){
			var crumbAName = a.getName();
			var crumbBName = b.getName();		
			var sortA = parseInt(crumbAName.substr(1));
			var sortB = parseInt(crumbBName.substr(1));
			
			if(sortA < sortB){
				return -1;
			}
			if(sortA == sortB){
				return 0;
			}
			if(sortA > sortB){
				return 1;
			}
		}		
		
	
		/*
			This will convert all the cookie crumbs into a string
			that will get set to the value of the containing master cookie		
		*/
		MasterCookie.prototype.makeCookieCrumbString = function(){
			var crumbString = "";
			this.crumbArray.sort(this.sortCrumbs);
			for(i=0;i < this.crumbArray.length; i++){			
				if(crumbString != ""){
					crumbString += this.delimiter;
				}
				crumbString += this.crumbArray[i].getName() + this.equals + this.crumbArray[i].getValue();
				
				var crumbExp = this.equals;  
				if(this.isRegularType()){
					crumbExp += this.crumbArray[i].getExpirationInSeconds();						
				}

				crumbString += this.delimiter + this.crumbArray[i].getName() + this.expirationSuffix + crumbExp;			
			}				
			return crumbString;
		}
		
		
		/*
			Parse the value into crumbs based off of the delimiter
		*/
		MasterCookie.prototype.initialize = function(){
		
		
			if(this.value != null && this.value != ""){
				var cookieCrumbArray = this.value.split(this.delimiter);
				
				for(var i=0; i < cookieCrumbArray.length; i = i + 2){
				    var crumbString = cookieCrumbArray[i];
				    var index = crumbString.indexOf(this.equals);		    
					var name = crumbString.substring(0, index);
					var value = crumbString.substring(index+1, crumbString.length);

					var crumbObject = null;
					var crumbExpiration = "";
					
					if(this.isRegularType()){
						// Parse Expiration info					
					    crumbString = cookieCrumbArray[i + 1];
					    // Defect # 8794
					    if(crumbString !=null){					    					    
					    	index = crumbString.indexOf(this.equals);						
					    	crumbExpiration = crumbString.substring(index+1, crumbString.length);
					    }
						
						if(crumbExpiration != -1){
							// Convert seconds back into milliseconds since that is what the interface specifies
							crumbExpiration = parseInt(crumbExpiration) * 1000;
							crumbObject = new CookieCrumb(name, value, null);
							crumbObject.setExpiration(crumbExpiration);		
						}
						else{
							crumbObject = new CookieCrumb(name, value, crumbExpiration);
						}
					}
					else{
						crumbObject = new CookieCrumb(name, value, null);						
						crumbObject.setExpiration("");		
					}										
					this.addCrumb(crumbObject);					
				}
			}			
			
			// Initialize the real expiration date of cookie here
			if(this.expiration != -1){
				var date = new Date();
				this.expiration = parseInt(this.configExpiration) + date.getTime();
			}

			this.updateToLatestExpiration();
		}
		
		// This will setup the in-memory data structures for use later	
		this.initialize();		
	}
	
	
	/*
		 Creates a CookieCrumb object that contains info about a logical cookie
		 Expiration for each cookie crumb is stored in milliseconds where the value will be
	 	 cookie crumb expiration = expiration(milliseconds) + current time(milliseconds). 
		 PARAMETER: name - The name of the crumb.
		 PARAMETER: value - The unparsed value of the crumb.
		 PARAMETER: expiration - The number of days until the cookie expires	
	*/
	function CookieCrumb(name, value, expiration){
		
		//console.log('CookieCrumb Running');
		
		this.name = name;
		this.value = value;
		
		//console.log(this.value)
	
		// A null expiration means that the expiration value should be set explicitly 
		// by calling the setExpiration method
		if (expiration != null){
			if (expiration != "" && expiration > 0){
				var date = new Date();
				date.setTime(date.getTime() + (parseInt(expiration) * 24 * 60 * 60 * 1000));
				this.expiration = date.getTime();
			}
			else {
				// This means the cookie is a session crumb
				if(expiration < 0 || expiration == ""){
					this.expiration = -1;
				}
				else{
					// A zero means to expire the crumb
					this.expiration = 0;
				}
			}
		}
			
		CookieCrumb.prototype.getName = function(){
			return this.name;
		}		
	
		CookieCrumb.prototype.getValue = function(){
			return this.value;
		}		
	
		CookieCrumb.prototype.getExpiration = function(){
			return this.expiration;
		}

		/*
			PARAMETER: expiration - The number of miliseconds until the cookie expires	
		*/
		CookieCrumb.prototype.setExpiration = function(expiration){
			this.expiration = expiration;
		}
		
		CookieCrumb.prototype.getExpirationInSeconds = function(){
			if(this.expiration != null && this.expiration != "" && this.expiration != -1){
				return parseInt(this.expiration / 1000);
			}
			else{
				return this.expiration;
			}
		}
				
	}


	// Uses CookieManager to return 
	function readCookie(name) {
		return cookieManager.readCookie(name);
	}


	// Onload Stacker Function
	var onloadHandlers = [];
	window.onload = function(){
		for(var i=0;i<onloadHandlers.length;i++){
			eval(onloadHandlers[i]);
		}
	};


	// Get Elements By ClassName
	function getElementsByClassName(oElm, strTagName, strClassName){
		var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
		var arrReturnElements = new Array();
		strClassName = strClassName.replace(/\-/g, "\\-");
		var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
		var oElement;
		for(var i=0; i<arrElements.length; i++){
			oElement = arrElements[i];
			if(oRegExp.test(oElement.className)){
				arrReturnElements.push(oElement);
			}
		}
		return (arrReturnElements);
	}

	//Call to scroll the window to the top for DHTML layers
	function toTop() {
		self.scrollTo(0, 0);
	}


	function setUserstatusCookieTo2() {
		createCookie("THD_USERSTATUS","1");
	}

	//Function retrieves the users local store as stored in the THD_LOCSTORE cookie
	//This is then set into the global variable locStoreNo so that it is available to all functions
	function getLocalStore(){
		var locStoreAddress = readCookie('THD_LOCSTORE');
		window.locStoreNo = "";
		
		if(locStoreAddress != null && locStoreAddress.length != 0) {
			var splLocStoreAddress = locStoreAddress.split('+');
		  	if (splLocStoreAddress.length < 2) {
			    locStoreAddress = unescape(locStoreAddress);
			    splLocStoreAddress = locStoreAddress.split('+');
		    if (splLocStoreAddress.length < 2) {
		     return;
		    }
		 }
	
		 var tmpLocStoreNo = splLocStoreAddress[0];

		 if (tmpLocStoreNo != null) {
		 	window.locStoreNo=tmpLocStoreNo;
		 }
		}
	}

     /*
    *	Function: getTHDUserName
    *		This function will get the username from the THD_USERNAME cookie crumb.
    *	Returns:
    *		This function returns the username of the logged in user.
    */
    function getTHDUserName()
    {
         	return readCookie('THD_USERNAME');
    }
    
	/*
    *	Function: getTHDLocalStoreInfo
    *		This function will get the local store address from the THD_LOCSTORE cookie crumb.
    *	Returns:
    *		This function returns the city and state of the local store in the format "city, state".
    */

    function getTHDLocalStoreInfo()
    {
    	//Read the cookie to get the local store address
    	var locStoreAddress = readCookie('THD_LOCSTORE');
    	var storeInfo ="";
    	//Formatting the address to get city and state in this format city, state
    	if(locStoreAddress != "" & locStoreAddress.length != 0)
		{
			locStoreAddress = unescape(locStoreAddress);
			//Get the last index values of - and +. Use substring to get the city and state.
			storeInfo = locStoreAddress.substring(locStoreAddress.lastIndexOf('-') + 1,locStoreAddress.lastIndexOf('+'));
		}
		return storeInfo;
    }
    
    function getTHDTotalCartAmount()
    {    	
	    // The total dollar amount in the shopping cart
		return readMiniCartCookie('D1');	    
    }
    
    /*
     *	Function: getTHDNumberItemsInCart
     *		This function calls the readMiniCartCookie() to get the I1 attribute of JSON object.
     *	Returns:
     *		This function returns nbrOfItemsInCart.
     */
     
     function getTHDNumberItemsInCart()
     {    	
 	    // The number of items in the shopping cart
 		return readMiniCartCookie('I1');
     }
     
    /*
    *	Function: getTHDOrderQualifiesForFreeShippingPromo
    *		This function calls the readMiniCartCookie() to get the F2 attribute of JSON object.
    *	Returns:
    *		This function returns orderQualifiesForFreeShippingFlg boolean value.
    */

    function getTHDStoreNo()
    {
    	var localStoreNo = readCookie('THD_NAVLOCALSTORE');
    	return localStoreNo;
    }
    
    
    function getTHDStoreName()
    {
    	var locStoreAddress = readCookie('THD_LOCSTORE');
    	var storeName = "";
    	if(locStoreAddress != null && locStoreAddress.length != 0) {
    		var splLocStoreAddress = locStoreAddress.split('+');
    		if (splLocStoreAddress.length < 2) {
    			locStoreAddress = unescape(locStoreAddress);
    			splLocStoreAddress = locStoreAddress.split('+');
    			if (splLocStoreAddress.length < 2) {
    				return "";
    			}
    		}
    	var tmpAddressLine = splLocStoreAddress[1];
    	storeName = tmpAddressLine.substring(0, tmpAddressLine.lastIndexOf('-') - 1);
    	}
    	return storeName;
    }
    
    function getTHDStoreZip()
    {
    	var storeZip = readCookie('THD_STRFINDERZIP');
    	return storeZip;
    }
    
    function goToOrderStatusFromJS() {
		var nonRegisteredURL = 'http://' + getWCSHostNameNonSecure() + '/webapp/wcs/stores/servlet/OrderTrackingForm?langId=-1&storeId=10051&catalogId=10053';
		var registeredURL = 'https://' + getWCSHostNameSecure() + '/webapp/wcs/stores/servlet/OrderSummaryJSONView?storeId=10051&langId=-1&catalogId=10053&orderType=online&ParentPageName=OnlineOrdersPage';
		
		goToLinkFromJSForCatalog(nonRegisteredURL,registeredURL);
	}
    
    function goToLinkFromJSForCatalog(nonRegisteredURL, registeredURL) {
		var url = nonRegisteredURL;
		var isLoggedOn = readCookie("THD_USERSTATUS") == '1';
		if(isLoggedOn) {
			url = registeredURL;
		}
		document.location.href = url;
	}

	function goToTHDMyAccountFromJS(){
		var nonRegisteredTHDMyAcctURL = THDLogonCmd + "URL=UserAccountView&";
		goToLinkFromJS(nonRegisteredTHDMyAcctURL,nonRegisteredTHDMyAcctURL);
	}
    
	function goToTHDMyListFromJS(){
		goToLinkFromJS(THDInterestItemVerifyCmd,InterestItemDisplayCmd);
	}

    function popup() {
        var url = 'https://'+getWCSHostNameSecure()+'/webapp/wcs/stores/servlet/THDEmailSignUpAddCmd?langId=-1&storeId=10051&catalogId=10053&URL=EmailSignUpView&subscrType=' + document.emailsub.subscrType.value + '&emailInput=' + document.emailsub.emailInput.value + '&formName=emailsub';
        var winWidth = 350;
        var winHeight = 150;
        var winY, winX = 0;
        if (screen.width > winWidth && screen.height > winHeight) {
            winX = (screen.width - winWidth) / 2;
            winY = (screen.height - winHeight) / 2;
        }
        var winOptions = 'location=0,scrollbars=0,menubar=0,toolbar=0,status=0,resizable=1,directories=0,width=' + winWidth + ',height=' + winHeight + ',top=' + winY + ',left=' + winX;
        var windowToOpen = window.open(url, "windowToOpen", winOptions);
        window.top.name = 'opener';
        if (windowToOpen) {
            windowToOpen.focus();
        }
        document.emailsub.emailInput.value = '';
    }

    function goToLinkFromJS(nonRegisteredURL, RegisteredURL) {
		var cmd = nonRegisteredURL;
		// readCookie is located in utils.js file
		var isLoggedOn = readCookie("THD_USERSTATUS") == '1';
		if(isLoggedOn) {
			cmd = RegisteredURL;
			document.location.href = cmd;
		}else if(nonRegisteredURL.indexOf('THDInterestItemVerify') != -1){
			var splitIndex = nonRegisteredURL.indexOf('?');
			//var ajaxURL = nonRegisteredURL.slice(0, splitIndex);
			var ajaxURL =  'https://'+getWCSHostNameSecure()+'/webapp/wcs/stores/servlet/THDInterestItemListOperation';
			var postData =nonRegisteredURL.slice(splitIndex+1) ;

			postData = postData + '&opCode=13'+ '&requestType=ajax';
			var response = $.ajax({
				url: ajaxURL, 
				type:"POST", 		
				data: postData,
				success: function(data) {	 
			//	$("#container").appendChild(data);
								  
				  var newdiv = document.createElement('div');

				 newdiv.setAttribute('id','ajaxResponse');

				  newdiv.innerHTML = data;
				  document.body.appendChild(newdiv);
				  
				  $(".popupAddListClose").click(function(){
				  					  if(popupStatus==1){
				  					  $(".backgroundPopup").fadeOut("slow");
				  					  popupStatus = 0;
				  					  }
					  });
				 
				loadPopup('popupSignIn'); 
				$("#signIn").click(function(){	
					var e = $("#email_id").attr('value');
					var f = $(".backgroundPopup #password").attr('value'); 
					var atpos=e.indexOf("@");
					var dotpos=e.lastIndexOf(".");
					 $("#email_id, .backgroundPopup #password").css('border','1px solid gray');
					  if ((e.length==0 && f.length==0) ||((atpos<1 || dotpos<atpos+2 || dotpos+2>=e.length) && f.length==0)) {
						$(".signInError").css('display','none');
						$("#email_id, .backgroundPopup #password").css('border','1px solid red');
						$(".signInError").css({display:'block', color:'red'});
						$(".signInError").html("The following field(s) are required: E-mail Address, Password.");
					  }
					  else if ((atpos<1 || dotpos<atpos+2 || dotpos+2>=e.length) || e.length==0) {
						$(".signInError").css('display','none');
						$("#email_id").css('border','1px solid red');
						$(".signInError").css({display:'block', color:'red'});
						$(".signInError").html("The following field(s) are required: E-mail Address.");
					  }
							else if(f.length==0){
							$(".backgroundPopup #password").css('border','1px solid red'); 
							$(".signInError").css({display:'block', color:'red'});
							$(".signInError").html("The following field(s) are required: Password.");
					}
					else {
						$("#email_id").css('border','1px solid gray');
						$(".signInError").css('display','none');
						$("#userLogin").submit();
						//makeAjaxCall(posn,10);	  
					}
				});

			},
			error: function(data){
				cmd = nonRegisteredURL;
				document.location.href = cmd;
			}});	

		}else{
			document.location.href = cmd;
		}
	}
    
    /*
     *	Function: readMiniCartCookie
     *		This is a generic method to get read the THD_MINICART cookie crumb and return the attributes
     *		of the JSON object.
     *	Parameter: param
     *		This parameter defines the attribute of the JSON object.
     *	Returns:
     *		This function returns the attributes of the JSON object based on the input passed.
     */
     
     function readMiniCartCookie(param)
     {
     	var miniCartJsonStr = readCookie("THD_MINICART");
  		if(miniCartJsonStr != "") {
 			var miniCartJsonObj;
     	    eval('miniCartJsonObj = ' + miniCartJsonStr + ';');
 		    
 		    //Get the JSON attribute based on the passed parameter
 		    
 		    if(param == 'D2')
 		    {
 		    	return miniCartJsonObj.D2;
 		    }
 		    else if(param == 'I1')
 		    {
 		    	return miniCartJsonObj.I1;
 		    }
 		    else if(param == 'F1')
 		    {
 		    	return miniCartJsonObj.F1;
 		    }
 		    else if(param == 'D1')
 		    {
 		    	return miniCartJsonObj.D1;
 		    }
 		    else if(param == 'F2')
 		    {
 		    	return miniCartJsonObj.F2;
 		    }
 	    } 
 	    else {
 	    	return "";
 	    }	    
     }