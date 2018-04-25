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
    obtenerDatosCatalogo();
    testCatalogo();

}

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

function obtenerDatosCatalogo() {
    obtenerCatalogoServicio(function (response) {
        //Parse JSON string into object
        var dataTemp = JSON.parse(response);
        //inicia el los objetos del catalogo
        catalogoProductos = dataTemp.data;
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

    console.log(lengthC);

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
    console.log(infoParrafo);

    //crea el boton de detalle 
    var botonD = document.createElement("a");
    botonD.setAttribute("class", "button expanded");
    botonD.setAttribute("href", "producto-page.html?id=" + item.idproducto );
    botonD.innerHTML = "Ver m&aacute;s";

    //se hace la composicion de los elementos del DOM para el elemento 
    columnItem.appendChild(imgProd);
    columnItem.appendChild(tituloProd);
    columnItem.appendChild(infoParrafo);
    columnItem.appendChild(botonD);

    return columnItem;
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

