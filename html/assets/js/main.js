'use strict';
var $html = $('html'),
	$win = $(window),
	navbar = $('.navbar-nav'),
	MEDIAQUERY = {};
MEDIAQUERY = {
	desktopXL: 1200,
	desktop: 992,
	tablet: 768,
	mobile: 576,
	phone: 480
};
var navbarHandler = function navbarHandler() {
	var elem = $('.navbar-nav'),
		$this = void 0;
	navbar.on('mouseleave', function(e) {
		if (!isSmallDevice()) {
			$(this).parents('.navbar').next('.header__backdrop').fadeOut(50).remove();
		}
	});
	$(document).on('click touchstart', '.header__backdrop', function(e) {
		$(this).fadeOut(50).remove();
	});
};
var toggleClassOnElement = function toggleClassOnElement() {
	var toggleAttribute = $('*[data-toggle-class]');
	toggleAttribute.each(function() {
		var $this = $(this);
		var toggleClass = $this.attr('data-toggle-class');
		var outsideElement = void 0;
		var toggleElement = void 0;
		typeof $this.attr('data-toggle-target') !== 'undefined' ? toggleElement = $($this.attr('data-toggle-target')) : toggleElement = $this;
		$this.on('click', function(e) {
			if ($this.hasClass('navbar-toggler') || $this.hasClass('navbar__close')) {
				if (!$('.navbar').next('.header__backdrop').length) {
					$('<div class="header__backdrop"></div>').insertAfter($('.navbar'));
					$('.header__backdrop').fadeIn(250);
				} else {
					$('.navbar').next('.header__backdrop').fadeOut(250).remove();
				}
			}
			if ($this.attr('data-toggle-type') !== 'undefined' && $this.attr('data-toggle-type') == 'on') {
				toggleElement.addClass(toggleClass);
			} else if ($this.attr('data-toggle-type') !== 'undefined' && $this.attr('data-toggle-type') == 'off') {
				toggleElement.removeClass(toggleClass);
			} else {
				toggleElement.toggleClass(toggleClass);
			}
			e.preventDefault();
			if ($this.attr('data-toggle-click-outside')) {
				outsideElement = $($this.attr('data-toggle-click-outside'));
				$(document).on('mousedown touchstart', toggleOutside);
			};
		});
		var toggleOutside = function toggleOutside(e) {
			if (outsideElement.has(e.target).length === 0 && !outsideElement.is(e.target) && !toggleAttribute.is(e.target) && toggleElement.hasClass(toggleClass)) {
				toggleElement.removeClass(toggleClass);
				$(document).off('mousedown touchstart', toggleOutside);
			}
		};
	});
};
var promoSlider = {
	slider: $('.js-promo-carousel'),
	sliderSettings: function sliderSettings() {
		return {
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			focusOnSelect: false,
			arrows: false,
			dots: true,
			speed: 500
		};
	},
	init: function init() {
		var width = void 0;
		if (promoSlider.slider.length) {
			width = $('body').width() - 30 >= promoSlider.slider.closest('.wrapper').width() ? promoSlider.slider.closest('.wrapper').width() : $('body').width() - 30;
			if ($(window).width() < 760) {
				width = width + 30;
			}
			promoSlider.slider.parent().width(width);
			promoSlider.slider.slick(promoSlider.sliderSettings());
			$(window).on('resize', function() {
				width = $('body').width() - 30 >= promoSlider.slider.closest('.wrapper').width() ? promoSlider.slider.closest('.wrapper').width() : $('body').width() - 30;
				if ($(window).width() < 760) {
					width = width + 30;
				}
				promoSlider.slider.parent().width(width);
			});
		}
	}
};
$(function() {
	svg4everybody();
	navbarHandler();
	toggleClassOnElement();
	promoSlider.init();
	$('.js-office-link').unbind();
	$('.js-office-link').on('click', function(e) {
		var $this = $(this);
		e.preventDefault(); //$(this).closest('.b-office').toggleClass('b-office_open');
		if ($this.closest('.b-office').is('.is-open')) {
			$this.addClass('is-open');
			$this.closest('.b-office').find('.b-office-full').slideUp(function() {
				$this.closest('.b-office').removeClass('is-open');
			});
		} else {
			$this.removeClass('is-open');
			$this.closest('.b-office').find('.b-office-full').slideDown(function() {
				$this.closest('.b-office').addClass('is-open');
			});
		}
	});
});
