
    // Definicion de modelo


    module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
        return sequelize.define('Centro', {


            nombre: {
                type: DataTypes.STRING

            },

            direccion: {
                type: DataTypes.STRING

            },

            contacto: {
                type: DataTypes.STRING
            },

            telefono: {
                type: DataTypes.STRING

            },

            email: {
                type: DataTypes.STRING
            },

            max_contadores: {
                type: DataTypes.FLOAT
            },

            max_vasos: {
                type: DataTypes.FLOAT
            }

        })
    };
