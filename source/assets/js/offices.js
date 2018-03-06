if ( typeof ymaps !== 'undefined' ) {
	var officesAtms = {
		isSend: null,
		partnerAtmItems:false,
		officesItems:false,
		itemsListMap:false,
		itemsListCollection:false,
		itemsDetailMap:false,
		listType: false,
		init: function(){

			$('.b-switch-item').unbind();

			officesAtms.changeFilterInit();
			officesAtms.filterFormSubmitInit();
			// officesAtms.getData();

			officesAtms.listType = $('[listType]').attr( 'listType' );
			ymaps.ready(function(){
				
				
				function GeolocationButton (params) {
				
        GeolocationButton.superclass.constructor.call(this, params);

        // Расширяем опции по умолчанию теми, что передали в конструкторе.
					this.geoLocationOptions = ymaps.util.extend({
						// Не центрировать карту.
						noCentering: false,
						// Не ставить метку.
						noPlacemark: false,
						// Не показывать точность определения местоположения.
						noAccuracy: false,
						// Режим получения наиболее точных данных.
						enableHighAccuracy: true,
						// Максимальное время ожидания ответа (в миллисекундах).
						timeout: 10000,
						// Максимальное время жизни полученных данных (в миллисекундах).
						maximumAge: 1000
					}, params.options);
				}

				officesAtms.itemsListMap = new ymaps.Map( "mapContainer", {
					center: [55.76, 37.64],
					zoom: 15
				});
				officesAtms.itemsListMap.controls
					// Кнопка изменения масштаба
					.add('zoomControl');
					
				var baseImageURL = '/img/';
				/*var myButton = new ymaps.control.Button({
					data: {
						image: baseImageURL + 'select-arrow.jpg',
						title: 'Определить местоположение'
					},
					options: {
						// Режим получения наиболее точных данных.
						enableHighAccuracy: true
					}
				});
				officesAtms.itemsListMap.controls
					// Кнопка изменения масштаба
					.add('myButton');*/
					var btnTop2 = new ymaps.control.Button({
						data: {
							content: 'Определить мое местоположение',
							title: 'Определить мое местоположение'
						}
					}, {
						layout: ymaps.templateLayoutFactory.createClass(
							// Если кнопка не нажата, к ней применится css-стиль 'myButton'
							// Если кнопка нажата, к ней применятся css-стили 'myButton' и 'myButtonSelected'.
							"<div class='btn-standart -form -green js-btn-reg' style='cursor: pointer'>" +
							"$[data.content]" +
							"</div>"
						)
					});
					btnTop2.events
						.add('click', function () {
							//officesAtms.itemsListMap.behaviors.enable('drag');
							if (navigator.geolocation) {
								// Запрашиваем текущие координаты устройства.
								navigator.geolocation.getCurrentPosition(
									ymaps.util.bind(function (position){
									var location = [position.coords.latitude, position.coords.longitude],
										accuracy = position.coords.accuracy,
										map = officesAtms.itemsListMap;/*,
										options = this.geoLocationOptions,
										placemark = this._placemark,
										circle = this._circle;*/

									// Смена центра карты (если нужно)
									//console.log(location);
									//if (0 && !options.noCentering) {
										map.setCenter(location, 15);
									//}

									// Установка метки по координатам местоположения (если нужно).
									//if (0 && !options.noPlacemark) {/*
										// Удаляем старую метку.
										/*if (placemark) {
											map.geoObjects.remove(placemark);
										}*/
										/*this._placemark = */placemark = new ymaps.Placemark(location, {}, { preset: 'geolocation#icon' });
										map.geoObjects.add(placemark);
										// Показываем адрес местоположения в хинте метки.
										function getLocationInfo (point) {
											ymaps.geocode(point.geometry.getCoordinates())
												.then(function (res) {
													var result = res.geoObjects.get(0);

													if (result) {
														point.properties.set('hintContent', result.properties.get('name'));
													}
												});
										};
										getLocationInfo(placemark);
									//}

									// Показываем точность определения местоположения (если нужно).
									if (0 && !options.noAccuracy) {/*
										// Удаляем старую точность.
										if (circle) {
											map.geoObjects.remove(circle);
										}
										this._circle = circle = new ymaps.Circle([location, accuracy], {}, { opacity: 0.5 });
										map.geoObjects.add(circle);*/
									}} , this),
									ymaps.util.bind(function (err){
									officesAtms.itemsListMap.hint
									.show(err.toString())
									.hide(2000);}, this)/*,
									this.geoLocationOptions*/
								);
							}
							/*else {
								this.handleGeolocationError('Ваш броузер не поддерживает GeolocationAPI.');
							}*/
						})
						.add('deselect', function () {
							//officesAtms.itemsListMap.behaviors.disable('drag');
						} );

					officesAtms.itemsListMap.controls.add(btnTop2, {left: 5, top: 5});
				/*if ($('html').hasClass('bx-touch'))
				{
					officesAtms.itemsListMap.behaviors.disable('drag');
					//officesAtms.itemsListMap.controls.remove('zoomControl');
					//officesAtms.itemsListMap.controls.add('mapTools');

					var btnTop = new ymaps.control.Button({
						data: {
							content: 'Включить карту'
						}
					});
					btnTop.events
						.add('select', function () {
							officesAtms.itemsListMap.behaviors.enable('drag');
						})
						.add('deselect', function () {
							officesAtms.itemsListMap.behaviors.disable('drag');
						} );

					officesAtms.itemsListMap.controls.add(btnTop, {left: 5, top: 5});
				}*/
			});
		},
		getData:function(){
			$('#filterForm').submit();
		},
		filterFormSubmitInit:function(){
			$('#filterForm').bind('submit', function(e) {
				var handlerUrl = $(this).data('action');
				if ( null !== officesAtms.isSend ){
					return false;
				}
				$('.b-map-loading').show();
				e.preventDefault();
				function responseHandler( response ){
					// console.log(response);
					response = $.parseJSON( response );
					
					if (window.console && typeof window.console.log === "function") {
						console.log(" распарсенный ответ");
						console.log(response);
					}		

					if(response.status == 'ok'){
						if ( officesAtms.listType == 'offices' ) {
							officesAtms.officesItems = response.officeItems;
							itemsList = response.officeItems;
						}else{
							officesAtms.atmsItems = response.atmItems;
							itemsList = response.atmItems;

						}

						$('#itemsListContainer').html( response.listItemsHtml );
						console.log(itemsList);
						officesAtms.showItemDetailInit();
						officesAtms.showDetailMapInit( itemsList );

						setTimeout(function(){ officesAtms.showItemsInMap();  }, 300);

						officesAtms.isSend = null;


					} else {
						console.log(response.message);
						officesAtms.isSend = null;


					}
				}
				officesAtms.isSend = $(this).ajaxSubmit({
					type: 'POST',
					dataType: 'html',
					cache: false,
					target:    handlerUrl,
					url:    handlerUrl,
					success:    responseHandler
				});
			});

		},
		showDetailMapInit:function( itemsList ){

			$('.js-office-map').each(function(ind, el)
			{
				var $mapNode = $(el);
				var mapCenter = $mapNode.data('center') || "55.76, 37.64";
				var mapZoom = $mapNode.data('zoom') || 16;

				ymaps.ready(function()
				{
					var map = new ymaps.Map($mapNode.get()[0], {
						'center': mapCenter.split(','),
						'zoom': mapZoom
					});

					var itemId = parseInt( $mapNode.data('itemid') );
					if ( typeof itemsList[ itemId ] === 'undefined' ) {
						console.log('not found item');
						return false;
					}

					var item = itemsList[itemId];
					var itemPlacemark = new ymaps.Placemark(mapCenter.split(','), {
						balloonContent: '<b>'+ item['name'] +'</b>1<br>' + item['address']
					}, {
						iconImageHref: '/img/map-mark.png',
						iconImageSize: [23, 35],
						iconImageOffset: [-11.5, -35]
					});

					map.geoObjects.add(itemPlacemark);
				});
			});
		},
		changeFilterInit:function(){

			$('[id^="filter_"]').change(function(){
				$('#filterForm').submit();
			});

			$('#searchQuery').keyup(function( event ){
				if ( event.which == 13 || event.keyCode == 13 ){
					$('#filterForm').click();
				}
			});

			$('[id^="filters_typeList"]').change(function(){




				$('.b-calculator-row').next('.b-calculator-row').next('.b-calculator-row').next('.b-calculator-row').hide();
				$('[id^="button"]').show();
				if ($(this).val() == 'Бизнес'){

				$('[id^="departmentf"]').show();
				//$('[id^="filters_typeList"]  :first').attr("selected", "selected");
				$('[id^="weight_from"]').val('10');
				$('[id^="weight_to"]').val('100000');
				};
				if ($(this).val() == 'Нежилая недвижимость'){
				$('[id^="areaf"]').show();
				$('[id^="ownershipf"]  :first').attr("selected", "selected");
				$('[id^="parcel_typef"]  :first').attr("selected", "selected");
				$('[id^="appointmentf"]  :first').attr("selected", "selected");
				$('[id^="countryf"]  :first').attr("selected", "selected");
				$('[id^="nomenclaturef"]  :first').attr("selected", "selected");
				$('[id^="appointmentpetsf"]  :first').attr("selected", "selected");
				$('[id^="typeVf"]  :first').attr("selected", "selected");
				$('[id^="brandf"]  :first').attr("selected", "selected");
				$('[id^="modelf"]  :first').attr("selected", "selected");
				$('[id^="yearf"]  :first').attr("selected", "selected");
				};
				if ($(this).val() == 'Жилая недвижимость'){
				$('[id^="areaf"]').show();
				$('[id^="ownershipf"]  :first').attr("selected", "selected");
				$('[id^="parcel_typef"]  :first').attr("selected", "selected");
				$('[id^="appointmentf"]  :first').attr("selected", "selected");
				$('[id^="countryf"]  :first').attr("selected", "selected");
				$('[id^="nomenclaturef"]  :first').attr("selected", "selected");
				$('[id^="appointmentpetsf"]  :first').attr("selected", "selected");
				$('[id^="typeVf"]  :first').attr("selected", "selected");
				$('[id^="brandf"]  :first').attr("selected", "selected");
				$('[id^="modelf"]  :first').attr("selected", "selected");
				$('[id^="yearf"]  :first').attr("selected", "selected");
				};
				if ($(this).val() == 'Земельные участки'){
				$('[id^="areaf"]').show();
				$('[id^="ownershipf"]').show();
				$('[id^="parcel_typef"]').show();
				};
				if ($(this).val() == 'Автотранспорт'){
				$('[id^="brandf"]').show();
				$('[id^="modelf"]').show();
				$('[id^="yearf"]').show();
				$('[id^="weight_from"]').val('10');
				$('[id^="weight_to"]').val('100000');
				$('[id^="ownershipf"]  :first').attr("selected", "selected");
				$('[id^="parcel_typef"]  :first').attr("selected", "selected");
				$('[id^="appointmentf"]  :first').attr("selected", "selected");
				$('[id^="countryf"]  :first').attr("selected", "selected");
				$('[id^="nomenclaturef"]  :first').attr("selected", "selected");
				$('[id^="appointmentpetsf"]  :first').attr("selected", "selected");
				$('[id^="typeVf"]  :first').attr("selected", "selected");
				};
				if ($(this).val() == 'Оборудование, с/х техника'){
				$('[id^="brandf"]').show();
				$('[id^="appointmentf"]').show();
				$('[id^="yearf"]').show();
				$('[id^="countryf"]').show();
				};
				if ($(this).val() == 'Товарно-материальные ценности'){
				$('[id^="nomenclaturef"]').show();
				};
				if ($(this).val() == 'Животные'){
				$('[id^="appointmentpetsf"]').show();
				$('[id^="typeVf"]').show();
				};

			});
		},

		showItemsInMap:function(){
			ymaps.ready(function(){
				var itemsListMap = officesAtms.itemsListMap;

				if ( officesAtms.itemsListMap == false ) {

					var itemsListMap  = new ymaps.Map( "map", {
						center: [55.76, 37.64],
						zoom: 10
					});
					officesAtms.itemsListMap = itemsListMap;
				}
				if ( officesAtms.itemsListCollection != false ) {
					officesAtms.itemsListCollection.removeAll();
					// Удаляем коллекцию с карты
					officesAtms.itemsListMap.geoObjects.remove(officesAtms.itemsListCollection);
				}


				officesAtms.itemsListCollection = new ymaps.GeoObjectCollection();
				var itemsListCollection = officesAtms.itemsListCollection;

				// Определяем границы карты: координаты левого верхнего и правого нижнего ее углов.
				bounds = itemsListMap.getBounds();

				var maxLatitude = 0;
				var minLatitude = 100;
				var maxLongitude = 0;
				var minLongitude = 100;

				var locationItems = [];

				var listItems = officesAtms.listType == 'offices' ? officesAtms.officesItems : officesAtms.atmsItems;
				console.log(listItems);
				for ( index in listItems ){
					locationItems.push( listItems[ index ] );
				}

				if ( locationItems.length ) {
					$.each(locationItems, function(i, item){
						var lat = parseFloat(item['location_lat']);
						var lng = parseFloat(item['location_lng']);
						console.log(lat, lng);
						var iconmap = (item['type'] == 'terminals') ? '/img/map-mark-term.png' : '/img/map-mark.png';

						var dopname = '';
						var doplink = '';
						if (item['type'] == 'terminals') {
							var dopname = 'Платежный терминал №';
							var doplink = '<a href="#' + item['name'] + '" class="b-atm-link-atms">Подробнее</a>';
						}
						if (item['type'] == 'atms') {
							var dopname = 'Банкомат №';
							var doplink = '<a href="#' + item['name'] + '" class="b-atm-link-atms">Подробнее</a>';
						}
						if ($('html').hasClass('bx-touch')) {
							var itemPlacemark = new ymaps.Placemark([lat, lng], {
							balloonContent: '<b>' + dopname + '' + item['name'] + '</b><br>' + item['address'] + '<br><br>' + doplink
						}, {
							iconImageHref: iconmap,
							iconImageSize: [23, 35],
							iconImageOffset: [-11.5, -35]
						});
						}
						else{
							var itemPlacemark = new ymaps.Placemark([lat, lng], {
							balloonContent: '<b>' + dopname + '' + item['name'] + '</b><br>' + item['address'] + '<br><br>' + doplink
						}, {
							iconImageHref: iconmap,
							iconImageSize: [46, 70],
							iconImageOffset: [-23, -70]
						});
						}

						if (lat > maxLatitude) {
							maxLatitude = lat;
						}
						if (lat < minLatitude) {
							minLatitude = lat
						}

						if (lng > maxLongitude) {
							maxLongitude = lng;
						}
						if (lng < minLongitude) {
							minLongitude = lng
						}
						// Добавляем метку в коллекцию.
						itemsListCollection.add(itemPlacemark);
					});

					if ( locationItems.length > 1 ) {

						if ( $('#locality-popup .b-current-branch-value').html() != 'Все' ) {
						  maxLatitude = maxLatitude + 0.004;
						  maxLongitude = maxLongitude + 0.006;
						}else{
							maxLatitude = maxLatitude + 0.4
						}
					}


					itemsListMap.setBounds([[maxLatitude, minLongitude ], [minLatitude, maxLongitude ]], {checkZoomRange: true});
					// Теперь добавим коллекцию геообъектов на карту.
					itemsListMap.geoObjects.add(itemsListCollection);
				}

				$('.b-map-loading').hide();

				$(document).on('click', '.b-atm-link-atms', function(e){
				e.preventDefault();
				var anchor = $(this);
				var name = anchor.attr('href').replace(new RegExp('#','gi'), '');
				$('html, body').stop().animate({
				scrollTop: $("a[name="+name+"]").offset().top
				}, 1000);
				$("a[name="+name+"]").closest('.b-atm').find('.b-office-full').slideDown(function(){ $("a[name="+name+"]").closest('.b-atm').addClass('b-office_open'); });

			});

			});

		},


		showItemDetailInit:function( ){
			$('.js-office-link').unbind();
			$('.js-office-link').click(function(e){
                var $this = $(this);
                e.preventDefault();
				//$(this).closest('.b-office').toggleClass('b-office_open');
				if($this.closest('.b-office').is('.b-office_open')){
					$this.closest('.b-office').find('.b-office-full').slideUp(function () {
                        $this.closest('.b-office').removeClass('b-office_open');
                        $this.addClass('is-open');
					});
				} else {
					$this.closest('.b-office').find('.b-office-full').slideDown(function () {
						$this.closest('.b-office').addClass('b-office_open').end().removeClass('is-open');
					});
				}
			});

			$('.js-office-link').unbind();
            $('.js-office-link').on('click', function (e) {
                var $this = $(this);
                e.preventDefault();
                //$(this).closest('.b-office').toggleClass('b-office_open');
                if($this.closest('.b-office').is('.is-open')){
                    $this.addClass('is-open');
                    $this.closest('.b-office').find('.b-office-full').slideUp(function () {
                        $this.closest('.b-office').removeClass('is-open');
                    });
                } else {
                    $this.removeClass('is-open');
                    $this.closest('.b-office').find('.b-office-full').slideDown(function () {
                        $this.closest('.b-office').addClass('is-open');
                    });
                }
            });

			$('.b-atm-link-atms').click(function(e){
				e.preventDefault();
				var anchor = $(this);
				var name = anchor.attr('href').replace(new RegExp('#','gi'), '');
				$('html, body').stop().animate({
				scrollTop: $("a[name="+name+"]").offset().top
				}, 1000);
				$("a[name="+name+"]").closest('.b-atm').find('.b-office-full').slideDown(function(){ $('a[name="+name+"]').closest('.b-atm').addClass('b-office_open'); });

			});


		},
		showItemDetail:function( itemId, itemType ){


		}

	};

	$(function(){
		officesAtms.init();
	});
}
