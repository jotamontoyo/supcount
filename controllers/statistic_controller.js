
	var models = require('../models/models.js');
	
	var statistics = {
		quizes: 0,
		comments: 0,
		average_comments: 0,
		no_commented: 0,
		commented_quizes: 0,
		comments_published: 0,
		comments_no_published: 0
	};
	
	exports.calculate = function(req, res, next) {
		statistics.quizes = 0;
		statistics.comments = 0;
		statistics.average_comments = 0;
		statistics.no_commented = 0;
		statistics.commented_quizes = 0;
		statistics.comments_published = 0;
		statistics.comments_no_published = 0;
		Promise.all([														// ejecuta todas las consultas
			models.Quiz.count(),
			models.Comment.count(),
			models.Quiz.findAll({
				include: [{
					model: models.Comment
				}]
			})
		]).then(function(results) { 										// `results` is an array of [quizes, comments, all]							
			if (results[0])	{												// por si no hay resultados, que no dé un infinity en la division
				statistics.quizes 				= results[0];		
				statistics.comments 			= results[1];
				statistics.average_comments 	= (statistics.comments / statistics.quizes).toFixed(2);
				for (var i in results[2]) {									// iteracion sobre la 3a consulta
					if (results[2][i].comments.length) {					// comprueba si existe comments
						statistics.commented_quizes++;
						for (var x in results[2][i].comments) {				// iteracion sobre todos los comments de un quiz
							if (!results[2][i].comments[x].publicado) {		// comprueba si no esta publicado
								statistics.comments_no_published++;
							};
						};
					} else {
						statistics.no_commented++;
					};
				};
				statistics.comments_published = statistics.comments - statistics.comments_no_published;
			}; 
		}).then(next, next);
	};
	
	exports.show = function(req, res) {
		res.render('quizes/statistics', {statistics: statistics, errors: []});
	}; 
