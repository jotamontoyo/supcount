
    var models = require('../models/models.js');


    exports.load = function(req, res, next, vasoId) {			// autoload. solo se ejecuta si en la peticion GET existe un :quizId. ayuda a factorizar el codigo del resto de controladores
		models.Vaso.find({										// carga de registro quiz
			where: 		{id: Number(vasoId)},					// where indice principal id <-- quizId recibido del GET
        }).then(function(vaso) {
				if (vaso) {
					req.vaso = vaso;
					next();
				} else {
					next(new Error('No existe vasoId=' + vaso[id]));
				}
			}
		).catch(function(error) {next(error);});
	};




    exports.index = function(req, res, next) {

	  	models.Vaso.findAll({

            where: {centro: req.session.user.centro},
            order: [['id', 'ASC']]

        }).then(					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id
	    	function(vasos) {
	      		res.render('vasos/index', {vasos: vasos, errors: []});
	    	}
	  	).catch(function(error){next(error)});

	};




    exports.new = function(req, res) {																				// GET /quizes/new, baja el formulario

		var vaso = models.Vaso.build( 																				// crea el objeto quiz, lo construye con buid() metodo de sequilize
			{
                nombre: "",
                centro: "",
                ubicacion: "",
                ph_max: 8.0,
                ph_min: 7.2,
                redox_max: 900,
                redox_min: 250,
                temp_max: 30,
                temp_min: 24,
                recirculacion: 4,
                transparencia: true,
                extranios: false,
                turbidez_max: 2,
                isocianuro_max: 75,
                bromo_max: 5,
                bromo_min: 2,
                cloro_max: 2.0,
                cloro_min: 0.8,
                cloro_combinado_max: 0.6,
                co2_interior: 0.0,
                co2_exterior: 0.0,
                ecoli: false,
                legionella_max: 100,
                pseudomona: false,
                enterococos: false,
                staphlylococcus: false,
                langelier_max: 0.5,
                langelier_min: -0.5
            }
		);

		res.render('vasos/new', {vaso: vaso, errors: []});

	};







    exports.create = function(req, res) {														// POST /quizes/create

		var vaso = models.Vaso.build( req.body.vaso );											// construccion de objeto quiz para luego introducir en la tabla
        vaso.centro = req.session.user.centro;

		var errors = vaso.validate();
		if (errors) {
			var i = 0;
			var errores = new Array();															// se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('vasos/new', {vaso: vaso, errors: errores});
		} else {
			vaso 																// save: guarda en DB campos pregunta y respuesta de quiz
			.save()
			.then(function() {res.redirect('/vasos')});
		};

	};






/*    exports.show = function(req, res) {

        res.render('vasos/show', {vaso: req.vaso, errors: []});

	}; */






    exports.edit = function(req, res) {															// carga formulario edit.ejs

		res.render('vasos/edit', {vaso: req.vaso, errors: []});   		// renderiza la vista contadores/edit junto con la lista de todos los proveedores

	};




    exports.update = function(req, res) {										     // modifica un contador

        req.vaso.nombre = req.body.vaso.nombre;
        req.vaso.ubicacion = req.body.vaso.ubicacion;
        req.vaso.ph_max = req.body.vaso.ph_max;
        req.vaso.ph_min = req.body.vaso.ph_min;
        req.vaso.redox_max = req.body.vaso.redox_max;
        req.vaso.redox_min = req.body.vaso.redox_min;
        req.vaso.temp_max = req.body.vaso.temp_max;
        req.vaso.temp_min = req.body.vaso.temp_min;
        req.vaso.recirculacion = req.body.vaso.recirculacion;
        req.vaso.transparencia = req.body.vaso.transparencia;
        req.vaso.extranios = req.body.vaso.extranios;
        req.vaso.turbidez_max = req.body.vaso.turbidez_max;
        req.vaso.isocianuro_max = req.body.vaso.isocianuro_max;
        req.vaso.bromo_max = req.body.vaso.bromo_max;
        req.vaso.bromo_min = req.body.vaso.bromo_min;
        req.vaso.cloro_max = req.body.vaso.cloro_max;
        req.vaso.cloro_min = req.body.vaso.cloro_min;
        req.vaso.cloro_combinado_max = req.body.vaso.cloro_combinado_max;
        req.vaso.humedad_max = req.body.vaso.humedad_max;
        req.vaso.co2_interior = req.body.vaso.co2_interior;
        req.vaso.co2_exterior = req.body.vaso.co2_exterior;
        req.vaso.ecoli = req.body.vaso.ecoli;
        req.vaso.legionella_max = req.body.vaso.legionella_max;
        req.vaso.pseudomona = req.body.vaso.pseudomona;
        req.vaso.enterococos = req.body.vaso.enterococos;
        req.vaso.staphlylococcus = req.body.vaso.staphlylococcus;
        req.vaso.langelier_max = req.body.vaso.langelier_max;
        req.vaso.langelier_min = req.body.vaso.langelier_min;


        var errors = req.vaso.validate();
        if (errors) {
            var i = 0;
            var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
            for (var prop in errors) errores[i++] = {message: errors[prop]};
            res.render('vasos/edit', {vaso: req.vaso, errors: errores});
        } else {
            req.vaso 															// save: guarda en DB campos pregunta y respuesta de quiz
            .save()
            .then(function() {res.redirect('/vasos')});
        };
    };





    exports.destroy = function(req, res) {
		req.vaso.destroy().then(function() {

            res.redirect('/vasos');

		}).catch(function(error) {next(error)});
	};
