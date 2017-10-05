$(document).foundation()
//Procesamiento del formulario de inscripcion basico

//Campos del formulario
var ciudad, documento, nombres, apellidos, tipodocumento, sexo, direccion,
            barrio, fechanacimiento, telefonofijo, celular, email, terminos;
var btnGuardar;
var urlWs = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpafiliacion/index.php?";
var ciudadesService = "http://dromedicas.sytes.net:9999/dropos/wsjson/ciudades/";
var asyncRequest;
//teclas eventos para scroll
var keys = {37: 1, 38: 1, 39: 1, 40: 1};


function iniciar() {

  // Almacena la información en sessionStorage
// sessionStorage.setItem('paco', 'lk');

// Obtiene la información almacenada desde sessionStorage
// var data = sessionStorage.getItem('paco');


// console.log("Session--> " + data);
// console.log("this--> " + this.sessionStorage.getItem('paco'));
    
    //Registro de eventos y componente para la interfaz de afiliacion
    if (location.pathname.substring(1) === "seccion/inscripcion.html") {
        btnGuardar = document.getElementById('guardar-button');
        btnGuardar.addEventListener('click', registrar, false);
        //verifica el dispositivo para el componente date
        if (mobilecheck() && mobileAndTabletcheck()) {
            document.getElementById('fechanacimiento').setAttribute('type', 'date');
        } else {
            $('#fechanacimiento').fdatepicker({
                closeButton: true,
                language: 'es',
                yearRange: "-100:+0",
                constrainInput: true,
                format: 'dd/mm/yyyy',
            });

            $('#fechanacimiento').fdatepicker().on('changeDate', function(ev) {
                if (ev.date.valueOf()) {
                    var newDate = new Date(ev.date)
                    newDate.setDate(newDate.getDate() + 1);
                    fechanacimiento = formatDateAnioMesDia(newDate);
                }
            });
        }

        //prepara combo de ciudades
        establecerCiudades();

        var street1 = document.getElementById('street1');
        street1.addEventListener('change', concatenardireccion, false);
        
        var street1valor = document.getElementById('street1-valor');
        street1valor.addEventListener('keyup', concatenardireccion, false);
        
        var street1 = document.getElementById('street2');
        street1.addEventListener('change', concatenardireccion, false);

        var street1valor = document.getElementById('street2-valor');
        street1valor.addEventListener('keyup', concatenardireccion, false);
        
        document.getElementById('cancelar-button').addEventListener('click',
          limpiarFormulario, false);

    }



    if (location.pathname.substring(1) == "index.html"){
    // if (location.pathname.substring(1) == "xxxx.html"){
        //Eventos formulario login
        var mostrarClave = document.getElementById("p-mostrarclave");
        mostrarClave.addEventListener('click', function() {
            var password = document.getElementById('password');
            if (password.getAttribute('type') === 'password') {
                password.setAttribute('type', 'text');
                mostrarClave.innerHTML = "Ocultar Contrase&ntilde;a"
            } else {
                password.setAttribute('type', 'password');
                mostrarClave.innerHTML = "Mostrar Contrase&ntilde;a"
            }
        }, false);

        //Eventos para cuadro de Login
        var login = document.getElementById('loginperfil');
        login.addEventListener('click', showLogin, false);       

        var loginout = document.getElementById('login-container-main');
        loginout.addEventListener('click', exitLogin, false);       

        var iconocerrar = document.getElementById('iconocerrar');
        iconocerrar.addEventListener('click', exitLogin, false);

        var olividoDedeLogin = document.getElementById('olvidocontrasenia');
        olividoDedeLogin.addEventListener('click', irARecuperarClave, false);

        //Eventos para cuadro de dialogo Reestablecer contrasenia
       

        //registro de evento techa de escape para el formulario de login
        document.addEventListener('keyup', exitLogin, false);
        
    }

    
    //si estoy en index valida que no se cargue a partir de la redireccion del formulario 2
    if(getParameterURLByName('confirmado') == "true"){
        document.getElementById("calloutafiliacion").style.display = 'block';      
     }


}//end function iniciar


function establecerCiudades(){
  try{
    var xhrCiudad = new XMLHttpRequest()
    xhrCiudad.addEventListener("readystatechange", function(){creandoComboCiudad(xhrCiudad);}, false);
    xhrCiudad.open( "GET", ciudadesService, true );
    xhrCiudad.setRequestHeader("Accept",
          "application/json; charset=utf-8" );
    xhrCiudad.send();     
  }catch(ex){
    mostrarFallaDelSistema(ex.message);
  }
}


function concatenardireccion(){
  var dirTemp = new Array();

  var street1 = document.getElementById('street1');    
  dirTemp.push( document.getElementById('street1').value );     
  dirTemp.push( document.getElementById('street1-valor').value.toUpperCase().trim() );     
  dirTemp.push( document.getElementById('street2').value );     
  dirTemp.push( document.getElementById('street2-valor').value.toUpperCase().trim() );     
   
  document.getElementById('direccion').innerHTML = dirTemp.join(" ") ;  
}

function limpiarFormulario(){
  document.getElementById('direccion').innerHTML ="";
}


//funciones para el bloqueo del scroll
function preventDefault(e) { 
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
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
function showLogin(event) {
    var bodylogin = document.getElementById('blurme-container');
    bodylogin.classList.add('blur-me2');
    document.getElementById('login-container-main').style.display = 'block';
    disableScroll();
}

//cierra el cuadro de login
function exitLogin(event){   
console.log(event.type) 
  if( event.target.getAttribute('id') == 'innerContainer' ||
      event.target.getAttribute('id') == 'paddingcontainer' ||
      event.target.getAttribute('id') == 'row-login' ||
      event.target.getAttribute('id') == 'row-iconocerrar' ||
      event.target.getAttribute('id') == 'iconocerrar' ||
      event.target.getAttribute('id') == 'olvidocontrasenia' ||
      event.key == 'Escape'){

    console.log("cerrando login")
    document.getElementById('blurme-container').classList.remove('blur-me2');    
    document.getElementById('login-container-main').style.display='none';  
    document.getElementById('documentologin').value="";
    document.getElementById('password').value="";
    document.getElementById('recordarme').checked = false;
    enableScroll();
  } 
}


function irARecuperarClave(event){
  exitLogin(event); 

  showRestablecerContrasena();
}


//muestra el cuadro de reestablecer clave
function showRestablecerContrasena() {
    document.getElementById('olvido-container-main').style.display = 'block';
    disableScroll();
    var content_main = document.getElementById('blurme-container');
    content_main.classList.add('blur-me2');
    console.log("end mostrar reestablecer")
}

//cierra el cuadro de reestablecer clave
function exitLoginOlvido(event){    

  console.log("olvido")
  console.log(event.target.getAttribute('id'))
  console.log(event.key)
  if( event.target.getAttribute('id') == 'innerContainer-olvido' ||
      event.target.getAttribute('id') == 'paddingcontainerrecuperar-olvido' ||
      event.target.getAttribute('id') == 'row-olvido' ||
      event.target.getAttribute('id') == 'row-iconocerrar-olvido' ||
      event.target.getAttribute('id') == 'iconocerrar-olvido' ||
      event.key == 'Escape'){
    document.getElementById('blurme-container').classList.remove('blur-me2');
    document.getElementById('login-container-main-olvido').style.display='none';     
    enableScroll();

  } 
}



//Crea el combobox de operadores, metodo auxiliar del metodo getOperadores
function creandoComboCiudad(xhr) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        var ciudadSelect = document.getElementById("ciudad");
        var ciudadList = data.data;
        for (var i = 0; i < ciudadList.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", ciudadList[i].nombre);
            option.appendChild(document.createTextNode(
                capitalize(ciudadList[i].nombre) +" ("+ capitalize(ciudadList[i].departamento)+")" ));
            if( ciudadList[i].nombre == 'CUCUTA'){
              option.setAttribute("selected", 'true');
            }
            ciudadSelect.appendChild(option);
        }
        //oculta el mensaje de inicio de la carga
        $("#mensaje-inicio").fadeOut(4000);
    } else {
        if (xhr.status == 404) {
      mostrarFallaDelSistema("Error 404 para Operador");            
        } 
    }
}


function capitalize(s){
    return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
}

function registrar() {

    console.log("Procesando formulario.... ");
    
    establecerValores();

    urlWs = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpafiliacion/index.php?";

    if(validarFormulario()){
      urlWs += "documento=" + documento + "&nombres=" + nombres  + "&apellidos=" + apellidos  +
             "&tipodocumento=" + tipodocumento  + "&sexo=" + sexo  + "&direccion=" + direccion  + 
             "&fechanacimiento=" + fechanacimiento  + "&telefonofijo=" + telefonofijo  + 
             "&celular=" + celular  + "&ciudad=" + ciudad  + "&email=" + email + "&barrio=" + barrio;

      console.log( "URL Servicio: " + urlWs);

      try {
        asyncRequest = new XMLHttpRequest();
        asyncRequest.addEventListener("readystatechange", stateChange, false);
        asyncRequest.open("GET", urlWs, true);
        asyncRequest.send(null);
      } catch (excepcion) {}
    }else{
        document.getElementById("calloutFormAlert").style.display = 'block';
    }
       
}


function stateChange() {
  if(asyncRequest.readyState == 1 || asyncRequest.readyState == 2 ||
      asyncRequest.readyState == 3 ){
    document.getElementById("spinner").style.display = 'block';
    document.getElementById("blur").classList.add("blur-me");
    document.getElementById("calloutFormAlert").style.display = 'none';
    document.getElementById("calloutFormWarning").style.display = 'none';
  }
  //console.log( asyncRequest.readyState + " - " + asyncRequest.status);

  if (asyncRequest.readyState == 4 && asyncRequest.status == 200) {   
    
    //`console.log("Respuesta antes json: " + asyncRequest.responseText);
    
    var response = JSON.parse(asyncRequest.responseText);

    console.log("Respuesta: " + asyncRequest.responseText);
    if(response.status === "sucess"){  
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("calloutFormWarning").style.display = 'none';
      document.getElementById("blur").classList.remove("blur-me");
      // reestablece el formulario    
      reestrablecerFormulario();
      document.getElementById("calloutForm").style.display = 'block';
      document.getElementById("calloutFormAlert").style.display = 'none';
      fechanacimiento = "";
    }else{
      if(response.data == '99'){
        document.getElementById("spinner").style.display = 'none';
        document.getElementById("mensaje").innerHTML ="";
        document.getElementById("mensaje").appendChild(document.createTextNode(response.message));
        document.getElementById("calloutFormWarning").style.display = 'block';
        document.getElementById("blur").classList.remove("blur-me");  
      }else{
        document.getElementById("spinner").style.display = 'none';
        document.getElementById("mensaje").innerHTML ="";
        document.getElementById("mensaje").appendChild(document.createTextNode(response.message));
        document.getElementById("calloutFormWarning").style.display = 'block';
        document.getElementById("blur").classList.remove("blur-me");        
      }
    }      
  } 
}

function reestrablecerFormulario(){
  document.getElementById("documento").value =""; 
  document.getElementById("nombres").value =""; 
  document.getElementById("apellidos").value =""; 
  document.getElementById("tipodocumento").value =""; 
  document.getElementById("sexo").value =""; 
  document.getElementById("direccion").innerHTML =""; 
  document.getElementById("street1").selectIndex = 1; 
  document.getElementById("street1-valor").value =""; 
  document.getElementById("street2").selectIndex = 1; 
  document.getElementById("street2-valor").value =""; 

  document.getElementById("barrio").value =""; 
  document.getElementById("fechanacimiento").value =""; 
  document.getElementById("telefonofijo").value =""; 
  document.getElementById("celular").value =""; 
  document.getElementById("ciudad").value =""; 
  document.getElementById("email").value =""; 
  document.getElementById("checkboxterminos").checked = false; 
}

function validarFormulario(){
  var valido = true;
  //validacion de nombres  

  if(nombres == "" || nombres.length < 3 ){
    valido = false;
    document.getElementById("nombres").setAttribute("class","is-invalid-input");
    document.getElementById("nombres").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de apellidos
  document.getElementById("apellidos").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("apellidos").setAttribute("class","is-invalid-input");
    document.getElementById("apellidos").closest("label").setAttribute("class","is-invalid-label");
  });

  if(apellidos == "" || apellidos.length < 3 ){
    valido = false;
    document.getElementById("apellidos").setAttribute("class","is-invalid-input");
    document.getElementById("apellidos").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de documento
  document.getElementById("documento").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("documento").setAttribute("class","is-invalid-input");
    document.getElementById("documento").closest("label").setAttribute("class","is-invalid-label");
  });

  if(documento == "" ){
    valido = false;
    document.getElementById("documento").setAttribute("class","is-invalid-input");
    document.getElementById("documento").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de fecha nacimiento
  
  document.getElementById("fechanacimiento").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("fechanacimiento").setAttribute("class","is-invalid-input");
    document.getElementById("fechanacimiento").closest("label").setAttribute("class","is-invalid-label");
  });

  if(fechanacimiento == "" || fechanacimiento == null){
    valido = false;
    document.getElementById("fechanacimiento").setAttribute("class","is-invalid-input");
    document.getElementById("fechanacimiento").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de barrio
  document.getElementById("street1-valor").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("street1-valor").setAttribute("class","is-invalid-input");
    document.getElementById("street1-valor").closest("label").setAttribute("class","is-invalid-label");
  });

console.log("-------" + (direccion=== ""));

  if(direccion=== "" || direccion=== "AVENIDA" ){
    valido = false;
    document.getElementById("street1-valor").setAttribute("class","is-invalid-input");
    document.getElementById("street1-valor").closest("label").setAttribute("class","is-invalid-label");
    document.getElementById("street2-valor").setAttribute("class","is-invalid-input");
    document.getElementById("street2-valor").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de barrio
  document.getElementById("barrio").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("barrio").setAttribute("class","is-invalid-input");
    document.getElementById("barrio").closest("label").setAttribute("class","is-invalid-label");
  });

  if(barrio == "" ){
    valido = false;
    document.getElementById("barrio").setAttribute("class","is-invalid-input");
    document.getElementById("barrio").closest("label").setAttribute("class","is-invalid-label");
  }  
  //validacion de celular
  document.getElementById("celular").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("celular").setAttribute("class","is-invalid-input");
    document.getElementById("celular").closest("label").setAttribute("class","is-invalid-label");
  });

  if(celular == "" ){
    valido = false;
    document.getElementById("celular").setAttribute("class","is-invalid-input");
    document.getElementById("celular").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de email
  document.getElementById("email").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("email").setAttribute("class","is-invalid-input");
    document.getElementById("email").closest("label").setAttribute("class","is-invalid-label");
  });

  if( !validateEmail(email)){
    valido = false;
    document.getElementById("email").setAttribute("class","is-invalid-input");
    document.getElementById("email").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de email
  document.getElementById("checkboxterminos").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("checkboxterminos").closest("label").setAttribute("class","is-invalid-label");
  });

  if( document.getElementById("checkboxterminos").checked == false){
    valido = false;
    document.getElementById("checkboxterminos").closest("label").setAttribute("class","is-invalid-label");
  }

  return valido
}


function establecerValores() {

    if( mobilecheck() && mobileAndTabletcheck()){
      fechanacimiento = document.getElementById('fechanacimiento').value;
    }
    

    documento = document.getElementById("documento").value.trim();
    var nombresTemp = document.getElementById("nombres").value.toUpperCase().trim();
    nombres = nombresTemp.replace('Ñ', 'N');
    nombres = removeDiacritics(nombres);
    var apellidosTemp = document.getElementById("apellidos").value.toUpperCase().trim();
    apellidos = apellidosTemp.replace('Ñ', 'N');
    apellidos = removeDiacritics(apellidos);
    tipodocumento = document.getElementById("tipodocumento").value;
    sexo = document.getElementById("sexo").value;
    
    var direcciontemp = document.getElementById("direccion").innerHTML.toUpperCase().trim();
    direcciontemp = direcciontemp.replace('#', '%23');
    direcciontemp = direcciontemp.replace('Ñ', 'N');
    direccion = removeDiacritics(direcciontemp);


   
    var barriotemp = document.getElementById("barrio").value.toUpperCase().trim();
    barriotemp = barriotemp.replace('#', '%23');
    barriotemp = barriotemp.replace('Ñ', 'N');
    barrio = removeDiacritics(barriotemp);

    telefonofijo = document.getElementById("telefonofijo").value.trim();
    celular = document.getElementById("celular").value.trim();
    ciudad = document.getElementById("ciudad").value.toUpperCase().trim();
    email = document.getElementById("email").value.trim();
    terminos = document.getElementById("checkboxterminos").value;    

   //console.log( "fechanacimiento: " + ); throw new Error("Something went badly wrong!");    
}


//metodo predicado para la validacion de correo
function validateEmail(email){        
  if( email == "" ){// permite que el campo sea vacio 
    return true;
  }else{
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(email);  
  }
 } 

//formato para fecha yyyy-mm-dd
 function formatDateAnioMesDia(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
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



function getParameterURLByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


//Validacion dispositivos mobiles
    function mobilecheck() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        // document.querySelector('.spaceblue').appendChild(document.createTextNode("xx"+navigator.userAgent));
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    function mobileAndTabletcheck() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        // document.querySelector('.spaceblue').appendChild(document.createTextNode("xx"+navigator.userAgent));
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };


function removeDiacritics (str) {

  var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
  ];

  for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
    str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
  }

  return str;

}