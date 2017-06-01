
    var models = require('../models/models.js');


    exports.load = function(req, res, next, centroId) {			// autoload. solo se ejecuta si en la peticion GET existe un :quizId. ayuda a factorizar el codigo del resto de controladores
		models.Centro.find({										// carga de registro quiz
			where: 		{id: Number(centroId)}					// where indice principal id <-- quizId recibido del GET
        }).then(function( centro ) {
				if (centro) {
					req.centro = centro;
					next();
				} else {
					next(new Error('No existe centroId=' + centro[id]));
				}
			}
		).catch(function(error) {next(error);});
	};




    exports.index = function(req, res, next) {

	  	models.Centro.findAll({

            order: [['id', 'ASC']]
        }).then(
	    	function( centros ) {
	      		res.render('centros/index.ejs', {centros: centros, errors: []});
	    	}
	  	).catch(function(error){next(error)});

	};




    exports.new = function(req, res) {																				// GET /quizes/new, baja el formulario


		var centro = models.Centro.build( 																				// crea el objeto quiz, lo construye con buid() metodo de sequilize
			{
                nombre: "",
                direccion: "",
                contacto: "",
                telefono: "",
                email: "",
                max_contadores: "",
                max_vasos: ""
            }
		);

		res.render('centros/new', {centro: centro, errors: []});


	};


    exports.create = function(req, res) {														// POST /quizes/create

		var centro = models.Centro.build( req.body.centro );											// construccion de objeto quiz para luego introducir en la tabla

		var errors = centro.validate();

		if (errors) {
			var i = 0;
			var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('centros/new', {centro: centro, errors: errores});
		} else {
			centro 																// save: guarda en DB campos pregunta y respuesta de quiz
			.save()
			.then(function() {res.redirect('/centros')});
		};

	};





    exports.edit = function(req, res) {															// carga formulario edit.ejs

		res.render('centros/edit', {centro: req.centro, errors: []});   		// renderiza la vista centroes/edit junto con la lista de todos los proveedores

	};




    exports.update = function(req, res) {										     // modifica un centro

        req.centro.nombre = req.body.centro.nombre;
        req.centro.direccion = req.body.centro.direccion;
        req.centro.contacto = req.body.centro.contacto;
        req.centro.telefono = req.body.centro.telefono;
        req.centro.email = req.body.centro.email;
        req.centro.max_contadores = req.body.centro.max_contadores;
        req.centro.max_vasos = req.body.centro.max_vasos;

        var errors = req.centro.validate();
        if (errors) {
            var i = 0;
            var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
            for (var prop in errors) errores[i++] = {message: errors[prop]};
            res.render('centros/edit', {centro: req.centro, errors: errores});
        } else {
            req.centro 															// save: guarda en DB campos pregunta y respuesta de quiz
            .save()
            .then(function() {res.redirect('/centros')});
        };
    };





    exports.destroy = function(req, res) {
		req.centro.destroy().then(function() {
			res.redirect('/centros');
		}).catch(function(error) {next(error)});
	};
