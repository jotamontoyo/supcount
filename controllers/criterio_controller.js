
    var models = require('../models/models.js');

    exports.ownershipRequired = function(req, res, next){		// MW que permite acciones solamente si el quiz al que pertenece el comentario objeto pertenece al usuario logeado o si es cuenta admin
        models.Contador.find({
                where: {
                      id: Number(req.criterio.ContadorId)			// SQL del QuizId del comment
                }
            }).then(function(contador) {
                if (contador) {
                    var objQuizOwner = contador.UserId;						// userId del quiz
                    var logUser = req.session.user.id;					// userId de la sesion
                    var isAdmin = req.session.user.isAdmin;				// valor de isAdmin
                    console.log(objQuizOwner, logUser, isAdmin);
                    if (isAdmin || objQuizOwner === logUser) {			// comprueba que el user del quiz es el mismo que el user logueado
                        next();
                    } else {
                        res.redirect('/');
                    }
                } else{next(new Error('No existe contadorId=' + contadorId))}
            }
        ).catch(function(error){next(error)});
    };


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

        var fecha = new Date();

        var criterio = {
            mes: fecha.getUTCMonth() + 1,
            max: 0,
            min: 0
        };

        var contador = {
            id: req.params.contadorId
        };

		res.render('criterios/new.ejs', {contador: contador, criterio: criterio, errors: []}); 			// renderiza la vista comments/new del quiz -->> quizid: req.params.quizId

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




    exports.edit = function(req, res) {

        res.render('criterios/edit', {contador: req.contador, criterio: req.criterio, errors: []});

    };


    exports.update = function(req, res, next) {

        req.criterio.mes = req.body.criterio.mes;
        req.criterio.max = req.body.criterio.max;
        req.criterio.min = req.body.criterio.min;

        req.criterio
            .save()
			.then(function() {res.redirect('/contadores/' + req.params.contadorId);})
			.catch(function(error) {next(error)});

    };









    exports.destroy = function(req, res) {

        console.log('destroy criterio::::::::::::::::' + req.criterio);

		req.criterio.destroy().then(function() {
			res.redirect('/contadores/' + req.params.contadorId);
		}).catch(function(error) {next(error)});
	};
