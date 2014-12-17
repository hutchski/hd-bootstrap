/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'hd-custom\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-free-shipping-symbol' : '&#xe000;',
			'icon-open-box-symbol' : '&#xe002;',
			'icon-close-symbol' : '&#xe003;',
			'icon-back-symbol' : '&#xe004;',
			'icon-online-only-symbol' : '&#xe005;',
			'icon-verified-symbol' : '&#xe006;',
			'icon-shipping' : '&#xe007;',
			'icon-close' : '&#xe008;',
			'icon-attention' : '&#xe009;',
			'icon-three-sixty-view' : '&#xe00a;',
			'icon-magnify' : '&#xe00b;',
			'icon-more-views' : '&#xe00c;',
			'icon-more-information-symbol' : '&#xe00d;',
			'icon-link-out-symbol' : '&#xe00e;',
			'icon-chevron-symbol' : '&#xe00f;',
			'icon-minus-symbol' : '&#xe010;',
			'icon-plus-symbol' : '&#xe011;',
			'icon-lock-symbol' : '&#xe012;',
			'icon-star-symbol' : '&#xe013;',
			'icon-magnify-symbol' : '&#xe014;',
			'icon-product-info' : '&#xe015;',
			'icon-bopis' : '&#xe016;',
			'icon-bopis-boss-symbol' : '&#xe001;',
			'icon-play' : '&#xe017;',
			'icon-google-plus' : '&#xe018;',
			'icon-mobile-symbol' : '&#xe019;',
			'icon-facebook' : '&#xe01b;',
			'icon-youtube' : '&#xe01c;',
			'icon-pinterest' : '&#xe01d;',
			'icon-rss' : '&#xe01e;',
			'icon-cart-symbol' : '&#xe01a;',
			'icon-local-ad-symbol' : '&#xe01f;',
			'icon-list-symbol' : '&#xe020;',
			'icon-arrow-up-sysmbol' : '&#xe021;',
			'icon-arrow-down-sysmbol' : '&#xe022;',
			'icon-poi-symbol' : '&#xe023;',
			'icon-form-check-solid' : '&#xe024;',
			'icon-form-check-outline' : '&#xe025;',
			'icon-my-account-symbol' : '&#xe026;',
			'icon-how-to-symbol' : '&#xe027;',
			'icon-more-symbol' : '&#xe028;',
			'icon-solid-down-arrow-symbol' : '&#xe029;',
			'icon-more-options-symbol' : '&#xe02a;',
			'icon-twitter' : '&#xe02b;',
			'icon-hd-logo' : '&#xe02c;',
			'icon-credit-center-symbol' : '&#xe02d;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};