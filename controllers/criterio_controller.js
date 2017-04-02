
    var models = require('../models/models.js');



    exports.load = function(req, res, next, criterioId) {									// Autoload :id de comentarios
		models.Criterio.find({
			where: {
				id: Number(criterioId)
			}
		}).then(function( criterio ) {
			if (criterio) {
				req.criterio = criterio;
				next();
			} else {
				next(new Error('No existe criterioId=' + criterioId))
			}
		}).catch(function(error){next(error)});
	};




    exports.new = function(req, res) {														// GET /quizes/:quizId/comments/new, baja el formulario /views/comment.ejs

		res.render('criterios/new.ejs', {contadorid: req.params.contadorId, errors: []}); 			// renderiza la vista comments/new del quiz -->> quizid: req.params.quizId

	};



	exports.create = function(req, res, next) {													// POST /quizes/:quizId/comments


		var criterio = models.Criterio.build({												// construccion objeto comment para lugego introducir en la tabla
			mes: req.body.criterio.mes,													// texto que llega del formulario
			max: req.body.criterio.max,													// texto que llega del formulario
			min: req.body.criterio.min,													// texto que llega del formulario
			ContadorId: req.params.contadorId											// al comment se le pasa el quizId del quiz para establecer la integridad referencial entre Quiz y Comment. indice secundario de Comment
		});

		var errors = criterio.validate();
		if (errors) {
			var i = 0;
			var errores = new Array();
			for (var prop in errors) errores[i++] = {message: errors[prop]};
			res.render('criterios/new', {criterio: criterio, errors: errores});
		} else {
			criterio 																		// save: guarda en DB campos pregunta y respuesta de quiz
			.save()
			.then(function() {res.redirect('/contadores/' + req.params.contadorId)});
		};

	};






    exports.destroy = function(req, res) {

        console.log('destroy criterio::::::::::::::::' + req.criterio);

		req.criterio.destroy().then(function() {
			res.redirect('/contadores/' + req.params.contadorId);
		}).catch(function(error) {next(error)});
	};
