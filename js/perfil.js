$(document).foundation()


var urlServicio = "http://dromedicas.sytes.net:8080/puntosfarmanorte/webservice/puntos/datosafiliado/";
var urlTxs      = "http://dromedicas.sytes.net:8080/puntosfarmanorte/webservice/puntos/ultimastxs/";
// var urlTxs      = "http://localhost:8080/puntosfarmanorte/webservice/puntos/ultimastxs/";
var infoAfiliado;
var infoTxs;


/**
 * Funcion que se ejecuta cuando el DOM ya esta cargado
 */
function iniciar() {  
 //Carga asincrona de los datos del afiliado
  obtenerInfoAfiliado(function(response) {
    //Parse JSON string into object
    infoAfiliado = JSON.parse(response);
    if(infoAfiliado.code == 200){
      cargarDatosAfiliado();
    }else{
       window.location.href = "../index.html";
    }
  });
  //Carga asincrona de las ultimas transadcciones
  obtenerTxAfiliado(
    function(response) {
        //Parse JSON string into object
        infoTxs = JSON.parse(response);
        if(infoTxs.code == 200){
          cargarTxAfiliado();
        }else{
           window.location.href = "../index.html";
        }
      }
  );
  document.getElementById('salirPuntos').addEventListener('click', cerrarSesion, false);
  document.getElementById('exit-offcanvas').addEventListener('click', cerrarSesion, false);
}//end function iniciar



/**
 * Obtiene las transacciones del afiliado desde el servicio definido
 * para este fin.
 * @param {function} callback 
 */
function obtenerTxAfiliado(callback) {
    var xobj = new XMLHttpRequest();
    urlEndPoint = urlTxs + localStorage.getItem('token');
    xobj.overrideMimeType("application/json");
    xobj.open('GET', urlEndPoint, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/**
 * Obtiene los datos del afiliado desde el servicio definido para
 * este fin, se debe enviar el token para validar la identidad del 
 * afiliado (JWT)
 * @param {function} callback 
 */
function obtenerInfoAfiliado(callback) {
    var xobj = new XMLHttpRequest();
    urlEndPoint = urlServicio + localStorage.getItem('token');
    xobj.overrideMimeType("application/json");
    xobj.open('GET', urlEndPoint, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


/**
 * Establece en los elementos del DOM los datos
 * obtenidos del afiliado desde el servicio web
 * Datos del afiliado de la plataforma de puntos.
 */
function cargarDatosAfiliado(){
  var afiliado = infoAfiliado.afiliado;  
  var balance = infoAfiliado.balance;
  var foto =  infoAfiliado.urlFotoAfiliado;
  $('#legendperfilmain').text(onwName(afiliado.nombres + " " + afiliado.apellidos));
  $('#etiquetaafiliado').text(onwName(afiliado.nombres + " " + afiliado.apellidos));
  $('#etiquetaafiliadooff').text(onwName(afiliado.nombres + " " + afiliado.apellidos));
 
  $('#puntosafmenuoff').val(number_format(balance.totalpuntosactual,0));
  $('#puntosafmenu').val(number_format(balance.totalpuntosactual,0));
  
  $('#p_acumulados').val(number_format(balance.acumulados,0));
  $('#p_redimidos').val(number_format(balance.redimidos,0));
  $('#p_vencidos').val(number_format(balance.avencer,0));
  $('#p_vencidos').val(number_format(balance.vencidos,0));
  $('#p_fecha').val(balance.fechavencimiento);
  $('#p_actual').val(number_format(balance.totalpuntosactual,0));

  if(foto){
    $('#imgperfilmain').attr("src",foto);
    $('#fotoPerfilMenu').attr("src",foto);
    $('#fotoperfilmenuOff').attr("src",foto);
  }
}


/**
 * Crea el detalle de la tabla de transacciones del 
 * perfil del afiliado
 */
function cargarTxAfiliado(){
    //transacciones
  var tabla = document.getElementById('txrecord');
  var txs = infoTxs.contenedor;
  for( var i = 0 ; i < 10; i++ ){
    var descripcion  = txs[i].tipotransaccion.descripcion;
    var tipoTx;
    if( descripcion == "ACUMULACION"){
      tipoTx = "Compra"
    }
    if( descripcion == "REDENCION"){
      tipoTx = "Redencion de Puntos"
    }
    if( descripcion == "DEVOLUCION DE COMPRA"){
      tipoTx = "Devolucion en Compra"
    }
    if( descripcion == "INSCRIPCION AFILIADO"){
      tipoTx = "Inscripción"
    }
    if( descripcion == "REFERIDO INSCRIPCION REFERIDO"){
      tipoTx = "Refirio Amigo"
    }

    var thDatos = document.createElement("td");
    // thDatos.setAttribute("class", "datosTx")
    thDatos.appendChild( document.createTextNode( tipoTx ) );
    var thFecha = document.createElement("td");
    // thFecha.setAttribute("class", "fechaTx")
    var fecha = txs[i].fechatransaccion;
    var fechaTemp = moment(fecha, moment.ISO_8601);
    var fechaFinal = moment(fechaTemp).format("DD/MM/YYYY");

    thFecha.appendChild( document.createTextNode( fechaFinal ) );
    var thPuntos = document.createElement("td");
    thPuntos.setAttribute("class", "puntosTx")

    thPuntos.appendChild( document.createTextNode( txs[i].puntostransaccion  ));
    var fila = document.createElement("tr");

    tabla.appendChild(fila);
    fila.appendChild(thDatos);
    fila.appendChild(thFecha);
    fila.appendChild(thPuntos);
  }//fin del for que itera las transaccion
}


/**
 * Cierra sesion y elimina el Json Web Token del
 * Local Storage
 */
function cerrarSesion(){

  //elimina el token
  localStorage.removeItem('token');

  //redireccion al index
  window.location.href = "../index.html";
}




//Funciones de utilidad y formato///
/**
 * Convierte la cadena en formato de nombre propio.
 * la primera letra en mayuscula de cada token
 * @param {String} str 
 */
function onwName(str)
{
  var array1 = str.toLowerCase().split(' ');
  var newarray1 = [];
    
  for(var x = 0; x < array1.length; x++){
      newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));
  }
  return newarray1.join(' ');
}


/**
 * Da formato de miles al parametro amount
 * @param {int} amount 
 * @param {int} decimals 
 */
function number_format(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split(','),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');
    return amount_parts.join('.');
}





//registro de manejo de eventos para la carga de la pagina
window.addEventListener("load", iniciar, false);
console.log("%cMade for %cDromedicas del Oriente  %c(specially this project)",       
        "background-color: #FFFFFF; color: #00612E",
        "background-color: #FFFFFF; color: #000a7b",
        "background-color: #FFFFFF; color: #AE000C");

    console.log("%cVisit us! %chttp:www.dromedicas.com.co",
        "background-color: #FFFFFF; color: #000",
        "background-color: #FFFFFF; color: #008ce2");


var currentElement = null;

//activa menu
 $('.menu li a').click(function(){
    $('li').removeClass("activa");
    // $(this).addClass("activation");
    currentElement = $(this);
    currentElement.parent().addClass("activa");
});


//close off-canvas
$('.off-canvas a').on('click', function() {
  $('.off-canvas').foundation('close');
});

 //activa menu
 $('#menuoffcanvas li a').click(function(){
    $('li').removeClass("activaOffCanvas");
    // $(this).addClass("activation");
    currentElement = $(this);
    currentElement.parent().addClass("activaOffCanvas");
});


//activa menu off-canvas
 $('.vertical .menu li a').click(function(){
    $('li a').removeClass("activa");
    $(this).addClass("activa");                                            
});   



//valida que la pagina actual sea el index para activar opciones de menu
if (location.pathname.substring(1) === "index.html") {
    //Activa opcion del menu cuando la navegacion es por scroll
    var lastId,
        topMenu = $("#menppal"),

        topMenuHeight = topMenu.outerHeight() + 30;
    // All list items
    menuItems = topMenu.find("a");

    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });
    // Bind click handler to menu items
    // so we can get a fancy scroll animation
    menuItems.click(function(e) {
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);
        e.preventDefault();
    });


    // Bind to scroll
    $(window).scroll(function() {
        // Get container scroll position  
        var fromTop = $(this).scrollTop() + topMenuHeight;

        var cur = scrollItems.map(function() {
            if ($(this).offset().top < fromTop)

                return this;
        });
        // Get the id of the current element       
        // Get id of current scroll item
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            if (currentElement != null) {
                if (currentElement.attr("href").replace("#", "") !== id);
                currentElement.removeClass("activa");
            }
            // Set/remove active class
            menuItems.parent().removeClass("activa").end().filter("[href='#" + id + "']").parent().addClass("activa");
        }
    });
}

