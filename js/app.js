
//Procesamiento del formulario de inscripcion basico

//Campos del formulario
var ciudad, documento, nombres, apellidos, tipodocumento, sexo, direccion,
                  fechanacimiento, telefonofijo, celular, email, terminos, btnGuardar;
var urlWs = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpafiliacion/";

function iniciar(){
  console.log("funcion iniciar->");
  btnGuardar = document.getElementById("guardar-button");
  btnGuardar.addEventListener('click', registrar, false);  
}

function registrar(){
  console.log("Procesando formulario.... ");
  establecerValores();
  if( validarFormulario()){
    //aca procesamiento Ajax
  }
}

function validarFormulario(){

  //Valida nombres y apellidos
  
  
  //Valida documento
  
  
  //Valida nro de Documento
  

  //Valida Direccion Barrio y ciudad
  
  
  //Valida Telefo celular & email
  

  //Valido terminos y condiciones
}


function establecerValores(){
  documento = document.getElementById("documento").value.trim() ;
  nombres = document.getElementById("nombres").value.toUpperCase().trim();
  apellidos = document.getElementById("apellidos").value.toUpperCase().trim();
  tipodocumento = document.getElementById("tipodocumento").value;
  sexo = document.getElementById("sexo").value;
  direccion = document.getElementById("direccion").value.toUpperCase().trim();
  fechanacimiento = document.getElementById("fechanacimiento").value;
  telefonofijo = document.getElementById("telefonofijo").value.trim();
  celular = document.getElementById("celular").value.trim();
  ciudad = document.getElementById("ciudad").value.toUpperCase().trim();
  email = document.getElementById("email").value.trim();
  terminos = document.getElementById("terminos").value;
  btnGuardar = document.getElementById("guardar-button");
}

//registro de manejo de eventos para la carga de la pagina
window.addEventListener("load", iniciar, false);






$(document).foundation()
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



