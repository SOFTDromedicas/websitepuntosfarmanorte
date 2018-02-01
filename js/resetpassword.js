$(document).foundation()

function iniciar() {
    //estos eventos permiten cerrar el menu off-canvas cuando se invoca el login
    $('.off-canvas h5').on('click', function() {
      $('.off-canvas').foundation('close');
    });
    $('.off-canvas i.fa-sign-in').on('click', function() {
      $('.off-canvas').foundation('close');
    });

    var clave = document.getElementById('passw1');
    clave.addEventListener('keyup', passwordChanged, false);
    var btn = document.getElementById('resetpasswordbtn');
    btn.addEventListener('click', reestablecer, false);

}//end function iniciar

function passwordChanged() {
    var strength = document.getElementById('mensaje-eva');
    
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
    var pwd = document.getElementById("passw1");

    var span = document.createElement("span");

    if (pwd.value.length == 0) {
        strength.innerHTML = ''
    } else if (false == enoughRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:#f44336"><i class="fa fa-ban"></i> Debil! </span>';
    } else if (strongRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:#06A730"><i class="fa fa-check-circle"></i> Excelente! </span>';
    } else if (mediumRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:#ffa94d"><i class="fa fa-exclamation-circle"></i> Regular! </span>';        
    } else {
        strength.innerHTML = '<span style="color:#f44336"><i class="fa fa-ban"></i> Debil! </span>';
    }
}

function reestablecer() {

  var token = getParameterURLByName('id');
  var urlServicio = "http://192.168.14.241:8080/puntosfarmanorte/webservice/afiliado/reestablecerclave";
  var clave = $('#passw1').val(); //email afiliado
  var xhr = new XMLHttpRequest();

  if (clave != '') {
        try {
            urlServicio += "?token=" + token + "&pswd=" + clave;
            
            //callback
            xhr.addEventListener("readystatechange", function(){stateChangeRec(xhr)}, false);
            xhr.open("GET", urlServicio, true);
            xhr.setRequestHeader("Accept",
                "application/json; charset=utf-8");
            xhr.send();
        } catch (ex) {
            document.getElementById("loadclave").classList.remove("loaderlogin");
            console.log(ex)
        }

    } else { //el email dado no es valido (Evaluado por Regex)
      document.getElementById("loadclave").classList.remove("loaderlogin");
       
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
        console.log("--" + res.code)
        if(res.code == 200){
          document.getElementById("loadclave").classList.remove("loaderlogin");

          window.location.href = "http://www.puntosfarmanorte.com.co?cambioclave=true";

        }else{
          document.getElementById("loadclave").classList.remove("loaderlogin");
              
        }
    } /*end if 200*/
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



