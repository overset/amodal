/**
 * amodal.js - v0.3 - ANOTHER modal - jquery plugin - MIT license
 * Author: Jim Palmer
 */
(function ($) {
    $.fn.amodal = function (options) {
        var close = function (m) {
            $(['.amodal','.amodalborder','.amodalmask','.amodalmaskall']
                .join(m + ',') + m).remove();
            if (!$('.amodal').length) {
                $(document).unbind('keydown.amodal')
                $(window).unbind('resize.amodal');
            }
        };
        // if no options arg passed - destroy newest amodal (FILO)
        if (typeof options == 'undefined') {
            var amodal = this.prevAll('.amodal:first')[0] || {},
                ami = (amodal.className || '').replace(/[^0-9]/g, '');
            ami && close(ami);
            return this;
        }
        var opts = $.extend({
                mask: true,          // mask target area
                maskAll: false,      // mask entire document
                windowResize: true,  // resize modal on window.onResize
                resizeFade: true,    // control the faded border onResize
                defOpacity: 0.4,     // default mask and border opacity
                escCancel: true,     // ESC key closes modal
                zStart: 1300,        // beginning z-index value for modal
                borderPad: 10,       // modalborder padding in px
                centerScroll: true,  // recenter relative to scroll in masked area
                close: '&times;'     // amodalclose - set to string or true to display
            }, typeof options == 'object' ? options : {}),
            body = $(document.body),
            mIndex = body.find('.amodal').length;
            message = typeof options == 'string' ? options : options.message || '',
            divMarkup = function (c, m, v) {
                return '<div class="' + c + ' ' + c + m + '">' + (v || '') + '</div>';
            },
            reposition = function (target, m) {
                var selSuffix = typeof m != 'undefined' ? m : '',
                    amodal = target.prevAll('.amodal' + selSuffix + ':first'),
                    height = $(this).outerHeight(1),
                    scrollTop = $(window).scrollTop(),
                    winHeight = $(window).height(),
                    tarOffset = target.offset(),
                    tarHeight = opts.centerScroll &&
                                Math.min(tarOffset.top + target.outerHeight(1),
                                         scrollTop + winHeight) -
                                Math.max(tarOffset.top, scrollTop) ||
                                target.outerHeight(1),
                    top = Math.max(opts.borderPad,
                            Math.max(target.position().top, scrollTop) +
                                (tarHeight / 2) -
                                (height / 2)),
                    overScroll = (winHeight + scrollTop);
                amodal.css({
                        top: top,
                        left: Math.max(opts.borderPad, Math.min(
                            $(window).width() - $(this).outerWidth(1) - opts.borderPad,
                            target.position().left +
                                (target.outerWidth(1) - $(this).outerWidth(1)) / 2))
                    })
                    .next('.amodalborder' + selSuffix).css({
                        left: (parseInt(amodal.css('left')) || 0 ) - opts.borderPad,
                        top: (parseInt(amodal.css('top')) || 0 ) - opts.borderPad,
                        height: amodal.height(),
                        width: amodal.width()
                    })
                    .next('.amodalmask' + selSuffix).css(target.position()).css({
                        width: target.outerWidth(1),
                        height: target.outerHeight(1)
                    });
            };
        if (opts.windowResize)
            $(window).unbind('resize.amodal').bind('resize.amodal', function () {
                opts.resizeFade && $('.amodalborder').hide();
                var ct = $(document).data('amodal.resizeTO');
                if (ct != null)
                    $(document).data('amodal.resizeTO', clearTimeout(ct));
                $(document.body).children('.amodalmaskall')
                    .css({width:$(window).width(), height:$(window).height()});
                $(document).data('amodal.resizeTO', setTimeout(function () {
                    $('.amodal').each(function () {
                        reposition.call(this, $(this).data('target'));
                    });
                    opts.resizeFade && $('.amodalborder').fadeIn(100);
                    $(document).data('amodal.resizeTO', null);
                }, 5));
            });
        if (opts.escCancel)
            $(document).unbind('keydown.amodal').bind('keydown.amodal', function (e) {
                if (e.keyCode == 27 || e.charCode == 27)
                    close($('.amodal').length);
            });
        return this.each(function () {
            var target = $(this).length ? $(this) : $(document.body),
                z = opts.zStart + (mIndex * 3) + 300,
                m = ++mIndex,
                maskCSS = {opacity: opts.defOpacity, zIndex: opts.zStart};
            if (opts.maskAll)
                body.append(divMarkup('amodalmaskall', m))
                    .find('.amodalmaskall' + m).css(maskCSS).css({
                        top: 0, left:0,
                        width: $(window).width(), height:$(window).height()
                    }).end()
            target.before(divMarkup('amodal', m))
                .before(divMarkup('amodalborder', m))
                .before(opts.mask && !opts.maskAll ? divMarkup('amodalmask', m) : '')
                .prevAll('.amodal' + m + ':first')
                    .html((opts.close ? divMarkup('amodalclose', m, opts.close) : '') + message)
                    .css(opts.css || {}).css({display:'block', zIndex:z--})
                    .data('target', target)
                    .find('.amodalclose').click(function () {
                        target.amodal();
                    }).end()
                    .each(function () {
                        reposition.call(this, target, m);
                    })
                .next('.amodalborder' + m)
                    .css({opacity: opts.defOpacity, zIndex:z--})
                .next('.amodalmask' + m).css(maskCSS);
        });
    };
})(jQuery);
