
	var models = require('../models/models.js');
	var fs = require('fs-extra');       						//File System - for file manipulation
	var Sequelize = require('sequelize');

	exports.ownershipRequired = function(req, res, next){   	// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o si es cuenta admin
	    var objQuizOwner = req.quiz.UserId;						// userId del quiz
	    var logUser = req.session.user.id;						// userId de la sesion
	    var isAdmin = req.session.user.isAdmin;					// valor de isAdmin
	    if (isAdmin || objQuizOwner === logUser) {				// comprueba que el user del quiz es el mismo que el user logueado
	        next();
	    } else {
	        res.redirect('/');
	    }
	};

	exports.load = function(req, res, next, quizId) {			// autoload. solo se ejecuta si en la peticion GET existe un :quizId. ayuda a factorizar el codigo del resto de controladores
		models.Quiz.find({										// carga de registro quiz
			where: 		{id: Number(quizId)},					// where indice principal id <-- quizId recibido del GET
			include: 	[{model: models.Comment}],				// incluye la tabla Comment como hijo
			order:		[[models.Comment, 'codigo', 'ASC']]		// y la ordena por codigo
			}).then(function(quiz) {
				if (quiz) {
					req.quiz = quiz;
					next();
				} else {
					next(new Error('No existe quizId=' + quiz[id]));
				}
			}
		).catch(function(error) {next(error);});
	};



	var fecha = new Date();
	var mes = fecha.getUTCMonth() + 1;
	var anio = fecha.getUTCFullYear();




	// GET /quizes   										--->>> GET sin req.user
	// GET /users/:userId/quizes							--->>> GET con req.user
	exports.index = function(req, res, next) {

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

	  	models.Quiz.findAll(options).then(					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id
	    	function(quizes) {
	      		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	    	}
	  	).catch(function(error){next(error)});

	};






	exports.mes_index = function(req, res) {

		fecha = new Date();

		var mes_index = {
			mes: fecha.getUTCMonth() + 1,
			anio: fecha.getUTCFullYear()
		};

		res.render('quizes/mes_index', {mes_index: mes_index, errors: []});

	};



	// GET /quizes   										--->>> GET sin req.user
	// GET /users/:userId/quizes							--->>> GET con req.user
	exports.mes_index_show = function(req, res, next) {

		mes = Number(req.body.mes_index.mes);
		anio = Number(req.body.mes_index.anio);

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

	  	models.Quiz.findAll(options).then(					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id
	    	function(quizes) {
	      		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	    	}
	  	).catch(function(error){next(error)});

	};





	exports.resumen_index = function(req, res) {

		var fecha = new Date();

		var resumen = {
			imprimir: 0,
			mes: fecha.getUTCMonth() + 1,
			anio: fecha.getUTCFullYear()
		};

		res.render('quizes/resumen_index', {resumen: resumen, errors: []});

	};






	exports.resumen = function(req, res, next) {

		var imprimir = req.body.resumen.imprimir;

		var mes = parseInt(req.body.resumen.mes),
			mes_siguiente = mes + 1,
			anio = parseInt(req.body.resumen.anio),
			anio_siguiente = anio;

		if (mes === 12) {
			mes_siguiente = 1;
			anio_siguiente = anio + 1;
		};

		var options = {
			where: Sequelize.or(				// segun la version de Sequelize he de usar una u otra estructura de consulta
				Sequelize.and(
					{mes: mes},
					{anio: anio},
					{centro: req.session.user.centro}
				),
				Sequelize.and(
					{dia: 1},
					{mes: mes_siguiente},
					{anio: anio_siguiente},
					{centro: req.session.user.centro}
				)
			),
			include: [{model: models.Comment}],
			order: [['fecha', 'ASC'], [models.Comment, 'codigo', 'ASC' ]]
		};

		models.Quiz.findAll(options).then(function(quizes) {
			models.Contador.findAll({
				where: {centro: req.session.user.centro},
				order: [['id', 'ASC']]
			}).then(function(contadores) {
				var anterior = 0;
				for (let i in quizes) {								// hallar consumo
					if (i > 0) {anterior = i - 1};
					for (let x in quizes[i].comments) {
						if (quizes[anterior].comments[x]) {						// por si no hay lectura anterior. para que no dé error undefined
							if (!quizes[anterior].comments[x].deposito) {		// pregunta si es o no deposito para hacer el calculo
								quizes[anterior].comments[x].consumo = (quizes[i].comments[x].lectura_actual - quizes[anterior].comments[x].lectura_actual);
							} else {
								quizes[anterior].comments[x].consumo = (quizes[anterior].comments[x].lectura_actual - (quizes[i].comments[x].lectura_actual - quizes[anterior].comments[x].carga)); // .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
							};
							if (quizes[anterior].comments[x].consumo > quizes[anterior].comments[x].maximo) { quizes[anterior].comments[x].cumple = false };
						};
					};
				};
				res.render('quizes/resumen', {quizes: quizes, contadores: contadores, imprimir: imprimir, errors: []});
			}).catch(function(error){next(error)});
		}).catch(function(error){next(error)});

	};





	exports.print = function(req, res) {

		models.Comment.findAll({
			where: {QuizId: req.quiz.id},
			order: [['nombre', 'ASC']]
		}).then( comments => {
			res.render('quizes/imprimir_lecturas', {comments: comments, quiz: req.quiz, errors: []});
		});

	};





	exports.chart_consumos = function(req, res) {

		var Chart = require('chart.js');

		var ctx = req.body.myChart;

		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		        datasets: [{
		            label: '# of Votes',
		            data: [12, 19, 3, 5, 2, 3],
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});

		console.log('chart........: ' + myChart);

		res.render('quizes/chart_consumos', {myChart: myChart, errors: []});


	};






	exports.show = function(req, res) {											// GET /quizes/:id

		res.render('quizes/show', {quiz: req.quiz, errors: []});				// renderiza la vista /quizes/show del quizId selecionado con load find()

	};







	exports.new = function(req, res) {																				// GET /quizes/new, baja el formulario

		var fecha = new Date();
		var dia = ("0" + fecha.getUTCDate()).slice(-2);
		var mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);														// se le añade 1 porque van de 0 a 11
		var anio = fecha.getUTCFullYear();

		var quiz = models.Quiz.build( 																				// crea el objeto quiz, lo construye con buid() metodo de sequilize
			{pregunta: "Motivo", respuesta: "Respuesta", proveedor: "Proveedor", centro: "Central", dia: dia, mes: mes, anio: anio}		// asigna literales a los campos pregunta y respuestas para que se vea el texto en el <input> cuando creemos el formulario
		);

		models.Proveedor.findAll().then(function(proveedor) {
			res.render('quizes/new', {quiz: quiz, proveedor: proveedor, errors: []});   							// renderiza la vista quizes/new
		});


	};








	exports.create = function(req, res) {														// POST /quizes/create

		req.body.quiz.UserId = req.session.user.id;												// referenciamos el quiz con el UserId
		req.body.quiz.UserName = req.session.user.username;
		req.body.quiz.centro = req.session.user.centro;

		var quiz = models.Quiz.build( req.body.quiz );											// construccion de objeto quiz para luego introducir en la tabla
		quiz.fecha = new Date(req.body.quiz.anio, req.body.quiz.mes - 1, req.body.quiz.dia);     // captura la fecha del form y la añade al quiz con clase Date()

		var errors = quiz.validate();															// objeto errors no tiene then(
		if (errors) {
			var i = 0;
			var errores = new Array();															// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('quizes/new', {quiz: quiz, errors: errores});
		} else {
			quiz
			.save({fields: ["pregunta", "respuesta", "tema", "UserId", "UserName", "proveedor", "centro", "fecha", "dia", "mes", "anio"]})
			.then(function() {

				models.Contador.findAll({

					where: {centro: req.session.user.centro},

		            order: [['id', 'ASC']]

		        }).then(function(contador) {

					for (let i in contador) {											// crea tantas Lecturas como Contadores

						models.Criterio.find({

							where: {ContadorId: contador[i].id, mes: quiz.mes}			// busca criterio del contador segun el mes del parte

						}).then(function(criterio) {

							var comment = models.Comment.build({						// se crea la lectura

								codigo: contador[i].id,
								nombre: contador[i].nombre,
								ubicacion: contador[i].ubicacion,
								deposito: contador[i].deposito,
								tolerancia: contador[i].tolerancia,
								carga: 0,
								lectura_actual: 0,
								maximo: criterio.max,									// le pasa el comsumo maximo previsto
								texto: '',
								publicado: true,
								fecha: quiz.fecha,
								dia: quiz.dia,
								mes: quiz.mes,
								anio: quiz.anio,
								QuizId: quiz.id											// al comment se le pasa el quizId del quiz para establecer la integridad referencial entre Quiz y Comment. indice secundario de Comment

							});

							var errors = comment.validate();
							if (errors) {
								let i = 0;
								var errores = new Array();
								for (var prop in errors) errores[i++] = {message: errors[prop]};
								res.render('comments/new', {comment: comment, errors: errores});
							} else {
								comment 																		// save: guarda en DB campos pregunta y respuesta de quiz
								.save()
								.then(function() {});
							};

						});

					};

				});

				res.redirect('/quizes');

			});

		};



	};










	exports.edit = function(req, res) {															// carga formulario edit.ejs
		var quiz = req.quiz;																	// req.quiz viene del autoload
		models.Proveedor.findAll().then(function(proveedor) {
			res.render('quizes/edit', {quiz: quiz, proveedor: proveedor, errors: []});   		// renderiza la vista quizes/edit junto con la lista de todos los proveedores
		});
	};








	exports.update = function(req, res) {										// modifica un quiz
//		req.quiz.fecha = req.body.quiz.fecha;

		req.quiz.fecha = new Date(req.body.quiz.anio, req.body.quiz.mes - 1, req.body.quiz.dia);
		req.quiz.dia = req.body.quiz.dia;
		req.quiz.mes = req.body.quiz.mes;
		req.quiz.anio = req.body.quiz.anio;

		req.quiz.pregunta = req.body.quiz.pregunta;
		req.quiz.respuesta = req.body.quiz.respuesta;
		req.quiz.centro = req.body.quiz.centro;
		req.quiz.proveedor = req.body.quiz.proveedor;
		req.quiz.estado = req.body.quiz.estado;

		var fecha_actual = new Date();

		var errors = req.quiz.validate();
		if (errors) {
			var i = 0;
			var errores = new Array();																				// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('quizes/edit', {quiz: req.quiz, errors: errores});
		} else {
			if (((fecha_actual - req.quiz.fecha) < (48*60*60*1000)) || (req.session.user.isAdmin)) {				// control de la antiguedad del parte

				req.quiz
				.save({fields: ["fecha", "pregunta", "respuesta", "centro", "proveedor", "estado", "dia", "mes", "anio"]})
				.then(function() {res.redirect('/quizes')});

			} else {

				res.render('avisos/aviso_max_antiguedad', {errors: []});

			};

		};

	};








	exports.destroy = function(req, res) {
		req.quiz.destroy().then(function() {
			for (var i in req.quiz.comments) {
				req.quiz.comments[i].destroy();
			};
			res.redirect('/quizes');
		}).catch(function(error) {next(error)});
	};

	exports.showtemas = function(req, res, next){
		models.Quiz.findAll(
			{
				attributes:['tema'],
				group: ['tema']
			}
		).then(
			function(quizes) {
				res.render('temas/index', { quizes: quizes, errors: []});
			}
		).catch(function(error) { next(error)});
	};

	exports.showbytema = function(req, res){
		models.Quiz.findAll({
			where: {tema: req.params.tema}
		}).then(
			function(quizes) {
				res.render('temas/showbytema.ejs', { quizes: quizes, errors: []});
			}
		).catch(function(error) {next(error)});
	};


	exports.image = function(req, res) {				// devuelve en la respuesta la imagen del quizId: solicitado
		res.send(req.quiz.image);
	};


	exports.uploadimg = function(req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            fstream = fs.createWriteStream('public/img/' + filename);					// Path where image will be uploaded
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("Upload Finished of " + filename);
                res.redirect('back');           										// where to go next
            });
        });
    };



	// exports.search = function(req, res, next) {
	//
	// 	models.Quiz.findAll({
	// 		where: {
	// 			id: req.params.search,
	// 			centro: req.session.user.centro
	// 		},
	// 		order: [['id', 'ASC']]
	// 	}).then( quizes => {
	//
	// 		console.log('search.......:' + req.params.search);
	// 		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	//
	// 	}).catch( error => {
	// 		next(error);
	// 	});
	//
	// };




	exports.opened = function(req, res) {
		models.Quiz.findAll({
			where: {estado: true, UserId: req.session.user.id}
		}).then(
			function(quizes) {
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}
		).catch(function(error){next(error)});
	};

	exports.closed = function(req, res) {
		models.Quiz.findAll({
			where: {estado: false, UserId: req.session.user.id}
		}).then(
			function(quizes) {
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}
		).catch(function(error){next(error)});
	};
	exports.answer = function(req, res) {										// GET /quizes/answer/:id
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {						// comprueba la variable respuesta de la peticion GET req recibida del form question.ejs vs req.quiz.respuesta, que es la respuesta que devuelve find() del autoload
			resultado = 'Correcto';
		};
		res.render('quizes/answer', {											// renderiza /views/answer.ejs con el objeto quiz y respuesta
			quiz: req.quiz,
			respuesta: resultado,
			errors: []
		});
	};




	/*				for (let i in quizes) {

						for (let x in quizes[i].comments) {

							if (quizes[i].comments[x].consumo > quizes[i].comments[x].maximo) {

								console.log('consumo...........: ' + quizes[i].comments[x].consumo);
								console.log('maximo...........: ' + quizes[i].comments[x].maximo);

								quizes[i].comments[x].cumple = false;

							};


						};
					}; */


	/*				for (let i in quizes) {

						for (let x in quizes[i].comments) {


							buscarCriterio(quizes[i].comments[x].codigo, quizes[i].comments[x].mes)
								.then((criterio) => {

									console.log('parte id.......: ' + quizes[i].id);
									console.log('lectura id.......: ' + quizes[i].comments[x].id);
									console.log('maximo.......: ' + criterio.max);
									console.log('consumo...........: ' + quizes[i].comments[x].consumo);

	//								quizes[i].comments[x].maximo = criterio.max;
	//								console.log('maximo...........: ' + quizes[i].comments[x].maximo);

									if (quizes[i].comments[x].consumo > criterio.max) {

	//									console.log('consumo...........: ' + quizes[i].comments[x].consumo);
	//									console.log('maximo...........: ' + quizes[i].comments[x].maximo);

										quizes[i].comments[x].cumple = false;


									};

									console.log('cumple...: ' + quizes[i].comments[x].cumple);


								}).catch((err) => {
									next(error);
								});






						};

					}; */



/*					buscarCriterio = function(ContadorId, mes) {

				  		return new Promise((resolve, reject) => {

				    		models.Criterio.find({

				      			where: {ContadorId: ContadorId, mes: mes}

				    		}).then(function(criterio) {

				      			resolve(criterio);

				    		}).catch(function(error) {

				      			reject(error)

				    		});

						});

					}; */



					/*		where: {
								$or: [
									{
										$and: {
							  				mes: 3,
							  				anio: 2017
										}
									},
									{
										$and: {
							  				dia: 1,
							  				mes: 4,
							  				anio: 2017
										}
									}
								]
							}, */





				/*			where: {
				  				$or: [
				    				$and: {
				      					mes: 3,
				      					anio: 2017
				    				},
				    				{
				      					$and: {
				        					dia: 1,
				        					mes: 4,
				        					anio: 2017
				      					}
				    				}
				  				]
							}, */
