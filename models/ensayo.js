
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

			centro: {
				type: DataTypes.STRING
			},

			nombre: {
                type: DataTypes.STRING

            },

			ubicacion: {
                type: DataTypes.STRING
            },
			capacidad: {
				type: DataTypes.FLOAT
			},
			interior: {
                type: DataTypes.BOOLEAN
            },
			tipo_ensayo: {
                type: DataTypes.STRING,
                defaultValue: "Completo"
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
			ph_cumple: {
				type: DataTypes.BOOLEAN
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
			redox_cumple: {
				type: DataTypes.BOOLEAN
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
			temp_cumple: {
				type: DataTypes.BOOLEAN
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
			recirculacion_cumple: {
				type: DataTypes.BOOLEAN
			},




            transparencia: {
                type: DataTypes.STRING,
				defaultValue: 'cumple'
            },
            transparencia_m: {
				type: DataTypes.STRING,
				defaultValue: 'cumple'
            },
            transparencia_t: {
				type: DataTypes.STRING,
				defaultValue: 'cumple'
            },
			transparencia_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'cumple'
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
			extranios_cumple: {
				type: DataTypes.BOOLEAN
			},




            turbidez_max: {
                type: DataTypes.FLOAT
            },
            turbidez_m: {
                type: DataTypes.FLOAT
            },
            turbidez_t: {
                type: DataTypes.FLOAT
            },
			turbidez_cumple: {
				type: DataTypes.BOOLEAN
			},




            isocianuro_max: {
                type: DataTypes.FLOAT
            },
            isocianuro_m: {
                type: DataTypes.FLOAT
            },
            isocianuro_t: {
                type: DataTypes.FLOAT
            },
			isocianuro_cumple: {
				type: DataTypes.BOOLEAN
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
			bromo_cumple: {
				type: DataTypes.BOOLEAN
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
			cloro_cumple: {
				type: DataTypes.BOOLEAN
			},




            cloro_combinado_max: {
                type: DataTypes.FLOAT
            },
            cloro_combinado_m: {
                type: DataTypes.FLOAT
            },
            cloro_combinado_t: {
                type: DataTypes.FLOAT
            },
			cloro_combinado_cumple: {
				type: DataTypes.BOOLEAN
			},



            humedad_max: {
                type: DataTypes.FLOAT
            },
            humedad_m: {
                type: DataTypes.FLOAT
            },
            humedad_t: {
                type: DataTypes.FLOAT
            },
			humedad_cumple: {
				type: DataTypes.BOOLEAN
			},


            co2_interior_max: {
                type: DataTypes.FLOAT
            },
            co2_interior_m: {
                type: DataTypes.FLOAT
            },
            co2_interior_t: {
                type: DataTypes.FLOAT
            },
			co2_interior_cumple: {
				type: DataTypes.BOOLEAN
			},


            co2_exterior_max: {
                type: DataTypes.FLOAT
            },
            co2_exterior_m: {
                type: DataTypes.FLOAT
            },
            co2_exterior_t: {
                type: DataTypes.FLOAT
            },
			co2_exterior_cumple: {
				type: DataTypes.BOOLEAN
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
			ecoli_cumple: {
				type: DataTypes.BOOLEAN
			},



            legionella_max: {
                type: DataTypes.FLOAT
            },
            legionella_m: {
                type: DataTypes.FLOAT
            },
            legionella_t: {
                type: DataTypes.FLOAT
            },
			legionella_cumple: {
				type: DataTypes.BOOLEAN
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
			pseudomona_cumple: {
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
			enterococos_cumple: {
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
			staphlylococcus_cumple: {
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
			langelier_cumple: {
				type: DataTypes.BOOLEAN
			},


			// *****************




            lectura_m: {						// lectura contador recirculacion
                type: DataTypes.FLOAT
            },
            lectura_t: {						// lectura contador recirculacion
                type: DataTypes.FLOAT
            },
			lectura_cumple: {
				type: DataTypes.BOOLEAN
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
