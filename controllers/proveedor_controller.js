
	var models = require('../models/models.js');

	exports.load = function(req, res, next, proveedorId) {			// autoload. solo se ejecuta si en la peticion GET existe un :proveedorId. ayuda a factorizar el codigo del resto de controladores 
		models.Proveedor.find({										// carga de registro proveedorId
			where: 		{id: Number(proveedorId)}					// where indice principal id <-- proveedorId recibido del GET
			}).then(function(proveedor) {
				if (proveedor) {
					req.proveedor = proveedor;
					next();
				} else {
					next(new Error('No existe proveedorId=' + proveedor[id]));
				}
			}
		).catch(function(error) {next(error);});
	}; 

	exports.index = function(req, res) {
		models.Proveedor.findAll().then(function(proveedores) {
			res.render('proveedores/index.ejs', {proveedores: proveedores, errors: []});
		});
	};

	exports.new = function(req, res) {												// GET /proveedor/new, baja el formulario
		var proveedor = models.Proveedor.build( 															// crea el objeto proveedor, lo construye con buid() metodo de sequilize
			{nombre: "Nombre", telefono: "Teléfono", email: "eMail"}				// asigna literales a los campos para que se vea el texto en el <input> cuando creemos el formulario
		);
		res.render('proveedores/new', {proveedor: proveedor, errors: []});   		// renderiza la vista quizes/new
	};

	exports.create = function(req, res) {											// POST /quizes/create  	
		var proveedor = models.Proveedor.build( req.body.proveedor );				// construccion de objeto quiz para luego introducir en la tabla
		var errors = proveedor.validate();											// objeto errors no tiene then(
		if (errors) {
			var i = 0; 
			var errores = new Array();												// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};        
			res.render('proveedores/new', {proveedor: proveedor, errors: errores});
		} else {
			proveedor 																// save: guarda en DB campos 
			.save({fields: ["nombre", "telefono", "email"]})
			.then(function() {res.redirect('/proveedores')});
		};
	};

	exports.edit = function(req, res) {												// carga formulario edit.ejs
		var proveedor = req.proveedor;												// req.proveedor viene del autoload
		res.render('proveedores/edit', {proveedor: proveedor, errors: []});   		// renderiza la vista proveedores/edit
	};
	
	exports.update = function(req, res) {											// modifica un proveedor
		req.proveedor.nombre = req.body.proveedor.nombre;
		req.proveedor.telefono = req.body.proveedor.telefono;
		req.proveedor.email = req.body.proveedor.email;
		var errors = req.proveedor.validate();											
		if (errors) {
			var i = 0; 
			var errores = new Array();												// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};        
			res.render('proveedores/edit', {proveedor: req.proveedor, errors: errores});
		} else {
			req.proveedor 															// save: guarda en DB campos 
			.save({fields: ["nombre", "telefono", "email"]})
			.then(function() {res.redirect('/proveedores')});
		};
	};
	
	exports.destroy = function(req, res) {
		req.proveedor.destroy().then(function() {
			res.redirect('/proveedores');
		}).catch(function(error) {next(error)});
	};