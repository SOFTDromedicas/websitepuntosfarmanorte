//@utor-> @lfernandortiz | @SOFTDromedicas
$(document).foundation()
//registro de manejo de eventos para la carga de la pagina
window.addEventListener("load", init, false);

var urlServicioCatalogo = "http://localhost/dropos/wsjson/catalogopuntos/?opc=catalogo";
var urlImgCatalogo = "http://localhost/dropos/imagenes.php?opcion=getimgcatalogo&productoid=";
var urlImgDetalle = "http://localhost/dropos/imagenes.php?opcion=getimgdetalle&productoid=";
var catalogoProductos;


function init() {
    //llamada al End-Point de Dropos que expone el catalogo de puntos.
    //obtenerDatosCatalogo();

    testCatalogo();

}

//prototipo para generar la grilla DOM  del catalogO
function testCatalogo(){
    var catalogo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
   
    var lengthC = Math.round(catalogo.length / 4);
    var multiArray = [];
    
    for( var i = 0 ; i < lengthC; i++ ){
        var x = [];
        multiArray.push(x);
    }
    
    var flag = 0;

    for( var i= 0 ; i <= catalogo.length+1; i++){
        if( flag < multiArray.length ){
            if( catalogo[i] != null ){
                multiArray[flag].push( catalogo[i]); 
            }
            if( multiArray[flag].length == 4){
                flag++;
            }
        }
    }

    console.log(multiArray);
}


function obtenerDatosCatalogo() {
    obtenerCatalogoServicio(function (response) {
        //Parse JSON string into object
        var dataTemp = JSON.parse(response);
        //inicia el los objetos del catalogo
        catalogoProductos = dataTemp.data;
        if (dataTemp.code == 200) {
            //llena el DOM con el catalogo
           cargarDatosCatalogo();
           console.log(catalogoProductos.length);
           console.log(catalogoProductos);
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

    if(catalogoProductos.length > 0){

        for (var index = 0; index < contenedorCatalogo.length; index++) {
            //evalua si es el comienzo del catalogo
            if( index == 0 ){
                var rowContenedor = document.createElement("div");
                rowContenedor.setAttribute("class", "row small-up-2 large-up-4 row-productos")
            }



        }

    }else{

    }
    

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

