	// Definicion de modelo


	module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
		return sequelize.define('Quiz', {
			pregunta: {														// guarda el motivo de la incidencia
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "--> Falta Pregunta"}}
			},
			respuesta: {
				type: DataTypes.STRING
			},
			image: {
				type: DataTypes.BLOB
			},
			proveedor: {													// guarda el proveedor que la origina
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "--> Falta Proveedor"}}
			},
			centro: {													// guarda el centro que la origina
				type: DataTypes.STRING
			},
			estado: {
                type: DataTypes.STRING,
                defaultValue: 'abierto'
            },
			UserName: {
				type: DataTypes.STRING
			},

			fecha: {
				type: DataTypes.DATE
			},

			dia: {
				type: DataTypes.INTEGER
			},

			mes: {
				type: DataTypes.INTEGER
			},

			anio: {
				type: DataTypes.INTEGER
			}


		})
	};
