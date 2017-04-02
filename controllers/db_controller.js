
	var models = require('../models/models.js');

	exports.show = function(req, res, next) {
		models.Quiz.findAll({
			include: [{
				model: models.Comment
			}]
		}).then(function(results) {
			res.render('db/index', {results: results, errors: []});
		});
	};

/*	exports.show = function(req, res, next) {
		models.User.findAll({
			include: [{
				model: models.Quiz
			}]
		}).then(function() {
			models.Quiz.findAll({
				include: [{
					model: models.Comment
				}]
			}).then(function(results) {
				res.render('db/index', {results: results, errors: []});
			});
		)};
	}; */
