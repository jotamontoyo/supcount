
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









	exports.update = function(req, res, next) {								// actualiza la lectura del contador


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
		if ((req.ensayo.recirculacion_m > req.ensayo.recirculacion_max) ||
			(req.ensayo.recirculacion_m < req.ensayo.recirculacion_min) ||
			(req.ensayo.recirculacion_t > req.ensayo.recirculacion_max) ||
			(req.ensayo.recirculacion_t < req.ensayo.recirculacion_min)) {
				req.ensayo.recirculacion_cumple = false;
		} else {
			req.ensayo.recirculacion_cumple = true;
		};




//		req.ensayo.transparencia_cumple = req.body.ensayo.transparencia_cumple;
		req.ensayo.transparencia_m = req.body.ensayo.transparencia_m;
		req.ensayo.transparencia_t = req.body.ensayo.transparencia_t;

		if ((req.ensayo.transparencia_m != req.ensayo.transparencia) ||
			(req.ensayo.transparencia_t != req.ensayo.transparencia)) {

				req.ensayo.transparencia_cumple = false;

		};

		if ((req.ensayo.transparencia_m === req.ensayo.transparencia) &&
			(req.ensayo.transparencia_t === req.ensayo.transparencia)) {

				req.ensayo.transparencia_cumple = true;

		};

		console.log('transparencia flag:  ' + req.ensayo.transparencia);
		console.log('transparencia cumple:  ' + req.ensayo.transparencia_cumple);
		console.log('transparencia m:  ' + req.ensayo.transparencia_m);
		console.log('transparencia t:  ' + req.ensayo.transparencia_t);







		req.ensayo.lectura_m = req.body.ensayo.lectura_m;
		req.ensayo.lectura_t = req.body.ensayo.lectura_t;






		req.ensayo.extranios_m = req.body.ensayo.extranios_m;
		req.ensayo.extranios_t = req.body.ensayo.extranios_t;

		if ((req.ensayo.extranios_m !== req.ensayo.extranios) ||
			(req.ensayo.extranios_t !== req.ensayo.extranios)) {

				req.ensayo.extranios_cumple = false;

		};

		if ((req.ensayo.extranios_m === req.ensayo.extranios) &&
			(req.ensayo.extranios_t === req.ensayo.extranios)) {

				req.ensayo.extranios_cumple = true;

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




// faltan campos desplegables aqui






		req.ensayo.legionella_m = req.body.ensayo.legionella_m;
		req.ensayo.legionella_t = req.body.ensayo.legionella_t;
		if ((req.ensayo.legionella_m > req.ensayo.legionella_max) || (req.ensayo.legionella_t > req.ensayo.legionella_max)) {
				req.ensayo.legionella_cumple = false;
		} else {
			req.ensayo.legionella_cumple = true;
		};



// faltan campos desplegables aqui






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
			.then(function() {
				res.redirect('/siloes/' + req.params.siloeId);
			})
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
			res.redirect('/quizes/' + req.params.quizId);
		}).catch(function(error) {next(error)});
	};
