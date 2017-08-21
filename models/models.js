
	// construye la DB y el modelo importando las estructuras de las tablas

	var path = require('path');

	// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
	// SQLite   DATABASE_URL = sqlite://:@:/
	var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
	var DB_name  = (url[6]||null);
	var user     = (url[2]||null);
	var pwd      = (url[3]||null);
	var protocol = (url[1]||null);
	var dialect  = (url[1]||null);
	var port     = (url[5]||null);
	var host     = (url[4]||null);
	var storage  = process.env.DATABASE_STORAGE;

	var Sequelize = require('sequelize');								// crea objeto de la clase modelo ORM

	var sequelize = new Sequelize(DB_name, user, pwd, 					// Usar BBDD SQLite o Postgres. Constructor de la DB
	  { dialect:  protocol,
		protocol: protocol,
		port:     port,
		host:     host,
		storage:  storage,  											// solo SQLite (.env)
		omitNull: true      											// solo Postgres
	  }
	);

	var Quiz = sequelize.import(path.join(__dirname, 'quiz'));				// importar estructura y definicion de la tabla Quiz
	var Comment = sequelize.import(path.join(__dirname, 'comment'));		// importar estructura y definicion de la tabla Comment
	var User = sequelize.import(path.join(__dirname, 'user'));				// importar estructura y definicion de la tabla User
	var Proveedor = sequelize.import(path.join(__dirname, 'proveedor'));	// importar estructura y definicion de la tabla Provider
	var Contador = sequelize.import(path.join(__dirname, 'contador'));		// importar estructura y definicion de la tabla Contador
	var Criterio = sequelize.import(path.join(__dirname, 'criterio'));		// importar estructura y definicion de la tabla Criterio
	var Centro = sequelize.import(path.join(__dirname, 'centro'));			// importar estructura y definicion de la tabla Centro
	var Contacto = sequelize.import(path.join(__dirname, 'contacto'));		// importar estructura y definicion de la tabla Contacto
	var Vaso = sequelize.import(path.join(__dirname, 'vaso'));				// importar estructura y definicion de la tabla Vaso
	var Siloe = sequelize.import(path.join(__dirname, 'siloe'));			// importar estructura y definicion de la tabla Siloe
	var Ensayo = sequelize.import(path.join(__dirname, 'ensayo'));			// importar estructura y definicion de la tabla Ensayo

	Quiz.belongsTo(User);												// integridad referncial. Cada Quiz es hijo de User
	User.hasMany(Quiz);													// cada User puede tener varios Quiz

	Comment.belongsTo(Quiz);											// integridad referncial. Cada Comment es hijo de Quiz
	Quiz.hasMany(Comment);												// el padre puede tener varios hijos

	Criterio.belongsTo(Contador);
	Contador.hasMany(Criterio);

	Siloe.belongsTo(User);												// integridad referncial. Cada Siloe es hijo de User
	User.hasMany(Siloe);

	Ensayo.belongsTo(Siloe);
	Siloe.hasMany(Ensayo);


	exports.Quiz = Quiz;												// exportar tablas
	exports.Comment = Comment;
	exports.User = User;
	exports.Proveedor = Proveedor;
	exports.Contador = Contador;
	exports.Criterio = Criterio;
	exports.Centro = Centro;
	exports.Contacto = Contacto;
	exports.Vaso = Vaso;
	exports.Siloe = Siloe;
	exports.Ensayo = Ensayo;



	sequelize.sync().then(function() {									// sequelize.sync() inicializa tabla de preguntas en DB

	  	User.count().then(function( count ) {								// then() ejecuta el manejador una vez creada la tabla

	    	if(count === 0) {   											// la tabla se inicializa solo si está vacía

				User.bulkCreate(
	        		[
						{username: 'sAdminCentral', password: '1973654qzpm', isAdmin: true, isSuperAdmin: true, centro: 'Central'},
						{username: 'admin', password: '1234', isAdmin: true, centro: 'Central'},
	          			{username: 'pepe', password: '5678', isAdmin: false, centro: 'Central'}
					]
	        	).then(function() {

	        		console.log('Base de datos: tabla user inicializada');

	        		Quiz.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Quiz.bulkCreate(
	              				[ {pregunta: 'faltas', respuesta: 'Roma', centro: "Central", proveedor: 'Central', estado: 'abierto', UserId: 2, UserName: 'pepe', dia: 0, mes: 0, anio: 0}, 			// estos quizes pertenecen al usuario pepe (2)
	                			{pregunta: 'retraso', respuesta: 'Lisboa', centro: "Central", proveedor: 'Central', estado: 'abierto', UserId: 2, UserName: 'pepe', dia: 0, mes: 0, anio: 0},
	                			{pregunta: 'retraso', respuesta: 'Lisboa', centro: "Central", proveedor: 'Central', estado: 'abierto', UserId: 2, UserName: 'pepe', dia: 0, mes: 0, anio: 0}]
	              			).then(function(){console.log('Base de datos: tabla parte inicializada')});
	          			};
	        		});

	        		Siloe.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Siloe.bulkCreate(
	              				[{centro: "Central", UserId: 2, UserName: "pepe", estado: 'abierto', dia: 0, mes: 0, anio: 0}]
	              			).then(function(){console.log('Base de datos: tabla siloe inicializada')});
	          			};
	        		});

	        		Proveedor.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Proveedor.bulkCreate(
	              				[ {nombre: 'provider1', telefono: '999999999', email: 'somenone@host.com'},
	                			{nombre: 'provider2', telefono: '999999999', email: 'someoneelse@host.com'}]
	              		    ).then(function(){console.log('Base de datos: tabla proveedor inicializada')});
	          			};
	        		});

	        		Centro.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Centro.bulkCreate(
	              				[{
									nombre: 'Central',
									direccion: 'central',
									contacto: 'contacto',
									telefono: '999999999',
									email: 'somenone@host.com',
									max_contadores: 3,
									max_vasos: 3
								}]
	              		    ).then(function(){console.log('Base de datos: tabla centros inicializada')});
	          			};
	        		});

					Contacto.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Contacto.bulkCreate(
	              				[{nombre: 'nombre', email: 'email', comentario: 'comentario', lopd: false}]
	              		    ).then(function(){console.log('Base de datos: tabla contacto inicializada')});
	          			};
	        		});

					Contador.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Contador.bulkCreate(

								[
									{ codigo: 1,
									nombre: 'contador 1',
									centro: 'Central',
									marca: 'marca',
									modelo: 'modelo',
									deposito: false,
									ubicacion: 'ubicacion',
									fecha_revision: 'fecha',
									tolerancia: 0,
									lectura_actual: 0,
									maximo: 0,
									minimo: 0,
									medio: 0 },

									{ codigo: 2,
									nombre: 'contador 2',
									centro: 'Central',
									marca: 'marca',
									modelo: 'modelo',
									deposito: false,
									ubicacion: 'ubicacion',
									fecha_revision: 'fecha',
									tolerancia: 0,
									lectura_actual: 0,
									maximo: 0,
									minimo: 0,
									medio: 0 },

									{ codigo: 3,
									nombre: 'contador 3',
									centro: 'Central',
									marca: 'marca',
									modelo: 'modelo',
									deposito: false,
									ubicacion: 'ubicacion',
									fecha_revision: 'fecha',
									tolerancia: 0,
									lectura_actual: 0,
									maximo: 0,
									minimo: 0,
									medio: 0 }

								]

	              		    ).then(function() {console.log('Base de datos: tabla contador inicializada')});
	          			};
	        		});

					Vaso.count().then(function( count ) {
	          			if(count === 0) {   																			// la tabla se inicializa solo si está vacía
	            			Vaso.bulkCreate(
	              				[{
									nombre: 'Piscina principal',
									centro: 'Central',
									ubicacion: '',
									interior: false,
									tipo_ensayo: 'Completo'

								}]
	              		    ).then(function(){console.log('Base de datos: tabla vaso inicializada')});
	          			};
	        		});

	      		});
	    	};
	  	});
	});
