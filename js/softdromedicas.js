$(document).foundation()
//Procesamiento del formulario de inscripcion basico

//Campos del formulario
var ciudad, documento, nombres, apellidos, tipodocumento, sexo, direccion,
            barrio, fechanacimiento, telefonofijo, celular, email, terminos;
var btnGuardar;
var urlWs = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpafiliacion/index.php?";
var asyncRequest;
var asyncRequestProcess;
var patologia = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];
var documentoAfiliado;

function iniciar() {
    console.log("funcion iniciar...");
    btnGuardar = document.getElementById('guardar-button');
    btnGuardar.addEventListener('click', registrar, false);

    $('#fechanacimiento').fdatepicker().on('changeDate', function(ev) {
        if (ev.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate() + 1);
            fechanacimiento = formatDateAnioMesDia(newDate);
        }
    });


    //validacion de correo electronico del cliente
    documentoAfiliado = getParameterURLByName('documento'); 

    var updateURL = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpvalidarcuentaemail/?documento=";
    updateURL += documentoAfiliado;
    // updateURL += "88239811";
    
    $.ajax({
            url: updateURL,
        })
        .done(function(res) {
            console.log(res);

        })
        .fail(function(xhr, status, error) {
            console.log(error);
        });

    //obtener todos los datos del cliente
    obtenerDatosAfiliado();

    console.log("device: " + mobilecheck());
    console.log("device: " + mobileAndTabletcheck());

}

function obtenerDatosAfiliado() {
    var datosURL = "http://dromedicas.sytes.net:9999/dropos/wsjson/fpdatosafiliado/?documento=";
    datosURL += documentoAfiliado;
    // datosURL += "88239811";

    try {
        asyncRequest = new XMLHttpRequest();
        asyncRequest.addEventListener("readystatechange", stateChangeDatos, false);
        asyncRequest.open("GET", datosURL, true);
        asyncRequest.send(null);
    } catch (excepcion) {}
}

function stateChangeDatos() {
    if (asyncRequest.readyState == 1 || asyncRequest.readyState == 2 ||
        asyncRequest.readyState == 3) {
    }

    console.log(asyncRequest.readyState + " - " + asyncRequest.status);

    if (asyncRequest.readyState == 4 && asyncRequest.status == 200) {
        var response = JSON.parse(asyncRequest.responseText);
        console.log("Respuesta: " + response.status);
        if (response.status === "sucess") {
            var afiliado = response.data[0];
            
            document.getElementById("nombres").value = afiliado.nombres; 
            document.getElementById("apellidos").value = afiliado.apellidos;
            document.getElementById("tipodocumento").value = afiliado.tipodocumento;
            document.getElementById("documento").value = afiliado.documento;
            document.getElementById("sexo").value = afiliado.sexo;
            $('#fechanacimiento').fdatepicker().val(afiliado.fechanacimiento);

            document.getElementById("direccion").value = afiliado.street;
            document.getElementById("barrio").value = afiliado.barrio;
            document.getElementById("ciudad").value = afiliado.ciudad;
            document.getElementById("telefonofijo").value = afiliado.telefonofijo
            document.getElementById("celular").value = afiliado.celular;
            document.getElementById("email").value = afiliado.email;
            
            

            // terminos = document.getElementById("checkboxterminos").value;


        } else {

        }
    }
}






function registrar() {
    console.log("Procesando formulario.... ");
    
    establecerValores();

    urlWs = "";

    if (validarFormulario()) {
        urlWs += "documento=" + documento + "&nombres=" + nombres + "&apellidos=" + apellidos +
            "&tipodocumento=" + tipodocumento + "&sexo=" + sexo + "&direccion=" + direccion +
            "&fechanacimiento=" + fechanacimiento + "&telefonofijo=" + telefonofijo +
            "&celular=" + celular + "&ciudad=" + ciudad + "&email=" + email;

        //obtengo valores de patologias para  concatenar
        var pato = document.getElementsByName("pat[]");
        for (var i = 0; i < pato.length; i++) {
            if (pato[i].checked) {
                urlWs += ("&" + patologia[i] + "=" + pato[i].value);
                console.log("&" + patologia[i] + "=" + pato[i].value);                
            }

        }

        if( document.getElementById("hijos").checked )
            urlWs += "&hijos=true";

        console.log("URL Servicio: " + urlWs);

        document.location.href = "localhost:8003";

        try {
            asyncRequestProcess = new XMLHttpRequest();
            asyncRequestProcess.addEventListener("readystatechange", stateChange, false);
            asyncRequestProcess.open("GET", urlWs, true);
            asyncRequestProcess.send(null);
        } catch (excepcion) {}
    } else {
        document.getElementById("calloutFormAlert").style.display = 'block';
    }
       
}


function stateChange() {
  if(asyncRequestProcess.readyState == 1 || asyncRequestProcess.readyState == 2 ||
      asyncRequestProcess.readyState == 3 ){
    document.getElementById("spinner").style.display = 'block';
    document.getElementById("blur").classList.add("blur-me");
    document.getElementById("calloutFormAlert").style.display = 'none';
    document.getElementById("calloutFormWarning").style.display = 'none';
  }
  console.log( asyncRequestProcess.readyState + " - " + asyncRequestProcess.status);



  if (asyncRequestProcess.readyState == 4 && asyncRequestProcess.status == 200) {   
    
    //`console.log("Respuesta antes json: " + asyncRequestProcess.responseText);
    
    var response = JSON.parse(asyncRequestProcess.responseText);

    console.log("Respuesta: " + response);
    if(response.status === "sucess"){  
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("calloutFormWarning").style.display = 'none';
      document.getElementById("blur").classList.remove("blur-me");
      // reestablece el formulario    
      reestrablecerFormulario();
      document.getElementById("calloutForm").style.display = 'block';
      document.getElementById("calloutFormAlert").style.display = 'none';
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
  document.getElementById("direccion").value =""; 
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

  
    console.log("x--" + $('#fechanacimiento').fdatepicker().val());
    

    documento = document.getElementById("documento").value.trim();
    nombres = document.getElementById("nombres").value.toUpperCase().trim();
    apellidos = document.getElementById("apellidos").value.toUpperCase().trim();
    tipodocumento = document.getElementById("tipodocumento").value;
    sexo = document.getElementById("sexo").value;
    var direcciontemp = document.getElementById("direccion").value.toUpperCase().trim();
    direccion = direcciontemp.replace('#', '%23');
    barrio = document.getElementById("barrio").value.toUpperCase().trim();
    telefonofijo = document.getElementById("telefonofijo").value.trim();
    celular = document.getElementById("celular").value.trim();
    ciudad = document.getElementById("ciudad").value.toUpperCase().trim();
    email = document.getElementById("email").value.trim();
    terminos = document.getElementById("checkboxterminos").value;   
    fechanacimiento = $('#fechanacimiento').fdatepicker().val(); 
    
}

function validateEmail(email){        
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(email);   
 } 

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