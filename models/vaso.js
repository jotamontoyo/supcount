
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
            ph_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },


            redox_max: {
                type: DataTypes.FLOAT,
                defaultValue: 900
            },
            redox_min: {
                type: DataTypes.FLOAT,
                defaultValue: 250
            },
            redox_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            temp_max: {
                type: DataTypes.FLOAT,
                defaultValue: 30
            },
            temp_min: {
                type: DataTypes.FLOAT,
                defaultValue: 24
            },
            temp_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            recirculacion: {
                type: DataTypes.FLOAT,
                defaultValue: 4
            },
            recirculacion_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            transparencia: {
                type: DataTypes.STRING,
                defaultValue: 'no ensaya'
            },

            extranios: {
                type: DataTypes.STRING,
                defaultValue: 'no ensaya'
            },

            turbidez_max: {
                type: DataTypes.FLOAT,
                defaultValue: 2
            },
            turbidez_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            isocianuro_max: {
                type: DataTypes.FLOAT,
                defaultValue: 75
            },
            isocianuro_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            bromo_max: {
                type: DataTypes.FLOAT,
                defaultValue: 5
            },
            bromo_min: {
                type: DataTypes.FLOAT,
                defaultValue: 2
            },
            bromo_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            cloro_max: {
                type: DataTypes.FLOAT,
                defaultValue: 2.0
            },
            cloro_min: {
                type: DataTypes.FLOAT,
                defaultValue: 0.8
            },
            cloro_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            cloro_combinado_max: {
                type: DataTypes.FLOAT,
                defaultValue: 0.6
            },
            cloro_combinado_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },



            humedad_max: {
                type: DataTypes.FLOAT,
                defaultValue: 65
            },
            humedad_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },


            co2_interior: {
                type: DataTypes.FLOAT
            },
            co2_interior_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            co2_exterior: {
                type: DataTypes.FLOAT
            },
            co2_exterior_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },


            ecoli: {
                type: DataTypes.STRING,
                defaultValue: 'no ensaya'
            },

            legionella_max: {
                type: DataTypes.FLOAT,
                defaultValue: 100
            },
            legionella_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },

            pseudomona: {
                type: DataTypes.STRING,
                defaultValue: 'no ensaya'
            },

            enterococos: {
                type: DataTypes.STRING,
                defaultValue: 'no ensaya'
            },

            staphlylococcus: {
                type: DataTypes.STRING,
                defaultValue: 'no ensaya'
            },



            langelier_max: {
                type: DataTypes.FLOAT,
                defaultValue: 0.5
            },
            langelier_min: {
                type: DataTypes.FLOAT,
                defaultValue: -0.5
            },
            langelier_ensayar: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },



        })

    };
