$(document).foundation()
//Procesamiento del formulario de inscripcion basico

//Campos del formulario
var ciudad, documento, nombres, apellidos, tipodocumento, sexo, direccion,
            barrio, fechanacimiento, telefonofijo, celular, email, terminos;
var btnGuardar;
var urlWs = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpafiliacion/index.php?";
var asyncRequest;


function iniciar(){
  console.log("funcion iniciar->");
  btnGuardar = document.getElementById('guardar-button'); 
  btnGuardar.addEventListener('click', registrar, false);  
}

function registrar() {
    console.log("Procesando formulario.... ");
    
    establecerValores();

    if(validarFormulario()){
      urlWs += "documento=" + documento + "&nombres=" + nombres  + "&apellidos=" + apellidos  +
             "&tipodocumento=" + tipodocumento  + "&sexo=" + sexo  + "&direccion=" + direccion  + 
             "&fechanacimiento=" + fechanacimiento  + "&telefonofijo=" + telefonofijo  + 
             "&celular=" + celular  , "&ciudad=" + ciudad  + "&email=" + email;

      console.log( "URL Servicio: " + urlWs);

      try {
        asyncRequest = new XMLHttpRequest();
        asyncRequest.addEventListener("readystatechange", stateChange, false);
        asyncRequest.open("GET", urlWs, true);
        asyncRequest.send(null);
      } catch (excepcion) {}
    }else{

    }

       
}


function stateChange() {
  if(asyncRequest.readyState == 1 || asyncRequest.readyState == 2 ||
      asyncRequest.readyState == 3 ){
    document.getElementById("spinner").style.display = 'block';
    document.getElementById("blur").classList.add("blur-me");
  }
  if (asyncRequest.readyState == 4 && asyncRequest.status == 200) {   
    var response = asyncRequest.responseText;
    console.log(response);
    if(response === "true"){  
      document.getElementById("spinner").style.display = 'none';
      // reestablece el formulario    
      reestrablecerFormulario();
      document.getElementById("calloutForm").style.display = 'block';
      document.getElementById("calloutFormAlert").style.display = 'none';
    }else{
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("calloutFormWarning").style.display = 'block';
    }      
  } 
}

function validarFormulario(){
  var valido = true;
  //validacion de nombres
  document.getElementById("nombres").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("nombres").setAttribute("class","is-invalid-input");
    document.getElementById("nombres").closest("label").setAttribute("class","is-invalid-label");
  });

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

  if(fechanacimiento == "" ){
    valido = false;
    document.getElementById("fechanacimiento").setAttribute("class","is-invalid-input");
    document.getElementById("fechanacimiento").closest("label").setAttribute("class","is-invalid-label");
  }
  //validacion de barrio
  document.getElementById("direccion").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("direccion").setAttribute("class","is-invalid-input");
    document.getElementById("direccion").closest("label").setAttribute("class","is-invalid-label");
  });

  if(direccion == "" ){
    valido = false;
    document.getElementById("direccion").setAttribute("class","is-invalid-input");
    document.getElementById("direccion").closest("label").setAttribute("class","is-invalid-label");
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
  //validacion de telefono
  document.getElementById("telefonofijo").addEventListener("invalid.zf.abide",function(ev,el) {
      valido = false;
    document.getElementById("telefonofijo").setAttribute("class","is-invalid-input");
    document.getElementById("telefonofijo").closest("label").setAttribute("class","is-invalid-label");
  });

  if(telefonofijo == "" ){
    valido = false;
    document.getElementById("telefonofijo").setAttribute("class","is-invalid-input");
    document.getElementById("telefonofijo").closest("label").setAttribute("class","is-invalid-label");
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
  return valido
}


function establecerValores() {
    documento = document.getElementById("documento").value.trim();
    nombres = document.getElementById("nombres").value.toUpperCase().trim();
    apellidos = document.getElementById("apellidos").value.toUpperCase().trim();
    tipodocumento = document.getElementById("tipodocumento").value;
    sexo = document.getElementById("sexo").value;
    direccion = document.getElementById("direccion").value.toUpperCase().trim();
    barrio = document.getElementById("barrio").value.toUpperCase().trim();
    fechanacimiento = document.getElementById("fechanacimiento").value;
    telefonofijo = document.getElementById("telefonofijo").value.trim();
    celular = document.getElementById("celular").value.trim();
    ciudad = document.getElementById("ciudad").value.toUpperCase().trim();
    email = document.getElementById("email").value.trim();
    terminos = document.getElementById("checkboxterminos").value;    

    console.log(documento+"-"+nombres+"-"+apellidos+"-"+
      tipodocumento+"-"+sexo+"-"+direccion+"-"+fechanacimiento+"-"+telefonofijo+"-"+
      celular+"-"+ciudad+"-"+email+"-"+terminos)
}

function validateEmail(email){        
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(email);   
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
//Activa opcion del menu cuando la navegacion es por scroll
var lastId,
    topMenu = $("#menppal"),

    topMenuHeight = topMenu.outerHeight()+30;
    // All list items
    menuItems = topMenu.find("a");  

    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });
  // Bind click handler to menu items
  // so we can get a fancy scroll animation
  menuItems.click(function(e){
    var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
    $('html, body').stop().animate({ scrollTop: offsetTop }, 300);
    e.preventDefault();
  });

// Bind to scroll
$(window).scroll(function(){
   // Get container scroll position  
   var fromTop = $(this).scrollTop()+topMenuHeight;
    
   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop)

       return this;
   });
   // Get the id of the current element       
   // Get id of current scroll item
   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;       
       if(currentElement != null){       
         if(currentElement.attr("href").replace("#","") !== id);          
          currentElement.removeClass("activa");
       }
       // Set/remove active class
       menuItems.parent().removeClass("activa").end().filter("[href='#"+id+"']").parent().addClass("activa");
   }                   
});



