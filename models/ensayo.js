
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
			ph_ensayar: {
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
			redox_ensayar: {
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
			temp_ensayar: {
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
			recirculacion_ensayar: {
				type: DataTypes.BOOLEAN
			},




            transparencia: {
                type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
            transparencia_m: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
			transparencia_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
			},





            extranios: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
            extranios_m: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
			extranios_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
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
			turbidez_ensayar: {
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
			isocianuro_ensayar: {
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
			bromo_ensayar: {
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
			cloro_ensayar: {
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
			cloro_combinado_ensayar: {
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
			humedad_ensayar: {
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
			co2_interior_ensayar: {
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
			co2_exterior_ensayar: {
				type: DataTypes.BOOLEAN
			},


            ecoli: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
            ecoli_m: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
			ecoli_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
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
			legionella_ensayar: {
				type: DataTypes.BOOLEAN
			},



            pseudomona: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
            pseudomona_m: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
			pseudomona_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
			},



            enterococos: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
            enterococos_m: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
			enterococos_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'cumple'
			},



            staphlylococcus: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
            staphlylococcus_m: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
            },
			staphlylococcus_cumple: {
				type: DataTypes.STRING,
				defaultValue: 'no ensaya'
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
			langelier_ensayar: {
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
