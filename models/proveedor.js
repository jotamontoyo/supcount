	// Definicion de modelo

	module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
		return sequelize.define('Proveedor', { 
			nombre: {														
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "--> Falta Nombre"}}
			},
			telefono: {
				type: DataTypes.INTEGER
			},
			email: {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "--> Falta eMail"}}
			}
		})
	};