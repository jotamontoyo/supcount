
    // Definicion de modelo

    module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
        return sequelize.define('Vaso', {

            nombre: {
                type: DataTypes.STRING
            },
            centro: {
                type: DataTypes.STRING

            },
            ubicacion: {
                type: DataTypes.STRING
            },
            capacidad: {
                type: DataTypes.FLOAT,
                defaultValue: 0.0
            },
            interior: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            tipo_ensayo: {
                type: DataTypes.STRING,
                defaultValue: "Completo"
            },




            ph_max: {
                type: DataTypes.FLOAT,
                defaultValue: 8.0
            },
            ph_min: {
                type: DataTypes.FLOAT,
                defaultValue: 7.2
            },


            redox_max: {
                type: DataTypes.FLOAT,
                defaultValue: 900
            },
            redox_min: {
                type: DataTypes.FLOAT,
                defaultValue: 250
            },

            temp_max: {
                type: DataTypes.FLOAT,
                defaultValue: 30
            },
            temp_min: {
                type: DataTypes.FLOAT,
                defaultValue: 24
            },

            recirculacion: {
                type: DataTypes.FLOAT,
                defaultValue: 4
            },

            transparencia: {
                type: DataTypes.STRING,
                defaultValue: 'cumple'
            },

            extranios: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },

            turbidez_max: {
                type: DataTypes.FLOAT,
                defaultValue: 2
            },

            isocianuro_max: {
                type: DataTypes.FLOAT,
                defaultValue: 75
            },

            bromo_max: {
                type: DataTypes.FLOAT,
                defaultValue: 5
            },
            bromo_min: {
                type: DataTypes.FLOAT,
                defaultValue: 2
            },

            cloro_max: {
                type: DataTypes.FLOAT,
                defaultValue: 2.0
            },
            cloro_min: {
                type: DataTypes.FLOAT,
                defaultValue: 0.8
            },

            cloro_combinado_max: {
                type: DataTypes.FLOAT,
                defaultValue: 0.6
            },



            humedad_max: {
                type: DataTypes.FLOAT,
                defaultValue: 65
            },


            co2_interior: {
                type: DataTypes.FLOAT
            },
            co2_exterior: {
                type: DataTypes.FLOAT
            },


            ecoli: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            legionella_max: {
                type: DataTypes.FLOAT,
                defaultValue: 100
            },
            pseudomona: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            enterococos: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            staphlylococcus: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },



            langelier_max: {
                type: DataTypes.FLOAT,
                defaultValue: 0.5
            },
            langelier_min: {
                type: DataTypes.FLOAT,
                defaultValue: -0.5
            }



        })

    };
