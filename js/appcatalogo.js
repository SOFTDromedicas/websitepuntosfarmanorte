//@utor-> @lfernandortiz | @SOFTDromedicas
$(document).foundation()
//registro de manejo de eventos para la carga de la pagina
window.addEventListener("DOMContentLoaded", init, false);

var urlServicioCatalogo = "http://192.168.14.241/dropos/wsjson/catalogopuntos/?opc=catalogo";
var urlServicioDetalle = "http://192.168.14.241/dropos/wsjson/catalogopuntos/?id=";
var urlImgCatalogo = "http://192.168.14.241/dropos/imagenes.php?opcion=getimgcatalogo&productoid=";
var urlImgDetalle = "http://192.168.14.241/dropos/imagenes.php?opcion=getimgdetalle&productoid=";
var catalogoProductos;
var detalleProducto;


function init() {
    //segun la ubicacion
    //llamada al End-Point de Dropos que expone el catalogo de puntos segun la ubicacion   
    console.log(location.pathname.substring(1));
    if (location.pathname.substring(1) == "seccion/catalogopuntos.html") {
        obtenerDatosCatalogo();
    }
    if (location.pathname.substring(1) == "seccion/detalleproducto.html") {
        obtenerDatosProducto();
    }

    //Eventos para cuadro de Login
    rememberMe();
    registerEventLogin(); 
}


function obtenerDatosCatalogo() {
    obtenerCatalogoServicio(function (response) {
        //Parse JSON string into object
        var dataTemp = JSON.parse(response);
        //inicia el los objetos del catalogo
        catalogoProductos = dataTemp.data;
        console.log('Total Productos Catalogo: ' + catalogoProductos.length );
        if (dataTemp.code == 200) {
            //llena el DOM con el catalogo
            cargarDatosCatalogo();
        } else {
            //aca manejo el error si no hay funciona el servicio
        }
    });
}

function obtenerCatalogoServicio(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', urlServicioCatalogo, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function cargarDatosCatalogo() {
    //elemento del DOM que alberga el catalogo de prodcutos
    var contenedorCatalogo = document.querySelector('#contenedor-catalogo');

    var lengthC = Math.ceil(catalogoProductos.length / 4);    
    //conjunto de contenedore o div con clase row
    var multiArray = [];
    for (var i = 0; i < lengthC; i++) {
        var rowContenedor = document.createElement("div");
        rowContenedor.setAttribute("class", "row small-up-2 large-up-4 row-productos")
        multiArray.push(rowContenedor);
    }
    //variable de control para iterar los contenedores
    var flag = 0;
    //se llenan  los contenedores con los articulos del catalogo
    for (var i = 0; i <= catalogoProductos.length + 1; i++) {
        if (flag < multiArray.length) {
            if (catalogoProductos[i] != null) {
                //crea el elemento del DOM del producto
                var prod = crearProductoCatalogo(catalogoProductos[i]);
                //lo añade al div row
                multiArray[flag].appendChild(prod);
            }
            if (multiArray[flag].length == 4) {
                flag++;
            }
        }
    }//fin del for

   //despues de creados los elemento se insertan en el contenedor
   for (let index = 0; index < multiArray.length; index++) {
        contenedorCatalogo.appendChild(multiArray[index]);
   }

   //oculta el spinner load
   $('#spinner-container').fadeOut();

}


function crearProductoCatalogo( item ){
    //crea el div column
    var columnItem = document.createElement("div");
    columnItem.setAttribute("class", "column item-activo")

    //crea el elemento imagen  
    var imgProd = document.createElement("img");
    imgProd.setAttribute("class", "thumbnail")
    imgProd.setAttribute("src", urlImgCatalogo + item.idproducto );

    //crea el titulo del producto 
    var tituloProd = document.createElement("h5");
    tituloProd.setAttribute("class", "tituloProducto");
    var tituloTemp = document.createTextNode( onwName(item.nomproducto) );
    tituloProd.appendChild(tituloTemp);
   
    //crea el parrafo 
    var infoParrafo = document.createElement("p");
    infoParrafo.setAttribute("class", "descripcion-prod");
    infoParrafo.innerHTML  = '<i class="fa fa-circle point" aria-hidden="true"></i> '+ item.puntos + ' + $' + item.puntos + 'c/u';
   
    //crea el boton de detalle 
    var botonD = document.createElement("a");
    botonD.setAttribute("class", "button expanded");
    botonD.setAttribute("href", "/seccion/detalleproducto.html?id=" + item.idproducto );
    botonD.innerHTML = "Ver m&aacute;s";

    //se hace la composicion de los elementos del DOM para el elemento 
    columnItem.appendChild(imgProd);
    columnItem.appendChild(tituloProd);
    columnItem.appendChild(infoParrafo);
    columnItem.appendChild(botonD);

    return columnItem;
}


function obtenerDatosProducto() {
    obtenerProductoServicio(function (response) {
        //Parse JSON string into object
        var dataTemp = JSON.parse(response);
        //obtiene los valores del producto desde el JSON
        detalleProducto = dataTemp.data;
        console.log(detalleProducto);
        if (dataTemp.code == 200) {
            //inserta los valores del producto en la pagina detalle
            crearProductoCatalogoDetalle(detalleProducto[0]);
        } else {
            //aca manejo el error si no hay funciona el servicio
        }
    });
}

function obtenerProductoServicio(callback) {
    var urlEnd = urlServicioDetalle + getParameterURLByName('id');
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', urlEnd, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


//Coloca los valores recibidos del servicio para el detalle de los productos
function crearProductoCatalogoDetalle(pdto){
    //inserta los valores para el nombre del producto
    $('#nombre-pro').text(onwName(pdto.nomproducto));
    
    //descripcion-pro
    $('#descripcion-pro').text(onwName(pdto.detalleprod));
    
    //cantidad-pro
    $('#cantidad-pro').val(pdto.exis);

    //puntos-pro
    $('#puntos-pro').text(number_format(pdto.puntos,0));
    
    //efectivo-pro
    $('#efectivo-pro').text(number_format(pdto.efectivo,0));
    
    //img-pro
    $('#img-pro').attr("src", urlImgDetalle + getParameterURLByName('id'));

    //oculta el spinner load
   $('#spinner-container').fadeOut();
} 



//** Funciones Cuadro Login **//
//Registro de eventos para los controles del cuadro de login
function registerEventLogin() {
    var login = document.getElementById('loginperfil');
    login.addEventListener('click', showLogin, false);
    
    var login = document.getElementById('login-offcanvas');
    login.addEventListener('click', showLogin, false);

    var loginout = document.getElementById('login-container-main');
    loginout.addEventListener('click', exitLogin, false);

    var iconocerrar = document.getElementById('iconocerrar');
    iconocerrar.addEventListener('click', exitLogin, false);

    var olividoDedeLogin = document.getElementById('olvidocontrasenia');
    olividoDedeLogin.addEventListener('click', irARecuperarClave, false);

    //Eventos para cuadro de dialogo Reestablecer contrasenia       
    var recuperarContainer = document.getElementById('olvido-container-main');
    recuperarContainer.addEventListener('click', exitLoginOlvido, false);

    var iconocerrarRegistrar = document.getElementById('iconocerrarlogin-olvido');
    iconocerrarRegistrar.addEventListener('click', exitLoginOlvido, false);

    var volverS = document.getElementById('volver-sesion');
    volverS.addEventListener('click', volverSesion, false);

    var recuperarClaveBtn = document.getElementById('recuperarClave');
    recuperarClaveBtn.addEventListener('click', enviarCorreoRecuperaClave, false);

    //inicio de sesion 
    document.getElementById('iniciar-sesion').addEventListener('click', 
    iniciarSesion, false);

    //registro de evento techa de escape para el formulario de login
    document.addEventListener('keyup', exitLogin, false);
}


//si en previo login se marco rememberme se cargan los 
//datos en el formulario de login
function rememberMe() {
    if (localStorage.chkbx && localStorage.chkbx != '') {
        $('#recordarme').attr('checked', 'checked');
        $('#documentologin').val(localStorage.usrname);
        $('#password').val(localStorage.pass);
    } else {
        $('#recordarme').removeAttr('checked');
        $('#documentologin').val('');
        $('#password').val('');
    }
}

//iniciar session del perfil de puntos farmanorte
function iniciarSesion(){
    //lamada al servicio de puntos farmanorte para la autenticacion
    removeWrongLoging();
    getToken();
  
}

//Obtien el JWT para el login 
function getToken(){  
    var xhr = new XMLHttpRequest();
    var userElement = document.getElementById('documentologin'); 
    var passwordElement = document.getElementById('password');  
    var tokenElement = document.getElementById('token');
    var user = userElement.value;  
    var password = passwordElement.value;
    servicioLogin = "http://dromedicas.sytes.net:8080/puntosfarmanorte/webservice/apiwebafiliado/login";
    servicioLogin += "?user=" + user + "&password=" + password;
  
    console.log("URL: " + servicioLogin);
    
    try{
      //callback
      xhr.addEventListener("readystatechange", function(){
        //muestra el loader de linea mientras procesa la solicitud
        if(this.readyState >= 1 && this.readyState <= 3 ){
          document.getElementById("loadinglogin").classList.add("loaderlogin");
        } 
  
        //al recibir la respuesta del servicio oculta el loader y procesa la respuesta
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("loadinglogin").classList.remove("loaderlogin");
  
          //obtiene el JWT del cabecero  de la respuesta
          var token = this.getResponseHeader('AUTHORIZATION');
          
          //si hay token se registra
          if (token) {
            // Almacena el token en localStorage
            localStorage.setItem('token', token);
            //si el checkbox de recordar usuario esta marcado 
            //los valores son guardados en el localstorage (no por cookies)
            if ($('#recordarme').is(':checked')) {
                // guarda usuario y contrasenia
                localStorage.usrname = $('#documentologin').val();
                localStorage.pass = $('#password').val();
                localStorage.chkbx = $('#recordarme').val();
            } else {
                localStorage.usrname = '';
                localStorage.pass = '';
                localStorage.chkbx = '';
            }
  
            //se redirecciona a la pagina de perfil
            window.location.href = "/seccion/perfilafiliado.html";
  
            //se limpia los campos del formulario
            $('#documentologin').val('');
            $('#password').val('');
  
          } else {
            //si hay error en el login se obtiene el mensaje para 
            //desplegarce en el callout
            var resp = JSON.parse(this.responseText);
            var mes = resp.message;
            //muestra los mensajes de error
            $('#documentologin').addClass('is-invalid-input');
            $('#documentologin').parent().addClass('is-invalid-label');
            $('#password').addClass('is-invalid-input');
            $('#password').parent().addClass('is-invalid-label');
            $('#calloutLoginAlert').css("display", "block");
          } //end else token 
        }//end validacion estado de la peticion 
       }, false);
      xhr.open( "POST", servicioLogin, true );
      xhr.setRequestHeader("Accept",
            "application/json; charset=utf-8" );
      xhr.send();     
  
    }catch(ex){
     console.log(ex)    
    }
  }
  
  
  //deshabilita el scroll cuando se muestra el login
  function disableScroll() {
    if (window.addEventListener) 
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; 
    window.onmousewheel = document.onmousewheel = preventDefault; 
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
  }
  
  function enableScroll() {
      if (window.removeEventListener)
          window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null; 
      window.onwheel = null; 
      window.ontouchmove = null;  
      document.onkeydown = null;  
  }
  // end funciones para el bloqueo del scroll
  
  //muestra el cuadro de login
  function showLogin(event){
  
      rememberMe(); 
      var bodylogin = document.getElementById('blurme-container');
      bodylogin.classList.remove('ocultarLogin');
      bodylogin.classList.add('blur-me2');
      document.getElementById('login-container-main').style.display = 'block';
      disableScroll();
  }
  
  //cierra el cuadro de login
  function exitLogin(event){   
    
    if( event.target.getAttribute('id') == 'password' && event.keyCode == 13){
       iniciarSesion();
    }
  
    if( event.target.getAttribute('id') == 'innerContainer' ||
        event.target.getAttribute('id') == 'paddingcontainer' ||
        event.target.getAttribute('id') == 'row-login' ||
        event.target.getAttribute('id') == 'row-iconocerrar' ||
        event.target.getAttribute('id') == 'iconocerrar' ||
        event.target.getAttribute('id') == 'olvidocontrasenia' ||
        event.key == 'Escape'){
      //cancelo el burbujeo de eventos
      event.cancelBubble = true;   
      document.getElementById('blurme-container').classList.remove('blur-me2');    
      document.getElementById('blurme-container').classList.add('ocultarLogin');    
      document.getElementById('login-container-main').style.display='none';  
      document.getElementById('documentologin').value="";
      document.getElementById('password').value="";
      document.getElementById('recordarme').checked = false;
      document.getElementById('loadinglogin').classList.remove('loaderlogin');    
      
      
      //si hay mensajes de error los elimina 
      removeWrongLoging();
      enableScroll();
      exitLoginOlvido(event);    
    } 
  }
  
  function removeWrongLoging(){
      $('#documentologin').removeClass('is-invalid-input');
      $('#documentologin').parent().removeClass('is-invalid-label');
      $('#password').removeClass('is-invalid-input');
      $('#password').parent().removeClass('is-invalid-label');
      $('#calloutLoginAlert').css("display", "none");
  }
  
  //ir a cuadro recuperacion de clave
  function irARecuperarClave(event){
    exitLogin(event); 
    document.getElementById('blurme-container').classList.remove('ocultarLogin');    
    showRestablecerContrasena();
  }
  
  //muestra el cuadro de reestablecer clave
  function showRestablecerContrasena() {
      document.getElementById('olvido-container-main').style.display = 'block';
      disableScroll();
      var content_main = document.getElementById('blurme-container');
      content_main.classList.add('blur-me2');    
  }
  
  //cierra el cuadro de reestablecer clave
  function exitLoginOlvido(event){      
    if( event.target.getAttribute('id') == 'innerContainer-olvido' ||
        event.target.getAttribute('id') == 'paddingcontainer-olvido' ||
        event.target.getAttribute('id') == 'row-olvido' ||
        event.target.getAttribute('id') == 'row-iconocerrar-olvido' ||
        event.target.getAttribute('id') == 'iconocerrarlogin-olvido' ||
        event.target.getAttribute('id') == 'volver-sesion' ||
        event.key == 'Escape'){
      //cancelo el burbujeo de eventos
      event.cancelBubble = true;
      document.getElementById('blurme-container').classList.remove('blur-me2');
      document.getElementById('blurme-container').classList.add('ocultarLogin');    
      document.getElementById('olvido-container-main').style.display='none';   
      document.getElementById('emialRecuperar').value='';       
      $('#calloutRecupera').css("display", "none");
  
      enableScroll();
    } 
  }
  
  //usada solamente por el evento de recuperacion de clave
  function exitOlvido(){
    event.cancelBubble = true;
      document.getElementById('blurme-container').classList.remove('blur-me2');
      document.getElementById('blurme-container').classList.add('ocultarLogin');    
      document.getElementById('olvido-container-main').style.display='none';   
      document.getElementById('emialRecuperar').value='';       
      $('#calloutRecupera').css("display", "none");
      document.getElementById("loadclave").classList.remove("loaderlogin");
  
      enableScroll();
  }
  
  //ir a login afiliado
  function volverSesion(event){
    exitLoginOlvido(event);
    showLogin(event);
  }


  //Procesa la solicitud de recuparacion de clave 
function enviarCorreoRecuperaClave() {
  
    var servicioRecuperaClave = "http://dromedicas.sytes.net:8080/puntosfarmanorte/webservice/afiliado/recuperaclave";
    var email = $('#emialRecuperar').val(); //email afiliado
    var xhr = new XMLHttpRequest();

    if (email != ''&& validateEmail(email)) {
        try {
            servicioRecuperaClave += "/" + email;
            
            //callback
            xhr.addEventListener("readystatechange", function(){stateChangeRec(xhr)}, false);
            xhr.open("GET", servicioRecuperaClave, true);
            xhr.setRequestHeader("Accept",
                "application/json; charset=utf-8");
            xhr.send();
        } catch (ex) {
            document.getElementById("loadclave").classList.remove("loaderlogin");
            console.log(ex)
        }

    } else { //el email dado no es valido (Evaluado por Regex)
      document.getElementById("loadclave").classList.remove("loaderlogin");
       $('#calloutRecupera').css("display", "block");
       $('#inforecupera').text("Cuenta de email no valida");
    }
}

function stateChangeRec(xhr) {
  
    if (xhr.readyState >= 1 && xhr.readyState <= 3) {
        $('#calloutRecupera').css("display", "none");
        document.getElementById("loadclave").classList.add("loaderlogin");
    }
    //al recibir la respuesta del servicio oculta el loader y procesa la respuesta
    if (xhr.readyState == 4 && xhr.status == 200) {
        var res =  JSON.parse(xhr.responseText);
        
        if(res.code == 200){
          document.getElementById("loadclave").classList.remove("loaderlogin");
          window.scrollTo(0, 0);
          exitOlvido();
          $('#calloutrecuparacionclave').css("display", "block");

        }else{
          document.getElementById("loadclave").classList.remove("loaderlogin");
          $('#calloutRecupera').css("display", "block");
          $('#inforecupera').text(res.message);        
        }
    } /*end if 200*/
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


function getParameterURLByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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


var currentElement = null;
//activa menu
$('.menu li a').click(function () {
    $('li').removeClass("activa");
    // $(this).addClass("activation");
    currentElement = $(this);
    currentElement.parent().addClass("activa");
});


//close off-canvas
$('.off-canvas a').on('click', function () {
    $('.off-canvas').foundation('close');
});

//activa menu
$('#menuoffcanvas li a').click(function () {
    $('li').removeClass("activaOffCanvas");
    // $(this).addClass("activation");
    currentElement = $(this);
    currentElement.parent().addClass("activaOffCanvas");
});

//activa menu off-canvas
$('.vertical .menu li a').click(function () {
    $('li a').removeClass("activa");
    $(this).addClass("activa");
});


//prototipo para generar la grilla DOM  del catalogO
function testCatalogo() {
    var catalogo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    var lengthC = Math.ceil(catalogo.length / 4);

    console.log(lengthC);
    var multiArray = [];
    for (var i = 0; i < lengthC; i++) {
        var x = [];
        multiArray.push(x);
    }
    var flag = 0;
    for (var i = 0; i <= catalogo.length + 1; i++) {
        if (flag < multiArray.length) {
            if (catalogo[i] != null) {
                multiArray[flag].push(catalogo[i]);
            }
            if (multiArray[flag].length == 4) {
                flag++;
            }
        }
    }
    console.log(multiArray);
}


