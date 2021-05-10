$(document).scroll(function(){
    if ($(window).width() > 768) {
   if($(this).scrollTop() >= $('#secCategory').offset().top ) {
       $("#fixed-cart").addClass("Fixed");
    if($(this).scrollTop() >= $('.footer-top').offset().top - $( window ).height() + 100 ) {
       $("#fixed-cart").removeClass("Fixed");
       $("#fixed-cart").addClass("Absolute");
   }
   else {
    $("#fixed-cart").removeClass("Absolute");
   }
    }
      
    else {
        $("#fixed-cart").removeClass("Fixed");
        $("#fixed-cart").removeClass("Absolute");

    }
}
});
$(document).ready(function(){
    var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	sitePlusMinus();
$(".cart-content--body").height($(".category-page").height() - 335 );
});
function OpenCart(e) {
    if ($(window).width() > 768) {
    $(e).siblings(".header-middle--ul-cart--cart-details").slideToggle();
    }
    else {
       $(e).siblings(".header-middle--ul-cart--cart-details").addClass("active");
    }
}
function ShowAllItem() {
    $(".item-filter-tabs").show();
}
function ShowItem(e) {
    $(".item-filter-tabs").hide()
    var id_item = $(e).attr("data-id");
      $( ".item-filter-tabs span.filter" ).each(function( i ) {
    if ( $(this).attr("data-item") == id_item ) {
      $(this).closest(".item-filter-tabs").show() ;
    } else {
    }
  });

}
function closecart() {
    $(".header-middle--ul-cart--cart-details").removeClass("active");
}
function CloseFilterMenu() {
     $(".block-product-sidebar-opt8").removeClass("active");
}
function OpenFilter() {
         $(".block-product-sidebar-opt8").addClass("active");
}
function OpenMobileMenu() {
    $(".header-bottom ").addClass("active");
}
function CloseNavMenu() {
    $(".header-bottom ").removeClass("active");
}
 function OpenMobileSearch() {
     $(".header-middle--ul-search--search-container--mobile").addClass("active");
 }
 function CloseSearch() {
    $(".header-middle--ul-search--search-container--mobile").removeClass("active");
}
 function qtybutton(e) {
    debugger
    var $button = $(e);
    var oldValue = $button.parent().find('input').val();
    if ($button.hasClass('inc')) {
        var newVal = parseFloat(oldValue) + 1;
    } else {
        // Don't allow decrementing below zero
        if (oldValue > 1) {
            var newVal = parseFloat(oldValue) - 1;
        } else {
            newVal = 1;
        }
    }
    $button.parent().find('input').val(newVal);
};
function CollapseFooter(e) {
    if ($(window).width() < 768) {
        $(e).siblings(".footer-top--footer-list--container-footer").slideToggle();
        }
}
// ========= numberonly
function validate(key) {
    var keycode = (key.which) ? key.which : key.keyCode;
    if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) { return !1 }
}
$(document).ready(function () {

    // $('#slider').slider({
    //     range: true,
    //     min: 0,
    //     max: 500,
    //     values: [ 75, 300 ],
    //     slide: function(event, ui) {
          
    //       $('.ui-slider-handle:eq(0) .price-range-min').html(ui.values[ 0 ] + '<b>EGP</b>');
    //       $('.ui-slider-handle:eq(1) .price-range-max').html(ui.values[ 1 ] + '<b>EGP</b>');
    //       $('.price-range-both').html('<i>EGP' + ui.values[ 0 ] + ' - </i>EGP' + ui.values[ 1 ] );
          
    //       //
          
    //       if ( ui.values[0] == ui.values[1] ) {
    //         $('.price-range-both i').css('display', 'none');
    //       } else {
    //         $('.price-range-both i').css('display', 'inline');
    //       }
    //     }
    //   });
      
    //   $('.ui-slider-range').append('<span class="price-range-both value"><i>EGP' + $('#slider').slider('values', 0 ) + ' - </i>' + $('#slider').slider('values', 1 ) + '</span>');
      
    //   $('.ui-slider-handle:eq(0)').append('<span class="price-range-min value">' + $('#slider').slider('values', 0 ) + '<b>EGP</b>' + '</span>');
      
    //   $('.ui-slider-handle:eq(1)').append('<span class="price-range-max value">' + $('#slider').slider('values', 1 ) + '<b>EGP</b>' + '</span>');

    setTimeout(function () {
        $('.home-category .home-category--home-silder').owlCarousel({
            loop: true,
            margin: 15,
            rtl: false,
            responsive: {
                300: {
                    items: 2,
                    nav: true
                },
                400: {
                    items: 2,
                    nav: true
                },
                600: {
                    items: 3,
                    nav: true
                },
                1000: {
                    items: 4,
                    nav: true,
                }
            }
        })
    }, 100);
});
    