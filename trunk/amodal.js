/**
 * amodal.js - v0.2 - ANOTHER modal - jquery plugin - MIT license
 * Author: Jim Palmer
 */
(function ($) {
	$.fn.amodal = function (options) {
		var close = function (m) {
			$(['.amodal','.amodalborder','.amodalmask'].join(m + ',') + m).remove();
			if (!$('.amodal').length) {
				$(document).unbind('keydown.amodal')
				$(window).unbind('resize.amodal');
			}
		};
		// if no options arg passed - destroy newest amodal (FILO)
		if (typeof options == 'undefined') {
			var amodal = this.siblings('.amodal')[0] || {},
				ami = (amodal.className || '').replace(/[^0-9]/g, '');
			ami && close(ami);
			return this;
		}
		var opts = $.extend({
				mask: true,			// mask target area
				maskAll: false,		// mask entire document
				windowResize: true,	// resize modal on window.onResize
				defOpacity: 0.6,	// default mask and border opacity
				escCancel: true,	// ESC key closes modal
				zStart: 1300,		// beginning z-index value for modal
				borderPad: 10,		// modalborder padding in px
				close: ' '			// amodalclose - set to string or true to display
			}, typeof options == 'object' ? options : {}),
			body = $(document.body),
			mIndex = body.find('.amodal').length;
			message = typeof options == 'string' ? options : options.message || '',
			divMarkup = function (c, m, v) {
				return '<div class="' + c + ' ' + c + m + '">' + (v || '') + '</div>';
			},
			reposition = function (target, m) {
				var selSuffix = typeof m != 'undefined' ? m : '',
					amodal = target.siblings('.amodal' + selSuffix);
				amodal.css({
						top: Math.max(opts.borderPad,
							target.offset().top + 
								(target.outerHeight(1) / 2) - 
								($(this).outerHeight(1) / 2)),
						left: Math.max(opts.borderPad, Math.min(
							$(window).width() - $(this).outerWidth(1) - opts.borderPad,
							target.offset().left + 
								(target.outerWidth(1) - $(this).outerWidth(1)) / 2))
					}).end()
					.siblings('.amodalborder' + selSuffix).css({
						left: (parseInt(amodal.css('left')) || 0 ) - opts.borderPad,
						top: (parseInt(amodal.css('top')) || 0 ) - opts.borderPad,
						height: amodal.height(),
						width: amodal.width()
					}).end()
					.siblings('.amodalmask' + selSuffix).css($.extend(target.offset(), {
						width: target.outerWidth(1),
						height: target.outerHeight(1)
					}));
			};
		if (opts.windowResize)
			$(window).unbind('resize.amodal').bind('resize.amodal', function () {
				$(body).children('.amodalmask')
					.css({width: $(window).width(), height:$(document).height()});
				if (!$(document).data('amodal.resizeTO'))
					$(document).data('amodal.resizeTO', setTimeout(function () {
						$('.amodal').each(function () {
							reposition.call(this, $(this).data('target'));
						});
						$(document).data('amodal.resizeTO', null)
					}, 5));
			});
		if (opts.escCancel)
			$(document).unbind('keydown.amodal').bind('keydown.amodal', function (e) {
				if (e.keyCode == 27 || e.charCode == 27)
					close($('.amodal').length);
			});
		return this.each(function () {
			var target = $(this).length ? $(this) : $(body),
				z = opts.zStart + (mIndex * 3) + 300,
				m = ++mIndex,
				maskCSS = {opacity: opts.defOpacity, zIndex: opts.zStart};
			if (opts.maskAll)
				body.append(divMarkup('amodalmask', m))
					.find('.amodalmask' + m).css(maskCSS).css({
						width: $(window).width(), height:$(document).height()
					}).end()
			target.before(divMarkup('amodal', m) + divMarkup('amodalborder', m) +
					(opts.mask && !opts.maskAll ? divMarkup('amodalmask', m) : ''))
				.siblings('.amodal' + m)
					.html((opts.close ? divMarkup('amodalclose', m, opts.close) : '') + message)
					.css(opts.css || {}).css({display:'block', zIndex:z--})
					.data('target', target)
					.find('.amodalclose').click(function () { 
						target.amodal();
					}).end()
					.each(function () {
						reposition.call(this, target, m);
					})
				.end()
				.siblings('.amodalborder' + m).css({opacity: opts.defOpacity, zIndex:z--}).end()
				.siblings('.amodalmask' + m).css(maskCSS);
		});
	};
})(jQuery);