
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

	router.get('/', function (req, res) {													/* GET home page. */
		res.render('index', {title: 'inciPro', errors: []});								// cuando renderice la vista index.ejs le pasa el objeto title: 'Quiz'
	});

	router.param('quizId', 								quizController.load);				// autoload de comandos. peticiones GET con SQL
	router.param('claveinvitado',						invitadoController.load);			// autoload de comandos. peticiones GET con SQL
	router.param('commentId',							commentController.load);
	router.param('userId',								userController.load);
	router.param('proveedorId',							proveedorController.load);
	router.param('contadorId',							contadorController.load);
	router.param('criterioId',							criterioController.load);

	// Definición de rutas de sesion
	router.get('/login',  								sessionController.new);     		// formulario login
	router.post('/login', 								sessionController.create);  		// crear sesión
	router.get('/logout', 								sessionController.destroy); 		// destruir sesión

	// Definición de rutas de cuenta
	router.get('/user',  								userController.new);     			// formulario sign
	router.post('/user',  								userController.create);     		// registrar usuario
	router.get('/user/:userId(\\d+)/edit',  			sessionController.loginRequired, userController.ownershipRequired, userController.edit);     	// editar información de cuenta
	router.put('/user/:userId(\\d+)',  					sessionController.loginRequired, userController.ownershipRequired, userController.update);     	// actualizar información de cuenta
	router.delete('/user/:userId(\\d+)',  				sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
	router.get('/user/:userId(\\d+)/quizes',			quizController.index);

	// Definición de rutas de quizes
	router.get('/quizes',			 					sessionController.loginRequired, quizController.index);				// accede a la lista completa de partes /quizes/index.ejs
	router.get('/quizes/mes_index',	 					sessionController.loginRequired, quizController.mes_index);			// formulario para seleccionar mes y año
	router.post('/quizes/mes_index_show',				sessionController.loginRequired, quizController.mes_index_show);	// accede a la lista de partes /quizes/index.ejs selecionando mes y año
	router.get('/quizes/resumen_index',			 		sessionController.loginRequired, quizController.resumen_index);		// formulario para seleccionar mes y año del resumen
	router.post('/quizes/resumen',			 			sessionController.loginRequired, quizController.resumen);			// genera el informe
	router.get('/quizes/imprimir_resumen',	 			sessionController.loginRequired, quizController.imprimir_resumen);	
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
	router.get('/quizes?search',                    	quizController.search);




	// Definición de rutas de comments
//	router.get('/quizes/:quizId(\\d+)/comments/new',							commentController.new);						// carga formulario /quizes/:quizId(\\d+)/comments/new y dispara el controlador new de comment_Controller
//	router.post('/quizes/:quizId(\\d+)/comments',								commentController.create);					// dispara controlador create cuando el boton <enviar> del formulario /comments/new.ejs
//	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/edit',			sessionController.loginRequired, commentController.ownershipRequired, commentController.edit);
	router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/update',		sessionController.loginRequired, commentController.ownershipRequired, commentController.update);
	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',   	sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);	//
	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/unpublish',   	sessionController.loginRequired, commentController.ownershipRequired, commentController.unpublish);	//
	router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/destroy',   	sessionController.loginRequired, commentController.ownershipRequired, commentController.destroy);	//



	// Deficion de rutas de Contadores
	router.get('/contadores',													contadorController.index);
	router.get('/contadores/new',												contadorController.new);
	router.post('/contadores/create',											contadorController.create);
	router.get('/contadores/:contadorId(\\d+)/edit',							contadorController.edit);
	router.put('/contadores/:contadorId(\\d+)/update',							contadorController.update);
	router.get('/contadores/:contadorId(\\d+)',									contadorController.show);
	router.delete('/contadores/:contadorId(\\d+)/destroy',						contadorController.destroy);


	// Deficion de rutas de Criterios
	router.get('/contadores/:contadorId(\\d+)/criterios/new',								criterioController.new);						// carga el formulario new
	router.post('/contadores/:contadorId(\\d+)/criterios/create',							criterioController.create);
	router.delete('/contadores/:contadorId(\\d+)/criterios/:criterioId(\\d+)/destroy',   	criterioController.destroy);





	// Definición de rutas de proveedor
	router.get('/proveedores',			 					sessionController.loginRequired, proveedorController.index);												// accede a la lista completa de proveedores
//	router.get('/proveedor/:proveedorId(\\d+)',				proveedorController.show);												// accede a una pregunta en concreto. envia al proveedorController la peticion GET con el parametro proveedorId (indice)
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
