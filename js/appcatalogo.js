//@utor-> @lfernandortiz | @SOFTDromedicas 
$(document).foundation()

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

