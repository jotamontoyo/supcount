
	var models = require('../models/models.js');

	exports.ownershipRequired = function(req, res, next){		// MW que permite acciones solamente si el usuario objeto corresponde con el usuario logeado o si es cuenta admin
		var objUser = req.user.id;								// userId del user
    	var logUser = req.session.user.id;						// userId de la sesion
    	var isAdmin = req.session.user.isAdmin;					// valor de isAdmin
		if (isAdmin || objUser === logUser) {					// comprueba que el userId es el mismo que el userId logueado
        	next();
    	} else {
        	res.redirect('/');
    	}
	};

	// Autoload :id
	exports.load = function(req, res, next, userId) {

//		console.log('userId.......: ' + userId);

	  	models.User.find({
	        where: {id: Number(userId)}
	    }).then(function(user) {
	    	if (user) {
				console.log('isAdmin.......: ' + user.isAdmin);
	        	req.user = user;
	        	next();
	      	} else{next(new Error('No existe userId=' + userId))}
	    }).catch(function(error){next(error)});
	};

	// Comprueba si el usuario esta registrado en users
	// Si autenticación falla o hay errores se ejecuta callback(error).
	exports.autenticar = function(login, password, callback) {
		models.User.find({
	        where: {
	            username: login
	        }
	    }).then(function(user) {
	    	if (user) {
	    		if(user.verifyPassword(password)){
	            	callback(null, user);
	        	}
	        	else { callback(new Error('Password erróneo.')); }
	      	} else { callback(new Error('No existe user=' + login))}
	    }).catch(function(error){callback(error)});
	};





	exports.index = function(req, res, next) {

		var centro = req.session.user.centro;



		var options = {
			where: {centro: centro},
			order: [['id', 'ASC']]
		};


		if (req.session.user.isSuperAdmin) {
			options = {									// muestra todos los centros si isSuperAdmin
				order: [['id', 'ASC']]
			};
		} else {
			if (req.user) {									// req.user se crea en autoload de user_controller si hay un GET con un user logueado
				options = {								// muestra solo los centros del user
					where: {centro: centro},
					order: [['id', 'ASC']]
				};
			};

		};

		models.User.findAll(options).then(					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id
			function(user) {
				res.render('user/index.ejs', {user: user, errors: []});
			}
		).catch(function(error){next(error)});

	};






	exports.new = function(req, res) {										// GET /user
	    var user = models.User.build( 										// crea objeto user
	        {username: "", password: "", email: "", isAdmin: false, centro: ""}
	    );

		models.Centro.findAll().then(function(centros) {

	    	res.render('user/new', {user: user, centros: centros, errors: []});

		});
	};



	exports.create = function(req, res) {									// POST /user
	    var user = models.User.build( req.body.user );
		if (req.body.user.isAdmin) {
			user.isAdmin  = true;
		} else {
			user.isAdmin  = false;
		};
		var errors = user.validate();											// objeto errors no tiene then(
		if (errors) {
			var i = 0;
			var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('user/new', {user: user, errors: errores});
		} else {
			user 																// save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["username", "password", "email", "isAdmin", "centro"]})
			.then(function() {res.redirect('/user')});
		};
	};





	exports.edit = function(req, res) {										// GET /user/:id/edit

		models.Centro.findAll().then(function(centros) {

			res.render('user/edit', { user: req.user, centros: centros, errors: []});				// req.user: instancia de user cargada con autoload

		});




	};

	exports.update = function(req, res, next) {								// PUT /user/:id

		req.user.username  = req.body.user.username;
	  	req.user.password  = req.body.user.password;
	  	req.user.email  = req.body.user.email;

/*		if (req.body.user.isAdmin) {
			req.user.isAdmin  = true;
		} else if (!req.body.user.isAdmin) {
			req.user.isAdmin  = false;
		}; */

//		console.log('isAdmin........: ' + req.body.user.isAdmin);

	  	req.user.centro  = req.body.user.centro;
	  	var errors = req.user.validate();											// objeto errors no tiene then(
		if (errors) {
			var i = 0;
			var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('user/new', {user: req.user, errors: errores});
		} else {
			req.user 																// save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["username", "password", "email", "isAdmin", "centro"]})
			.then(function() {res.redirect('/user')});
		};
	};

	exports.destroy = function(req, res) {									// DELETE /user/:id
	  req.user.destroy().then( function() {
	    delete req.session.user;											// borra la sesión y redirige a /
	    res.redirect('/');
	  }).catch(function(error){next(error)});
	};
