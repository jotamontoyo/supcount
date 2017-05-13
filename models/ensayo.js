
	// Definicion de modelo

	module.exports = function(sequelize, DataTypes) {			// crea la estructura de la tabla
		return sequelize.define('Ensayo', {



			texto: {
				type: DataTypes.STRING
			},

			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},

			vasoId: {											// guardara el id del vaso
                type: DataTypes.INTEGER
            },

			nombre: {
                type: DataTypes.STRING

            },

			ubicacion: {
                type: DataTypes.STRING
            },





			ph_max: {											// datos del ensayo
                type: DataTypes.FLOAT
            },
            ph_min: {
                type: DataTypes.FLOAT
            },
            ph_m: {
                type: DataTypes.FLOAT
            },
            ph_t: {
                type: DataTypes.FLOAT
            },


            redox_max: {
                type: DataTypes.FLOAT
            },
            redox_min: {
                type: DataTypes.FLOAT
            },
            redox_m: {
                type: DataTypes.FLOAT
            },
            redox_t: {
                type: DataTypes.FLOAT
            },




            temp_max: {
                type: DataTypes.FLOAT
            },
            temp_min: {
                type: DataTypes.FLOAT
            },
            temp_m: {
                type: DataTypes.FLOAT
            },
            temp_t: {
                type: DataTypes.FLOAT
            },




            recirculacion: {
                type: DataTypes.FLOAT
            },
            recirculacion_m: {
                type: DataTypes.FLOAT
            },
            recirculacion_t: {
                type: DataTypes.FLOAT
            },



            transparencia: {
                type: DataTypes.BOOLEAN
            },
            transparencia_m: {
                type: DataTypes.BOOLEAN
            },
            transparencia_t: {
                type: DataTypes.BOOLEAN
            },





            extranios: {
                type: DataTypes.BOOLEAN
            },
            extranios_m: {
                type: DataTypes.BOOLEAN
            },
            extranios_t: {
                type: DataTypes.BOOLEAN
            },




            turbidez_max: {
                type: DataTypes.FLOAT
            },
            turbidez_max_m: {
                type: DataTypes.FLOAT
            },
            turbidez_max_t: {
                type: DataTypes.FLOAT
            },




            isocianuro_max: {
                type: DataTypes.FLOAT
            },
            isocianuro_max_m: {
                type: DataTypes.FLOAT
            },
            isocianuro_max_t: {
                type: DataTypes.FLOAT
            },




            bromo_max: {
                type: DataTypes.FLOAT
            },
            bromo_min: {
                type: DataTypes.FLOAT
            },
            bromo_m: {
                type: DataTypes.FLOAT
            },
            bromo_t: {
                type: DataTypes.FLOAT
            },



            cloro_max: {
                type: DataTypes.FLOAT
            },
            cloro_min: {
                type: DataTypes.FLOAT
            },
            cloro_m: {
                type: DataTypes.FLOAT
            },
            cloro_t: {
                type: DataTypes.FLOAT
            },




            cloro_combinado_max: {
                type: DataTypes.FLOAT
            },
            cloro_combinado_max_m: {
                type: DataTypes.FLOAT
            },
            cloro_combinado_max_t: {
                type: DataTypes.FLOAT
            },



            humedad_max: {
                type: DataTypes.FLOAT
            },
            humedad_max_m: {
                type: DataTypes.FLOAT
            },
            humedad_max_t: {
                type: DataTypes.FLOAT
            },


            co2_interior: {
                type: DataTypes.FLOAT
            },
            co2_interior_m: {
                type: DataTypes.FLOAT
            },
            co2_interior_t: {
                type: DataTypes.FLOAT
            },
            co2_exterior: {
                type: DataTypes.FLOAT
            },
            co2_exterior_m: {
                type: DataTypes.FLOAT
            },
            co2_exterior_t: {
                type: DataTypes.FLOAT
            },


            ecoli: {
                type: DataTypes.BOOLEAN
            },
            ecoli_m: {
                type: DataTypes.BOOLEAN
            },
            ecoli_t: {
                type: DataTypes.BOOLEAN
            },



            legionella_max: {
                type: DataTypes.FLOAT
            },
            legionella_max_m: {
                type: DataTypes.FLOAT
            },
            legionella_max_t: {
                type: DataTypes.FLOAT
            },



            pseudomona: {
                type: DataTypes.BOOLEAN
            },
            pseudomona_m: {
                type: DataTypes.BOOLEAN
            },
            pseudomona_t: {
                type: DataTypes.BOOLEAN
            },



            enterococos: {
                type: DataTypes.BOOLEAN
            },
            enterococos_m: {
                type: DataTypes.BOOLEAN
            },
            enterococos_t: {
                type: DataTypes.BOOLEAN
            },



            staphlylococcus: {
                type: DataTypes.BOOLEAN
            },
            staphlylococcus_m: {
                type: DataTypes.BOOLEAN
            },
            staphlylococcus_t: {
                type: DataTypes.BOOLEAN
            },



            langelier_max: {
                type: DataTypes.FLOAT
            },
            langelier_min: {
                type: DataTypes.FLOAT
            },
            langelier_m: {
                type: DataTypes.FLOAT
            },
            langelier_t: {
                type: DataTypes.FLOAT
            },


			// *****************




            lectura_actual: {						// lectura contador recirculacion
                type: DataTypes.FLOAT
            },


			cumple: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			cantidad_no_cumple: {
				type: DataTypes.INTEGER,
				defaultValue: 0
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

		},

		{
			timestamps: false
		})
	};
