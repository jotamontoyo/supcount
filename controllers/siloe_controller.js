
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
							transparencia_m: vasos[i].transparencia,
//							transparencia_t: vasos[i].transparencia,
							transparencia_cumple: vasos[i].transparencia,

							lectura_m: 0,
							lectura_t: 0,
							lectura_cumple: false,

							extranios: vasos[i].extranios,
							extranios_m: 'cumple',
							extranios_t: 'cumple',
							extranios_cumple: 'cumple',

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
							ecoli_m: 'cumple',
							ecoli_t: 'cumple',
							ecoli_cumple: 'cumple',

							legionella_max: vasos[i].legionella_max,
							legionella_m: 0,
							legionella_t: 0,
							legionella_cumple: false,

							pseudomona: vasos[i].pseudomona,
							pseudomona_m: 'cumple',
							pseudomona_t: 'cumple',
							pseudomona_cumple: 'cumple',

							enterococos: vasos[i].enterococos,
							enterococos_m: 'cumple',
							enterococos_t: 'cumple',
							enterococos_cumple: 'cumple',

							staphlylococcus: vasos[i].staphlylococcus,
							staphlylococcus_m: 'cumple',
							staphlylococcus_t: 'cumple',
							staphlylococcus_cumple: 'cumple',

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

				} else {

					res.redirect('/siloes');

				};

			});
		};
	};




	exports.resumen_index = function(req, res) {				// para excel de todos los vasos
		var fecha = new Date();
		var anio = fecha.getUTCFullYear();
		res.render('siloes/resumen_index', {anio: anio, errors: []});
	};


	exports.resumen_index_vaso = function(req, res) {			// seleccionar vaso y año para informe siloe
		var fecha = new Date();
		var anio = fecha.getUTCFullYear();
		models.Vaso.findAll({
			where: {centro: req.session.user.centro},
			order: [['id', 'ASC']]
		}).then( vasos => {
			res.render('siloes/resumen_index_vaso', {anio: anio, vasos: vasos, errors: []});
		});
	};


	exports.ver_resumen_vaso = function(req, res) {				// visuazar informe
		var vasoid = req.body.vaso;
		var anio = req.body.anio;
		models.Vaso.find({
			where: {id: vasoid}
		}).then( vaso => {
			exports.resumenVaso(anio, vaso, function(vasoId, resumen) {
				res.render('siloes/resumen_index_vaso_informe', {resumen: resumen, vaso: vaso, anio: anio, errors: []});
			});
		});
	};


	exports.downloadExcel = function(req, res, next) {

		try {
			// Obtenemos todos los vasos del usuario
			models.Vaso.findAll({
	            where: {centro: req.session.user.centro},
	            order: [['id', 'ASC']]
	        }).then(
		    	function(vasos) {

		    		var detalle = new Array();

		    		// Calculamos el detalle de los vasos
		    		vasos.forEach(function(item, index) {
		    			exports.resumenVaso(req.params.anio, item, function(vasoId, resumen) {
		    				detalle[vasoId] = resumen;

		    				if (index == vasos.length - 1) {
		    					// Generamos el excel
		    					exports.generateExcel(req, res, next, vasos, detalle);
		    				}
		    			});
		    		});
		    	}
		    ).catch(function(error){next(error)});

		} catch(err) {
	        console.log('OOOOOOO this is the error: ' + err);
	    }
	}


	exports.generateExcel = function(req, res, next, vasos, detalle) {
		const WIDTH_L = 30;
		const WIDTH_M = 20;
		const HEADER_HEIGHT = 35;

		try {
			// Creamos el excel
			var Excel = require('exceljs');
			const tempfile = require('tempfile');
			var workbook = new Excel.Workbook();
			workbook.creator = 'Registros de mantenimiento';
			workbook.lastModifiedBy = 'Registros de mantenimiento';
			workbook.created = new Date();
			workbook.modified = new Date();
			workbook.lastPrinted = new Date();

			vasos.forEach(function(item) {
				// Añadimos una hoja por cada vaso
				var worksheet = workbook.addWorksheet('TABLA ' + item.nombre.toUpperCase(), {views: [ {state: 'nomral', showGridLines: false} ], pageSetup:{fitToPage: true, paperSize: 9, orientation: 'landscape'}});
				worksheet.columns = [
				    { header: 'Medición', key: 'nombre', width: WIDTH_L, style: {alignment: { vertical: 'middle', horizontal: 'center' }}},
				    { header: 'Muestros realizados', key: 'muestreos', width: WIDTH_M, style: {alignment: { vertical: 'middle', horizontal: 'center' }}},
				    { header: 'Muestreos conformes', key: 'cumple', width: WIDTH_M, style: {alignment: { vertical: 'middle', horizontal: 'center' }}},
				    { header: 'Valor Medio', key: 'media', width: WIDTH_M, style: {numFmt: '#,##0.00', alignment: { vertical: 'middle', horizontal: 'center' }}},
				    { header: 'Valor Máx', key: 'max', width: WIDTH_M, style: {numFmt: '#,##0.00', alignment: { vertical: 'middle', horizontal: 'center' }}},
				    { header: 'Valor Mín', key: 'min', width: WIDTH_M, style: {numFmt: '#,##0.00', alignment: { vertical: 'middle', horizontal: 'center' }}},
				    { header: 'Días Incumplimiento', key: 'incumplidos', width: WIDTH_M, style: {alignment: { vertical: 'middle', horizontal: 'center' }}}
				];

				// Configuramos la cabecera
				worksheet.getRow(1).height = HEADER_HEIGHT;
				worksheet.getRow(1).font = {
				    name: 'Calibri',
				    color: { argb: 'FF000000' },
				    family: 2,
				    size: 11,
				    bold: true
				};
				worksheet.getCell('A1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};
				worksheet.getCell('B1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};
				worksheet.getCell('C1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};
				worksheet.getCell('D1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};
				worksheet.getCell('E1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};
				worksheet.getCell('F1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};
				worksheet.getCell('G1').fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: {argb:'FFD9D9D9'}
				};

				// Rellenamos la fila
				detalle[item.id].forEach(function(row, index) {
					worksheet.addRow(detalle[item.id][index]);

					worksheet.getCell('A' + (index + 2)).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: {argb:'FF4F6228'}
					};
					worksheet.getCell('A' + (index + 2)).font = {
					    name: 'Calibri',
					    color: { argb: 'FFFFFFFF' },
					    family: 2,
					    size: 11,
					    bold: true
					};
				});

				// Dibujamos los bordes de las celdas
				var borderStyles = {
						  top: { style: "thin" },
						  left: { style: "thin" },
						  bottom: { style: "thin" },
						  right: { style: "thin" }
						};
				worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
					  row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
					    cell.border = borderStyles;
					  });
					});
			});

			// Descargamos el excel
			var tempFilePath = tempfile('.xlsx');
	        workbook.xlsx.writeFile(tempFilePath).then(function() {
	            console.log('file is written');

	            var today = new Date();
	            var filename = today.getFullYear() + '' + ("0" + (today.getMonth() + 1)).slice(-2) + '' + ("0" + (today.getDate())).slice(-2) + ' - Tabla SILOE ' + req.params.anio + ".xlsx";

	            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
	            res.setHeader('Content-Transfer-Encoding', 'binary');
	            res.setHeader('Content-Type', 'application/octet-stream');


	            res.sendFile(tempFilePath, function(err){
	                console.log('---------- error downloading file: ' + err);
	            });
	        });

		} catch(err) {
	        console.log('OOOOOOO this is the error: ' + err);
	    }
	}

	exports.resumenVaso = function(anio, vaso, callback) {
		var resumen = new Array();

		// Creamos una conexión a la base de datos
		var sequelize = new Sequelize(process.env.DATABASE_URL, {
			  storage: process.env.DATABASE_STORAGE
		});

		// Construimos el WHERE aplicando el filtro por año y vaso
		var where = " WHERE anio = " + anio + " AND vasoID = " + vaso.id + " ";

		var queries = [
			// PH
			"SELECT 'ph' as nombre, " +
				" count(*) as muestreo, " +
				" sum(ph_cumple) as cumple, " +
				" (avg(ph_m) + avg(ph_t)) / 2 as media, " +
				" max(ph_m) as max_m, max(ph_t) as max_t, " +
				" min(ph_m) as min_m, min(ph_t) as min_t " +
			" FROM Ensayoes " + where,

			// REDOX
			"SELECT 'potencial redox' as nombre, " +
				" count(*) as muestreo, " +
				" sum(redox_cumple) as cumple, " +
				" (avg(redox_m) + avg(redox_t)) / 2 as media, " +
				" max(redox_m) as max_m, max(redox_t) as max_t, " +
				" min(redox_m) as min_m, min(redox_t) as min_t " +
			" FROM Ensayoes " + where,

			// Tª agua
			"SELECT 'Tª agua' as nombre, " +
				" count(*) as muestreo, " +
				" sum(temp_cumple) as cumple, " +
				" (avg(temp_m) + avg(temp_t)) / 2 as media, " +
				" max(temp_m) as max_m, max(temp_t) as max_t, " +
				" min(temp_m) as min_m, min(temp_t) as min_t " +
			" FROM Ensayoes " + where,

			// Tiempo recirculacion
			"SELECT 'Tiempo recirculación' as nombre, " +
				" count(*) as muestreo, " +
				" sum(recirculacion_cumple) as cumple, " +
				" (avg(recirculacion_m) + avg(recirculacion_t)) / 2 as media, " +
				" max(recirculacion_m) as max_m, max(recirculacion_t) as max_t, " +
				" min(recirculacion_m) as min_m, min(recirculacion_t) as min_t " +
			" FROM Ensayoes " + where,

			// Transparencia
			"SELECT 'Transparencia' as nombre, " +
				" count(transparencia_cumple <> 'no ensaya') as muestreo, " +
				" sum(transparencia_cumple = 'cumple') as cumple, " +
				" 'n/a' as media, " +
				" 'n/a' as max_m, 'n/a' as max_t, " +
				" 'n/a' as min_m, 'n/a' as min_t " +
			" FROM Ensayoes " + where,

			// Espumas, Grasas y Materias …
			"SELECT 'Espumas, Grasas y Materias …' as nombre, " +
				" count(*) as muestreo, " +
				" sum(extranios_cumple = 'cumple') as cumple, " +
				" 'n/a' as media, " +
				" 'n/a' as max_m, 'n/a' as max_t, " +
				" 'n/a' as min_m, 'n/a' as min_t " +
			" FROM Ensayoes " + where,

			// Turbidez
			"SELECT 'Turbidez' as nombre, " +
				" count(*) as muestreo, " +
				" sum(turbidez_cumple) as cumple, " +
				" (avg(turbidez_m) + avg(turbidez_t)) / 2 as media, " +
				" max(turbidez_m) as max_m, max(turbidez_t) as max_t, " +
				" min(turbidez_m) as min_m, min(turbidez_t) as min_t " +
			" FROM Ensayoes " + where,

			// Acido Isocianurico
			"SELECT 'Ácido Isocianúrico' as nombre, " +
				" count(*) as muestreo, " +
				" sum(isocianuro_cumple) as cumple, " +
				" (avg(isocianuro_m) + avg(isocianuro_t)) / 2 as media, " +
				" max(isocianuro_m) as max_m, max(isocianuro_t) as max_t, " +
				" min(isocianuro_m) as min_m, min(isocianuro_t) as min_t " +
			" FROM Ensayoes " + where,

			// Bromo total
			"SELECT 'Bromo total' as nombre, " +
				" count(*) as muestreo, " +
				" sum(bromo_cumple) as cumple, " +
				" (avg(bromo_m) + avg(bromo_t)) / 2 as media, " +
				" max(bromo_m) as max_m, max(bromo_t) as max_t, " +
				" min(bromo_m) as min_m, min(bromo_t) as min_t " +
			" FROM Ensayoes " + where,

			// Cloro
			"SELECT 'Cloro libre' as nombre, " +
				" count(*) as muestreo, " +
				" sum(cloro_cumple) as cumple, " +
				" (avg(cloro_m) + avg(cloro_t)) / 2 as media, " +
				" max(cloro_m) as max_m, max(cloro_t) as max_t, " +
				" min(cloro_m) as min_m, min(cloro_t) as min_t " +
			" FROM Ensayoes " + where,

			// Cloro combinado
			"SELECT 'Cloro combinado' as nombre, " +
				" count(*) as muestreo, " +
				" sum(cloro_combinado_cumple) as cumple, " +
				" (avg(cloro_combinado_m) + avg(cloro_combinado_t)) / 2 as media, " +
				" max(cloro_combinado_m) as max_m, max(cloro_combinado_t) as max_t, " +
				" min(cloro_combinado_m) as min_m, min(cloro_combinado_t) as min_t " +
			" FROM Ensayoes " + where,

			// Humedad
			"SELECT 'Humedad' as nombre, " +
				" count(*) as muestreo, " +
				" sum(humedad_cumple) as cumple, " +
				" (avg(humedad_m) + avg(humedad_t)) / 2 as media, " +
				" max(humedad_m) as max_m, max(humedad_t) as max_t, " +
				" min(humedad_m) as min_m, min(humedad_t) as min_t " +
			" FROM Ensayoes " + where,

			// Diferencia CO2
			"SELECT 'Diferencia CO2' as nombre, " +
				" count(*) as muestreo, " +
				" sum(co2_interior_cumple = 1 AND co2_exterior_cumple = 1) as cumple, " +
				" (avg(co2_interior_m - co2_exterior_m) + avg(co2_interior_t - co2_exterior_t)) / 2 as media, " +
				" max(co2_interior_m - co2_exterior_m) as max_m, max(co2_interior_t - co2_exterior_t) as max_t, " +
				" min(co2_interior_m - co2_exterior_m) as min_m, min(co2_interior_t - co2_exterior_t) as min_t " +
			" FROM Ensayoes " + where,

			// E.Coli
			"SELECT 'E.Coli' as nombre, " +
				" count(*) as muestreo, " +
				" sum(ecoli_cumple = 'cumple') as cumple, " +
				" 'n/a' as media, " +
				" 'n/a' as max_m, 'n/a' as max_t, " +
				" 'n/a' as min_m, 'n/a' as min_t " +
			" FROM Ensayoes " + where,

			// Legionella spp
			"SELECT 'Legionella spp' as nombre, " +
				" count(*) as muestreo, " +
				" sum(legionella_cumple) as cumple, " +
				" (avg(legionella_m) + avg(legionella_t)) / 2 as media, " +
				" max(legionella_m) as max_m, max(legionella_t) as max_t, " +
				" min(legionella_m) as min_m, min(legionella_t) as min_t " +
			" FROM Ensayoes " + where,

			// P.Aeruginosa
			"SELECT 'P.Aeruginosa' as nombre, " +
				" count(*) as muestreo, " +
				" sum(pseudomona_cumple = 'cumple') as cumple, " +
				" 'n/a' as media, " +
				" 'n/a' as max_m, 'n/a' as max_t, " +
				" 'n/a' as min_m, 'n/a' as min_t " +
			" FROM Ensayoes " + where,

			// Enterococos
			"SELECT 'Enterococos' as nombre, " +
				" count(*) as muestreo, " +
				" sum(enterococos_cumple = 'cumple') as cumple, " +
				" 'n/a' as media, " +
				" 'n/a' as max_m, 'n/a' as max_t, " +
				" 'n/a' as min_m, 'n/a' as min_t " +
			" FROM Ensayoes " + where,

			// Staphlylococos
			"SELECT 'Staphlylococos' as nombre, " +
				" count(*) as muestreo, " +
				" sum(staphlylococcus_cumple = 'cumple') as cumple, " +
				" 'n/a' as media, " +
				" 'n/a' as max_m, 'n/a' as max_t, " +
				" 'n/a' as min_m, 'n/a' as min_t " +
			" FROM Ensayoes " + where,

			// Indice de Langelier
			"SELECT 'Indice de Langelier' as nombre, " +
				" count(*) as muestreo, " +
				" sum(langelier_cumple) as cumple, " +
				" (avg(langelier_m) + avg(langelier_t)) / 2 as media, " +
				" max(langelier_m) as max_m, max(langelier_t) as max_t, " +
				" min(langelier_m) as min_m, min(langelier_t) as min_t " +
			" FROM Ensayoes " + where

		].join(' UNION ALL ');

		sequelize.query(queries).spread((results, metadata) => {
			results.forEach(function(item) {
				var ref = item;
				if ('0' in item) {
					ref = item[0];
				}
				resumen.push({
					nombre: ref.nombre,
					muestreos: ref.muestreo,
					cumple: ref.cumple,
					media: ref.media,
					max: (ref.max_m >= ref.max_t ? ref.max_m : ref.max_t),
					min: (ref.min_m <= ref.min_t ? ref.min_m : ref.min_t),
					incumplidos: ref.muestreo - ref.cumple
				});
			})

			callback(vaso.id, resumen);
		});



		return resumen;
	}







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
