    // Definicion de modelo


    module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
        return sequelize.define('Siloe', {

            centro: {													// guarda el centro que la origina
                type: DataTypes.STRING
            },
            proceso: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
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
