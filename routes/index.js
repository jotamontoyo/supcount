
	var express = require('express');
	var multer = require('multer');
	var storage = multer.memoryStorage();
	var upload = multer({ storage: storage }).single('image');
	var router = express.Router();
	var quizController = require('../controllers/quiz_controller');						// importa el controlador quiz_controller.js
	var commentController = require('../controllers/comment_controller');				// importa el controlador comment_controller.js
	var sessionController = require('../controllers/session_controller');				// importa el controlador session_controller.js
	var contadorController = require('../controllers/contador_controller');				// importa el controlador contador_controller.js
	var criterioController = require('../controllers/criterio_controller');				// importa el controlador criterio_controller.js
	var statisticsController = require('../controllers/statistic_controller');
	var dbController = require('../controllers/db_controller');
	var userController = require('../controllers/user_controller');
	var proveedorController = require('../controllers/proveedor_controller');
	var invitadoController = require('../controllers/invitado_controller');
	var centroController = require('../controllers/centro_controller');
	var contactoController = require('../controllers/contacto_controller');
	var vasoController = require('../controllers/vaso_controller');
	var siloeController = require('../controllers/siloe_controller');
	var ensayoController = require('../controllers/ensayo_controller');

	router.get('/', function (req, res) {													/* GET home page. */
		res.render('index', {title: 'Registros de Mantemiento', errors: []});				// cuando renderice la vista index.ejs le pasa el objeto title: 'Quiz'
	});

	router.param('quizId', 								quizController.load);				// autoload de comandos. peticiones GET con SQL
	router.param('claveinvitado',						invitadoController.load);			// autoload de comandos. peticiones GET con SQL
	router.param('commentId',							commentController.load);
	router.param('userId',								userController.load);
	router.param('proveedorId',							proveedorController.load);
	router.param('contadorId',							contadorController.load);
	router.param('criterioId',							criterioController.load);
	router.param('centroId',							centroController.load);
	router.param('contactoId',							contactoController.load);
	router.param('vasoId',								vasoController.load);
	router.param('vasoId',								vasoController.load);
	router.param('siloeId',								siloeController.load);
	router.param('ensayoId',							ensayoController.load);



	// Definición de rutas de sesion
	router.get('/login',  								sessionController.new);     		// formulario login
	router.post('/login', 								sessionController.create);  		// crear sesión
	router.get('/logout', 								sessionController.destroy); 		// destruir sesión



	// Definición de rutas de cuenta
	router.get('/user',                                 sessionController.loginRequired, userController.index);
	router.get('/user/new',  							sessionController.loginRequired, userController.new);     			// formulario sign
	router.post('/user/create',  						sessionController.loginRequired, userController.create);     		// registrar usuario
	router.get('/user/:userId(\\d+)/edit',  			sessionController.loginRequired, userController.ownershipRequired, userController.edit);     	// editar información de cuenta
	router.put('/user/:userId(\\d+)',  					sessionController.loginRequired, userController.ownershipRequired, userController.update);     	// actualizar información de cuenta
	router.delete('/user/:userId(\\d+)/destroy',		sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
	router.get('/user/:userId(\\d+)/quizes',			sessionController.loginRequired, quizController.index);



	// Definición de rutas de quizes
	router.get('/quizes',			 					sessionController.loginRequired, quizController.index);				// accede a la lista completa de partes /quizes/index.ejs
	router.get('/quizes/mes_index',	 					sessionController.loginRequired, quizController.mes_index);			// formulario para seleccionar mes y año
	router.post('/quizes/mes_index_show',				sessionController.loginRequired, quizController.mes_index_show);	// accede a la lista de partes /quizes/index.ejs selecionando mes y año
	router.get('/quizes/resumen_index',			 		sessionController.loginRequired, quizController.resumen_index);		// formulario para seleccionar mes y año del resumen
	router.post('/quizes/resumen',			 			sessionController.loginRequired, quizController.resumen);			// genera el informe
	router.get('/quizes/:quizId(\\d+)/print',			sessionController.loginRequired, quizController.ownershipRequired, quizController.print);
	router.get('/quizes/chart_consumos',				sessionController.loginRequired, quizController.chart_consumos);
	router.get('/quizes/opened',			 			quizController.opened);												// accede a la lista de partes abiertos /quizes/index.ejs
	router.get('/quizes/closed',			 			quizController.closed);												// accede a la lista de partes cerrados /quizes/index.ejs
	router.get('/quizes/:quizId(\\d+)',					sessionController.loginRequired, quizController.show);				// accede a una pregunta en concreto. envia al quizController la peticion GET con el parametro quizId (indice)
	router.get('/quizes/:quizId(\\d+)/answer',			quizController.answer);												// se dispara cuando submit del form question.ejs hacia la ruta /quizes/answer. le pasa el id en la peticion GET req
	router.get('/quizes/new',							sessionController.loginRequired, quizController.new);				// carga el formulario /quizes/new si sessionController.loginRequired()
	router.post('/quizes/create',						sessionController.loginRequired, upload, quizController.create);	// dispara controlador create cuando el boton <salvar> del formulario new.js
	router.get('/quizes/:quizId(\\d+)/edit',			sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);				// carga formulario quizes/quizes:Id(\\d+)/edit y dispara el controlador edit de quiz_Controller
	router.put('/quizes/:quizId(\\d+)',					sessionController.loginRequired, quizController.ownershipRequired, upload, quizController.update);	// dispara controlador update cuando el boton <salvar> del formulario edit.js
	router.delete('/quizes/:quizId(\\d+)',				sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);
	router.get('/quizes/statistics',					statisticsController.calculate, statisticsController.show);
	router.get('/quizes/:quizId(\\d+)/image', 			quizController.image);												// se dispara cuando se carga una img en el formulario show
	router.post('/quizes/uploadimg',                    quizController.uploadimg);
	// router.get('/quizes:search',	                	quizController.search);




	// Definición de rutas de comments
	router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/update',		sessionController.loginRequired, commentController.ownershipRequired, commentController.update);
	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',   	sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);	//
	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/unpublish',   	sessionController.loginRequired, commentController.ownershipRequired, commentController.unpublish);	//
	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/destroy',   	sessionController.loginRequired, commentController.ownershipRequired, commentController.destroy);	//



	// Deficion de rutas de Contadores
	router.get('/contadores',													sessionController.loginRequired, contadorController.index);
	router.get('/contadores/new',												sessionController.loginRequired, contadorController.new);
	router.post('/contadores/create',											sessionController.loginRequired, contadorController.create);
	router.get('/contadores/:contadorId(\\d+)/edit',							sessionController.loginRequired, contadorController.edit);
	router.put('/contadores/:contadorId(\\d+)/update',							sessionController.loginRequired, contadorController.update);
	router.get('/contadores/:contadorId(\\d+)',									sessionController.loginRequired, contadorController.show);
	router.delete('/contadores/:contadorId(\\d+)/destroy',						sessionController.loginRequired, contadorController.destroy);



	// Deficion de rutas de Criterios
	router.get('/contadores/:contadorId(\\d+)/criterios/new',								criterioController.new);						// carga el formulario new
	router.post('/contadores/:contadorId(\\d+)/criterios/create',							criterioController.create);
	router.get('/contadores/:contadorId(\\d+)/criterios/:criterioId(\\d+)/edit',   			sessionController.loginRequired, criterioController.ownershipRequired, criterioController.edit);
	router.put('/contadores/:contadorId(\\d+)/criterios/:criterioId(\\d+)/update',   		sessionController.loginRequired, criterioController.ownershipRequired, criterioController.update);
	router.delete('/contadores/:contadorId(\\d+)/criterios/:criterioId(\\d+)/destroy',   	criterioController.destroy);




	// Deficion de rutas de Centros
	router.get('/centros',													sessionController.loginRequired, centroController.index);
	router.get('/centros/new',												sessionController.loginRequired, centroController.new);
	router.post('/centros/create',											sessionController.loginRequired, centroController.create);
	router.get('/centros/:centroId(\\d+)/edit',								sessionController.loginRequired, centroController.edit);
	router.put('/centros/:centroId(\\d+)/update',							sessionController.loginRequired, centroController.update);
	router.delete('/centros/:centroId(\\d+)/destroy',						sessionController.loginRequired, centroController.destroy);






	// Definición de rutas de Contacto
	router.get('/contactos',			 					sessionController.loginRequired, contactoController.index);				// accede a la lista completa de proveedores
	router.get('/contactos/new',							sessionController.loginRequired, contactoController.new);				// carga el formulario /proveedores/new si sessionController.loginRequired()
	router.post('/contactos/create',						sessionController.loginRequired, contactoController.create);			// dispara controlador create cuando el boton <salvar> del formulario tanto del index ppral como de la vista webform
	router.post('/contactos/webcreate',						contactoController.webcreate);											// dispara controlador webcreate cuando el boton <salvar> del formulario new.js
	router.get('/contactos/:contactoId(\\d+)/edit',			sessionController.loginRequired, contactoController.edit);				// carga formulario proveedores/proveedores:Id(\\d+)/edit y dispara el controlador edit de proveedorController
	router.put('/contactos/:contactoId(\\d+)/update',		sessionController.loginRequired, contactoController.update);			// dispara controlador update cuando el boton <salvar> del formulario edit.js
	router.delete('/contactos/:contactoId(\\d+)/destroy',	sessionController.loginRequired, contactoController.destroy);





	// Deficion de rutas de Vaso
	router.get('/vasos',									sessionController.loginRequired, vasoController.index);
	router.get('/vasos/new',								sessionController.loginRequired, vasoController.new);				// carga el formulario /proveedores/new si sessionController.loginRequired()
	router.post('/vasos/create',							sessionController.loginRequired, vasoController.create);			// dispara controlador create cuando el boton <salvar> del formulario tanto del index ppral como de la vista webform
	router.get('/vasos/:vasoId(\\d+)/edit',					sessionController.loginRequired, vasoController.edit);				// carga formulario proveedores/proveedores:Id(\\d+)/edit y dispara el controlador edit de proveedorController
	router.put('/vasos/:vasoId(\\d+)/update',				sessionController.loginRequired, vasoController.update);			// dispara controlador update cuando el boton <salvar> del formulario edit.js
	router.delete('/vasos/:vasoId(\\d+)/destroy',			sessionController.loginRequired, vasoController.destroy);





	// Definición de rutas de Siloe
	router.get('/siloes',			 						sessionController.loginRequired, siloeController.index);				// accede a la lista completa de partes /siloes/index.ejs
	router.get('/siloes/mes_index',	 						sessionController.loginRequired, siloeController.mes_index);			// formulario para seleccionar mes y año
	router.post('/siloes/mes_index_show',					sessionController.loginRequired, siloeController.mes_index_show);		// accede a la lista de partes /quizes/index.ejs selecionando mes y año
	router.get('/siloes/resumen_index',			 			sessionController.loginRequired, siloeController.resumen_index);		// formulario para seleccionar año y descargar Excel
	router.get('/siloes/resumen_index_vaso', 	 			sessionController.loginRequired, siloeController.resumen_index_vaso);   // formulario para seleccionar mes y año del resumen
	router.put('/siloes/ver_resumen_vaso', 	 				sessionController.loginRequired, siloeController.ver_resumen_vaso);     // ejecuta la consulta con los parametros del formulario
	router.get('/siloes/new',								sessionController.loginRequired, siloeController.new);					// carga el formulario /siloes/new si sessionController.loginRequired()
	router.post('/siloes/create',							sessionController.loginRequired, siloeController.create);				// dispara controlador create cuando el boton <salvar> del formulario new.js
	router.get('/siloes/:anio(\\d+)/excel',					sessionController.loginRequired, siloeController.downloadExcel);		// genera el informe de siloes
	router.get('/siloes/:siloeId(\\d+)/edit',				sessionController.loginRequired, siloeController.ownershipRequired, siloeController.edit);				// carga formulario quizes/quizes:Id(\\d+)/edit y dispara el controlador edit de quiz_Controller
	router.put('/siloes/:siloeId(\\d+)',					sessionController.loginRequired, siloeController.ownershipRequired, siloeController.update);	// dispara controlador update cuando el boton <salvar> del formulario edit.js
	router.get('/siloes/:siloeId(\\d+)',					sessionController.loginRequired, siloeController.show);
	router.get('/siloes/:siloeId(\\d+)/print',				sessionController.loginRequired, siloeController.ownershipRequired, siloeController.print);
	router.delete('/siloes/:siloeId(\\d+)/destroy',			sessionController.loginRequired, siloeController.destroy);




	// Definición de rutas de Ensayo
	router.put('/siloes/:siloeId(\\d+)/ensayos/:ensayoId(\\d+)/update',				sessionController.loginRequired, ensayoController.ownershipRequired, ensayoController.update);




	// Definición de rutas de proveedor
	router.get('/proveedores',			 					sessionController.loginRequired, proveedorController.index);												// accede a la lista completa de proveedores
	router.get('/proveedores/new',							sessionController.loginRequired, proveedorController.new);				// carga el formulario /proveedores/new si sessionController.loginRequired()
	router.post('/proveedores/create',						sessionController.loginRequired, proveedorController.create);			// dispara controlador create cuando el boton <salvar> del formulario new.js
	router.get('/proveedores/:proveedorId(\\d+)/edit',		sessionController.loginRequired, proveedorController.edit);				// carga formulario proveedores/proveedores:Id(\\d+)/edit y dispara el controlador edit de proveedorController
	router.put('/proveedores/:proveedorId(\\d+)',			sessionController.loginRequired, proveedorController.update);			// dispara controlador update cuando el boton <salvar> del formulario edit.js
	router.delete('/proveedores/:proveedorId(\\d+)',		sessionController.loginRequired, proveedorController.destroy);




	router.get('/temas',			 						quizController.showtemas);
	router.get('/temas/:tema', 								quizController.showbytema);

	router.get('/profile/author', function(req, res) {
		res.render('profile/author', {title: 'Autor', errors: []});						// visualiza el autor
	});

	router.get('/db/index',								sessionController.loginRequired, dbController.show);

	module.exports = router;
