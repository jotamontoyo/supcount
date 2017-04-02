
    // Definicion de modelo

    module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
        return sequelize.define('Criterio', {

            codigo: {
                type: DataTypes.INTEGER // no vale pa na de momento
            },

            mes: {
                type: DataTypes.INTEGER
            },

            max: {
                type: DataTypes.FLOAT
            },

            min: {
                type: DataTypes.FLOAT
            }





        })

    };
