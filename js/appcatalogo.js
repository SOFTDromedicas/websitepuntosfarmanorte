//@utor-> @lfernandortiz | @SOFTDromedicas
$(document).foundation()
//registro de manejo de eventos para la carga de la pagina
window.addEventListener("load", init, false);

var urlServicioCatalogo = "http://localhost/dropos/wsjson/catalogopuntos/?opc=catalogo";
var urlImgCatalogo = "http://localhost/dropos/imagenes.php?opcion=getimgcatalogo&productoid=";
var urlImgDetalle = "http://localhost/dropos/imagenes.php?opcion=getimgdetalle&productoid=";
var catalogoProductos;


function init() {

    obtenerDatosCatalogo();

}

function obtenerDatosCatalogo() {
    obtenerInfoAfiliado(function (response) {
        //Parse JSON string into object
        infoAfiliado = JSON.parse(response);
        if (infoAfiliado.code == 200) {
            console.log(infoAfiliado);
            //cargarDatosCatalogo();
        } else {
            //aca manejo el error si no hay funciona el servicio
        }
    });
}

function obtenerInfoAfiliado(callback) {
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

