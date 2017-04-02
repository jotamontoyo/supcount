
	var models = require('../models/models.js');

	exports.ownershipRequired = function(req, res, next){		// MW que permite acciones solamente si el quiz al que pertenece el comentario objeto pertenece al usuario logeado o si es cuenta admin
	    models.Quiz.find({
	            where: {
	                  id: Number(req.comment.QuizId)			// SQL del QuizId del comment
	            }
	        }).then(function(quiz) {
	            if (quiz) {
	                var objQuizOwner = quiz.UserId;						// userId del quiz
	                var logUser = req.session.user.id;					// userId de la sesion
	                var isAdmin = req.session.user.isAdmin;				// valor de isAdmin
	                console.log(objQuizOwner, logUser, isAdmin);
	                if (isAdmin || objQuizOwner === logUser) {			// comprueba que el user del quiz es el mismo que el user logueado
	                    next();
	                } else {
	                    res.redirect('/');
	                }
	            } else{next(new Error('No existe quizId=' + quizId))}
	        }
	    ).catch(function(error){next(error)});
	};

	exports.load = function(req, res, next, commentId) {									// Autoload :id de comentarios
		models.Comment.find({
			where: {
				id: Number(commentId)
			}
		}).then(function(comment) {
			if (comment) {
				req.comment = comment;
				next();
			} else {
				next(new Error('No existe commentId=' + commentId))
			}
		}).catch(function(error){next(error)});
	};

/*	exports.new = function(req, res) {	//********** se elimina porque se crean con el quiz segun los contadores creados en la tabla Contador	// GET /quizes/:quizId/comments/new, baja el formulario /views/comment.ejs
		res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []}); 			// renderiza la vista comments/new del quiz -->> quizid: req.params.quizId
	};

	exports.create = function(req, res, next) {													// POST /quizes/:quizId/comments
		if (req.body.comment.texto) {
			var comment = models.Comment.build({												// construccion objeto comment para lugego introducir en la tabla
				texto: req.body.comment.texto,													// texto que llega del formulario
				QuizId: req.params.quizId														// al comment se le pasa el quizId del quiz para establecer la integridad referencial entre Quiz y Comment. indice secundario de Comment
			});
			var errors = comment.validate();
			if (errors) {
				var i = 0;
				var errores = new Array();
				for (var prop in errors) errores[i++] = {message: errors[prop]};
				res.render('comments/new', {comment: comment, errors: errores});
			} else {
				comment 																		// save: guarda en DB campos pregunta y respuesta de quiz
				.save()
				.then(function() {res.redirect('/quizes/' + req.params.quizId)});
			};
		} else {
			next(new Error('Introuzca un texto'));
		};
	}; */



/*	exports.edit = function(req, res) {															// carga formulario

		console.log('edit..............:' + req.quiz.comments)

			res.render('comments/edit', {
				quiz: req.quiz,
				comment: req.quiz.comments,
				errors: []
			});





	}; */






	exports.update = function(req, res, next) {								// actualiza la lectura del contador

		req.comment.lectura_actual = req.body.comment.lectura_actual;
		req.comment.carga = req.body.comment.carga;

		req.comment.texto = req.body.comment.texto;

		req.comment.save({fields: ["lectura_actual", "carga", "texto"]})
			.then(function() {res.redirect('/quizes/' + req.params.quizId);})
			.catch(function(error) {next(error)});


	};








	exports.publish = function(req, res) {													// GET /quizes/:quizId/comments/:commentId/publish
		req.comment.publicado = true;
		req.comment.save({fields: ["publicado"]})
			.then(function() {res.redirect('/quizes/' + req.params.quizId);})
			.catch(function(error) {next(error)});
	};

	exports.unpublish = function(req, res) {													// GET /quizes/:quizId/comments/:commentId/unpublish
		req.comment.publicado = false;
		req.comment.save({fields: ["publicado"]})
			.then(function() {res.redirect('/quizes/' + req.params.quizId);})
			.catch(function(error) {next(error)});
	};

	exports.destroy = function(req, res) {
		req.comment.destroy().then(function() {
			res.redirect('/quizes/' + req.params.quizId);
		}).catch(function(error) {next(error)});
	};
