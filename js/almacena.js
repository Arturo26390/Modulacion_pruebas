var almacena = {
	db: null,
	usuario: null,
	informacion: null,
	estado: null,
	conectarDB: function(){
		return window.openDatabase("Modulacion", "1.0", "Modulacion", 200000);
	},
	error: function(error){
		alert("Error: "+error.message);
	},
	exito: function(){
		//alert("Exito");
	},
	//guardarReservasHistorial: function(th, np, nh, nd){
	guardaPedimento: function(usu, inf, est){
		almacena.db              = almacena.conectarDB();
		almacena.usuario  		 = usu;
		almacena.informacion     = inf;
		almacena.estado 		 = est;
		almacena.db.transaction(almacena.tablaPendientes, almacena.error, almacena.exito);
	},
	tablaPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER PRIMARY KEY, usuario, informacion, estado)');

		// INSERTAR LOS DATOS
		tx.executeSql('INSERT INTO Pendientes (usuario, informacion, estado) VALUES ("'+almacena.usuario+'", "'+almacena.informacion+'", "'+almacena.estado+'")');
		bcs.abrirCamara();
	},

	cargarDatosPendientes: function(){
		almacena.db = almacena.conectarDB();
		almacena.db.transaction(almacena.leerPendientes, almacena.error);
	},

	leerPendientes: function(tx){
		// CREAR TABLA DE HISTORIAL SI NO EXISTE
		tx.executeSql('CREATE TABLE IF NOT EXISTS Pendientes (id INTEGER PRIMARY KEY,  usuario, informacion, estado)');

		// LEER DEL HISTORIAL
		tx.executeSql('SELECT * FROM Pendientes', [], almacena.mostrarResultadosPendientes, null);
	},

	mostrarResultadosPendientes: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay pedimentos pendientes</td></tr>';

		if(cantidad > 0){
			// SI HAY RESERVAS EN EL HISTORIAL
			var resultado = '';

			for( var i = 0; i < cantidad; i++){
				var usu = res.rows.item(i).usuario;
				var inf = res.rows.item(i).informacion;
				var est = res.rows.item(i).estado;
				resultado += '<tr><td>'+usu+'</td><td>'+inf+'</td><td>'+est+'</td></tr>';
			}
		}

		$("#listaHistorial").html(resultado);
	}
};