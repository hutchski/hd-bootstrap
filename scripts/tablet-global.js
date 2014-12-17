THDModuleLoader = null;

function isAbsoluteUrl(urlString) {
	var pat = /^https?:\/\//i;
	if (pat.test(urlString))
	{
	    return true;
	}
	return false;
}

THDModuleLoader = (function() {

	var THDModuleDependencies = [];

	return {

		$includeModule: function(moduleName) {
			var _body = document.getElementsByTagName('body')[0];

			//create new element
			var newScript = document.createElement('script');
			var newCSS = document.createElement('link');

			// paths to correct folders
			var jsDependencyPath = 'http://' + getWCSHostNameNonSecure() + '/static/scripts/library/';
			var cssModulePath = 'http://' + getWCSHostNameNonSecure() + '/static/styles/modules/';
			var jsModulePath = 'http://' + getWCSHostNameNonSecure() + '/static/scripts/modules/';

			//set the source for each variable
			newScript.type = 'text/javascript';
			newScript.src = jsModulePath + moduleName + '.js';

			//set type for each new element
			newCSS.rel = 'stylesheet';
			newCSS.href = cssModulePath + moduleName + '.css';

			//check for dependencies and append accordingly
			for(var i = 1; i < arguments.length; i++) {
				// check if dependency exist in the global array THDModuleDependencies
				// If it doesn not exist then add it to the page and update the array
				if(jQuery.inArray(arguments[i], THDModuleDependencies) === -1) {
					//console.log(arguments[i] + '.js has been added to the page');

					var newDependency = document.createElement('script');
					newDependency.src = jsDependencyPath + arguments[i] + '.js';

					THDModuleDependencies.push(arguments[i]);

					_body.appendChild(newDependency);
				}
			}

			//append script and css for module
			_body.appendChild(newScript);
			_body.appendChild(newCSS);
		},

		$includeJS: function(url) {
			var _body = document.getElementsByTagName('body')[0];
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			if(!isAbsoluteUrl(url)) {
				url = "http://" + getWCSHostNameNonSecure() + url;
			}
			newScript.src = url;
			_body.appendChild(newScript);
		},

		$includeCSS: function(url) {
			var _body = document.getElementsByTagName('body')[0];
			var newCSS = document.createElement('link');
			newCSS.rel = 'stylesheet';
			if(!isAbsoluteUrl(url)) {
				url = "http://" + getWCSHostNameNonSecure() + url;
			}
			newCSS.href = url;
			_body.appendChild(newCSS);
		}

	};
})();

var THD = (window.THD) ? window.THD : {};
THD.Utils = (THD.Utils) ? THD.Utils : {};
THD.Utils.GestureHandler = (function ($, THD) {

		var self= this;
			self.ui = {},
			self.clickbuster = {};
			

		self.ui.FastButton = function(element, handler) {
		  this.element = element;
		  this.handler = handler;

		  element.addEventListener('touchstart', this, false);
		  element.addEventListener('click', this, false);
		};

		self.ui.FastButton.prototype.handleEvent = function(event) {
		  switch (event.type) {
			case 'touchstart': this.onTouchStart(event); break;
			case 'touchmove': this.onTouchMove(event); break;
			case 'touchend': this.onClick(event); break;
			case 'click': this.onClick(event); break;
		  }
		};

		self.ui.FastButton.prototype.onTouchStart = function(event) {
		  event.stopPropagation();

		  this.element.addEventListener('touchend', this, false);
		  document.body.addEventListener('touchmove', this, false);

		  this.startX = event.touches[0].clientX;
		  this.startY = event.touches[0].clientY;
		};

		self.ui.FastButton.prototype.onTouchMove = function(event) {
		  if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
			  Math.abs(event.touches[0].clientY - this.startY) > 10) {
			this.reset();
		  }
		};

		self.ui.FastButton.prototype.onClick = function(event) {
		  event.stopPropagation();
		  this.reset();
		  this.handler(event);

		  if (event.type == 'touchend') {
			self.clickbuster.preventGhostClick(this.startX, this.startY);
		  }
		};

		self.ui.FastButton.prototype.reset = function() {
		  this.element.removeEventListener('touchend', this, false);
		  document.body.removeEventListener('touchmove', this, false);
		};

		self.clickbuster.preventGhostClick = function(x, y) {
		  self.clickbuster.coordinates.push(x, y);
		  window.setTimeout(self.clickbuster.pop, 2500);
		};

		self.clickbuster.pop = function() {
		  self.clickbuster.coordinates.splice(0, 2);
		};

		self.clickbuster.onClick = function(event) {
		  for (var i = 0; i < self.clickbuster.coordinates.length; i += 2) {
			var x = self.clickbuster.coordinates[i];
			var y = self.clickbuster.coordinates[i + 1];
			if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
			  event.stopPropagation();
			  event.preventDefault();
			}
		  }
		};


		/**
		* @function - Builds tap event and intercepts mouseover events for touch devices. fast click functionality taken from https://developers.google.com/mobile/articles/fast_buttons
		*/
		function initTouch() {
			THD.Utils.GestureHandler.touch = false;
			
			var is_touch = 'ontouchstart' in document.documentElement;
			if(is_touch){

				document.addEventListener('click', self.clickbuster.onClick, true);
				self.clickbuster.coordinates = [];

				THD.Utils.GestureHandler.touch = true;
			}
		}
		

		// PUBLIC FUNCTIONS
		return {
			init: function(){
				initTouch();
			}
		};

	}(jQuery, THD));

	$(THD.Utils.GestureHandler.init);

	//Overloaded this method from global.js to fix overlays on content pages. 
	//This goes through proxy on MW code instead of directly hitting www content. 
	function attachOverlays(context) {
		var $overlays = (context) ? $('.overlayTrigger', context) : $('.overlayTrigger');

		$overlays.each(function(i) {
			var $this = $(this),
				useConfig = '',
				theRel = ($this.attr('rel')) ? $this.attr('rel').toLowerCase() : '';
			switch (theRel) {
			case 'bopis':
				bopisHrefReplace($this); //defect #15052
				useConfig = overlayConfigs.bopis;
				break;
			case 'quickview':
				useConfig = overlayConfigs.quickview;
				break;
			case 'gallery':
				useConfig = overlayConfigs.gallery;
				break;
			case 'modal':
				useConfig = overlayConfigs.modal;
				break;
			case 'content':
				var url = $this.attr('href');
				url = '/servlet/ContentProxy?src=' + url;
				$this.attr('href', url);
				useConfig = overlayConfigs.content;
				break;
			case 'custom':
				// Does not attach Fancybox
				$this.click(HD_lightbox);
				break;
				// All all new types above here otherwise you will mess up the default.
			case 'nonmodal':
				// fall through
			default:
				useConfig = overlayConfigs.nonModal;
				break;
			}

			if (useConfig) {
				$this.fancybox(useConfig);
			}
			$this.css({
				"visibility": "visible"
			});

		});
	}