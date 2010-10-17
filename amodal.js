/**
 * amodal.js - v0.1 - ANOTHER modal - jquery plugin - MIT license
 * Author: Jim Palmer
 */
(function ($) {
	$.fn.amodal = function (options) {
		var close = function (m) {
			$(['.amodal','.amodalborder','.amodalmask'].join(m + ',') + m).remove();
		};
		// if no options arg passed - destroy newest amodal (FILO)
		if (typeof options == 'undefined') {
			var amodal = this.siblings('.amodal')[0] || {},
				ami = (amodal.className || '').replace(/[^0-9]/g, '');
			if (ami)
				close(ami);
			return this;
		}
		var opts = $.extend({
				mask: true,			// mask target area
				maskAll: false,		// mask entire document
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
			};
		if (opts.escCancel)
			$(document).unbind('keydown.amodal').bind('keydown.amodal', function (e) {
				if (e.keyCode == 27 || e.charCode == 27)
					close($('.amodal').length);
				!$('.amodal').length && $(this).unbind('keydown.amodal');
			});
		return this.each(function () {
			var target = $(this).length ? $(this) : body,
				z = opts.zStart + (mIndex * 3) + 300,
				m = ++mIndex,
				maskCSS = {
					width:$(window).width(),
					height:$(window).height(),
					opacity:opts.defOpacity,
					zIndex:opts.zStart
				};
			if (opts.maskAll)
				body.append(divMarkup('amodalmask', m))
					.find('.amodalmask' + m).css(maskCSS).end()
			target.before(divMarkup('amodal', m) + divMarkup('amodalborder', m) +
					(opts.mask && !opts.maskAll ? divMarkup('amodalmask', m) : ''))
				.siblings('.amodal' + m)
					.html((opts.close ? divMarkup('amodalclose', m, opts.close) : '') + message)
					.each(function () {
						$(this).css({
							top:Math.max(10, target.offset().top - ($(this).height() / 2)),
							left:target.offset().left + 
								(target.outerWidth(1) - $(this).outerWidth(1)) / 2,
							zIndex:z--
						});
					})
					.find('.amodalclose').click(function () { 
						target.amodal();
					}).end()
				.end()
				.siblings('.amodalborder' + m).each(function () {
					var p = $(this).siblings('.amodal' + m);
					$(this).css({
						left:(parseInt(p.css('left')) || 0 ) - opts.borderPad, 
						top:(parseInt(p.css('top')) || 0 ) - opts.borderPad, 
						height:p.height(), 
						width:p.width(), 
						opacity:opts.defOpacity, 
						zIndex:z--
					});
				}).end()
				.siblings('.amodalmask' + m).css($.extend(maskCSS, target.offset(), {
					width:target.outerWidth(1),
					height:target.outerHeight(1)
				})).end();
		});
	};
})(jQuery);
