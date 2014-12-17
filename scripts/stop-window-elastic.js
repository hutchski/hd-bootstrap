$(document).ready(function(){
	$(document).on('touchmove',function(e){
		if(!$('#thdTablet-searchFocus').is(":focus")){ // fix for typeahead
			e.preventDefault();
		};
	});
	$('body').on('touchmove','.scrollable, .thdtablet-scrollable',function(e) {
		
		e.stopPropagation();
		
		var contentHeight = $(this).innerHeight();
		var scrollHeight = $(this).prop('scrollHeight');
		var scrollX = $(this).hasClass('scroll-x');
		
		thdTablet.log('TagName: '+e.target.tagName+' | Current Height: '+contentHeight+' | Scroll Height: '+scrollHeight);
		
		if (e.currentTarget.scrollTop === 0) {
			if(contentHeight == scrollHeight && scrollX === false){
				e.preventDefault();
			}else if(contentHeight < scrollHeight){
				e.currentTarget.scrollTop = 1;
			}
		} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
			if(contentHeight == scrollHeight && scrollX === false){
				e.preventDefault();
			}else if(contentHeight < scrollHeight){
				e.currentTarget.scrollTop -= 1;
			}
		}
	});
	
	// Specific to Home Page Template
	$(document).on('touchstart', '#sliderwrapper', function(){
		$('article').removeClass('scrollable');
	});
	$(document).on('touchend', '#sliderwrapper', function(){
		$('article').addClass('scrollable');
	});
});