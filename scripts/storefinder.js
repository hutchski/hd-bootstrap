/* Tablet Web Site js functionality 
using jQuery JavaScript Library v1.9.1
created: 5-29-2013 Tablet Web Project
---------------------------------------
*/

/*
This script uses the mapquest api (MQA) to update the storefinder pages and 
controls client-side updating of localization using the "Make this my store" buttons.
This script uses mobile-utils.js for cookie read/update, GPS/phone localization, and updating the html once
client-side localization has changed.
*/

thdTablet.sf = {};

//Global constants
thdTablet.sf.MAX_MATCHES_SEARCH = 30;	//Max search results to return
thdTablet.sf.MAX_MATCHES_MOVE = 99;	//Max search results to return on pan/zoom
thdTablet.sf.MIN_STORE_ZOOM_LEVEL = 5;	//Mininum zoom level that performs search

//Messages
thdTablet.sf.NO_STORE_ERROR_MESSAGE = "There are no stores found that meet your search criteria.";
thdTablet.sf.SEARCH_RESULTS_DEFAULT = "Enter a ZIP code, city and state or store number below to find a store location or tap on the map to zoom in";
thdTablet.sf.INPUT_PLACEHOLDER = "ZIP, City & State or Store #";
thdTablet.sf.SEARCH_ERROR_TEXT = "Enter valid City, ST or ZIP";
thdTablet.sf.GPS_ERROR_TEXT = "Your location cannot be found. Please enter a city, state or zip code.";
	
//Global variables
thdTablet.sf.selectedRefinements = {};
thdTablet.sf.sourceAddress = '';
thdTablet.sf.txtSearch = false;

// ------------------------------------
// document ready to initialize everything
$("document").ready(function () {
	
	thdTablet.sf.initMap();
	
}); // doc ready function

/*
 * Initializes Store Finder Map
 */
thdTablet.sf.initMap = function(){
	MQA.EventUtil.observe(window,"load",function(){
		MQA.withModule('htmlpoi', function() {
			var mapCenterLat = Number(hd_storelist.stores[0].latlng.latitude);
			var mapCenterLon = Number(hd_storelist.stores[0].latlng.longitude);
			window.onorientationchange = function(event) {
				var resizeMap = new MQA.Size($('#sf-map').width(),$('#sf-map').height());
				window.map.setSize(resizeMap);
			}

			var sc = new MQA.ShapeCollection();
			var mapStoreCount = hd_storelist.stores.length;
			var i = 0;
			for (i=0; i<mapStoreCount; i++){
				poi = thdTablet.sf.buildPOIInfoContent(hd_storelist.stores[i]);
				sc.add(poi);
			}
			var mapLoadOptions = {
					elt: document.getElementById('sf-map'),
					zoom: 10,
					bestFitMargin: 100,
					mtype:'map',
					latLng: { lat:mapCenterLat,lng:mapCenterLon }
				};
			window.map = new MQA.TileMap(mapLoadOptions);
			map.addShapeCollection(sc);
			MQA.EventManager.addListener(map, 'dragend', thdTablet.sf.mapChange);
			MQA.EventManager.addListener(map, 'zoomend', thdTablet.sf.mapChange);
			MQA.EventManager.addListener(map, 'infowindowopen', thdTablet.sf.updateInfoWindow);
		});
		MQA.withModule('largezoom', function() {
			window.map.addControl(
				new MQA.LargeZoom(),
				new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(10,10))
			);
		});
		thdTablet.sf.setSourceDirections();
	});
};

/*
 * Build HTML for input store 
 */
thdTablet.sf.buildStoreHtml = function(store) {

	//Build Store List
	var storeHtml = '';
	var storeName = store.fields.N;
	var storeNum = store.fields.RecordId;
	var storeAddress = store.fields.address;
	var storeCity = store.fields.city;
	var storeState = store.fields.state;
	var storeZipCode = store.fields.I;
	var storePhone = store.fields.user1;
	var storeDirection = thdTouchCommon.sf.getStoreDirectionUrl(storeAddress, storeCity, storeState, storeZipCode);
	var storeLayoutUrl = thdTouchCommon.sf.getStoreLayoutUrl(storeNum);
	var storeDistance = (store.distance).toFixed(2) + ' mi';
	var localAdUrl = thdTouchCommon.sf.getLocalAdUrl(storeNum);
	var storeManager = store.fields.user3;
	var storeHours = thdTouchCommon.sf.getStoreHours(store.fields.user6);
	var country = store.fields.country;
	var storeServices = '';
	
	//Load store services into element
	for(var j=0; j < thdTouchCommon.sf.StoreServices.length; j++){
		var service = thdTouchCommon.sf.StoreServices[j];
		if(store.fields[service.db] == service.value){
			storeServices += '<li>' + service.name +'</li>';
		}
	}
	
	storeHtml = storeHtml + '<div class="sf-store store-detail-' + storeNum + '">' + 
		'<h4 class="normal b">' + storeName + ', #' + storeNum + ' (' + storeDistance + ')</h4>' + 
		'<ul class="sf-store-address">' + 
		'<li>' + storeAddress + '</li>' + 
		'<li>' + storeCity + ', ' + storeState + ' ' + storeZipCode + '</li>' +
		'<li><a href="tel:' + thdTouchCommon.utils.formatPhone(storePhone) + '"> ' + storePhone + ' <i class="icon-link-out-symbol thdOrange"></i></a></li>' + 
		'</ul>' + 
		'<ul class="sf-store-map-btns">' +
		'<a class="btn btn-short btn-flat-darkGray directions" href="' + storeDirection + '">Get Directions <i class="icon-link-out-symbol thdOrange"></i></a>' + 
		'<a class="btn btn-short btn-flat-darkGray" href="' + storeLayoutUrl + '">In-Store Map <i class="icon-chevron-symbol thdOrange"></i></a>' + 
		'</ul>'  + 
		'<ul class="sf-store-btns">' + 
		(thdTouchCommon.sf.hasMakeThisMyStore(country) ? (storeNum == thdTouchCommon.localization.getStoreNum() ? '<a class="btn btn-flat-green myStore" storenum="'+ storeNum +'"><i class="icon-verified-symbol"></i> My Store</a>' : '<a href="#" class="btn btn-white setStore" storenum="'+ storeNum +'">Make This My Store</a>') : '') + 
		'<a class="btn btn-white" href="' + localAdUrl + '">Local Ad</a>' +   
		'</ul>' + 
		'<ul class="sf-store-manager">' + 
		'<li class="b">Store Manager</li>' + 
		'<li>' + storeManager + '</li>' + 
		'</ul>' + 
		'<ul class="sf-store-hours">' + 
		'<li class="b">Store Hours</li>' + storeHours + '</ul>' + 
		'<ul class="sf-store-services">' + 
		'<li class="b">Services</li>' + storeServices + '</ul>' + 
		'</div>'; 

	return storeHtml;
};

/*
 * Build POI Info Window
 */
thdTablet.sf.buildPOIInfoContent = function(store) {
	var lat = store.latlng.latitude;
	var lon = store.latlng.longitude;
	var storeName = store.fields.N;
	var storeNum = store.fields.RecordId;
	var storeAddress = store.fields.address;
	var storeCity = store.fields.city;
	var storeState = store.fields.state;
	var storeZipCode = store.fields.I;
	var storePhone = store.fields.user1;
	var storeDirection = thdTouchCommon.sf.getStoreDirectionUrl(storeAddress, storeCity, storeState, storeZipCode);
	var country = store.fields.country;
	
	poi = new MQA.HtmlPoi({ lat: lat, lng: lon });
	if(storeNum == thdTouchCommon.localization.getStoreNum()){
		poi.setHtml('<div id="pin'+storeNum+'" class="handle"></div>', -17, -17, 'icon-poi-symbol nlpGreen poiNum'+storeNum);
		poi.setInfoContentHTML('<div class="sf-store-info info'+storeNum+'"><h4 class="normal b">' + storeName + ', #' + storeNum + '</h4>' +  
				'<ul class="sf-store-info-address"><li>' + storeAddress + '</li><li>' + storeCity + ', ' + storeState + ' ' + storeZipCode + '</li>' +  
				'<li>' + storePhone + '</li></ul>' +
				'<ul class="sf-store-info-btns">' + 
				'<a class="btn btn-flat-green myStore"  storenum="'+ storeNum +'"><i class="icon-verified-symbol"></i> My Store</a>'+ 
				'<a class="btn btn-flat-darkGray directions" href="' + storeDirection + '">Get Directions <i class="icon-link-out-symbol thdOrange"></i></a></ul></div>'
		);
	}else{
		poi.setHtml('<div id="pin'+storeNum+'" class="handle"></div>', -17, -17, 'icon-poi-symbol thdOrange poiNum'+storeNum);
		poi.setInfoContentHTML('<div class="sf-store-info info'+storeNum+'" ><h4 class="normal b">' + storeName + ', #' + storeNum + '</h4>' +  
				'<ul class="sf-store-info-address"><li>' + storeAddress + '</li><li>' + storeCity + ', ' + storeState + ' ' + storeZipCode + '</li>' +  
				'<li>' + storePhone + '</li></ul>' +
				'<ul class="sf-store-info-btns">' + 
				(thdTouchCommon.sf.hasMakeThisMyStore(country) ? '<a href="#" ontouchend="$(this).trigger(\'click\');" class="btn btn-white setStore" storenum="'+ storeNum +'">Make This My Store</a>' : '') + 
				'<a class="btn btn-flat-darkGray directions" href="' + storeDirection + '">Get Directions <i class="icon-link-out-symbol thdOrange"></i></a></ul></div>'
		);
	}
	return poi;
};

/*
 * Listener event for Map Zoom/Pan
 */
thdTablet.sf.mapChange = function(evt){
	var triggerEvt = evt.eventName.toLowerCase();
	if(triggerEvt == 'mqa.tilemap.dragend' || triggerEvt == 'mqa.tilemap.zoomend' && thdTablet.sf.txtSearch == false){
		$('.sf-search input').val("");
		if(triggerEvt == 'mqa.tilemap.zoomend' && window.map.getZoomLevel && window.map.getZoomLevel() < thdTablet.sf.MIN_STORE_ZOOM_LEVEL) {
			window.map.removeAllShapes();
			$('#sf-store-list').html('<p class="b">' + thdTablet.sf.SEARCH_RESULTS_DEFAULT + '</p>');
		} else {
			thdTablet.sf.getStoresByBoundingBox();
		}
	}
}

/*
 * Get stores by bounding box
 */
thdTablet.sf.getStoresByBoundingBox = function(){
	var bounds = window.map.getBounds();
	var wsParams = {
			ulLatitude : bounds.ul.getLatitude(),
			ulLongitude : bounds.ul.getLongitude(),
			lrLatitude : bounds.lr.getLatitude(),
			lrLongitude : bounds.lr.getLongitude(),
			maxMatches : thdTablet.sf.MAX_MATCHES_MOVE
		}
	thdTablet.sf.getStores('get-stores-by-bounding-box', wsParams);
}

/*
 * Call Webservice
 */
thdTablet.sf.getStores = function(methodName, wsParams){
	var storeRefinements = '';
	//Get the services checked
	for(var i =0; i < thdTouchCommon.sf.StoreServices.length; i++){
		var service = thdTouchCommon.sf.StoreServices[i];
		wsParams[service.field] = $('#sf-refine-' + service.field).is(':checked');
		thdTablet.sf.selectedRefinements[service.field] = wsParams[service.field];
		if(wsParams[service.field]) {
			storeRefinements = storeRefinements + service.onm + ":";
		}
	}
	
	wsParams['key'] = apiKey;
	var appURL = storeSearchWSUrl + methodName + '/json?';
	$.ajax({
		url: appURL,
		data: wsParams,
		dataType: 'JSONP',
		success: function(data) {
			if(data != undefined) {
				thdTablet.sf.loadStores(data.stores, methodName);
				thdTablet.sf.txtSearch = false;
			}
		}
	});
};

/*
 * Refresh Store data on page
 */
thdTablet.sf.loadStores = function(stores, methodName) {
	window.map.removeAllShapes();
	var mapStoreCount;
	if(stores != undefined){
		mapStoreCount = stores.length;
	}
	thdTablet.log("Number of stores - " + mapStoreCount);
	if(mapStoreCount != undefined){
		MQA.withModule('htmlpoi', function() {
			var sc = new MQA.ShapeCollection();
			var i = 0;
			var storeListHtml = '';
			for (i=0; i<mapStoreCount; i++){
				poi = thdTablet.sf.buildPOIInfoContent(stores[i]);
				sc.add(poi);
				storeListHtml = storeListHtml + thdTablet.sf.buildStoreHtml(stores[i]);
			}
			$('#sf-store-list').empty();
			$('#sf-store-list').html(storeListHtml);
			window.map.addShapeCollection(sc);
			if(methodName == 'get-stores-by-address' || methodName == 'get-stores-by-latlng') {
				window.map.bestFit();
			}
		});
		thdTablet.sf.setSourceDirections();
	} else {
		$('#sf-store-list').html('<p class="b">' + thdTablet.sf.NO_STORE_ERROR_MESSAGE + '</p>');
	}
};

/*
 * Perform store search
 */
thdTablet.sf.submitTextSearch = function(){
	
	thdTablet.sf.txtSearch = true;
	
	$('.sf-search input').blur();
	var searchText = $('.sf-search input').val().trimMe();
	$('.sf-search input').removeClass('errorText errorBorder');
	$('.sf-search input').attr("placeholder", thdTablet.sf.INPUT_PLACEHOLDER);
	var wsParams = {
			address : searchText,
			radius : thdTouchCommon.sf.RADIUS_SEARCH,
			maxMatches : thdTablet.sf.MAX_MATCHES_SEARCH
		};
	thdTablet.sf.getStores('get-stores-by-address', wsParams);
	if(ensightenOn){
		_hddata["AJAX"]="formSubmit";
		_hddata["localizationMethod"]="zip";
		_hddata["storeLocatorFind"]="storeFinderSearch";
		thdTouchCommon.utils.analytics.hdDataCallBack();
	}
};

/*
 * Validate user input 
 */
thdTablet.sf.validateInput = function() {
	var searchText = $('.sf-search input').val();
	var fix = new RegExp (/[^A-Za-z0-9,.\-_\/]|[<>\[\]?+\^\&]/g);
	var a = searchText.replace(fix," ");
	a = a.trimMe();
	var d = a.split(",").length;
	
	if (a.length == 5 && isNaN(a) == false) {
		return true;
	} else {
		if (isNaN(a) == false && a.length >= 1 && a.length <= 5) {
			return true;
		} else {
			if (a == thdTablet.sf.INPUT_PLACEHOLDER) {
				return false;
			} else {
				if (thdTouchCommon.utils.hasNumbers(a) == false && d == 2) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
}

/*
 * Show input error
 */
thdTablet.sf.showError = function() {
	$('.sf-search input').val('');
	$('.sf-search input').attr("placeholder", thdTablet.sf.SEARCH_ERROR_TEXT);
	$('.sf-search input').addClass('errorText errorBorder');
}

/*
 * Reset refinement checkboxes with previously selected values.
 */
thdTablet.sf.cancelRefinements = function() {
	if($.isEmptyObject(thdTablet.sf.selectedRefinements)) {
		//If no refinements exists, clear all checkboxes
		for(var j=0; j < thdTouchCommon.sf.StoreServices.length; j++){
			var service = thdTouchCommon.sf.StoreServices[j];
			$('#sf-refine-' + service.field).prop('checked', false);
		}
	} else {
		//Reset checkboxes with previous values
		$.each(thdTablet.sf.selectedRefinements, function(key, value){
			console.log('key-' + key + 'value-' + value);
			if(value) {
				console.log(key + 'checked');
				$('#sf-refine-' + key).prop('checked', true);
			} else {
				console.log(key + 'remove');
				$('#sf-refine-' + key).prop('checked', false);
			}
		});
	} 
}

/*
 * Use GPS 
 */
thdTablet.sf.getStoresByLocation = function(position) {
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	var wsParams = {
			latitude : lat,
			longitude : lon,
			radius : thdTouchCommon.sf.RADIUS_SEARCH,
			maxMatches : thdTablet.sf.MAX_MATCHES_SEARCH
		};
	thdTablet.sf.getStores('get-stores-by-latlng', wsParams);
}

/*
 * Handles errors and deny while using GPS
 */
thdTablet.sf.handleGpsError = function(error) {	
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
	$('.sf-search input').val('');
	$('.sf-search input').attr("placeholder", thdTablet.sf.GPS_ERROR_TEXT);
	$('.sf-search input').addClass('errorText errorBorder');
}

/*
 * Handles Make this my store button tap
 */
$(document).on('click', '.setStore', function(event){
	event.stopPropagation();
	event.preventDefault();
	
	var newStoreNum = $(this).attr('storenum');
	// Updates Map
	if($("#sf-map").length > 0){
		$('#sf-map .nlpGreen').addClass('thdOrange').removeClass('nlpGreen');
		$('#sf-map .poiNum'+newStoreNum).addClass('nlpGreen').removeClass('thdOrange');
	}
	// Updates cookie
	var wsParams = {
			id : newStoreNum
		};
	reqlocalization = false;
	thdTouchCommon.localization.getStore('get-store-by-id', wsParams);
	
	//Change My store to Set store on List
	$(".myStore").removeClass("myStore btn-flat-green").addClass("setStore btn-white").attr('href','#').text("MAKE THIS MY STORE");
	//Change Set store to My store on InfoWindow
	$('.info' + newStoreNum + ' .setStore').removeClass("setStore btn-white").addClass("myStore btn-flat-green").html('<i class="icon-verified-symbol"></i>MY STORE');
	//Change Set store to My store on List
	$('.store-detail-' + newStoreNum + ' .setStore').removeClass("setStore btn-white").addClass("myStore btn-flat-green").html('<i class="icon-verified-symbol"></i>MY STORE');
	
	if(ensightenOn){
		_hddata["AJAX"]="formSubmit";
		_hddata["localStoreNum"]=newStoreNum;
		thdTouchCommon.utils.analytics.hdDataCallBack();
	}
});


/* 
 * Updates info window when it is opened
 */
thdTablet.sf.updateInfoWindow = function(evt) {
	var infoWindow = evt.srcObject.infoWindow.elements.content;
	var currentStoreNum = $(infoWindow).find('.btn-white, .btn-flat-green').attr('storenum');
	if(currentStoreNum == thdTouchCommon.localization.getStoreNum()) {
		//Change set store to My Store
		$(infoWindow).find('.setStore').removeClass("setStore btn-white").addClass("myStore btn-flat-green").html('<i class="icon-verified-symbol"></i>MY STORE');
	} else {
		//Change My store to Set Store
		$(infoWindow).find(".myStore").removeClass("myStore btn-flat-green").addClass("setStore btn-white").text("MAKE THIS MY STORE");
	}
	//Set source address as current location in info window.
	var mapAppDirections = $('#sf-map .directions').attr('href');
	$('#sf-map .directions').attr('href', mapAppDirections+'&saddr='+thdTablet.sf.sourceAddress);
}

/*
 * Set source address as current location in store list
 */
thdTablet.sf.setSourceDirections = function(evt) {
	navigator.geolocation.getCurrentPosition(thdTablet.sf.setDirectionsOnList);
}

/*
 * Callback method for setSourceDirections. 
 */
thdTablet.sf.setDirectionsOnList = function(position){
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	var totalDirections = $(".directions").length - 1;
	thdTablet.sf.sourceAddress = lat+','+lon;
	for (var i=0; i<=totalDirections; i++){
		var mapAppDirections = $('.directions:eq('+i+')').attr('href');
		$('.directions:eq('+i+')').attr('href',mapAppDirections+'&saddr='+thdTablet.sf.sourceAddress);
	}
}
