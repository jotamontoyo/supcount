
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

        }).then(function(vasos) {					// si hubo req.user ---> options contiene el SQL where UserId: req.user.id

	    	res.render('vasos/index', {vasos: vasos, errors: []});
            
	  	}).catch(function(error){next(error)});

	};




    exports.new = function(req, res) {																				// GET /quizes/new, baja el formulario

		var vaso = models.Vaso.build( 																				// crea el objeto quiz, lo construye con buid() metodo de sequilize
			{
                nombre: "",
                centro: "",
                ubicacion: "",
                capacidad: 0.0,
                interior: 0,
                tipo_ensayo: "Completo",
                ph_max: 8.00,
                ph_min: 7.20,
                ph_ensayar: 1,
                redox_max: 900.00,
                redox_min: 250.00,
                redox_ensayar: 1,
                temp_max: 30.00,
                temp_min: 24.00,
                temp_ensayar: 1,
                recirculacion: 4,
                recirculacion_ensayar: 1,
                transparencia: 'no ensaya',
                extranios: 'no ensaya',
                turbidez_max: 2.00,
                turbidez_ensayar: 1,
                isocianuro_max: 75.00,
                isocianuro_ensayar: 1,
                bromo_max: 5.00,
                bromo_min: 2.00,
                bromo_ensayar: 1,
                cloro_max: 2.00,
                cloro_min: 0.80,
                cloro_ensayar: 1,
                cloro_combinado_max: 0.60,
                cloro_combinado_ensayar: 1,
                co2_interior: 0.00,
                co2_interior_ensayar: 1,
                co2_exterior: 0.00,
                co2_exterior_ensayar: 1,
                ecoli: 'no ensaya',
                legionella_max: 100.00,
                legionella_ensayar: 1,
                pseudomona: 'no ensaya',
                enterococos: 'no ensaya',
                staphlylococcus: 'no ensaya',
                langelier_max: 0.50,
                langelier_min: -0.50,
                langelier_ensayar: 1
            }
		);

		res.render('vasos/new', {vaso: vaso, errors: []});

	};







    exports.create = function(req, res) {														// POST /quizes/create

        models.Centro.find({
            where: 		{nombre: req.session.user.centro}                           // busca el centro del user para pasar los datos al nuevo contador
        }).then(function(centro) {
            models.Vaso.count({                                                 // saber cuantos vasos hay creados en el centro
                where: {centro: centro.nombre}
            }).then(function(cantidad_vasos) {
                if (cantidad_vasos < centro.max_vasos) {                             // comprobar si puede crear mas
                    var vaso = models.Vaso.build( req.body.vaso );		        // construccion de objeto para luego introducir en la tabla
                    vaso.centro = centro.nombre;

                    if (req.body.vaso.interior) {vaso.interior = 1};
                    if (!req.body.vaso.interior) {vaso.interior = 0};

                    if (req.body.vaso.ph_ensayar) {vaso.ph_ensayar = 1};
                    if (!req.body.vaso.ph_ensayar) {vaso.ph_ensayar = 0};

                    if (req.body.vaso.temp_ensayar) {vaso.temp_ensayar = 1};
                    if (!req.body.vaso.temp_ensayar) {vaso.temp_ensayar = 0};

                    if (req.body.vaso.turbidez_ensayar) {vaso.turbidez_ensayar = 1};
                    if (!req.body.vaso.turbidez_ensayar) {vaso.turbidez_ensayar = 0};

                    if (req.body.vaso.recirculacion_ensayar) {vaso.recirculacion_ensayar = 1};
                    if (!req.body.vaso.recirculacion_ensayar) {vaso.recirculacion_ensayar = 0};

                    if (req.body.vaso.redox_ensayar) {vaso.redox_ensayar = 1};
                    if (!req.body.vaso.redox_ensayar) {vaso.redox_ensayar = 0};

                    if (req.body.vaso.cloro_ensayar) {vaso.cloro_ensayar = 1};
                    if (!req.body.vaso.cloro_ensayar) {vaso.cloro_ensayar = 0};

                    if (req.body.vaso.cloro_combinado_ensayar) {vaso.cloro_combinado_ensayar = 1};
                    if (!req.body.vaso.cloro_combinado_ensayar) {vaso.cloro_combinado_ensayar = 0};

                    if (req.body.vaso.bromo_ensayar) {vaso.bromo_ensayar = 1};
                    if (!req.body.vaso.bromo_ensayar) {vaso.bromo_ensayar = 0};

                    if (req.body.vaso.isocianuro_ensayar) {vaso.isocianuro_ensayar = 1};
                    if (!req.body.vaso.isocianuro_ensayar) {vaso.isocianuro_ensayar = 0};

                    if (req.body.vaso.humedad_ensayar) {vaso.humedad_ensayar = 1};
                    if (!req.body.vaso.humedad_ensayar) {vaso.humedad_ensayar = 0};

                    if (req.body.vaso.co2_interior_ensayar) {vaso.co2_interior_ensayar = 1};
                    if (!req.body.vaso.co2_interior_ensayar) {vaso.co2_interior_ensayar = 0};

                    if (req.body.vaso.co2_exterior_ensayar) {vaso.co2_exterior_ensayar = 1};
                    if (!req.body.vaso.co2_exterior_ensayar) {vaso.co2_exterior_ensayar = 0};

                    if (req.body.vaso.legionella_ensayar) {vaso.legionella_ensayar = 1};
                    if (!req.body.vaso.legionella_ensayar) {vaso.legionella_ensayar = 0};

                    if (req.body.vaso.langelier_ensayar) {vaso.langelier_ensayar = 1};
                    if (!req.body.vaso.langelier_ensayar) {vaso.langelier_ensayar = 0};

                    var errors = vaso.validate();
            		if (errors) {
            			var i = 0;
            			var errores = new Array();															// se convierte en [] con la propiedad message por compatibilidad con layout
            			for (var prop in errors) errores[i++] = {message: errors[prop]};
            			res.render('vasos/new', {vaso: vaso, errors: errores});
            		} else {
            			vaso
            			.save()
            			.then(function() {res.redirect('/vasos')});
            		}
                } else {
                    res.render('avisos/aviso_max_vasos', {errors: []});
                };
            });
        });

	};






/*    exports.show = function(req, res) {

        res.render('vasos/show', {vaso: req.vaso, errors: []});

	}; */






    exports.edit = function(req, res) {															// carga formulario edit.ejs

		res.render('vasos/edit', {vaso: req.vaso, errors: []});   		// renderiza la vista contadores/edit junto con la lista de todos los proveedores

	};




    exports.update = function(req, res) {										     // modifica un vaso

        req.vaso.nombre = req.body.vaso.nombre;
        req.vaso.ubicacion = req.body.vaso.ubicacion;
        req.vaso.capacidad = req.body.vaso.capacidad;

        if (req.body.vaso.interior) {
            req.vaso.interior = 1;
        } else {
            req.vaso.interior = 0;
        };

        req.vaso.tipo_ensayo = req.body.vaso.tipo_ensayo;

        req.vaso.ph_max = req.body.vaso.ph_max;
        req.vaso.ph_min = req.body.vaso.ph_min;
        if (req.body.vaso.ph_ensayar) {
            req.vaso.ph_ensayar = 1;
        } else {
            req.vaso.ph_ensayar = 0;
        };


        req.vaso.redox_max = req.body.vaso.redox_max;
        req.vaso.redox_min = req.body.vaso.redox_min;
        if (req.body.vaso.redox_ensayar) {
            req.vaso.redox_ensayar = 1;
        } else {
            req.vaso.redox_ensayar = 0;
        };


        req.vaso.temp_max = req.body.vaso.temp_max;
        req.vaso.temp_min = req.body.vaso.temp_min;
        if (req.body.vaso.temp_ensayar) {
            req.vaso.temp_ensayar = 1;
        } else {
            req.vaso.temp_ensayar = 0;
        };


        req.vaso.recirculacion = req.body.vaso.recirculacion;
        if (req.body.vaso.recirculacion_ensayar) {
            req.vaso.recirculacion_ensayar = 1;
        } else {
            req.vaso.recirculacion_ensayar = 0;
        };


        req.vaso.transparencia = req.body.vaso.transparencia;
        req.vaso.extranios = req.body.vaso.extranios;


        req.vaso.turbidez_max = req.body.vaso.turbidez_max;
        if (req.body.vaso.turbidez_ensayar) {
            req.vaso.turbidez_ensayar = 1;
        } else {
            req.vaso.turbidez_ensayar = 0;
        };


        req.vaso.isocianuro_max = req.body.vaso.isocianuro_max;
        if (req.body.vaso.isocianuro_ensayar) {
            req.vaso.isocianuro_ensayar = 1;
        } else {
            req.vaso.isocianuro_ensayar = 0;
        };


        req.vaso.bromo_max = req.body.vaso.bromo_max;
        req.vaso.bromo_min = req.body.vaso.bromo_min;
        if (req.body.vaso.bromo_ensayar) {
            req.vaso.bromo_ensayar = 1;
        } else {
            req.vaso.bromo_ensayar = 0;
        };


        req.vaso.cloro_max = req.body.vaso.cloro_max;
        req.vaso.cloro_min = req.body.vaso.cloro_min;
        if (req.body.vaso.cloro_ensayar) {
            req.vaso.cloro_ensayar = 1;
        } else {
            req.vaso.cloro_ensayar = 0;
        };


        req.vaso.cloro_combinado_max = req.body.vaso.cloro_combinado_max;
        if (req.body.vaso.cloro_combinado_ensayar) {
            req.vaso.cloro_combinado_ensayar = 1;
        } else {
            req.vaso.cloro_combinado_ensayar = 0;
        };


        req.vaso.humedad_max = req.body.vaso.humedad_max;
        if (req.body.vaso.humedad_ensayar) {
            req.vaso.humedad_ensayar = 1;
        } else {
            req.vaso.humedad_ensayar = 0;
        };


        req.vaso.co2_interior = req.body.vaso.co2_interior;
        if (req.body.vaso.co2_interior_ensayar) {
            req.vaso.co2_interior_ensayar = 1;
        } else {
            req.vaso.co2_interior_ensayar = 0;
        };


        req.vaso.co2_exterior = req.body.vaso.co2_exterior;
        if (req.body.vaso.co2_exterior_ensayar) {
            req.vaso.co2_exterior_ensayar = 1;
        } else {
            req.vaso.co2_exterior_ensayar = 0;
        };


        req.vaso.legionella_max = req.body.vaso.legionella_max;
        if (req.body.vaso.legionella_ensayar) {
            req.vaso.legionella_ensayar = 1;
        } else {
            req.vaso.legionella_ensayar = 0;
        };


        req.vaso.ecoli = req.body.vaso.ecoli;
        req.vaso.pseudomona = req.body.vaso.pseudomona;
        req.vaso.enterococos = req.body.vaso.enterococos;
        req.vaso.staphlylococcus = req.body.vaso.staphlylococcus;


        req.vaso.langelier_max = req.body.vaso.langelier_max;
        req.vaso.langelier_min = req.body.vaso.langelier_min;
        if (req.body.vaso.langelier_ensayar) {
            req.vaso.langelier_ensayar = 1;
        } else {
            req.vaso.langelier_ensayar = 0;
        };


        var errors = req.vaso.validate();
        if (errors) {
            var i = 0;
            var errores = new Array();											// se convierte en [] con la propiedad message por compatibilidad con layout
            for (var prop in errors) errores[i++] = {message: errors[prop]};
            res.render('vasos/edit', {vaso: req.vaso, errors: errores});
        } else {
            req.vaso
            .save()
            .then(function() {
                res.redirect('/vasos');
            });
        };
    };





    exports.destroy = function(req, res) {
		req.vaso.destroy().then(function() {

            res.redirect('/vasos');

		}).catch(function(error) {next(error)});
	};
