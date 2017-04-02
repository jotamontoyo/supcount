
	function iniciar() {
		localStorage.marcadores = localStorage.marcadores || '[]'; 					// variable que almacena en localStorage
		var marcadores = JSON.parse(localStorage.marcadores);						// serializacion de localStorage
		var map, lat, lng, latini, lngini, nuevaPos, 
			distancia = 0, duracion = 0, t = undefined;								// inicializa variables globales

		var selectedMode =  $('#mode').value;								
//		var selectedMode = document.getElementById('mode').value;
		
//		$('#panel').on('change', function() {cambiarMapa();});
		
		$('#eliminar').on('click', function() {inicializar();});			// carga de eventos
		$('#compactar').on('click', function() {compactar();});
		$('#grabar').on('click', function() {grabar();});
		$('#volver').on('click', function() {volver();});
		
		$('#eliminar').on('tap', function() {inicializar();});
		$('#compactar').on('tap', function() {compactar();});
		$('#grabar').on('tap', function() {grabar();});
		$('#volver').on('tap', function() {volver();});
		
//		geolocalizar();
		mostrarMapa();

	
		function Ruta(origen, destino) {							// dibuja la ruta entre el marcador anterior y actual
			map.travelRoute({
				origin: origen, 									// origen en coordenadas anteriores
				destination: destino, 								// destino en coordenadas del click o toque actual
				travelMode: selectedMode,  							// modo de ruta driving, bicycling o walking.
				step: function(e) {
					$('#instructions').append('<li>' + e.instructions + ' - ' + e.distance.text + ' / ' + e.duration.text + '</li>');
					distancia = distancia + e.distance.value;
					duracion = duracion + e.duration.value;
					$('#distancia').html(distancia + ' / ' + duracion);
					map.drawPolyline({
						path: e.path,
						strokeColor: '#131540',
						strokeOpacity: 0.6,
						strokeWeight: 6,
						mouseover: function() {
							this.setOptions({strokeColor: '#00ff00'});
							this.setOptions({strokeWeight: 8});
						},
						mouseout: function() {
							this.setOptions({strokeColor: '#131540'});
							this.setOptions({strokeWeight: 6});
						},
						click: function() {
							var index = e.step_number;
							$('#instructions li').css('color', '#000000');										// pone todas las lineas en negro
							$('#instructions li:eq(' + (parseInt(index)) + ')').css('color', '#00ff00');		// pone en verde las click
						}
					}); 
				}
			});
			map.addMarker({												// añade el marcador destino[] al mapa
				lat: destino[0],
				lng: destino[1],
				animation: google.maps.Animation.DROP,
				icon: 'img/llegada.png',
				title: 'Nueva',
				infoWindow: {
					content: (destino).toString()
				}
			}); 
//			map.setCenter(lat, lng); 		// centra el mapa en el ultimo marcador
		}

		function enlazarMarcador(e) {
			lat = e.latLng.lat(); 											// guarda coords para el marcador siguiente
			lng = e.latLng.lng();
			nuevaPos = [lat, lng];
			if (marcadores.length > 0) {
				Ruta(marcadores[marcadores.length - 1], nuevaPos);  		// llama a Ruta() y le pasa marcadores-1 (anterior marcador) y nuevaPos
			} else {
				map.addMarker({												// pone marcador en mapa
					lat: lat,
					lng: lng,
					animation: google.maps.Animation.DROP,
					icon: 'llegada.png'
				}); 
			}
			map.fitZoom();
			marcadores.push(nuevaPos);										// añade el nuevo marcadores al array
			localStorage.marcadores = JSON.stringify(marcadores); 			// guardamos el marcador serializado en localStorage
		}
		
		function volver() {
			if (marcadores.length > 1) {
				$('#instructions').html('');
				$('#distancia').html('');
				distancia = 0;
				duracion = 0;
				map.cleanRoute();	  										// borra la ruta
				map.removeMarkers();  										// elimina marcadores
				marcadores.splice(1, marcadores.length - 2);  				// extrae el primer y ultimo marcador del array
				localStorage.marcadores = JSON.stringify(marcadores);  		// guardamos el primer y último marcador serializados en localStorage
				Ruta(marcadores[1], marcadores[0]);							// dibuja la ruta alreves para regresar
				$('#info').css('visibility', 'visible');
				map.addMarker({  											// marcador en [lat, lng] cambiados
					lat: marcadores[1][0],									// le pasa el ultimo punto de la ruta, pero lo convierte en punto de origen
					lng: marcadores[1][1],
					animation: google.maps.Animation.DROP,
					icon: 'img/salida.png',
					title: 'Tu ubicación',
					infoWindow: {
						content: '<p>Tu Ubicación</p>'
					}
				});
				map.fitZoom();
			}
		}

		function geolocalizar() {
			GMaps.geolocate({												// geolocaliza la posicion actual
				success: function (position) {								// si exito le pasa a la funcion el objeto position
					if (marcadores.length === 0) {							// si no existen marcadores el primer marcador sera la ubicación actual
						lat = position.coords.latitude; 					// guarda coords en lat y lng
						lng = position.coords.longitude;
						nuevaPos = [lat, lng];
						marcadores.push(nuevaPos);									// guardamos el primer marcador
						localStorage.marcadores = JSON.stringify(marcadores); 		// serializa un objeto en un JSON
					} else {														// si existen marcadores, la primera posición del array es el inicio de la ruta
						lat = marcadores[0][0];										// y se lo pasamos a las locales para dibujar mapa
						lng = marcadores[0][1];
					}
					mostrarMapa();
					if (marcadores.length > 0) {					// si el array tiene un elemento agrega un marcador
						map.addMarker({  							// marcador en [lat, lng]
							lat: marcadores[0][0],
							lng: marcadores[0][1],
							animation: google.maps.Animation.DROP,
							icon: 'img/salida.png',
							title: 'Tu ubicación',
							infoWindow: {
								content: '<p>Tu Ubicación</p>'
							},
							click: mostrarPanorama
							
/*							function (e) {					// abre google street
								lat = e.latLng.lat(); 			
								lng = e.latLng.lng();
								GMaps.createPanorama({
									el: '#panorama',
									lat : lat,
									lng : lng
								});
							} */
						});
						latini = lat;  							// marcador inicial, primer punto de la ruta
						lngini = lng; 
					}
					if (marcadores.length > 1) {  				// si el array tiene mas de un elemento utiliza la funcion Ruta() para dibujar los marcadores y trazar la ruta hacia anterior
						var i;
						for (i = 1; i < marcadores.length; i++) {
							Ruta(marcadores[i-1], marcadores[i]);		// llama a Ruta() y le pasa origen[lat, lng] y destino[lat, lng]
						}
						map.fitZoom();
					}
				},
				error: function (error) {
					alert('Geolocalización falla: ' + error.message);
				},
				not_supported: function () {
					alert('Su navegador no soporta geolocalización');
				}
			});
		}    
		
		function mostrarMapa() {
			map = new GMaps({ 							// dibuja map con [lat, lng]
				el: '#map',
				lat: 38.3949586,
				lng: -0.5261481,
				mapTypeControlOptions: {				// añade controles al mapa estandar
					mapTypeIds : ["hybrid", "roadmap", "satellite", "terrain", "osm", "cloudmade"]
				},
				click: enlazarMarcador,
				tap: enlazarMarcador
			});
			map.addMarker({
				lat: 38.3949586,
			  	lng: -0.5261481,
			  	title: 'x',
			  	click: function(e) {
				    alert('You clicked in this marker');
			  	}
			});
			map.addMapType("osm", {							// crea un mapa openstreetmap
				getTileUrl: function(coord, zoom) {
					return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
				},
				tileSize: new google.maps.Size(256, 256),
				name: "OpenStreetMap",
				maxZoom: 18
			});
			map.addMapType("cloudmade", {
				getTileUrl: function(coord, zoom) {
					return "http://b.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/1/256/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
				},
				tileSize: new google.maps.Size(256, 256),
				name: "CloudMade",
				maxZoom: 18
			  });
//			  map.setMapTypeId("osm");
		}
		
		function mostrarPanorama(e) {
			lat = e.latLng.lat(); 			
			lng = e.latLng.lng();
			GMaps.createPanorama({
				el: '#panorama',
				lat : lat,
				lng : lng
			});
		}
			
		function limpiar() {
			if (map) {
				map.cleanRoute(); 					// borra la ruta
				map.removeMarkers(); 				// elimina marcadores
				if (latini && lngini) {
					map.addMarker({					// posiciona marcador inicial
						lat: latini,
						lng: lngini,
						animation: google.maps.Animation.DROP,
						icon: 'salida.png',
						title: 'Tu ubicación',
						infoWindow: {
							content: '<p>Tu ubicación</p>'
						}
					}); 								
					map.setCenter(latini, lngini); 							//centra el mapa
				}
				marcadores = JSON.parse(localStorage.marcadores); 			// deserializa un JSON en un objeto
				marcadores.splice(1, marcadores.length); 					// elimina los elementos del array menos el primero
				$('#instructions').html('');
				$('#distancia').html('');
				distancia = 0;
				duracion = 0;
			}
		}

		function inicializar() {
			$('#info').css('visibility', 'hidden');
			latini = undefined;  						// borramos para que limpiar no posicione marcador
			lngini = undefined;
			limpiar();
			marcadores = [];   							// borramos
			localStorage.removeItem('marcadores');  	// eliminamos
			geolocalizar();
		} 

		function compactar(){
			if (marcadores.length > 2) {
				$('#instructions').html('');
				$('#distancia').html('');
				distancia = 0;
				duracion = 0;
				map.cleanRoute();  											// borra la ruta
				map.removeMarkers();  										// elimina marcadores
				marcadores.splice(1, marcadores.length - 2);  				// extrae el primer y ultimo marcador del array
				localStorage.marcadores = JSON.stringify(marcadores);  		// guardamos el primer y último marcador serializados en localStorage
				$('#info').css('visibility', 'visible');
				geolocalizar();
			}
		}
		
		function grabar() {
			if (!t) {
				t = setInterval(grabarRuta, 6000);
				$('#cambiar').attr('class', 'fa fa-stop');
				$('#grabar').attr('text', 'Parar');
			} else {
				clearInterval(t);
				t = undefined;
				$('#cambiar').attr('class', 'fa fa-floppy-o');
			}
		}
		
		function grabarRuta() {
			GMaps.geolocate({												// geolocaliza la posicion actual
				success: function (position) {								// si exito le pasa a la funcion el objeto position
					lat = position.coords.latitude; 						// guarda coords en lat y lng
					lng = position.coords.longitude;
					nuevaPos = [lat, lng];
					marcadores.push(nuevaPos);									// guardamos el primer marcador
					localStorage.marcadores = JSON.stringify(marcadores); 		// serializa un objeto en un JSON
					Ruta(marcadores[marcadores.length - 1], nuevaPos);			// llama a Ruta() y le pasa origen[lat, lng] y destino[lat, lng]
					map.fitZoom();
				},
				error: function (error) {
					alert('Geolocalización falla: ' + error.message);
				},
				not_supported: function () {
					alert('Su navegador no soporta geolocalización');
				}
			});
		}
	
		function cambiarMapa() {
			marcadores.splice(1, marcadores.length - 2);  				// extrae el primer y ultimo marcador del array
			localStorage.marcadores = JSON.stringify(marcadores);  
			var origen = new google.maps.LatLng(marcadores[0][0], marcadores[0][1]);
			var destino = new google.maps.LatLng(marcadores[1][0], marcadores[1][1]);
//			var selectedMode = document.getElementById('mode').value;
			var directionsService = new google.maps.DirectionsService();
			var directionsDisplay = new google.maps.DirectionsRenderer();
			var mapOptions = {
				zoom: 14,
				center: origen
			}
			var map = new google.maps.Map(document.getElementById('map'), mapOptions);
			directionsDisplay.setMap(map);
			var request = {
				origin: origen,
				destination: destino,
				travelMode: 'BICYCLING' 				// google.maps.TravelMode[selectedMode]
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}
			});
		}


	}		
			
//	window.addEventListener('load', iniciar, false);
	google.maps.event.addDomListener(window, 'load', iniciar);


	  
	  
	  
	  
	  
	  
	  
	  
	  