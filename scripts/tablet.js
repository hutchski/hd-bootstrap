var isShopAllOpen = false;

// Primary Object for Everything Tablet
var thdTablet = {};

var recProds = {};

// THD Tablet Debug
thdTablet.isLogging = false;
thdTablet.log = function() {
	if (thdTablet.isLogging && console){
		console.log.apply(console, arguments);
	}
}

// Lets keep track of layout
thdTablet.orientation;

// Lets scripts know what template user is viewing
thdTablet.content = false;
thdTablet.home = false;
thdTablet.plp = false;
thdTablet.pip = false;
thdTablet.storefinder = false;
thdTablet.more = false;
thdTablet.checkout = false;

// Lets scripts know whats on page
thdTablet.header = true;
thdTablet.refinements = {};
thdTablet.miniPLP = {};
thdTablet.tabs = {};
thdTablet.tabs.irg = {};
thdTablet.prp = {};
thdTablet.irg = {};
thdTablet.ssku = {};
thdTablet.prp.scroll;
thdTablet.productZoom;

// Lets script know whats active
thdTablet.refinements.obj = {};
thdTablet.refinements.open = false;
thdTablet.refinements.active = false;
thdTablet.miniPLP.obj = {};
thdTablet.miniPLP.open = false;
thdTablet.miniPLP.active = false;
thdTablet.tabs.obj;
thdTablet.tabs.cur;
thdTablet.tabs.open = false;
thdTablet.tabs.active = false;
thdTablet.tabs.irg.active = false;
thdTablet.irg.totals = {};
thdTablet.irg.positions = {};
thdTablet.irg.cur;
thdTablet.irg.loading = false;
thdTablet.irg.loader;
thdTablet.ssku.obj;
thdTablet.ssku.active = false;
thdTablet.miniPLP.obj;

// Keeps up with tablet window size
thdTablet.winW;
thdTablet.winH;

// Defining messaging
thdTablet.message = {};
thdTablet.message.addToCart = 'Adding to Your Cart';
thdTablet.message.addToCart_success = 'Added to Cart';
thdTablet.message.addToCart_fail = 'Failed to add to Cart';
thdTablet.message.addToMyList = 'Adding to Your List';
thdTablet.message.refine = 'Refining Selections';
thdTablet.message.productUpdate = 'Fetching Product';
thdTablet.message.productUpdateError = 'Failed to retrieve product';
thdTablet.message.reviewUpdate = 'Fetching reviews';
thdTablet.message.reviewUpdateError = 'Failed to retrieve reviews';
thdTablet.message.loading = 'Loading more products';
thdTablet.message.notRated = 'Not Yet Rated';
thdTablet.message.SEARCH_ERROR = 'Enter Keyword or SKU';
thdTablet.message.SEARCH_TYPEAHEAD_ERROR = 'No Suggestions';




/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _GLOBAL UTILITIES Function/Methods !!! SOME RESCOPING NEEDED !!!  */


//run function on orientation change
window.onorientationchange = function(){
	thdTablet.positionElements();
	
	// Needed so scrolling works properly after o change, known safari bug
	$('.scrollable').css('-webkit-overflow-scrolling', 'auto');
	setTimeout(function () { $('.scrollable').css('-webkit-overflow-scrolling', 'touch') }, 10);
}

//Positions elements depending on what page user is
//viewing and what is active on thse pages
thdTablet.elements = function(){

	var contentHeight;
	var contentWidth;
	var footerTop;
	var tabTop;
	var cartTop;
	var homeSections;
	var footerPos;
	var sectionWidth;

	$('.overlay').css({'width':thdTablet.winW+'px','height':thdTablet.winH+'px'});
	$('.productImg-overlay').css({'width':thdTablet.winW+'px','height':thdTablet.winH+'px'});
	var productImgHeight = thdTablet.winH - $('.productImg-overlay .bar-top').height();
	$('#productImg').css({'height':productImgHeight+'px'});
	
	if(thdTablet.home) {
		
		// Handles Height of layout on HOMEPAGE
		contentHeight = thdTablet.winH - $('#thdTablet-mast').height();
		$('article').css({'height':contentHeight+'px'});
		
		// Handles Width of layout on HOMEPAGE
		contentWidth = thdTablet.winW;
		
		$('article').css({'left':'0', 'width':contentWidth+'px'});
		$('#section-content section').css({'width':contentWidth+'px'});
		
		if(thdTablet.orientation == 'landscape'){
			homeSections = $('article .section-container').length;
			sectionWidth = $('article .section-container').width();
			homeSections = thdTablet.winW * homeSections;
			contentHeight = contentHeight + 2;
			$('#section-content').css({'left':'0', 'width':homeSections+'px','height':contentHeight+'px'});
			if(homeSections > thdTablet.winW){
				$('.window-arrow-left,.window-arrow-right').css({'-webkit-animation':'none'}).show();
				setTimeout(function() { 
					$('.window-arrow-left').css({'-webkit-animation':'arrow-out-left 0.75s'}).on('webkitAnimationEnd', function(){
						$(this).hide();
					});
					$('.window-arrow-right').css({'-webkit-animation':'arrow-out-right 0.75s'}).on('webkitAnimationEnd', function(){
						$(this).hide();
					});
				}, 1500);
			}
		} else if(thdTablet.orientation == 'portrait'){
			$('#section-content').css({'left':'0', 'width':contentWidth+'px','height':'auto'});
			$('.window-arrow-left,.window-arrow-right').hide();
		}
	}else if(thdTablet.plp) {
		var plpScrollHeight = thdTablet.winH - 62;
		
		if($('#plp-product-list').length > 0){
			plpScrollHeight = plpScrollHeight - $("#plp-product-list > header").height();
			$(".plp-products").css('height',plpScrollHeight+'px');
		}else if($('#plp-content').length > 0){
			plpScrollHeight = plpScrollHeight - $("#plp-content > header").height();
			$(".plp-content-pods").css('height',plpScrollHeight+'px');
		}
	}
};

//Fires element posiitoning on device rotation
thdTablet.positionElements = function(){
	
	// lets get orientation
	var orientation = window.orientation;

	// lets define the width and height of the window
	thdTablet.winW = window.innerWidth;
	thdTablet.winH = window.innerHeight;

	if (orientation === 0 || orientation === 180){
		thdTablet.orientation = 'portrait';
	} else if (orientation === 90 || orientation === -90){
		thdTablet.orientation = 'landscape';
	} else {
		thdTablet.orientation = 'desktop view';
	}
	
	thdTablet.elements();
};

//Dynamic product ratings display
thdTablet.dynamicRatings = function(){
	var obj = $('.ratings .stars');
	$(obj).each(function (i){
		var avgRating = $(this).attr('rel');
		var RatingNumber = avgRating * 20;
		if(avgRating == 'noRating' || RatingNumber == '0.0'){
			$(this).parent().addClass('ratingsNone');
			$(this).removeClass('stars');
			$(this).text(thdTablet.message.notRated);
		} else{
			$(this).css('width', RatingNumber+'%');
		}
	});
};

// Overlay Messaging and activation
thdTablet.showOverlayMessage = function(){
	$('#overlay-notification').css({'display':'-webkit-box'});
}

thdTablet.hideOverlayMessage = function(){
	setTimeout(function () { $('#overlay-notification').fadeOut(); }, 1000);
}
// Search Functionality 
thdTablet.blurSearch = function(){
	if ($("#thdTablet-searchFocus").val().length == 0) {
		$("#thdTablet-searchFocus").blur();
	}
}

var resultModel =  {
		"Categories": {label: 'Category', cssClass: 'categories', max: 6, column: 0, values:[]},
		"Brands": {label: 'Shop by Brand', cssClass: 'brands', max: 3, column: 1, values:[]},
		"Project Guide": {label: 'How to: Project Guides', cssClass: 'projects', max: 4, column: 2, values:[]},
		"Buying Guides": {label: 'How to: Buying Guides', cssClass: 'buying', max: 2, column: 1, values:[]},
		"Installations": {label: 'Installation Services', cssClass: 'InstallationServices', max: 1, column: 1, values:[]},
		"Communities": {label: 'Community', cssClass: 'Community', max: 1, column: 2, values:[]},
		isEmpty: function() {
			var isEmpty = ((this["Categories"].values.length == 0) &&
				(this["Brands"].values.length == 0) &&
				(this["Project Guide"].values.length == 0) &&
				(this["Buying Guides"].values.length == 0) &&
				(this["Installations"].values.length == 0) &&
				(this["Communities"].values.length == 0) );
			return isEmpty;
		}
	};

// Animates and controls search box in header
thdTablet.searchBoxBehavior = function() {
   	var $results = $("#thdTablet-typeahead");
	var searchText='';
	var searchTimer;
	$("#thdTablet-searchFocus").focus(function() {

// Added by Scott to set overlay on search focus 
		$("#overlay-search").show();
		if ($(document).find("#overlay-search").length == 0) {
			var docHeight = $(document).height();	
   			$("body").append("<div id='overlay-search'></div>");
   			$("#overlay-search").height(docHeight);
   		}
// End Scott's additions

		searchText='';
		$(this).addClass("infocus");
		$('#thdTablet-main-navigation').fadeOut();
		$('#thdTablet-clearSearch').show();
		$('#thdTablet-searchButton').fadeIn();
		searchTimer = setTimeout(thdTablet.blurSearch,7000);
	}).blur(function() {
		if ($(this).val().length == 0) {
			window.clearTimeout(searchTimer);
			thdTablet.searchFadeOut();

		} else {
			searchText = $(this).val();
			//$(this).val("");
			//thdTablet.searchFadeOut();
		};
	}).keydown(function(event) {
		if ($(this).val().length > 1) {
			thdTablet.submitSearch(event);
		} else {
			searchTimer = setTimeout(thdTablet.blurSearch,7000);
		}
	}).on("input", function(e) {
   		var text = $(this).val();
   		if(text.length > 1) {
   			$.ajax({
   					type:		"get", 
   					crossDomain: true,
   					url:		$("#typeAheadURL").val() + "123098/0000/" + text + ".js?e="+$("#thdTablet-eVal").val() +"&dr=1",
   					dataType:	"JSONP",
   					jsonpCallback: "_jqjsp",
					cache: true,
   					error: function(data) {
   						console.log("error");
   						console.log(data);
   					},
   					success: function(data) {
   						console.log("success");
   						console.log(data);
   						
   						if($.isEmptyObject(data)){
   							$("#thdTablet-typeahead").html(thdTablet.message.SEARCH_TYPEAHEAD_ERROR).fadeIn("fast");
   						}else{
   							$("#thdTablet-typeahead").html(thdTablet.drawResults(data)).fadeIn("fast");
   						}
   					}
   			});
   		};
   	});
	$("#thdTablet-searchBoxForm").submit(function() {
		if(searchText!='') {
			$("#thdTablet-searchFocus").val(searchText);
		}
		if ($("#thdTablet-searchFocus").val().length == 0) {
			thdTablet.showSearchError();
			thdTablet.blurSearch();
			return false;
		} else {
			thdTablet.searchFadeOut();
			var b = $(this).attr("action");
			if(thdTablet.validateSearchInput($("#thdTablet-searchFocus").val())) {
				var c = b.replace("{0}", escape($("#thdTablet-searchFocus").val()));
				window.location = c;
			} else {
				thdTablet.showSearchError();
			}
			return false;
		}
	});
}

/*
 * Validate user input in search box
 */
thdTablet.validateSearchInput = function(searchText) {
	var fix = new RegExp (/[^A-Za-z0-9,.\-_\/]|[<>\[\]?+\^\&]/g);
	var a = searchText.replace(fix," ");
	a = a.trimMe();
	
	if (a.length >= 1 && a.length <= 60) {
		return true;
	} else {
		return false;
	}
}

/*
 * Display error
 */
thdTablet.showSearchError = function() {
	$('#thdTablet-searchFocus').val('');
	$('#thdTablet-searchFocus').attr("placeholder", thdTablet.message.SEARCH_ERROR);
	$('#thdTablet-searchFocus').addClass('errorText errorBorder');
}

thdTablet.drawResults = function(data) {
	var $wrapper = $("<div>");
	var $tabDiv = $("<div>").appendTo($wrapper);
	var columns = [
		$("<div class='thdTablet-column'>"),
		$("<div class='thdTablet-column'>"),
		$("<div class='thdTablet-column'>")];
	
	$.each(data, function(cat,grp) {
		if (grp.length > 0) {
			$cat = $("<div/>",{"class":"thdTablet-category"});
			$("<h4/>").html(cat).appendTo($cat);
			$ul = $("<ul/>").appendTo($cat);
			var max = 1;
			switch(cat) {
				case "Categories":
					$cat.addClass("categories").appendTo(columns[0]);
					max = 6;
					break;
				case "Brands":
					$cat.addClass("brands").appendTo(columns[1]);
					max = 3;
					break;
				case "Buying Guides":
					$cat.addClass("buying").appendTo(columns[1]);
					max = 2;
					break;
				case "Installations":
					$cat.addClass("installations").appendTo(columns[1]);
					max = 1;
					break;
				case "Project Guide":
					$cat.addClass("projects").appendTo(columns[2]);
					max = 4;
					break;
				case "Communities":
					$cat.addClass("communities").appendTo(columns[2]);
					max = 1;
					break;
			}
			$.each(grp, function(item,set) {
				if (item < max) {
					var aSet = set.split("|");
					var $li = $("<li/>");
					var $anc = $("<a/>",{"data-category":"Categories",
											"data-linkname":item,
											"href": buildSearchURL(aSet),
											"class":""}).text(aSet[0]);	
					$("<i/>",{"class":"thdTablet-glyph-chevron-symbol thdOrange"}).appendTo($anc);	
					$anc.appendTo($li);
					$li.appendTo($ul);
				} 
			});	
		}
	});
	
	columns[0].insertAfter($tabDiv);
	columns[1].insertAfter(columns[0]);
	columns[2].insertAfter(columns[1]);
	$("<div style='clear:both'></div>").insertAfter(columns[2]); 
	return $wrapper.html();
};

function buildSearchURL (aVal) {
	var urlKey = aVal[1];
	var cType = aVal.length > 2 ? parseInt(aVal[2]) : 0;
	switch(cType) {
		case 0:
			return "http://" + getHostName() + "/b/N-5yc1v" + urlKey;
		case 1:
			return urlKey;
		case 2:
			return "javascript:MM_openBrWindow('http://ext.homedepot.com/video/?bcpid=207606409001&bctid=" + urlKey + "', 'hdtv', 'width=1100,height=675')";	
		case 3:
			return "http://" + getHostName() + "/c/" + urlKey;
		case 4:
			return "http://community.homedepot.com/" + (urlKey || "");
	}
};

// Fades out Search box
thdTablet.searchFadeOut = function(){
	$("#thdTablet-typeahead").fadeOut("fast");
	$("#thdTablet-searchFocus").removeClass("infocus");
	$('#thdTablet-main-navigation').fadeIn('slow'); 
	$('#thdTablet-clearSearch').hide();
	$('#thdTablet-searchButton').fadeOut();
// Added by Scott to kill the search overlay	
	$("#overlay-search").hide();
}

// Hides Search box when anyplace on the page is tapped
$(document).on('touchend', function(e){
	thdTablet.log(e);
	if(e.target.id != 'thdTablet-clearSearch' && e.target.id != 'thdTablet-searchFocus'){
		thdTablet.searchFadeOut();
	}
});

// Fadeout search on Reset 
thdTablet.resetSearch = function() {
	thdTablet.searchFadeOut();
	return true;
}

//Ajax call to shop all navigation
thdTablet.loadTopLevelNav = function() {
	$('#thdTablet-flyout-wrapper').load('/servlet/ShopAllView', function() {
		//adjustFlyoutForOrientation();
	});
}

thdTablet.toggleShopAll = function() {
	if(!isShopAllOpen){
		isShopAllOpen = true;
		$('.thdTablet-shop-all-trigger').toggleClass('active');
		$('#thdTablet-flyout-wrapper').show();
		if(ensightenOn){
			//set the event
			//the data collectors would change at this point.
			_hddata["pageType"] = "shop all";
			_hddata["siteSection"] = "shop all";
			_hddata["pageName"] = "shop all";
			_hddata["contentCategory"]= "shop all";
			_hddata["contentSubCategory"]="shop all";
		}
	} else {
		isShopAllOpen = false;
		$('.thdTablet-shop-all-trigger').toggleClass('active');
		$('#thdTablet-flyout-wrapper').hide();
	};
}

// Sets Shop All state to open or closed. 
thdTablet.setShopAllState = function() {
	if(isShopAllOpen) {
		isShopAllOpen = false;
		$('.thdTablet-shop-all-trigger').attr('checked', true);
		thdTablet.toggleShopAll();
	} else {
		$('.thdTablet-shop-all-trigger').attr('checked', false);
	}
}

// Show number in cart on header
thdTablet.showCartBlock = function() {
	var itemsInCart = getTHDNumberItemsInCart();
	if (itemsInCart != '0' && itemsInCart != '') {
		if(parseInt(itemsInCart) > 999) { itemsInCart = '999+'; }
		$("#thdTablet-mcartnum").html(itemsInCart);
		$("#thdTablet-mcartnum").addClass("thdTablet-cartcounter");
	}
}

// iscroll Snap scroller
thdTablet.scrolltest = function() {
	//set width of scrollwindow
	var numItems = $('#slider_window .row .pod').length,
	widthItems = 750,
	slideWidth = numItems * widthItems;
	$('#slider_window').width(slideWidth);
	if(numItems > 0) {
		var myScroll = new iScroll('sliderwrapper', {
			snap: '.row .pod',
			momentum: false,
			hScrollbar: false,
			onScrollEnd : function() {
				$('#sliderwrapper').find('.swipable-image-indicator > a.active').removeClass('active');
				$('#sliderwrapper').find('.swipable-image-indicator > a:nth-child('+ (this.currPageX + 1) + ')').addClass('active');
			}
		});
		var swipeIndicator = '';
		swipeIndicator += '<nav class="swipable-image-nav"><ul class="swipable-image-indicator">';
		for (i=0; i < numItems; i++){
			swipeIndicator += '<a ';
			if(i === 0){
				swipeIndicator += 'class="active"';
			}
			swipeIndicator += 'href="#">'+i+'</a>';
		}
		swipeIndicator += '</ul></nav>';
		$('#sliderwrapper').append(swipeIndicator);
	}
}
// Submit search on enter
thdTablet.submitSearch = function(e) {
	if (e.keyCode == 13) {
		var btn = document.getElementById('thdTablet-searchButton');
		if (btn) {
			btn.click();
			thdTablet.searchFadeOut();
			return false;
		}
	}
}

//Highlight Header
thdTablet.highlightHeader = function() {
	//Reset header
	$('#thdTablet-nav-store-finder a, #thdTablet-nav-store-finder a i').removeClass("thdOrange");
	$('#thdTablet-nav-more a, #thdTablet-nav-more a i').removeClass("thdOrange");
	if(thdTablet.storefinder) {
		$('#thdTablet-nav-store-finder a, #thdTablet-nav-store-finder a i').addClass("thdOrange");
	} else if(thdTablet.more) {
		$('#thdTablet-nav-more a, #thdTablet-nav-more a i').addClass("thdOrange");
	}
}

// Creates Image or Content Swiper
// Accepts Element ID, Nav Boolean, Notice Boolean, Zoom Boolean
thdTablet.createImgSlider = function(id, nav, notice, zoom) {
	
	var sliderID = id,
		sliderNav = nav,
		sliderNotice = notice,
		imgZoom = zoom,
		slides = $('#'+id+' img').length;
	
	if(slides > 1){
		var slideWidth = $('#'+sliderID+' img').width(),
			swiperWidth = slideWidth * slides;
		
		$('#'+sliderID+' > div').css({'width':swiperWidth+'px'});
		
		thdTablet.pipImgSwipe = new iScroll(sliderID,{
			snap : true,
			momentum : false,
			lockDirection : true,
			vscroll : false,
			hScrollbar : false,
			onScrollEnd : function() {
				if(sliderNav === true){
					$('#'+sliderID).parent().find('.swipable-image-indicator > a.active').removeClass('active');
					$('#'+sliderID).parent().find('.swipable-image-indicator > a:nth-child('+ (this.currPageX + 1) + ')').addClass('active');
					
					$('#'+sliderID+' img').removeClass('active');
					$('#'+sliderID+' img:nth-child('+(this.currPageX+1)+')').addClass('active');
				}
			}
		});
		
		if(sliderNav === true){
			var swipeIndicator = '',
				i;
			for (i=0; i < slides; i++){
				swipeIndicator += '<a ';
				if(i === 0){
					swipeIndicator += 'class="active"';
				}
				swipeIndicator += 'href="javascript:heroScroll.scrollToPage('+i+', 0, 200);">'+i+'</a>';
			}
			$('#'+sliderID).parent().find('.swipable-image-indicator').append(swipeIndicator);
		}
	}
	if(sliderNotice === true){
		thdTablet.createImgZoom(sliderID);
		setTimeout(function () {
			$('#'+sliderID).parent().find('.notice').fadeOut();
		}, 1800);
	}
}

// Creates Image Zoom
// Accepts Element ID and nothing else
thdTablet.createImgZoom = function(id) {
	var wrapperID = id;
	
	$('#'+wrapperID+' img').hammer();
	$('#'+wrapperID).on('doubletap', 'img', function(e){
		thdTablet.productZoom = new iScroll('productImg',{ 
			zoom: true,
			hScrollbar: false,
			vScrollbar: false,
			onZoomEnd: function(){
				thdTablet.log(this);
			},
			onBeforeScrollStart: function (e) { e.preventDefault(); }
		});
		setZoomedImg();
	});
	
	if(thdTablet.pip){
		$('#'+wrapperID).parent().find('.icon-magnify').on('touchend', function(e){
			e.preventDefault();
			thdTablet.productZoom = new iScroll('productImg',{ 
				zoom: true,
				hScrollbar: false,
				vScrollbar: false,
				onZoomEnd: function(){
					thdTablet.log(this);
				},
				onBeforeScrollStart: function (e) { e.preventDefault(); }
			});
			setZoomedImg();
		});
	}
	/*
	$('.overlay-product-image a').click(function(e){
		e.preventDefault();
		$('.overlay-product-image').hide();
		thdTablet.productZoom.destroy();
		thdTablet.productZoom = null;
	});
	*/
	
	function setZoomedImg(){
		var curImg = $('#'+wrapperID).find('.active').attr('src');
		curImg = curImg.replace('/300/','/400/').replace('_300','_400');
		thdTablet.log(curImg);
		$('#productImg').find('img').attr('src',curImg);
		$('.overlay-productZoom').css({'display':'-webkit-box'});
		$('.overlay-productZoom .overlay-close a').on('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			$('.overlay-productZoom').hide();
			$('.overlay-productZoom section').off();
		});
		/*
		$('.overlay-productZoom').find('section').css({'-webkit-animation':'card-up 0.75s'});
		$('.overlay-productZoom .overlay-close a').on('touchend',function(e){
			$('.overlay-productZoom').find('section').css({'-webkit-animation':'card-right 0.75s'});
			$('.overlay-productZoom').find('section').on('webkitAnimationEnd', function(e){
				$('.overlay-productZoom').hide();
				$('.overlay-productZoom').find('section').off();
			}); 
		});
		*/
	}
}

//Checks if referrer is a valid PLP URL
thdTablet.isValidReferrer = function(xUrl) {
	var validParams = ["/N-","?N=","&N=","/s/", "/Search"];
	for(i=0; i<validParams.length; i++) {
		if(xUrl.indexOf(validParams[i]) >= 0 ) {
			return true;
		}
	}
	return false;
}

//Retrieves N, Ntk, Ntt, keyword params from URL
thdTablet.getExtraParams = function(xUrl) {
	var urlArr = xUrl.split("/");
	var outUrl='';
	for(i=0; i<urlArr.length; i++) {
		if(urlArr[i].indexOf('N-') == 0 
				|| urlArr[i].indexOf('Ntk-') == 0 || urlArr[i].indexOf('Ntt-') == 0){
			var qsParam = urlArr[i].split('-');
			outUrl += qsParam[0] + "=" + qsParam[1] + "&";
		} else if (urlArr[i] == 's') {
			outUrl += "keyword" + "=" + urlArr[i+1];
			break;
		}
	}
	
	if(outUrl.substr(-1) == '&') {
		outUrl = outUrl.substr(0, outUrl.length-1);
	}
	return outUrl;
}

thdTablet.getTHDStoreName = function(){
	var locStoreAddress = readCookie('THD_LOCSTORE');
	var storeName = "";
	if (locStoreAddress != null && locStoreAddress.length != 0) {
		var splLocStoreAddress = locStoreAddress.split('+');
		if (splLocStoreAddress.length < 2) {
			locStoreAddress = unescape(locStoreAddress);
			splLocStoreAddress = locStoreAddress.split('+');
			if (splLocStoreAddress.length < 2) {
				return "";
			}
		}
		var tmpAddressLine = splLocStoreAddress[1];
		storeName = tmpAddressLine.substring(0,
				tmpAddressLine.lastIndexOf('-') - 1);
	}
	return storeName;
}

thdTablet.hasValue = function(key) {
	if (typeof key === 'undefined' || key == undefined || key == null || key.toString().length == 0) {
		return false;
	} else {
		return true;
	}
}

function setURLParam(URL, key, value, includeEmpty) {
	var aURL = URL.split("?");
	if (value == undefined) {
		value = "";
	}
	includeEmpty = (includeEmpty == undefined) ? "false" : includeEmpty.toString();
	if (aURL.length > 1) {
		var aQS = aURL[1].split("&");
		var update = false;
		for ( var p = 0; p < aQS.length; p++) {
			if (aQS[p].toLowerCase().indexOf(key.toLowerCase() + "=") == 0) {
				if (includeEmpty == "true" || value.toString().length > 0) {
					aQS[p] = key + "=" + value;
					update = true;
					break;
				} else {
					aQS.splice(p, 1);
					update = true;
					break;
				}
			};
		}
		if (!update && (includeEmpty == "true" || value.toString().length > 0)) {
			aQS.push(key + "=" + value);
		}
		if (aQS.length == 0) {
			return aURL[0];
		}
		return aURL[0] + "?" + aQS.toString().replace(/,/g, "&");
	} else if (includeEmpty == "true" || value.toString().length > 0) {
		return URL + "?" + key + "=" + value;
	}
	return URL;
}

String.prototype.setURLParam = function(param,value,includeEmpty) {
	return setURLParam(this,param,value,includeEmpty);
};




/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _STOREFINDER () Function/Methods */


thdTablet.int_STOREFINDER = function (){
	
	// Binds action to Refinement Select
	var refinementsSelect = $('.btn-select-overlay').parent().find('.select-overlay');
	$('.btn-select-overlay').on('touchend', function(e){
		if(refinementsSelect.is(':visible')) {
			refinementsSelect.hide();
			thdTablet.sf.cancelRefinements();
		} else {
			refinementsSelect.show();
		}
		e.stopPropagation();
	});
	$('.select-overlay').on('touchend', function(e) {
		e.stopPropagation();
	});
	$('#sf-map, #storefinder-details, #storefinder-search').on('touchend', function(){
		refinementsSelect.hide();
		thdTablet.sf.cancelRefinements();
	});
	$('#sf-refine-apply').on('click', function(e){
		$('.select-overlay').hide();
		thdTablet.sf.getStoresByBoundingBox();
	});
	$('#sf-search-txt').on('click', function(e){
		if(thdTablet.sf.validateInput()) {
			thdTablet.sf.submitTextSearch();
		} else {
			thdTablet.sf.showError();
		}
	});
	$('#sf-search-gps').on('click', function(e){
		$('.sf-search input').val("");
		$('.sf-search input').removeClass('errorText errorBorder');
		$('.sf-search input').attr("placeholder", thdTablet.sf.INPUT_PLACEHOLDER);
		navigator.geolocation.getCurrentPosition(thdTablet.sf.getStoresByLocation,thdTablet.sf.handleGpsError, {timeout : thdTouchCommon.sf.GPS_TIMEOUT});
		if(ensightenOn){
			_hddata["AJAX"]="formSubmit";
			_hddata["localizationMethod"]="gps";
			_hddata["storeLocatorFind"]="storeFinderSearch";
			thdTouchCommon.utils.analytics.hdDataCallBack();
		}
	});
	$('.sf-search input').keydown(function(e) {
		if (e.keyCode == 13) {
			if(thdTablet.sf.validateInput()) {
				thdTablet.sf.submitTextSearch();
			} else {
				thdTablet.sf.showError();
			}
		}
	});
	
}




/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _PLP (Product Listings Page) Function/Methods */


thdTablet.int_PLP = function(){
	
	// Sets Sorting Drop Down
	thdTablet.setSorting();
	
	// Sets Height of PLP Product Scroll
	thdTablet.positionElements();
	
	// Page Counter (IS THIS NEEDED?)
	//var pageCounter = 0;
	
	// Applies Menu Slider Func to wrapper elems
	if(thdTablet.refinements.active){
		
		thdTablet.refinements.obj = new slideInMenu('refinements-wrapper', 'vert', true);
		
		$(thdTablet.refinements.obj).on('menu:visible', function (event, visible) {
			if(visible === false){
				$('#plp-product-list,#plp-content').removeClass('open');
				$('#plp-product-list,#plp-content').addClass('closed');
			}else if(visible === true){
				$('#plp-product-list,#plp-content').removeClass('closed');
				$('#plp-product-list,#plp-content').addClass('open');
			}
		});
		
		// Binds toggle for refinement header
		$('#refinements header').hammer().on('tap', function(){
			$(this).next('ul').toggle();
			$(this).find('i').toggleClass('icon-minus-symbol icon-plus-symbol');
		});
		
		// Creates Clear All URL
		//$("#refinements-btn-clear").attr("href", window.location.href.replace(/\/N-[a-zA-Z0-9]+/,"\/N-"+ clearAll).replace("ref=1","ref=2") );
		
	}
	
	$(document).on('click', '.refinements-nav-list a', function(e){
		e.preventDefault();
		var elem = $(this);
		var checked = elem.parent().find('input[type=checkbox]').is(':checked') ? true : false;
		var url = elem.parent().find('a').attr('href');
		thdTablet.setRefinement(checked,url);
	});
	
	$(document).on('click', '.refinements-nav-list input[type=checkbox]', function(e){
		e.preventDefault();
		var elem = $(this);
		var checked = elem.parent().find('input[type=checkbox]').is(':checked') ? false : true;
		var url = elem.parent().find('a').attr('href');
		thdTablet.setRefinement(checked,url);
	});
	
	//Click event for PLP Add to cart
	$('.addToCart').on('click', function(e){
		e.preventDefault();
		var xURL = $(this).data('url');
		if (xURL.indexOf('addToCartConfirmation') > 1) {
				thdTablet.addToCartJSONPCall( xURL );
		} else {
			window.location.href = xURL;
		}
		if(ensightenOn) {
			_hddata["AJAX"]='addtocart';
			_hddata["potentialUnits1"]='1';
			_hddata["potentialRevenue1"]=$(this).parent().find('.item-price').text().replace('$', '');
			_hddata["productID1"]=$(this).parent().data('productid');
			thdTouchCommon.utils.analytics.hdDataCallBack();
		}
	});
	
	// Get Recommendations
	recProds.init();
	
}

thdTablet.setRefinement = function(checked,url) {
	if(checked){
		document.location = window.location.href.replace('Z'+url,'');
	}else if(!checked){
		window.location.href = url;
	}
}

thdTablet.setSorting = function() {
	if ($("#sortSelect").length) {
		$('#currSort').text($('#sortSelect option:selected').text());		
		$("#sortSelect").focus(function() {
			$("#sortSelect .selected").attr("selected", true);
		});
		$("#sortSelect").change(function() {
			window.location.href = $(this).val();
		});
	}
}

thdTablet.getProducts = function() {
	var referrer = document.referrer;
	if(thdTablet.isValidReferrer(referrer)) {
		//var xURL = "/servlet/AjaxNavigation?N=5yc1vZ12kx&Ntk=All&Ntt=nails&Ntx=mode+matchall&Nu=P_PARENT_ID&catalogId=10053&langId=-1&storeId=10051&Nao=10&fromPage=PIP";
		
		var refArr = referrer.split("?");
		var qsExtras = thdTablet.getExtraParams(refArr[0]);
		var xURL = "/servlet/AjaxNavigation?fromPage=PIP";
		var productId =  $("#productId").attr("data-productid");
		if(refArr.length > 1) {
			xURL += "&" + refArr[1];
		}
		if(thdTablet.hasValue(qsExtras)) {
			xURL += "&" + qsExtras;
		}
		if(thdTablet.hasValue(productId)) {
			xURL += "&removeItem=" + productId;
		}
		$.ajax({
			url: xURL,
			dataType: "text",
			success: function(text) {
				text = $.trim(text);
				var title = $('#miniPLP-wrapper .handle span').html();
				if(title == undefined || title == '') {
					title =  $(text).find('.msg-other-products h5').html();
					$("#miniPLP-wrapper .handle span").html(title);
				}
				var productList = $(text).html();
				$("#product-scroll .product-list").append(productList);
			},
			complete: function(jqXHR, textStatus) {
				thdTablet.dynamicRatings();
				thdTablet.productScroll();
				recProds.postObservations();
			}
		});
	} else {
		thdTablet.dynamicRatings();
		thdTablet.productScroll();
		recProds.postObservations();
	}
}




/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _PIP (Product Information Page) Function/Methods */


thdTablet.int_PIP = function() {
	
	window.onload = function() {
		window.setTimeout(function() {
			window.addEventListener("popstate", function(e) {
				thdTablet.showProdDetailsAJAX(location.pathname);
			}, false);
		}, 1);
	}
	
	thdTablet.getDynamicProductDataForPip();
	thdTablet.getRecommendedProducts();
	thdTablet.createImgSlider('pip-product-images',true,true,true);
	
	if(thdTablet.miniPLP.active){
		// Applies Menu Slider Func to wrapper elems
		thdTablet.miniPLP.obj = new slideInMenu('miniPLP-wrapper', 'horz', true);
		
		// Listener for TABS to be open or closed
		$(thdTablet.miniPLP.obj).on('menu:visible', function (event, visible) {
			if(visible === false){
				$('#pip-product').addClass('closed_miniPLP');
			}else if(visible === true){
				$('#pip-product').removeClass('closed_miniPLP');
			}
		});
	}
	
	// TAB funcs
	if(thdTablet.tabs.active){
		
		// Applies Menu Slider Func to wrapper
		thdTablet.tabs.obj = new slideInMenu('tab-wrapper', 'horz', false);
		
		// Listener for TABS to be open or closed
		$(thdTablet.tabs.obj).on('menu:visible', function (event, visible) {
			if(visible === false){
				$('#tabs i').removeClass('icon-arrow-down-symbol');
				thdTablet.miniPLP.obj.open();
			}else if(visible === true){
				$('#tabs i').addClass('icon-arrow-down-symbol');
				thdTablet.miniPLP.obj.close();
			}
		});
		
		/*
		// Hides Tabs when anyplace on the page is tapped
		$('#product-details').on('touchend', function(e){
			e.stopPropagation();
		});
		$(document).on('touchend', function(e){
			if(thdTablet.tabs.obj.opened == true){
				thdTablet.tabs.obj.close();
			}
		});*/
		
		// Activates Default content in Tabs
		$('#tabs-details .tab-content').eq(0).show();
		
		// Shows TAB Content when tab is tapped
		$('#tabs a').on('touchstart', function(e){
			e.preventDefault();
			$('#tabs-details .tab-content').hide();
			var loc = $(this).attr('href');
			thdTablet.tabs.cur = loc;
			thdTablet.log(thdTablet.tabs.cur);
			$(thdTablet.tabs.cur).show();
		});
		
		// Fires if IRG Active
		if(thdTablet.tabs.active){
			
			// Activates Default content in IRG
			$('#tab_irg .irg-products').eq(0).show();
			
			// Create Loader for IRG Products
			thdTablet.irg.loader = '<div class="pod ajax-loader"><span></span><span></span><span></span></div>';
			
			thdTablet.getRelatedItemGroupTabs();
			
		}
		
		thdTablet.int_PIP_REVIEWS();
	}
	
	// Binds action to Ratings Stars
	$('.ratings a').on('touchend', function(e){
		e.preventDefault();
		console.log('Ratings Fired');
		thdTablet.tabs.obj.open();
		$('.tab-content').hide();
		var loc = '#tab_customerReviews';
		thdTablet.tabs.cur = loc;
		$(thdTablet.tabs.cur).show();
	});
	
	// Binds action to Check Inventory Button
	$('#store-inventory-btn, #pip-store-qty').on('touchend', function(e){
		var overlayType = $(this).data('type');
		var qty = $('#quantity').val();
		var overlayURL = $(this).data('url') + '&quantity=' + qty; 
		if(overlayType == 'BOPIS'){
			$('#bopis-iframe').attr('src',overlayURL);
			
			$('.overlay-bopis').css({'display':'-webkit-box'});
			//Need to make overlay bigger when we get errors.
			$('.overlay-bopis .overlay-generic section').css({'height':'760px'});


			$('.overlay-bopis .overlay-close a').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#bopis-iframe').contents().find('input').remove();
				$('#bopis-iframe').attr('src','');
				$('.overlay-bopis').hide();
				$('.overlay-bopis section').off();
			});
		} else if(overlayType == 'BOSS'){
			$('#bopis-iframe').attr('src',overlayURL);
			$('.overlay-bopis').css({'display':'-webkit-box'});
			$('.overlay-bopis .overlay-close a').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#bopis-iframe').contents().find('input').remove();
				$('#bopis-iframe').attr('src','');
				$('.overlay-bopis').hide();
				$('.overlay-bopis section').off();
			});
			/* ANIMATED OVERLAY IF WE CAN FIRGURE OUT WHY ISSUES ARE CAUSED WHEN KEYBOARD IS ACTIVATED!!!!!!!!!!!!!!!!!!!!!!
			$('.overlay-bopis').find('section').css({'-webkit-animation':'card-up 0.75s'});
			$('.overlay-bopis .overlay-close a').on('touchend',function(){
				$('.overlay-bopis').find('section').css({'-webkit-animation':'card-right 0.75s'});
				$('.overlay-bopis').find('section').on('webkitAnimationEnd', function(e){
					$('.overlay-bopis').hide();
					$('.overlay-bopis section').off();
				}); 
			});*/
		}
	});
	
	// SSKU methods
	if(thdTablet.ssku.active){
		thdTablet.int_PIP_SSKU();
	}
	
	// BOPIS & BOSS Overlay overrides
	$('#bopis-iframe').load(function() {
		// BOPIS & BOSS Overlay overrides
		var overlayType = $('#store-inventory-btn').data('type');
		if(overlayType == 'BOPIS'){
			//Added to give popup box room when error messages exist
			$(this).contents().find('#qvColor').css({'height':'760px'});

			$(this).contents().find('.bopis_sd_col.bopis_sd_lastcol').css({'width':'300px','padding':'2px 0 2px 15px'});
			$(this).contents().find('.overlay_ss .bopis_one_storewrpr').css({'width':'720px'});
			$(this).contents().find('.overlay_ss .bopis_sd_lastcol strong').css({'display':'block'});
			$(this).contents().find('#currentstore').css({'padding-right':'0'});
		} else if(overlayType == 'BOSS'){
			$(this).contents().find('.overlay_ss.boss2 .bopis_sd_lastcol').css({'width':'450px','padding':'10px 0 10px 15px'});
			$(this).contents().find('.bopis_product_info').css({'padding-left':'10px'});
			$(this).contents().find('.bopis_product_info img').css({'width':'65px'});
			$(this).contents().find('#bopis2').css({'width':'760px','float':'left'});
			$(this).contents().find('.bopis_store.single').css({'width':'379px','height':'110px'});
			$(this).contents().find('.bopis_overlay_address').css({'margin-top':'10px'});
			$(this).contents().find('#bopis_top').css({'padding-left':'10px'});
			$(this).contents().find('#bopis_details_container .bopis_store p').css({'padding':'10px 0 10px 10px','height':'85px'});
			$(this).contents().find('.boss_quantity + input').css({'margin-right':'30px'});
			$(this).contents().find('.make_my_store').css({'text-align':'left','padding':'0'});
		}
	});
	// BOPIS & BOSS Overlay overrides
	$.fancybox = function (url) {
		var atcUrl = url.href.replace("OrderItemAdd", "THDMobileOrderItemAdd").replace("OrderItemDisplay", "THDMobileOrderItemDisplay");
		thdTablet.addToCartJSONPCall(atcUrl);
		$('.overlay-bopis').hide();
		setTimeout(function () {
			$('#bopis-iframe').contents().find('input').remove();
			$('#bopis-iframe').attr('src','');
		}, 50);
	}
	
	var currentQty = $(".quantity");
	
	$(".quantity").keyup(function(e) {
		if(currentQty.val() == '0') {
			currentQty.val('');
		};
	}).keypress(function(e) {
		if(currentQty.val().length >= 3) {
			return false;
		};
		return /\d/.test(String.fromCharCode(e.keyCode));
	}).focus(function(e) {
		if (e.target.value == e.target.defaultValue){
			e.target.value = '';
		}
	}).blur(function(e) {
		if (e.target.value == ''){
			e.target.value = e.target.defaultValue;
		}
	});
	
}

thdTablet.int_PIP_SSKU = function() {

	$('#superSku').removeClass('hide');
	// Binds action to SSKU Select
	$('.btn-select-overlay').on('touchend', function(e){
		e.stopPropagation();
		$('.select-overlay').hide();
		$(this).parent().find('.select-overlay').show();
	});
	$('.ssku-option').on('touchend', function(e){
		e.stopPropagation();
	});
	$('.ssku-option .select-overlay li').on('click',function(e){
		//e.stopPropagation();
		var selected = $(this);
		var disabled = selected.hasClass('disabled');
		
		if(!disabled){
			var value = selected.data('value');
			var name = selected.html();
			var swatch = selected.has('img').length ? true : false;
			if(swatch === true){
				selected.parent().find('img').removeClass('active');
				selected.find('img').addClass('active');
			}
			selected.parents('.ssku-option').find('.btn-select-overlay').data('value',value).html(name+'<i class="icon-chevron-symbol thdOrange"/>');
			selected.parents('.select-overlay').hide();
			
			thdTablet.matchSSKU();
		}
	});
	// Hides Select Overlay when anyplace on the page is tapped
	$(document).on('touchend', function(e){
		$('.select-overlay').hide();
	});

}

//Initialize PIP reviews events
thdTablet.int_PIP_REVIEWS = function() {

	// Binds action to Reviews sort Select
	$('.btn-select-overlay').on('touchend', function(e){
		e.stopPropagation();
		$('.select-overlay').hide();
		$(this).parent().find('.select-overlay').show();
	});
	$('.sort-by').on('touchend', function(e){
		e.stopPropagation();
	});
	$('.sort-by .select-overlay li').on('click', function(e){
		e.stopPropagation();
		var selected = $(this);
		var value = selected.data('value');
		var sortOrder = selected.data('sortorder');
		var productId = $("#productId").data("productid");		
		var url = '/servlet/ProductReview?productId=' + productId + '&pageNo=1&sort=' + value + '&sortOrder=' + sortOrder;
		thdTablet.loadReviews(url);
	});
	
	// Load additional Product Reviews
	$('#tab_customerReviews .plp-pagination a').on('touchend', function(e){
		thdTablet.loadReviews($(this).data('url'));
	})

	// Hides Select Overlay when anyplace on the page is tapped
	$(document).on('touchend', function(e){
		$('.select-overlay').hide();
	});
	
	// Calculates Ratings Stars
	thdTablet.dynamicRatings();
}

//Call product reviews command and load reviews tab
thdTablet.loadReviews = function(url) {
	$('#overlay-notification .overlay-message p').text(thdTablet.message.reviewUpdate);
	thdTablet.showOverlayMessage();
	$.ajax({
		url: url,
		dataType: "text",
		success: function(text) {
			text = $.trim(text);
			var productReviews = $(text).html();
			$('#tab_customerReviews').html(productReviews);
			$('#tab_customerReviews').scrollTop(0);
			thdTablet.int_PIP_REVIEWS();
		},
		error: function(xhr,status,error) {
			$('#overlay-notification .overlay-message p').text(thdTablet.message.reviewUpdateError);
		},
		complete: function(jqXHR, textStatus) {
			thdTablet.hideOverlayMessage();
		}
	});	
}

thdTablet.productScroll = function() {
	if(thdTablet.miniPLP.active){
		var podTotal = $('#product-scroll .product-list > .pod').length;
		var msgTotal = $('#product-scroll .product-list > .msg-other-products').length;
		
		var podStaticWidth = $('#product-scroll .product-list > .pod').outerWidth();
		var msgWidth = $('#product-scroll .product-list > .msg-other-products').outerWidth();
		
		var totalPodWidth = podStaticWidth * podTotal;
		var totalMsgWidth = msgWidth * msgTotal;
		
		var scrollWidth = totalPodWidth + totalMsgWidth;
		
		$('#product-scroll .product-list').css({'width':scrollWidth+'px'});
		
		var offset = $('#product-scroll .msg-other-products').offset();
		if(offset != undefined) {
			var msgLeft = offset.left;
			var handleTextRecommendation = $('#miniPLP-wrapper .handle span').text();
			var handleTextPLP =  $('#product-scroll .msg-other-products h5').html();
			$('#product-scroll').scroll(function(){
				if($(this)[0].scrollLeft > msgLeft){
					$('#miniPLP-wrapper .handle span').text(handleTextPLP);
				} else if($(this)[0].scrollLeft < msgLeft){
					$('#miniPLP-wrapper .handle span').text(handleTextRecommendation);
				}
			});
		}
		
		if($("#miniPLP .pod").size() == 0) {
			$('#product-scroll .product-list').css({'width':'300px'});
			$("#product-scroll .product-list").append("<p class='normal b spad'>Recommendations not available</p>");
		}

	}
}

//If the user is not localized (mainly for bots, but actual users may not be
//localized as well) then skip the Ajax call.
thdTablet.getDynamicProductDataForPip = function() {
	if ($("#buyBox").length > 0) {
		var productId = $("#productId").data("productid");
		var storeNum = thdTouchCommon.localization.getStoreNum();
		if (storeNum == null) {
			storeNum = '121';
		}
		var dynamicProductDetailsUrl = "/servlet/GetDynamicProductDetails?sku="
				+ productId + "&locStrId=" + storeNum;
		$.getJSON(dynamicProductDetailsUrl, {}, function(data) {
			if (typeof data !== "undefined") {
				thdTablet.setPurchaseButtons(data);
				thdTablet.setAvailabilityMessages(data);
				thdTablet.setPrice(data);
				thdTablet.setInStoreDetails(data);
			}
		});
	}
}

thdTablet.setAvailabilityMessages = function(data) {
	if (typeof data.m !== "undefined") {
		if (typeof data.m.ma !== "undefined") {
			for ( var key in data.m.ma) {
				if (data.m.ma.hasOwnProperty(key)) {
					if (key == "1") {
						$(".out-of-stock-online").removeClass('hide');
						$("#add-to-cart-btn").addClass('hide');
						$(".out-of-stock-online span").text(data.m.ma[key]);
					}
					if (key == "5") {
						$("#pip-store-qty span:last").text(data.m.ma[key]);
					}
					if (key == "9") {
						if (data.m.ma[key] == "ENABLE") {
							$("#pip-store-qty i").show();
							$("#pip-store-qty").attr('data-type', data.p);
							$("#pip-store-qty").attr('data-url', data.pu);
						} else {
							$("#pip-store-qty i").hide();
						}
					}
				}
			}
		}
	}
	if (typeof data.sc != "undefined") {
		var exclText = '';
		if(data.sc.toLowerCase().indexOf("online") !== -1) {
			exclText = '<p class="promo b"><i class="icon-online-only-symbol thdOrange"></i>' + data.sc + '</p>';
		} else if(data.sc.toLowerCase().indexOf("store") !== -1) {
			exclText = '<p class="promo b"><i class="icon-bopis thdOrange"></i>' + data.sc + '</p>';
		}
		$(".product-promotions").append(exclText);
	}
	if(data.p == "BOSS") {
		$("#boss-msg").removeClass('hide');
	} else if (data.p == "BOPIS") {
		$("#bopis-msg").removeClass('hide');
	}
}

thdTablet.setPurchaseButtons = function(data) {
	// If mCommerce Kill switch is enabled, hide purchase buttons
	if (data.mk == "DISABLE") {
		$(".cart-inputs").addClass('hide');
	} else {
		// If product can be added to cart or picked up in store, enable "Add to
		// cart" button
		// setup Button Functionality
		if (data.a != "NONE") {
			$("#add-to-cart-btn").removeClass('hide disabled').on('click', function(e) {
						e.preventDefault();
						var qty = $("#quantity").val();
						
						if(isNaN(qty) == false && qty.length < 4 && qty != 0 && qty != undefined){
							$("#quantity").removeClass('errorBorder');
							var xurl = $('#add-to-cart-btn').attr('href').replace(/quantity=[0-9]+/,'quantity=' + qty);
							if (xurl.indexOf('addToCartConfirmation') > 1) {
								thdTablet.addToCartJSONPCall( xurl );
							} else {
								var atcUrl = xurl.replace("THDMobileOrderItemAdd", "OrderItemAdd").replace("THDMobileOrderItemDisplay", "OrderItemDisplay");
								window.location.href = atcUrl;
							}
							if(ensightenOn) {
								_hddata["AJAX"]="addtocart";
								_hddata["potentialUnits1"]=qty;
								_hddata["potentialRevenue1"]=$('#price').text().replace('$', '');
								thdTouchCommon.utils.analytics.hdDataCallBack();
							}
						}else{
							$("#quantity").addClass('errorBorder');
						}
				});
		}
		
		$("#add-to-my-list-btn").on('click',
				function(e) {
					e.preventDefault();
					var qty = $("#quantity").val();
					var url = $(this).attr("href").replace(/quantity=[0-9]+/,
							'quantity=' + qty);
					window.location.href = url;
				});
		
		$("#add-to-cart-btn").attr('href', data.au);
		$("#store-inventory-btn").attr('data-type', data.p);
		$("#store-inventory-btn").attr('data-url', data.pu);
		
		// If BOPIS/BOSS is available, show Ship & Pickup in store radio buttons
		if (data.p != "NONE") {
			$("#store-inventory-btn").removeClass('hide disabled');
			if(data.p == 'BOSS') {
				$('#store-inventory-btn').html('Ship to Store');
			} else if(data.p == 'BOPIS') {
				$('#store-inventory-btn').html('Pick up in Store');
			}
		}
		
		if(data.a == "DISABLE" || data.a == "NONE") {
			$("#add-to-cart-btn").removeClass("hide").addClass('disabled');
		} else if(data.p == "DISABLE") {
			$("#store-inventory-btn").removeClass("hide").addClass('disabled');
		}
	}
}

thdTablet.setPrice = function(data) {
	if (typeof data.cp !== "undefined") {
		$("#price").text(data.cp);
		$("#price").removeClass('hide');
		$("#priceper").removeClass('hide');
	}
	if (typeof data.op !== "undefined") {
		$("#beforeprice").text("WAS " + data.op);
		$("#beforeprice").removeClass('hide');
	}
	if (typeof data.sp !== "undefined") {
		$("#areaprice").text(data.sp);
		$("#areaprice").removeClass('hide');
	}
}

thdTablet.setInStoreDetails = function(data) {
	var storeNum = thdTouchCommon.localization.getStoreNum();
	if (storeNum != null) {
		$(".product-location").removeClass('hide');
	
		var storeName = getTHDStoreName();
		var myStore = storeName + " #" + storeNum;
		
		$("#pip-my-store span:last").text(myStore);
		$("#pip-my-store").attr("href","/store/search/" + storeNum + "/");
		
		if (typeof data.ai !== "undefined") {
			$("#pip-aisle span:last").text(data.ai);
			$("#pip-aisle").attr("href",thdTouchCommon.sf.getStoreLayoutUrl(storeNum));
		} else {
			$("#pip-aisle span:last").text("- -");
			$("#pip-aisle").attr("href",thdTouchCommon.sf.getStoreLayoutUrl(storeNum));
		}
	}
}

thdTablet.addToCartJSONPCall = function(xURL) {
	$('#overlay-notification .overlay-message p').text(thdTablet.message.addToCart);
	thdTablet.showOverlayMessage();
	
	 $.ajax({
       type 			: "GET",
       crossDomain 		: true,
       url				: xURL,
       dataType 		: "JSONP",
       jsonp			: "addToCartCallback",
       error 			: function(a,b,c) {
      	 $('.overlay .overlay-message p').text(thdTablet.message.addToCart_fail);
       },
       success: function(data) {
       	cookieManager.initializeMasterCookie();
       	thdTablet.showCartBlock();
      	$("#add-to-cart-btn").addClass('hide');
      	$("#view-cart-btn").removeClass('hide');
      	$('#overlay-notification .overlay-message p').text(thdTablet.message.addToCart_success);
       },
       complete: function(jqXHR, textStatus) {
    	   $('#overlay-notification .overlay-message p').text(thdTablet.message.addToCart_success);
    	   thdTablet.hideOverlayMessage();
       }

 });
}

thdTablet.showProdDetailsAJAX = function(url) {
	$('#overlay-notification .overlay-message p').text(thdTablet.message.productUpdate);
	thdTablet.showOverlayMessage();
  	$.ajax({
		url: url,
		dataType: "text",
		success: function(text) {
			text = $.trim(text);
			thdTablet.loadProductDetails(text);
		},
		error: function(xhr,status,error) {
			$('#overlay-notification .overlay-message p').text(thdTablet.message.productUpdateError);
		},
		complete: function(jqXHR, textStatus) {
			thdTablet.hideOverlayMessage();
		}	
	});	
}

thdTablet.loadProductDetails = function(text) {
	$('#pip-product article').removeClass('ssku_active');
	$("#superSku").addClass('hide');

	var productTitle = $(text).find('#productTitle').html();
	var productImgs = $(text).find('#productImage').html();
	var productPrice = $(text).find('#productPrice').html();
	var productMessaging = $(text).find('#productMessaging').html();
	
	var productDetails = $(text).find('#tabs-details').html();
	var productSSku = $(text).find('#superSku').html();
	var tabs = $(text).find('#tabs').html();
	
	var productpageTitle = $(text).find('#productPageTitle').val();
	document.title = productpageTitle;
	
	if(thdTablet.pipImgSwipe){
		thdTablet.pipImgSwipe.destroy();
		thdTablet.pipImgSwipe = null;
	}
	
	$("#productTitle").html(productTitle);
	$("#productImage").html(productImgs);
	$("#productPrice").html(productPrice);
	$("#productMessaging").html(productMessaging);
	if(productSSku.trim() !== '') {
		$('#pip-product article').addClass('ssku_active');
		$("#superSku").html(productSSku);
		$("#superSku").removeClass('hide');
		thdTablet.int_PIP_SSKU();
	}
	$("#tabs").html(tabs);
	$('#tabs a').on('touchstart', function(e){
		$('.tab-content').hide();
		var loc = $(this).attr('href');
		thdTablet.tabs.cur = loc;
		thdTablet.log('thdTablet.tabs.cur: '+thdTablet.tabs.cur);
		$(thdTablet.tabs.cur).show();
	});
	$("#tabs-details").html(productDetails);
	
	// Updates the product image swipe
	thdTablet.createImgSlider('pip-product-images',true,true,true);
	if(thdTablet.tabs.open == true){
		thdTablet.tabs.obj.close();
	}
	
	// Reset buy box
	$(".out-of-stock-online").addClass('hide');
 	$("#add-to-cart-btn").off('click');
 	$("#add-to-my-list-btn").off('click');
 	$("#add-to-cart-btn").addClass('hide');
 	$("#view-cart-btn").addClass('hide');
 	$("#store-inventory-btn").addClass('hide');
 	$("#quantity").removeClass('errorBorder').val("1");
 	 
 	// Reset Store section 
 	$("#productStoreDetails").addClass('hide');
  	$("#pip-store-qty span:last").text("NA");
	$("#pip-store-qty").removeAttr('data-type');
	$("#pip-store-qty").removeAttr('data-url');

	thdTablet.getDynamicProductDataForPip();
	
	//Reset mini-PLP 
	$("#product-scroll .product-list").html('');
	thdTablet.getRecommendedProducts();
	thdTablet.getRelatedItemGroupTabs();
	
	loadBazaarvoiceApi(function() {
		$BV.ui("rr", "show_reviews", {
			productId: $("#productId").data("productid"),
			onEvent: function(json) {
				if(json.eventSource == "Display"){
					showRatingsDisplayed(json.attributes.numReviews);
				}
			}
		})
	});
	
	// Activates Default content in Tabs
	$('#tabs-details .tab-content').eq(0).show();
}

thdTablet.showProdDetails = function(url) {
	thdTablet.showProdDetailsAJAX(url);
	history.pushState(null, null, url);
}

//Recommendation Pod
thdTablet.getRecommendedProducts = function() {
	if (thdTablet.hasValue(recProds.cSchema) && thdTablet.pip) {
		var xURL = "/servlet/recommendedProducts";
		xURL = xURL.setURLParam("cSchema", recProds.cSchema);
		var pip = $("#productId").data("productid");
		if (thdTablet.hasValue(pip)) {
			xURL = xURL.setURLParam("prodIds",pip);
		}
		$.ajax({
			url : xURL,
			dataType : "html",
			success : function(data) {
				data = $.trim(data);
				var title = $(data).find('#recommendationTitle').val();
				$("#miniPLP-wrapper .handle span").html(title);
				var recommendedProds = $(data).html();
				$("#product-scroll .product-list").html(recommendedProds);

			},
			complete : function (jqXHR, textStatus) {
				var urlParams = thdTouchCommon.utils.getURLParameters();
				if(urlParams["showplp"] != "false") {
					thdTablet.getProducts();
				} else {
					thdTablet.dynamicRatings();
					thdTablet.productScroll();
					recProds.postObservations();
				}
			}
		});
	}

}

thdTablet.getRelatedItemGroupTabs = function(){
	
	thdTablet.irg.cur = null;
	thdTablet.irg.loading = false;
	
	if (relatedItemsData != undefined  && relatedItemsData != null && relatedItemsData != '') {
		
		var itemData = relatedItemsData; // Inline Data Object
		var irgSetLength = itemData.productRelatedItemIds.length;
		var irgTabs = '';
		
		thdTablet.log('IRG Loaded | Found: '+irgSetLength+' Group(s)');
		
		// Builds IRG Tabs from whats in the Obj
		for(var i=0; i<irgSetLength; i++){
			var groupName = itemData.productRelatedItemIds[i].groupName;
			var anchorName = groupName.replace(' ','').toLowerCase();
			var groupItemTotal = itemData.productRelatedItemIds[i].itemIDList.length;
			thdTablet.irg.totals[i] = itemData.productRelatedItemIds[i].itemIDList.length;
			thdTablet.irg.positions[anchorName] = 0;
			irgTabs += '<span data-group="irg_'+anchorName+'" class="btn btn-flat-lightGray ';
			if(i === 0){ irgTabs += ' btn-flat-darkGray active'; }
			irgTabs += '">'+ groupName.replace('_',' ')+' ('+itemData.productRelatedItemIds[i].itemIDList.length+')</span>';
		}
		
		// Writes IRG Tabs to DOM
		$('.irg-tabs nav').html(irgTabs);
		
		// Shows IRG Content when tab is tapped
		// Has to be re-binded each priduct re-load
		$('.irg-tabs nav > span').on('touchend', function(e){
			
			thdTablet.log('User Clicked IRG Group');
			
			var irgTab = $(this);
			var loc = irgTab.data('group');
			
			if(!irgTab.hasClass('active')){
			
				// Reset Tabs to default
				$('.irg-tabs nav span').removeClass('btn-flat-darkGray active');
				$('.irg-products').hide();
				
				// Show selected Tab
				irgTab.addClass('btn-flat-darkGray active');
				$('#'+loc).show();
				
				// Update Tab products
				thdTablet.getItemDetails(loc);
			}
			return false;
		});
		
		// Binds Scrolling to dynamically loaded IRG
		// Has to be re-binded each product re-load
		$('.irg-product-group-wrapper').on('scroll', function(e){
			var irgTab = $(this);
			var currentWidth = $('#'+thdTablet.irg.cur).width() - 1000;
			
			thdTablet.log('User is Scrolling IRG');
			
			if(irgTab[0].scrollLeft >= currentWidth && thdTablet.irg.loading == false){
				thdTablet.irg.loading = true;
				thdTablet.log('Tab Left Scroll Pos at execute Pos | Current Group Width: '+currentWidth);
				thdTablet.getItemDetails(thdTablet.irg.cur);
			}
		});
		
		$('.irg-products').hide();
		
		// Sends first Group name to get/show first 10 products of first Group
		var defaultGroup = 'irg_'+itemData.productRelatedItemIds[0].groupName.toLowerCase();
		$('#'+defaultGroup).show();
		thdTablet.getItemDetails(defaultGroup);
	}
}

thdTablet.getItemDetails = function(groupName){
	
	thdTablet.irg.cur = groupName;
	var containerName = groupName.replace(' ','').toLowerCase();
	groupName = groupName.replace('irg_','');
	
	if (relatedItemsData != undefined  && relatedItemsData != null && relatedItemsData != '') {
		
		var itemData = relatedItemsData;
		var irgSetLength = itemData.productRelatedItemIds.length;
		thdTablet.log('Retriving IRG Group: '+groupName);
		
		for(var i=0; i<irgSetLength; i++){
			
			if(itemData.productRelatedItemIds[i].groupName.toLowerCase() == groupName){
				
				var itemIds = itemData.productRelatedItemIds[i].itemIDList;
				var productLength = itemIds.length;
				var startIndex = thdTablet.irg.positions[groupName];
				var endIndex = startIndex + maxPIPRelatedItems;
				
				thdTablet.irg.positions[groupName] = endIndex;
				itemIds = itemIds.slice(startIndex,endIndex);
				thdTablet.log('Retriving IRG Group: '+itemData.productRelatedItemIds[i].groupName+' | Total IDs:'+productLength+' | Start/End Pos: '+startIndex+'/'+endIndex);
				
				// SERV call to get product details
				if (itemIds.length !== 0 && productLength >= startIndex) {
					
					thdTablet.log('Retriving IRG Group Product from SERV call');
					thdTablet.log(containerName);
					$('#'+containerName).append(thdTablet.irg.loader);
					var relatedItemDetailsURL = "/servlet/GetRelatedItemDetails?productId="+ itemIds;
					
					$.get(relatedItemDetailsURL, {}, function(data) {
						if (typeof data !== "undefined") {
							$('#'+containerName).find('.ajax-loader').hide();
							$('#'+containerName).append(data);
							var podLength = $('#'+containerName+' .pod').length;
							var newWidth = podLength * 200;
							$('#'+containerName).css('width',newWidth+'px').show();
							thdTablet.irg.loading = false;
						}
					});
				}
				break;
			}
		}
	}
}

// SSKU Match and fire
thdTablet.matchSSKU = function(){
	
	var sskuSelects = $('.ssku-option').length;
	var selectedOptions = [];
	var skuTotal = sSkuJson.ssku.length;
	var currProductId = $("#productId").data("productid");
	
	for (var i=0; i<sskuSelects; i++){
		var selected = $('.ssku-option').eq(i).find('.btn-select-overlay').data('value');
		var key = $('.ssku-option').eq(i).find('label').data('value');
		selectedOptions.push([key, selected]);
	};
	
	for (var i=0; i<skuTotal; i++){
		
		switch (sskuSelects){
			case 1:
				var valueA = sSkuJson.ssku[i].attributes[selectedOptions[0][0]];
				if(valueA == selectedOptions[0][1]){
					var productId = sSkuJson.ssku[i].itemId;
					var productName = sSkuJson.ssku[i].productName;
					if(productId != currProductId) {
						thdTablet.showProdDetails('/p/'+productName+'/'+productId+'/?showPLP=false');
					}
					break;
				}
			break;
			case 2:
				var valueA = sSkuJson.ssku[i].attributes[selectedOptions[0][0]];
				var valueB = sSkuJson.ssku[i].attributes[selectedOptions[1][0]];
				if(valueA == selectedOptions[0][1] && valueB == selectedOptions[1][1]){
					var productId = sSkuJson.ssku[i].itemId;
					var productName = sSkuJson.ssku[i].productName;
					if(productId != currProductId) {
						thdTablet.showProdDetails('/p/'+productName+'/'+productId+'/?showPLP=false');
					}
					break;
				}
			break;
			case 3:
				var valueA = sSkuJson.ssku[i].attributes[selectedOptions[0][0]];
				var valueB = sSkuJson.ssku[i].attributes[selectedOptions[1][0]];
				var valueC = sSkuJson.ssku[i].attributes[selectedOptions[2][0]];
				if(valueA == selectedOptions[0][1] && valueB == selectedOptions[1][1] && valueC == selectedOptions[2][1]){
					var productId = sSkuJson.ssku[i].itemId;
					var productName = sSkuJson.ssku[i].productName;
					if(productId != currProductId) {
						thdTablet.showProdDetails('/p/'+productName+'/'+productId+'/?showPLP=false');
					}
					break;
				}
			break;
		}
	}
};

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _CERTONA */


//Observations
var resx = {
	appid		: "homedepot01",
	top1		: 100000,
	top2		: 100000,
	links		: "",
	event		: "",
	itemid		: "",
	customerid	: "",
	pageid		: ""
};

// Resonance, Certona Product Recommendations
var recProds = {
		cSchema	: "",
		prodIds	: "",
		excProdIds : "",
		rBrand	: "",
		rPrice	: "", 
		rColor	: "", 
		rPrice	: "",
		rRating	: "",
		init: function() {	
			recProds.wrapper = $("#PRP");
			if (thdTablet.hasValue(recProds.cSchema)) {
			  if (certonaOn) {			  
				if (recProds.cSchema=='NA') {
					recProds.cSchema='';
				}
				if (recProds.wrapper.length != 0){
					recProds.getRecommendedProducts(); // Displaying recommendations then reporting
				} else {
					recProds.postObservations(); // Reporting observations
				}
			  }
			}
		},
		postObservations: function() {
			if (certonaOn) {
				resx.customerid = getUniqueUserIdFromUserActivityCookie();
				resx.links = getCallbackLinks();
				resx.itemid = getCallbackItemId();
				resx.event = getCallbackEvent();
				resx.cv2 = thdTouchCommon.localization.getStoreNum();
				
				if (useCertonaProd == undefined || 'true' != useCertonaProd) {
					resx.host = "qa.res-x.com";
				}
				$.getScript("/tablet/thirdparty/certona/resxclsx.js",function(){
					certonaResx.run();
					console.log("posting observations");
				});
			}
		},
		postEventObservations: function() {
			if (certonaOn) {
				certonaResx.run();
			}
		},
		injectSchema: function(prods) {
			if (undefined == prods) {
				return "";
			}
			var ca = prods.split(';');
			for(var i=0;i < ca.length;i++) {
				ca[i]=ca[i]+ '|' + recProds.cSchema;
			}
			return ca.toString();
		},
		getProductIds: function() {
			var ids = [];
			if ($("#productId").length > 0) {
				ids =  $("#productId").attr("productid");
			}
			return ids.toString();
		},
		getExcProductIds: function() {
			var ids = [];
			if ($(".plp-products")) {
				$(".plp-products").children(".pod").each(function(i){
					if (i < 25) {
						ids.push( $(this).data("productid"));
					}
				});
			}
			return ids.toString();
		},
		getRecommendedProducts: function() {
			var xURL = "/servlet/recommendedProducts";
			
			recProds.prodIds = recProds.getProductIds();
			xURL = xURL.setURLParam("prodIds",recProds.prodIds.toString().replace(/,/g,";"));
			
			recProds.excProdIds = recProds.getExcProductIds();
			xURL = xURL.setURLParam("exProdIds",recProds.excProdIds.toString().replace(/,/g,";"));
			xURL = xURL.setURLParam("cSchema", recProds.cSchema);
			xURL = xURL.setURLParam("levels",recProds.levels);
			xURL = xURL.setURLParam("rBrand",recProds.rBrand);
			xURL = xURL.setURLParam("rColor",recProds.rColor); 
			xURL = xURL.setURLParam("rPrice",recProds.rPrice); 
			xURL = xURL.setURLParam("rRating",recProds.rRating); 
			$.ajax({
				url			: xURL,
				dataType	: "html",
				success		: function (data) {
					recProds.drawRecommendations(data);
				},
				error		: function () {
					recProds.postObservations();
				},
				complete	: function() {
					if(storeHoursGlobal != undefined) {
						createCookie('THD_STORE_HOURS', storeHoursGlobal, '0.0417');
					}
				}
			});
		},
		drawRecommendations: function(data) {
			recProds.wrapper.html(data); 
			recProds.wrapper.find("h3").addClass("pad-side");
			var $wrp = $("#recProd_wrapper");
			var count = $wrp.attr("count");
			resx.pageid = $wrp.attr("pageId"); // Assign pageid 
			$wrp.children("ul").css("width", 320 * count/2 +"px" );
			var list = $("#recProd_wrapper").children("ul");
			list.addClass("pod-recProd");
			list.children("div").each(function(i){
				$(this).children("li").find("a").prepend( $("<img />", {src: getImageURL( $(this).children("li").attr("guid"),145 ) }));
			});
			dynamicRatings();
			if (count > 2) {
				recImgSwipe = new iScroll('recProd_wrapper',{
					snap : true,
					momentum : false,
					lockDirection : true,
					vscroll : false,
					hScrollbar : false,
					onScrollEnd: function () {
						var num=this.currPageX; 
						$('.swipable-nav a').removeClass("active");
						$('.swipable-nav li a:eq(' + num +')').addClass("active");
					}
				});
				
				//this is  temp fix - will make func out of this -mm
				whatAmI=phoneAgent();		
				navUser=navigator.userAgent;
				showSwipeNav=true;
				if(whatAmI=='Windows' || whatAmI=='BlackBerry'){
					var wPattern,catcher,catchMe,appVer;
					if(whatAmI=='Windows'){
						wPattern=/IEMobile\/\d*\.\d*/g; 
						catcher=wPattern.exec(navUser);
						catchMe=catcher[0].split('/');
						appVer=catchMe[1];
						if(appVer < 10) showSwipeNav=false;
					}
					if(whatAmI=='BlackBerry'){
						bPattern=/BlackBerry\s\d*/g; 
						catcher=bPattern.exec(navUser);
						catchMe=catcher[0].split(' ');
						appVer=catchMe[1];
						if(appVer >= 9800) {
							showImgNav=true;
							goBerry=true;
						}
						else showSwipeNav=false;
					}
				}
				
				if(showSwipeNav )	createSwipeCounter("recImgSwipe",recProds.wrapper, count/2 );
			}
			recProds.postObservations();
		}
};

function getUniqueUserIdFromUserActivityCookie() {
	var startsWithName = "WC_USERACTIVITY_";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++){
		var c =(ca[i]);
		if (c.indexOf(startsWithName) != -1 && c!=startsWithName ){
			var id = c.substring(c.lastIndexOf('_')+1, c.indexOf('='));
			if (id != "-1002") {
				return id;
			} 
		}
	}
	return "";
}




/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _OTHER */






/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */
/* _DOCUMENT READY */


$(document).ready(function(){
	
	// Calculates Ratings Stars
	thdTablet.dynamicRatings();

	// Initialize the search bar behaviors
	thdTablet.searchBoxBehavior();

	//Ajax call to load Shop All navigation
	thdTablet.loadTopLevelNav();

	//Set shop all state to Open or Closed on initial page load
	thdTablet.setShopAllState();

	// Binding Touch to Shop All Dropdown
	$('.thdTablet-shop-all-trigger').on('touchend', function(e) {
		thdTablet.toggleShopAll();
	});

	//Highlight header
	thdTablet.highlightHeader();
	
	//Initiate Localization
	if (cookieManager != undefined) {
		thdTouchCommon.localization.getStoreNum();
	}
	
	if(thdTablet.plp){
		// INT PLP Template Methods
		thdTablet.int_PLP();
		
	}else if(thdTablet.pip){
		// INT PIP Template Methods
		thdTablet.int_PIP();
		
	}else if(thdTablet.storefinder){
		// INT Storefinder Template Methods
		thdTablet.int_STOREFINDER();
		
	}else if(thdTablet.home){
		// INT Home Template Methods
		thdTablet.positionElements();
		thdTablet.scrolltest();
		
	}

		// set up click/tap panels
	$('.cardFlip').hammer().on('swipe', function(ev){
		if (ev.gesture.direction == 'right') {
		$(this).toggleClass('flip');
		};
	});
	
// Let look and see whats in the obj through the console
	thdTablet.log(thdTablet);
});



