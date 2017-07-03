
	var models = require('../models/models.js');
	var Sequelize = require('sequelize');

	exports.ownershipRequired = function(req, res, next){   	// MW que permite acciones solamente si el siloe objeto pertenece al usuario logeado o si es cuenta admin
	    var objSiloeOwner = req.siloe.UserId;						// userId del siloe
	    var logUser = req.session.user.id;						// userId de la sesion
	    var isAdmin = req.session.user.isAdmin;					// valor de isAdmin
	    if (isAdmin || objSiloeOwner === logUser) {				// comprueba que el user del siloe es el mismo que el user logueado
	        next();
	    } else {
	        res.redirect('/');
	    }
	};

	exports.load = function(req, res, next, siloeId) {			// autoload. solo se ejecuta si en la peticion GET existe un :siloeId. ayuda a factorizar el codigo del resto de controladores
		models.Siloe.find({										// carga de registro siloe
			where: 		{id: Number(siloeId)},					// where indice principal id <-- siloeId recibido del GET
			include: 	[{model: models.Ensayo}],				// incluye la tabla Comment como hijo
			order:		[[models.Ensayo, 'vasoId', 'ASC']]		// y la ordena por codigo
			}).then(function(siloe) {
				if (siloe) {
					req.siloe = siloe;
					next();
				} else {
					next(new Error('No existe siloeId=' + siloe[id]));
				}
			}
		).catch(function(error) {next(error);});
	};






	// GET /siloees   										--->>> GET sin req.user
	// GET /users/:userId/siloees							--->>> GET con req.user
	exports.index = function(req, res, next) {

		var fecha = new Date();
		var mes = fecha.getUTCMonth() + 1;
		var anio = fecha.getUTCFullYear();

		var options = {
			where: {mes: mes, anio: anio},
			order: [['fecha', 'ASC']]
		};

	  	if (req.user) {									// req.user se crea en autoload de user_controller si hay un GET con un user logueado
			options = {
				where: {UserId: req.user.id, centro: req.session.user.centro, mes: mes, anio: anio},
				order: [['fecha', 'ASC']]
			};
	  	};

	  	models.Siloe.findAll(options).then(					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id
	    	function(siloes) {
	      		res.render('siloes/index.ejs', {siloes: siloes, errors: []});
	    	}
	  	).catch(function(error){next(error)});

	};






	exports.mes_index = function(req, res) {

		var fecha = new Date();

		var mes_index = {
			mes: fecha.getUTCMonth() + 1,
			anio: fecha.getUTCFullYear()
		};

		res.render('siloes/mes_index', {mes_index: mes_index, errors: []});

	};



	// GET /quizes   										--->>> GET sin req.user
	// GET /users/:userId/quizes							--->>> GET con req.user
	exports.mes_index_show = function(req, res, next) {

		var mes = Number(req.body.mes_index.mes);
		var anio = Number(req.body.mes_index.anio);

		var options = {
			where: {mes: mes, anio: anio},
			order: [['fecha', 'ASC']]
		};

	  	if (req.user) {									// req.user se crea en autoload de user_controller si hay un GET con un user logueado
			options = {
				where: {
					UserId: req.user.id,
					centro: req.session.user.centro,
					mes: mes,
					anio: anio
				},
				order: [['fecha', 'ASC']]
			};
	  	};

	  	models.Siloe.findAll(options).then(					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id
	    	function(siloes) {
	      		res.render('siloes/index.ejs', {siloes: siloes, errors: []});
	    	}
	  	).catch(function(error){next(error)});

	};








	exports.resumen_index = function(req, res) {

		var fecha = new Date();

		var resumen = {
//			mes: fecha.getUTCMonth() + 1,
//			nombre_mes: '',
			anio: fecha.getUTCFullYear()
		};

		res.render('siloes/resumen_index', {resumen: resumen, errors: []});

	};










	exports.resumen = function(req, res, next) {


		var	anio = parseInt(req.body.resumen.anio);

		var ph_true = 0;
		var ph_false = 0;
		var ph_maximo = 0;
		var ph_minimo = 0;
		var ph_total = 0;
		var ph_medio = 0;

		var redox_true = 0;
		var redox_false = 0;
		var redox_maximo = 0;
		var redox_minimo = 0;
		var redox_total = 0;
		var redox_medio = 0;



		var sql_vasos = {

			where: {centro: req.session.user.centro, nombre: 'ACS'},
			order: [['id', 'ASC']]

		};




		models.Vaso.find(sql_vasos).then( vaso => {



//			for (let i in vasos) {

				var sql_ensayos = {
					where: {vasoId: vaso.id, anio: anio, ph_cumple: true, redox_cumple: true}
				};

				models.Ensayo.findAll(sql_ensayos).then( c => {

					ph_true = c.length;
					redox_true = c.length;

					for (var i in c) {											// itera para acumular los valores solo de los seleccionador
						ph_medio = ph_medio + c[i].ph_m + c[i].ph_t;			// tanto de la mañana como la tarde
					};

					ph_medio = ph_medio / (ph_true * 2);						// la condicion true aplica al conjunto de valores de mañana y tarde. por ello para la media se multiplica por dos la cantidad de casos true

					sql_ensayos = {
						where: {vasoId: vaso.id, anio: anio, ph_cumple: false, redox_cumple: false}
					};

					models.Ensayo.count(sql_ensayos).then( c => {

						ph_false = c;
						redox_false = c;

						sql_ensayos = {
							where: {vasoId: vaso.id, anio: anio}
						};

						models.Ensayo.max('ph_m', sql_ensayos).then( c => {

							ph_maximo = c;

							models.Ensayo.max('ph_t', sql_ensayos).then( c => {

								if (c > ph_maximo) { ph_maximo = c };

								sql_ensayos = {
									where: {vasoId: vaso.id, anio: anio}
								};
								models.Ensayo.min('ph_m', sql_ensayos).then( c => {

									ph_minimo = c;

									models.Ensayo.min('ph_t', sql_ensayos).then( c => {

										if (c < ph_minimo) { ph_minimo = c };

										sql_ensayos = {
											where: {vasoId: vaso.id, anio: anio}
										};
										models.Ensayo.count(sql_ensayos).then( c => {

											ph_total = c;

											res.render('siloes/resumen', {vaso: vaso, ph_true: ph_true, ph_false: ph_false, ph_maximo: ph_maximo,
												ph_minimo: ph_minimo, ph_total: ph_total, ph_medio: ph_medio, redox_true: redox_true, redox_false: redox_false, errors: []});
										});

									});

								});

							});

						});

					});

				});




/*				var sql_redox = {
					where: {vasoId: vaso.id, anio: anio, redox_cumple: true}
				};

				models.Ensayo.findAll(sql_redox).then( c => {

					redox_true = c.length;

					for (var i in c) {											// itera para acumular los valores solo de los seleccionador
						redox_medio = redox_medio + c[i].ph_m + c[i].ph_t;			// tanto de la mañana como la tarde
					};

					redox_medio = redox_medio / (redox_true * 2);						// la condicion true aplica al conjunto de valores de mañana y tarde. por ello para la media se multiplica por dos la cantidad de casos true

					sql_redox = {
						where: {vasoId: vaso.id, anio: anio, redox_cumple: false}
					};

					models.Ensayo.count(sql_redox).then( c => {

						redox_false = c;

						sql_redox = {
							where: {vasoId: vaso.id, anio: anio}
						};

						models.Ensayo.max('redox_m', sql_redox).then( c => {

							redox_maximo = c;

							models.Ensayo.max('redox_t', sql_redox).then( c => {

								if (c > redox_maximo) { redox_maximo = c };

								sql_redox = {
									where: {vasoId: vaso.id, anio: anio}
								};
								models.Ensayo.min('redox_m', sql_redox).then( c => {

									redox_minimo = c;

									models.Ensayo.min('redox_t', sql_redox).then( c => {

										if (c < redox_minimo) { redox_minimo = c };

										sql_redox = {
											where: {vasoId: vaso.id, anio: anio}
										};
										models.Ensayo.count(sql_redox).then( c => {

											redox_total = c;

											res.render('siloes/resumen', {vaso: vaso, redox_true: redox_true, redox_false: redox_false, redox_maximo: redox_maximo, redox_minimo: redox_minimo, redox_total: redox_total, redox_medio: redox_medio, errors: []});
										});

									});

								});

							});

						});

					});

				}); */





















/*				models.Ensayo.count({

					options_ensayos

				}).then(function(ensayos_ph) {

					ph = ensayos_ph;

					console.log('ensayos.....:' + ph);

					res.render('siloes/resumen', {vaso: vaso, ph: ph, errors: []});

/*					for (let x in ensayos) {

						for (let z in ensayos[x].ph_m) {

							if (ensayos[x].ph_m[z] > 0) {

								ph = ph + 1;

								console.log('ensayos.....:' + ph);

							};

						};

					}; */




/*				}).catch(function(error){next(error)}); */




//			};






		}).catch(function(error){next(error)});














/*		var options = {
			where: Sequelize.or(				// segun la version de Sequelize he de usar una u otra estructura de consulta
				Sequelize.and(
					{anio: anio},
					{centro: req.session.user.centro}
				),
				Sequelize.and(
					{dia: 1},
					{mes: 1},
					{anio: anio + 1},
					{centro: req.session.user.centro}
				)
			),
			include: [{model: models.Ensayo}],
			order: [['fecha', 'ASC'], [models.Ensayo, 'id', 'ASC' ]]
		};



		models.Siloe.findAll(options).then(function(siloes) {
			models.Vaso.findAll({
				where: {centro: req.session.user.centro},
				order: [['id', 'ASC']]
			}).then(function(vasos) { */


/*				var anterior = 0;
				for (let i in siloes) {								// hallar consumo

					if (i > 0) {anterior = i - 1};

					for (let x in siloes[i].ensayos) {
						if (siloes[anterior].ensayos[x]) {						// por si no hay lectura anterior. para que no dé error undefined
							if (!siloes[anterior].ensayos[x].deposito) {		// pregunta si es o no deposito para hacer el calculo
								siloes[anterior].ensayos[x].consumo = (siloes[i].ensayos[x].lectura_actual - siloes[anterior].ensayos[x].lectura_actual);
							} else {
								siloes[anterior].ensayos[x].consumo = (siloes[anterior].ensayos[x].lectura_actual - (siloes[i].ensayos[x].lectura_actual - siloes[anterior].ensayos[x].carga)); // .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
							};
							if (siloes[anterior].ensayos[x].consumo > siloes[anterior].ensayos[x].maximo) { siloes[anterior].ensayos[x].cumple = false };
						};
					};


				}; */

/*				models.Ensayo.count({
					attributes: [Sequelize.col('ph_m'), Sequelize.col('ph_t')]
				}).then(function(cantidad) {

					var ph = {
						muestreos: cantidad
					};

					console.log('ph........: ' + ph.muestreos);

					res.render('siloes/resumen', {siloes: siloes, vasos: vasos, ph: ph, errors: []});

				});





			}).catch(function(error){next(error)});

		}).catch(function(error){next(error)}); */

	};



	exports.imprimir_resumen = function(req, res) {

		console.log(req.body.quizes);

		res.render('quizes/resumen_impreso', {quizes: req.body.quizes, contadores: req.contadores, errors: []});

	};









	exports.show = function(req, res) {											// GET /quizes/:id

		models.Ensayo.findAll({
            where: 		{SiloId: Number(req.siloe.id)},
            order:      [['vasoId', 'ASC']]
        }).then(function(ensayos) {
            res.render('siloes/show', {siloe: req.siloe, ensayos: ensayos, errors: []});
        });

//		res.render('siloes/show', {siloe: req.siloe, errors: []});				// renderiza la vista /quizes/show del quizId selecionado con load find()

	};











	exports.new = function(req, res) {																				// GET /quizes/new, baja el formulario

		var fecha = new Date();
		var dia = ("0" + fecha.getUTCDate()).slice(-2);
		var mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);														// se le añade 1 porque van de 0 a 11
		var anio = fecha.getUTCFullYear();

		var siloe = models.Siloe.build( 																				// crea el objeto quiz, lo construye con buid() metodo de sequilize
			{centro: "Central", proceso: true, dia: dia, mes: mes, anio: anio}		// asigna literales a los campos pregunta y respuestas para que se vea el texto en el <input> cuando creemos el formulario
		);

		res.render('siloes/new', {siloe: siloe, errors: []});   							// renderiza la vista quizes/new



	};








	exports.create = function(req, res) {														// POST /quizes/create

		req.body.siloe.UserId = req.session.user.id;												// referenciamos el quiz con el UserId
		req.body.siloe.UserName = req.session.user.username;
		req.body.siloe.centro = req.session.user.centro;

		var siloe = models.Siloe.build( req.body.siloe );											// construccion de objeto quiz para luego introducir en la tabla
		siloe.fecha = new Date(req.body.siloe.anio, req.body.siloe.mes - 1, req.body.siloe.dia);     // captura la fecha del form y la añade al quiz con clase Date()

		var errors = siloe.validate();															// objeto errors no tiene then(
		if (errors) {
			var i = 0;
			var errores = new Array();															// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('siloes/new', {siloe: siloe, errors: errores});
		} else {
			siloe
			.save()
			.then(function() {

				models.Vaso.findAll({

					where: {centro: req.session.user.centro},

		            order: [['id', 'ASC']]

		        }).then(function(vasos) {

					for (let i in vasos) {											// crea tantas ensayos como Vasos


						var ensayo = models.Ensayo.build({						// se crea en ensayo

							vasoId: vasos[i].id,
							centro: vasos[i].centro,
							nombre: vasos[i].nombre,
							ubicacion: vasos[i].ubicacion,
							capacidad: vasos[i].capacidad,
							interior: vasos[i].interior,
							tipo_ensayo: vasos[i].tipo_ensayo,

							ph_max: vasos[i].ph_max,
							ph_min: vasos[i].ph_min,
							ph_m: 0,
							ph_t: 0,
							ph_cumple: false,

							redox_max: vasos[i].redox_max,
							redox_min: vasos[i].redox_min,
							redox_m: 0,
							redox_t: 0,
							redox_cumple: false,

							temp_max: vasos[i].temp_max,
							temp_min: vasos[i].temp_min,
							temp_m: 0,
							temp_t: 0,
							temp_cumple: false,

							recirculacion: vasos[i].recirculacion,
							recirculacion_m: 0,
							recirculacion_t: 0,
							recirculacion_cumple: false,

							transparencia: vasos[i].transparencia,
							transparencia_m: true,
							transparencia_t: true,
							transparencia_cumple: true,

							lectura_m: 0,
							lectura_t: 0,
							lectura_cumple: false,

							extranios: vasos[i].extranios,
							extranios_m: false,
							extranios_t: false,
							extranios_cumple: true,

							turbidez_max: vasos[i].turbidez_max,
							turbidez_m: 0,
							turbidez_t: 0,
							turbidez_cumple: false,

							isocianuro_max: vasos[i].isocianuro_max,
							isocianuro_m: 0,
							isocianuro_t: 0,
							isocianuro_cumple: false,

							bromo_max: vasos[i].bromo_max,
							bromo_min: vasos[i].bromo_min,
							bromo_m: 0,
							bromo_t: 0,
							bromo_cumple: false,

							cloro_max: vasos[i].cloro_max,
							cloro_min: vasos[i].cloro_min,
							cloro_m: 0,
							cloro_t: 0,
							cloro_cumple: false,

							cloro_combinado_max: vasos[i].cloro_combinado_max,
							cloro_combinado_m: 0,
							cloro_combinado_t: 0,
							cloro_combinado_cumple: false,

							humedad_max: vasos[i].humedad_max,
							humedad_m: 0,
							humedad_t: 0,
							humedad_cumple: false,

							co2_interior_max: vasos[i].co2_interior,
							co2_interior_m: 0,
							co2_interior_t: 0,
							co2_interior_cumple: false,

							co2_exterior_max: vasos[i].co2_exterior_max,
							co2_exterior_m: 0,
							co2_exterior_t: 0,
							co2_exterior_cumple: false,

							ecoli: vasos[i].ecoli,
							ecoli_m: false,
							ecoli_t: false,
							ecoli_cumple: true,

							legionella_max: vasos[i].legionella_max,
							legionella_m: 0,
							legionella_t: 0,
							legionella_cumple: false,

							pseudomona: vasos[i].pseudomona,
							pseudomona_m: false,
							pseudomona_t: false,
							pseudomona_cumple: true,

							enterococos: vasos[i].enterococos,
							enterococos_m: false,
							enterococos_t: false,
							enterococos_cumple: true,

							staphlylococcus: vasos[i].staphlylococcus,
							staphlylococcus_m: false,
							staphlylococcus_t: false,
							staphlylococcus_cumple: true,

							langelier_max: vasos[i].langelier_max,
							langelier_min: vasos[i].langelier_min,
							langelier_m: 0,
							langelier_t: 0,
							langelier_cumple: false,

							publicado: true,
							texto: '',
							fecha: siloe.fecha,
							dia: siloe.dia,
							mes: siloe.mes,
							anio: siloe.anio,
							SiloId: siloe.id											// al comment se le pasa el quizId del siloe para establecer la integridad referencial entre Quiz y Comment. indice secundario de Comment
						});

						var errors = ensayo.validate();
						if (errors) {
							let i = 0;
							var errores = new Array();
							for (var prop in errors) errores[i++] = {message: errors[prop]};
							res.render('ensayos/new', {ensayo: ensayo, errors: errores});
						} else {
							ensayo 																		// save: guarda en DB campos pregunta y respuesta de quiz
							.save()
							.then(function() {});
						};

					};

				});

				res.redirect('/siloes');

			});

		};



	};










	exports.edit = function(req, res) {											// carga formulario edit.ejs

		res.render('siloes/edit', {siloe: req.siloe, errors: []});   			// renderiza la vista quizes/edit

	};








	exports.update = function(req, res) {										// modifica un siloe

		req.siloe.fecha = new Date(req.body.siloe.anio, req.body.siloe.mes - 1, req.body.siloe.dia);
		req.siloe.dia = req.body.siloe.dia;
		req.siloe.mes = req.body.siloe.mes;
		req.siloe.anio = req.body.siloe.anio;
		req.siloe.proceso = req.body.siloe.proceso;

		var admin_email = "";															// busca email administrador del centro
		models.User.find({
			where: {
				centro: req.session.user.centro,
				isAdmin: true,
				isSuperAdmin: false
			}
		}).then(function(admin) {
			admin_email = admin.email;
		});

		var errors = req.siloe.validate();
		if (errors) {
			var i = 0;
			var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('siloes/edit', {siloe: req.siloe, errors: errores});
		} else {
			req.siloe 															// save: guarda en DB campos de siloe
			.save()
			.then(function() {

				if (!req.siloe.proceso) {										// se envia cuando el proceso del siloe se cierra/revisado

					var helper = require('sendgrid').mail;
					var fromEmail = new helper.Email(req.session.user.email);	// email del usuario
					var toEmail = new helper.Email(admin_email);				// email del administrador del centro
					var subject = 'El Parte de Ensayos nº: '
						+ req.siloe.id
						+ ' de fecha '
						+ req.siloe.dia
						+ '-' + req.siloe.mes
						+ '-' + req.siloe.anio
						+ ' ha sido revisado';
					var content = new helper.Content(
						'text/plain', 'El usuario '
						+ req.session.user.username
						+ ' del centro '
						+ req.session.user.centro
						+ ' ha revisado y confirmado un parte. Entre en '
						+ 'https://supcounter.herokuapp.com para ver los resultados'
					);
					var mail = new helper.Mail(fromEmail, subject, toEmail, content);

					var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
					var request = sg.emptyRequest({
						method: 'POST',
						path: '/v3/mail/send',
						body: mail.toJSON()
					});

					sg.API(request, function (error, response) {
						if (error) {
							console.log('Error response received');
						};
						console.log(response.statusCode);
						console.log(response.body);
						console.log(response.headers);
					});

				};

				res.redirect('/siloes');

			});
		};
	};








	exports.destroy = function(req, res, next) {    // ojo no borra detalles. corregir *****************************************************



		req.siloe.destroy().then(function() {

			models.Ensayo.findAll({

				where: {SiloId: req.siloe.id}

			}).then(function(ensayos) {

				for (var i in ensayos) {
					ensayos[i].destroy();
				};

			});

			res.redirect('/siloes');
		}).catch(function(error) {next(error)});
	};
