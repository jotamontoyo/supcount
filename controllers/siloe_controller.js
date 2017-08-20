
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

/*				var resultados = new Array();
				var ph_true = new Array();

				ph_true[0] = 1;
				console.log(ph_true[0]);

				ph_true[1] = 2;
				console.log(ph_true[1]);

				ph_true[2] = 3;
				console.log(ph_true[2]);

				resultados[0] = ph_true;

				console.log(resultados[0][0]); */






/*				var ph_array = new Array();

				var sql_ensayos = {
					where: {vasoId: vaso.id, anio: anio}
				};

				models.Ensayo.findAll(sql_ensayos).then( ensayos => {


					for (var i in ensayos) {

						if (ensayos[i].ph_cumple) {
							ph_true = ph_true + 1;
						};

						ph_array[i] = ensayos[i].ph_m;

					};

					ph_maximo = Math.max(...ph_array);

					console.log(ph_true);
					console.log(ph_maximo);


				});

				ph_true = 0; */












/*				var squel = require('squel').useFlavour('postgres');

				var pg = require('pg');
				var client = new pg.Client("postgres://rkybjxyluotzej:43099e66b7cf8f864aace6eeabe25f4e4ac7331fd379dd32dd71e420313ae87f@ec2-23-21-246-11.compute-1.amazonaws.com:5432/denu1l0mihcu43?ssl=true");

				var query = squel.select({ separator: "\n" })
				        .from("client.Ensayo")
						.where("vasoId = vaso.id")
						.where("anio = anio")
//				        .field("ph_m")
//				        .field("MIN(ph_m)")
				        .field("MAX(ph_m)")
//				        .field("GROUP_CONCAT(DISTINCT ph_m ORDER BY ph_m DESC SEPARATOR ' ')")
//				        .group("ph_m")
				        .toString();





			client.connect(function (err, data) {

			if (err) {
				console.log("'Error connecting to PG'", err);

	    	} else {

					client.query(query.toString(), function (err, res) {
				        if (err) throw err;

						console.log("result " + JSON.stringify(res));


		/*		        var x = JSON.stringify(res);
				        var y = x.split(",")
				        // console.log(y[7])
				        console.log(y.length);
				        for (var i=0; i<y.length; i++){
				            // console.log(y[i]);
				            if (y[i].indexOf('"asnumber":') > 0)
				            {
				                console.log(y[i])
				                outputJSON.push(y[i]);
				            }
				        };
				        // console.log("result "+JSON.stringify(res))
						}); */
/*					});

				};
			}); */













/*				var p = new Promise(function (resolve, reject) {
				    models.Ensayo.findAll(sql_ensayos, function(err, ensayos) {
				    	if (err)
				            reject(err);
				        else
				            resolve(ensayos);
				    });
				});

				p.then(function(result) {

					ph_true = result.length;
					console.log('ph_true cantidad.....:' + ph_true);
				    return res.json(result);

				}).catch(function(err) {

				    next(err);

				}); */




				var sql_ensayos = {
					where: {vasoId: vaso.id, anio: anio, ph_cumple: true}
				};




/*				var contarEnsayos = function(sql_ensayos) {

			  		return new Promise((resolve, reject) => {

				    	models.Ensayo.count(sql_ensayos).then(function(ensayos) {
				      		resolve(ensayos);
				    	}).catch(function(error) {
				      		reject(error)
				    	});

					});

				};


				var mediaEnsayos = function(sql_ensayos) {

			  		return new Promise((resolve, reject) => {

				    	models.Ensayo.findAll(sql_ensayos).then(function(ensayos) {
				      		resolve(ensayos);
				    	}).catch(function(error) {
				      		reject(error)
				    	});

					});

				};







				contarEnsayos(sql_ensayos)
					.then( ensayos => {

						console.log('ensayos...: ' + ensayos);
						ph_true = ensayos;

					}).catch( err => {
						next(error);
					});





				sql_ensayos = {
					where: {vasoId: vaso.id, anio: anio, redox_cumple: true}
				};

				contarEnsayos(sql_ensayos)
					.then( ensayos => {

						console.log('ensayos...: ' + ensayos);
						redox_true = ensayos;

					}).catch( err => {
						next(error);
					});





				sql_ensayos = {
					where: {vasoId: vaso.id, anio: anio, ph_cumple: false}
				};

				contarEnsayos(sql_ensayos)
					.then( ensayos => {

						console.log('ensayos...: ' + ensayos);
						ph_false = ensayos;

					}).catch( err => {
						next(error);
					});








				sql_ensayos = {
					where: {vasoId: vaso.id, anio: anio, ph_cumple: true},
					attributes: ['ph_m', [models.sequelize.fn('AVG', models.sequelize.col('ph_m')), 'ph_m_count']],
					group: 'ph_m',
					order: [[models.sequelize.fn('AVG', models.sequelize.col('ph_m')), 'DESC']]
				};

				mediaEnsayos(sql_ensayos)
					.then( ensayos => {


/*						for (var i in ensayos) {													// itera para acumular los valores solo de los seleccionados
							ph_medio = ph_medio + ensayos[i].ph_m + ensayos[i].ph_t;				// tanto de la mañana como la tarde
						};


						console.log('ph_true.......: ' + ph_true);
						ph_medio = ph_medio / (ph_true * 2);	*/									// la condicion true aplica al conjunto de valores de mañana y tarde. por ello para la media se multiplica por dos la cantidad de casos true


/*						ph_medio = ensayos;
						console.log('ph_medio.......: ' + ph_medio);


					}).catch( err => {
						next(error);
					}); */
















				models.Ensayo.findAll(sql_ensayos).then( c => {

					ph_true = c.length;
					redox_true = c.length;

					for (var i in c) {											// itera para acumular los valores solo de los seleccionados
						ph_medio = ph_medio + c[i].ph_m + c[i].ph_t;			// tanto de la mañana como la tarde
					};

					ph_medio = ph_medio / (ph_true * 2);						// la condicion true aplica al conjunto de valores de mañana y tarde. por ello para la media se multiplica por dos la cantidad de casos true

					sql_ensayos = {
						where: {vasoId: vaso.id, anio: anio, ph_cumple: false}
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
												ph_minimo: ph_minimo, ph_total: ph_total, ph_medio: ph_medio, redox_true: redox_true, redox_false: redox_false,
												redox_maximo: redox_maximo, redox_medio: redox_medio, errors: []});
										});

									});

								});

							});

						});

					});

				});


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
			{centro: "Central", estado: 'abierto', dia: dia, mes: mes, anio: anio}		// asigna literales a los campos pregunta y respuestas para que se vea el texto en el <input> cuando creemos el formulario
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
							.then(function() {
								res.redirect('/siloes');
							});
						};

					};

				});

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
		req.siloe.estado = req.body.siloe.estado;

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

				if (req.siloe.estado === 'cerrado') {										// se envia cuando el estado del siloe se cierra/revisado

					'use strict';
					const nodemailer = require('nodemailer');

					let transporter = nodemailer.createTransport({				// create reusable transporter object using the default SMTP transport
						host: 'registrosdemantenimiento.com',
						port: 465,
						secure: true, 											// secure:true for port 465, secure:false for port 587
						auth: {
							user: 'noreply@registrosdemantenimiento.com',
							pass: process.env.NODE_SMTP_PASS
						},
						tls: {
					        rejectUnauthorized: false							// do not fail on invalid certs
					    }
					});

					let mailOptions = {																						// setup email data with unicode symbols
						from: '"Supcounter \u00A9 - no responder - " <noreply@registrosdemantenimiento.com>',	 			// sender address
						to: admin_email, 															// list of receivers
						subject: 'Cierre de parte #' + req.siloe.id, 								// Subject line
						text: 'Se ha confirmado un parte de Ensayos', 								// plain text body
						html:
							'<p>El usuario ' + req.session.user.username
							+ ' del centro ' + req.session.user.centro
							+ ' ha confirmado un parte de Ensayos. </p>'
							+ '<p>Email: ' + req.session.user.email + '</p>'
							+ '<h5>Por favor no responda a este email. Si quiere puede ponerse en contacto con el usuario en su email personal arriba indicado.</h5>'
					};

					transporter.sendMail(mailOptions, (error, info) => {							// send mail with defined transport object
						if (error) {
							return console.log(error);
						};
						console.log('Message %s sent: %s', info.messageId, info.response);
				        res.redirect('/siloes');
					});

				} else {res.redirect('/siloes')};

			});
		};
	};







	exports.destroy = function(req, res, next) {
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










	/*	process.env.SENDGRID_API_KEY = "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";
		process.env.SENDGRID_PASSWORD = "eu0coa3b6878";
		process.env.SENDGRID_USERNAME = "app66046690@heroku.com"; */



	/*					var helper = require('sendgrid').mail;
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
						}); */

	//				};
