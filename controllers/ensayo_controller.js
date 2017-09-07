
	var models = require('../models/models.js');

	exports.ownershipRequired = function(req, res, next){		// MW que permite acciones solamente si el quiz al que pertenece el comentario objeto pertenece al usuario logeado o si es cuenta admin
	    models.Siloe.find({
	            where: {
	                  id: Number(req.ensayo.SiloId)			// SQL del QuizId del comment
	            }
	        }).then(function(siloe) {
	            if (siloe) {
	                var objSiloeOwner = siloe.UserId;						// userId del quiz
	                var logUser = req.session.user.id;					// userId de la sesion
	                var isAdmin = req.session.user.isAdmin;				// valor de isAdmin
	                console.log(objSiloeOwner, logUser, isAdmin);
	                if (isAdmin || objSiloeOwner === logUser) {			// comprueba que el user del quiz es el mismo que el user logueado
	                    next();
	                } else {
	                    res.redirect('/');
	                }
	            } else{next(new Error('No existe siloeId=' + siloeId))}
	        }
	    ).catch(function(error){next(error)});
	};

	exports.load = function(req, res, next, ensayoId) {									// Autoload :id de comentarios
		models.Ensayo.find({
			where: {
				id: Number(ensayoId)
			}
		}).then(function(ensayo) {
			if (ensayo) {
				req.ensayo = ensayo;
				next();
			} else {
				next(new Error('No existe ensayoId=' + ensayoId))
			}
		}).catch(function(error){next(error)});
	};









	exports.update = function(req, res, next) {



		req.ensayo.ph_m = req.body.ensayo.ph_m;
		req.ensayo.ph_t = req.body.ensayo.ph_t;
		if ((req.ensayo.ph_m > req.ensayo.ph_max) ||
			(req.ensayo.ph_m < req.ensayo.ph_min) ||
			(req.ensayo.ph_t > req.ensayo.ph_max) ||
			(req.ensayo.ph_t < req.ensayo.ph_min)) {
				req.ensayo.ph_cumple = false;
		} else {
			req.ensayo.ph_cumple = true;
		};




		req.ensayo.redox_m = req.body.ensayo.redox_m;
		req.ensayo.redox_t = req.body.ensayo.redox_t;
		if ((req.ensayo.redox_m > req.ensayo.redox_max) ||
			(req.ensayo.redox_m < req.ensayo.redox_min) ||
			(req.ensayo.redox_t > req.ensayo.redox_max) ||
			(req.ensayo.redox_t < req.ensayo.redox_min)) {
				req.ensayo.redox_cumple = false;
		} else {
			req.ensayo.redox_cumple = true;
		};




		req.ensayo.temp_m = req.body.ensayo.temp_m;
		req.ensayo.temp_t = req.body.ensayo.temp_t;
		if ((req.ensayo.temp_m > req.ensayo.temp_max) ||
			(req.ensayo.temp_m < req.ensayo.temp_min) ||
			(req.ensayo.temp_t > req.ensayo.temp_max) ||
			(req.ensayo.temp_t < req.ensayo.temp_min)) {
				req.ensayo.temp_cumple = false;
		} else {
			req.ensayo.temp_cumple = true;
		};





		req.ensayo.recirculacion_m = req.body.ensayo.recirculacion_m;
		req.ensayo.recirculacion_t = req.body.ensayo.recirculacion_t;
		if ((req.ensayo.recirculacion_m < req.ensayo.recirculacion) ||
			(req.ensayo.recirculacion_t < req.ensayo.recirculacion)) {
				req.ensayo.recirculacion_cumple = false;
		} else {
			req.ensayo.recirculacion_cumple = true;
		};




		req.ensayo.transparencia_m = req.body.ensayo.transparencia_m;
		if (req.ensayo.transparencia_m === 'no cumple') {
				req.ensayo.transparencia_cumple = 'no cumple';
		};
		if (req.ensayo.transparencia_m === 'cumple') {
				req.ensayo.transparencia_cumple = 'cumple';
		};
		if (req.ensayo.transparencia_m === 'no ensaya') {
				req.ensayo.transparencia_cumple = 'no ensaya';
		};



		req.ensayo.extranios_m = req.body.ensayo.extranios_m;
		if (req.ensayo.extranios_m === 'no cumple') {
				req.ensayo.extranios_cumple = 'no cumple';
		};
		if (req.ensayo.extranios_m === 'cumple') {
				req.ensayo.extranios_cumple = 'cumple';
		};
		if (req.ensayo.extranios_m === 'no ensaya') {
				req.ensayo.extranios_cumple = 'no ensaya';
		};



		req.ensayo.turbidez_m = req.body.ensayo.turbidez_m;
		req.ensayo.turbidez_t = req.body.ensayo.turbidez_t;
		if ((req.ensayo.turbidez_m > req.ensayo.turbidez_max) ||
			(req.ensayo.turbidez_m < req.ensayo.turbidez_min) ||
			(req.ensayo.turbidez_t > req.ensayo.turbidez_max) ||
			(req.ensayo.turbidez_t < req.ensayo.turbidez_min)) {
				req.ensayo.turbidez_cumple = false;
		} else {
			req.ensayo.turbidez_cumple = true;
		};



		req.ensayo.isocianuro_m = req.body.ensayo.isocianuro_m;
		req.ensayo.isocianuro_t = req.body.ensayo.isocianuro_t;
		if ((req.ensayo.isocianuro_m > req.ensayo.isocianuro_max) ||
			(req.ensayo.isocianuro_m < req.ensayo.isocianuro_min) ||
			(req.ensayo.isocianuro_t > req.ensayo.isocianuro_max) ||
			(req.ensayo.isocianuro_t < req.ensayo.isocianuro_min)) {
				req.ensayo.isocianuro_cumple = false;
		} else {
			req.ensayo.isocianuro_cumple = true;
		};



		req.ensayo.bromo_m = req.body.ensayo.bromo_m;
		req.ensayo.bromo_t = req.body.ensayo.bromo_t;
		if ((req.ensayo.bromo_m > req.ensayo.bromo_max) ||
			(req.ensayo.bromo_m < req.ensayo.bromo_min) ||
			(req.ensayo.bromo_t > req.ensayo.bromo_max) ||
			(req.ensayo.bromo_t < req.ensayo.bromo_min)) {
				req.ensayo.bromo_cumple = false;
		} else {
			req.ensayo.bromo_cumple = true;
		};



		req.ensayo.cloro_m = req.body.ensayo.cloro_m;
		req.ensayo.cloro_t = req.body.ensayo.cloro_t;
		if ((req.ensayo.cloro_m > req.ensayo.cloro_max) ||
			(req.ensayo.cloro_m < req.ensayo.cloro_min) ||
			(req.ensayo.cloro_t > req.ensayo.cloro_max) ||
			(req.ensayo.cloro_t < req.ensayo.cloro_min)) {
				req.ensayo.cloro_cumple = false;
		} else {
			req.ensayo.cloro_cumple = true;
		};



		req.ensayo.cloro_combinado_m = req.body.ensayo.cloro_combinado_m;
		req.ensayo.cloro_combinado_t = req.body.ensayo.cloro_combinado_t;
		if ((req.ensayo.cloro_combinado_m > req.ensayo.cloro_combinado_max) || (req.ensayo.cloro_combinado_t > req.ensayo.cloro_combinado_max)) {
				req.ensayo.cloro_combinado_cumple = false;
		} else {
			req.ensayo.cloro_combinado_cumple = true;
		};



		req.ensayo.humedad_m = req.body.ensayo.humedad_m;
		req.ensayo.humedad_t = req.body.ensayo.humedad_t;
		if ((req.ensayo.humedad_m > req.ensayo.humedad_max) || (req.ensayo.humedad_t > req.ensayo.humedad_max)) {
				req.ensayo.humedad_cumple = false;
		} else {
			req.ensayo.humedad_cumple = true;
		};



		req.ensayo.co2_interior_m = req.body.ensayo.co2_interior_m;
		req.ensayo.co2_interior_t = req.body.ensayo.co2_interior_t;
		if ((req.ensayo.co2_interior_m > req.ensayo.co2_interior_max) || (req.ensayo.co2_interior_t > req.ensayo.co2_interior_max)) {
				req.ensayo.co2_interior_cumple = false;
		} else {
			req.ensayo.co2_interior_cumple = true;
		};



		req.ensayo.co2_exterior_m = req.body.ensayo.co2_exterior_m;
		req.ensayo.co2_exterior_t = req.body.ensayo.co2_exterior_t;
		if ((req.ensayo.co2_exterior_m > req.ensayo.co2_exterior_max) || (req.ensayo.co2_exterior_t > req.ensayo.co2_exterior_max)) {
				req.ensayo.co2_exterior_cumple = false;
		} else {
			req.ensayo.co2_exterior_cumple = true;
		};




		req.ensayo.ecoli_m = req.body.ensayo.ecoli_m;
		if (req.ensayo.ecoli_m === 'no cumple') {
				req.ensayo.ecoli_cumple = 'no cumple';
		};
		if (req.ensayo.ecoli_m === 'cumple') {
				req.ensayo.ecoli_cumple = 'cumple';
		};
		if (req.ensayo.ecoli_m === 'no ensaya') {
				req.ensayo.ecoli_cumple = 'no ensaya';
		};





		req.ensayo.legionella_m = req.body.ensayo.legionella_m;
		req.ensayo.legionella_t = req.body.ensayo.legionella_t;
		if ((req.ensayo.legionella_m > req.ensayo.legionella_max) || (req.ensayo.legionella_t > req.ensayo.legionella_max)) {
				req.ensayo.legionella_cumple = false;
		} else {
			req.ensayo.legionella_cumple = true;
		};




		req.ensayo.pseudomona_m = req.body.ensayo.pseudomona_m;
		if (req.ensayo.pseudomona_m === 'no cumple') {
				req.ensayo.pseudomona_cumple = 'no cumple';
		};
		if (req.ensayo.pseudomona_m === 'cumple') {
				req.ensayo.pseudomona_cumple = 'cumple';
		};
		if (req.ensayo.pseudomona_m === 'no ensaya') {
				req.ensayo.pseudomona_cumple = 'no ensaya';
		};





		req.ensayo.enterococos_m = req.body.ensayo.enterococos_m;
		if (req.ensayo.enterococos_m === 'no cumple') {
				req.ensayo.enterococos_cumple = 'no cumple';
		};
		if (req.ensayo.enterococos_m === 'cumple') {
				req.ensayo.enterococos_cumple = 'cumple';
		};
		if (req.ensayo.enterococos_m === 'no ensaya') {
				req.ensayo.enterococos_cumple = 'no ensaya';
		};




		req.ensayo.staphlylococcus_m = req.body.ensayo.staphlylococcus_m;
		if (req.ensayo.staphlylococcus_m === 'no cumple') {
				req.ensayo.staphlylococcus_cumple = 'no cumple';
		};
		if (req.ensayo.staphlylococcus_m === 'cumple') {
				req.ensayo.staphlylococcus_cumple = 'cumple';
		};
		if (req.ensayo.staphlylococcus_m === 'no ensaya') {
				req.ensayo.staphlylococcus_cumple = 'no ensaya';
		};



		req.ensayo.langelier_m = req.body.ensayo.langelier_m;
		req.ensayo.langelier_t = req.body.ensayo.langelier_t;
		if ((req.ensayo.langelier_m > req.ensayo.langelier_max) ||
			(req.ensayo.langelier_m < req.ensayo.langelier_min) ||
			(req.ensayo.langelier_t > req.ensayo.langelier_max) ||
			(req.ensayo.langelier_t < req.ensayo.langelier_min)) {
				req.ensayo.langelier_cumple = false;
		} else {
			req.ensayo.langelier_cumple = true;
		};



		req.ensayo.texto = req.body.ensayo.texto;

		req.ensayo
			.save()
			.then(function() {res.redirect('/siloes/' + req.params.siloeId)})
			.catch(function(error) {next(error)});

	};








	exports.publish = function(req, res) {													// GET /quizes/:quizId/ensayos/:ensayoId/publish
		req.ensayo.publicado = true;
		req.ensayo.save({fields: ["publicado"]})
			.then(function() {res.redirect('/quizes/' + req.params.quizId);})
			.catch(function(error) {next(error)});
	};

	exports.unpublish = function(req, res) {													// GET /quizes/:quizId/ensayos/:ensayoId/unpublish
		req.ensayo.publicado = false;
		req.ensayo.save({fields: ["publicado"]})
			.then(function() {res.redirect('/quizes/' + req.params.quizId);})
			.catch(function(error) {next(error)});
	};

	exports.destroy = function(req, res) {
		req.ensayo.destroy().then(function() {
			res.redirect('/siloes/' + req.params.siloeId);
		}).catch(function(error) {next(error)});
	};
