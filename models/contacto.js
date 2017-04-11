
    // Definicion de modelo

    module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
        return sequelize.define('Contacto', {
            nombre: {
                type: DataTypes.STRING
            },
            direccion: {
                type: DataTypes.STRING
            },
            poblacion: {
				type: DataTypes.STRING
			},
            provincia: {
				type: DataTypes.STRING
			},
            cp: {
				type: DataTypes.STRING
			},
            email: {
                type: DataTypes.STRING
            },
            telefono: {
				type: DataTypes.INTEGER
			},
            comentario: {
                type: DataTypes.STRING
            },
			lopd: {
				type: DataTypes.BOOLEAN,
                defaultValue: false
			}
        })
    };
