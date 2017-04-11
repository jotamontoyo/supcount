
	var models = require('../models/models.js');
//	var sa = require('sweetalert');

	exports.load = function(req, res, next, contactoId) {			// autoload. solo se ejecuta si en la peticion GET existe un :contactoId. ayuda a factorizar el codigo del resto de controladores
		models.Contacto.find({										// carga de registro proveedorId
			where: 		{id: Number(contactoId)}					// where indice principal id <-- proveedorId recibido del GET
			}).then(function(contacto) {
				if (contacto) {
					req.contacto = contacto;
					next();
				} else {
					next(new Error('No existe contactoId=' + contacto[id]));
				}
			}
		).catch(function(error) {next(error);});
	};

	exports.index = function(req, res) {
		models.Contacto.findAll().then(function(contactos) {
			res.render('contactos/index.ejs', {contactos: contactos, errors: []});
		});
	};




	exports.new = function(req, res) {												// GET /proveedor/new, baja el formulario

		var contacto = models.Contacto.build( 															// crea el objeto proveedor, lo construye con buid() metodo de sequilize
			{
				nombre: "",
				direccion: "",
				poblacion: "",
				provincia: "",
				cp: "",
				telefono: "",
				email: "",
				comentario: "",
				lopd: false
			}				// asigna literales a los campos para que se vea el texto en el <input> cuando creemos el formulario
		);

		res.render('contactos/new', {contacto: contacto, errors: []});   		// renderiza la vista quizes/new
	};



	exports.create = function(req, res) {											// POST /quizes/create
		var contacto = models.Contacto.build( req.body.contacto );					// construccion de objeto quiz para luego introducir en la tabla
		var errors = contacto.validate();											// objeto errors no tiene then(
		if (errors) {
			var i = 0;
			var errores = new Array();												// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('contactos/new', {contacto: contacto, errors: errores});
		} else {
			contacto 																// save: guarda en DB campos
			.save()
			.then(function() {res.redirect('/contactos')});
		};
	};

	exports.edit = function(req, res) {												// carga formulario edit.ejs
//		var contacto = req.contacto;												// req.proveedor viene del autoload
		res.render('contactos/edit', {contacto: req.contacto, errors: []});   		// renderiza la vista proveedores/edit
	};

	exports.update = function(req, res) {											// modifica un proveedor


		req.contacto.nombre = req.body.contacto.nombre;
		req.contacto.direccion = req.body.contacto.direccion;
		req.contacto.poblacion = req.body.contacto.poblacion;
		req.contacto.provincia = req.body.contacto.provincia;
		req.contacto.cp = req.body.contacto.cp;
		req.contacto.email = req.body.contacto.email;
		req.contacto.telefono = req.body.contacto.telefono;
		req.contacto.comentario = req.body.contacto.comentario;
		if (req.body.contacto.lopd) {
			req.contacto.lopd = true;
		} else {
			req.contacto.lopd = false;
		};

		var errors = req.contacto.validate();
		if (errors) {
			var i = 0;
			var errores = new Array();												// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('contactos/edit', {contacto: req.contacto, errors: errores});
		} else {
			req.contacto 															// save: guarda en DB campos
			.save()
			.then(function() {res.redirect('/contactos')});
		};
	};

/*	exports.show = function(req, res) {											// GET /contactos/:id
		models.Contacto.find({
			where: 		{id: req.contacto.id}
		}).then(function(contacto) {
			res.render('contactos/show', {contacto: req.contacto, errors: []});				// renderiza la vista /quizes/show del quizId selecionado con load find()
		});																					// req.quiz: instancia de quiz cargada con autoload
	}; */

	exports.destroy = function(req, res) {
		req.contacto.destroy().then(function() {
			res.redirect('/contactos');
		}).catch(function(error) {next(error)});
	};

	exports.webcreate = function(req, res) {											// POST /contacto/webcreate

		var contacto = models.Contacto.build( 											// crea el objeto contacto, lo construye con buid() metodo de sequilize
			{nombre: "Nombre", email: "email", comentario: "Comentario", lopd: false}		// asigna literales a los campos para que se vea el texto en el <input> cuando creemos el formulario
		);
		contacto.nombre = req.body.nombre;
		contacto.email = req.body.email;
		contacto.comentario = req.body.comentario;
		if (req.body.lopd) {contacto.lopd = true};
		var errors = contacto.validate();											// objeto errors no tiene then(
		if (errors) {
			var i = 0;
			var errores = new Array();												// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('contactos/new', {contacto: contacto, errors: errores});
		} else {
			contacto 																// save: guarda en DB campos
			.save()
			.then(function() {

/*				var postmark = require("postmark")(process.env.POSTMARK_API_TOKEN);

				postmark.send({														// email al portal
					"From": "no-reply@inbarasset.es",
					"To": "contacto@inbarasset.es",
					"Subject": "Solicitud de información recibida en el portal inbarasset.es",
					"TextBody": "Tienes una solicitud pendiente de revisar. Entra en el portal www.inbarasset.es/login",
					"Tag": "Solicitudes de informanción"
				}, function(error, success) {
					if (error) {
						console.error("Unable to send via postmark: " + error.message);
						return;
					}
					console.info("Sent to postmark for delivery");
				});

				postmark.sendEmailWithTemplate({									// email al cliente
					"From": "no-reply@inbarasset.es",
					"To": contacto.email,
					"TemplateId": 772821,
					"TemplateModel": {
					    "product_name": "Inbar Asset",
					    "name": contacto.nombre,
					    "sender_name": "sender_name_Value",
					    "product_address_line1": "Teléfono +34 601 23 79 19",
					    "product_address_line2": "contacto@inbarasset.es"
					}
				}, function(error, success) {
					if (error) {
						console.error("Unable to send via postmark: " + error.message);
						return;
					}
					console.info("Sent to postmark for delivery with template");
				});

				res.render('adjuntar/', {errors: []}); */

				res.redirect('/');

/*				res.render('adjuntar/', { soypersona: true }, function(err, html) {
					res.send(html);
				}); */

			});
		};
	};
