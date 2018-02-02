$(document).foundation()


var urlServicio = "http://dromedicas.sytes.net:8080/puntosfarmanorte/webservice/puntos/datosafiliado/";
var infoAfiliado;


function iniciar() {
  //valido las respuestas del endpoint
  obtenerDatosAfiliado();

  document.getElementById('salirPuntos').addEventListener('click', cerrarSesion, false);
  document.getElementById('exit-offcanvas').addEventListener('click', cerrarSesion, false);

}//end function iniciar


function obtenerDatosAfiliado(){
  obtenerInfoAfiliado(function(response) {
    //Parse JSON string into object
    infoAfiliado = JSON.parse(response);
    if(infoAfiliado.code == 200){
      cargarDatosAfiliado();
    }else{
       window.location.href = "../index.html";
    }
  });
}

function obtenerInfoAfiliado(callback) {
    var xobj = new XMLHttpRequest();
    urlEndPoint = urlServicio + localStorage.getItem('token');
    xobj.overrideMimeType("application/json");
    xobj.open('GET', urlEndPoint, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
           callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


function cargarDatosAfiliado(){
  var afiliado = infoAfiliado.afiliado;
  var txs = afiliado.transaccions;
  var balance = infoAfiliado.balance;
  var foto =  infoAfiliado.urlFotoAfiliado;
  $('#etiquetaafiliado').text(onwName(afiliado.nombres + " " + afiliado.apellidos));
  $('#etiquetaafiliadooff').text(onwName(afiliado.nombres + " " + afiliado.apellidos));
  $('#puntosafmenuoff').val(number_format(balance.totalpuntosactual,0));
  $('#puntosafmenu').val(number_format(balance.totalpuntosactual,0));
  
  if(foto){
    $('#imgperfilmain').attr("src",foto + '?' + new Date().getTime());
    $('#fotoPerfilMenu').attr("src",foto + '?' + new Date().getTime());
    $('#fotoperfilmenuOff').attr("src",foto + '?' + new Date().getTime());
  }

  $('#p_acumulados').val(number_format(balance.acumulados,0));
  $('#p_redimidos').val(number_format(balance.redimidos,0));
  $('#p_avencer').val(number_format(balance.avencer,0));
  $('#p_vencidos').val(number_format(balance.vencidos,0));
  $('#p_fecha').val(balance.fechavencimiento);
  $('#p_actual').val(number_format(balance.totalpuntosactual,0));
  
}



function cerrarSesion(){
  //elimina el token
  localStorage.removeItem('token');
  //redireccion al index
  window.location.href = "../index.html";
}

function onwName(str)
{
  var array1 = str.toLowerCase().split(' ');
  var newarray1 = [];
    
  for(var x = 0; x < array1.length; x++){
      newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));
  }
  return newarray1.join(' ');
}

//Da formato de miles a un numero 
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

//amado Dios y padre ten misericordia de mi estoy muy enfermo.... :-( 
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