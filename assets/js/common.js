function addToWishList(product_id) {
	debugger
	$.ajax({
		url: 'index.php?route=account/wishlist/add',
		type: 'post',
		data: $('.product-add-form input[type=\'text\'], .product-add-form input[type=\'hidden\'], .product-add-form input[type=\'radio\']:checked, .product-add-form input[type=\'checkbox\']:checked, .product-add-form select, .product-add-form textarea'),
		dataType: 'json',
		success: function (json) {
			$('.alert-success, .alert-warning, .alert-attention, .alert-information').remove();

			if (json['success']) {
				$('#notification').html('<br><div class="alert alert-success alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['success'] + '</div>');

				$('.alert-success').fadeIn('slow');

				$('#wishlist-total').html(json['total']);

				$('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		}
	});
}
$(document).ready(function() {

	$('.currency-language > currency-box >  a ').click(function(event) {
		event.preventDefault();
		 return false;
	});

	$(document).on('click', ".form-qty .btn-number", function() {
		$(".qty-up").html('<i class="fa fa-caret-up" aria-hidden="true"></i>');
		$(".qty-down").html('<i class="fa fa-caret-down" aria-hidden="true"></i>');
		if ($(this).hasClass('qtyplus')) {
			$("[name=quantity]", '.form-qty').val(parseInt($("[name=quantity]", '.form-qty').val()) + 1);
			
		} else {
			if (parseInt($("[name=quantity]", '.form-qty').val()) > 1) {
				$("[name=quantity]", '.form-qty').val(parseInt($("[name=quantity]", '.form-qty').val()) - 1);
				
			}
		}
	});

	/* Search */
	$('.button-search').bind('click', function() {
		url = $('base').attr('href') + 'index.php?route=product/search';
				 
		var search = $('input[name="search"]:visible').val();
		
		if (search) {
			url += '&search=' + encodeURIComponent(search);
		}
		
		location = url;
	});
	
	$('#search input[name=\'search\']').bind('keydown', function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			e.stopPropagation();
			url = $('base').attr('href') + 'index.php?route=product/search';
			 
			var search = $(this).val();
			
			if (search) {
				url += '&search=' + encodeURIComponent(search);
			}
			
			location = url;
		}
	});
	$(document).on('click', '.CloseSideAll', function() {

		$('.delete-mini-cart-item.icon-close').each(function(){
			debugger
			var del_id = $(this).attr('id');
			$.get('index.php?route=common/cart&remove=' + del_id, function(html) {
				$.ajax({
					url: 'index.php?route=checkout/cart/count',
					dataType: 'json',
					success: function(json) {
						$('.counter-Label').html(json['product_count']);
						 $(".cart-form").html(html);
					}
				});
			});
		})
	})
	$(document).on('click', '.delete-mini-cart-item.icon-close', function() {
		debugger
		var del_id = $(this).attr('id');

		if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
            location = 'index.php?route=checkout/cart&remove=' + del_id;
		}
		else {
            $.get('index.php?route=common/cart&remove=' + del_id, function(html) {
                $.ajax({
                    url: 'index.php?route=checkout/cart/count',
                    dataType: 'json',
                    success: function(json) {
                        $('.counter-Label').html(json['product_count']);
						 $(".cart-form").html(html);
                    }
                });
            });
		}

        return false;
	});

    var sectionId = getURLVar('draftsectionid');
    if(sectionId != '') {
        setTimeout(function() {
            //debugger;
            if($('div#section-' + sectionId).length > 0)
                $(document).scrollTop($('div#section-' + sectionId).offset().top);
        }, 100);
    }
	// add and remove from add WishList
	$(document).on('click','.addToWishlist',function(e){
		e.preventDefault();
		addToWishList($(this).attr('product-id'),true,$(this));
	});
	$(document).on('click','.removeFromWishlist',function(e){
		e.preventDefault();
		removeFromWishList($(this).attr('product-id'),true,$(this));
	});
	$(document).on('change','#cart-form .qty-input',function(e){
		e.preventDefault();
		update_qty_cart($(this).attr('key-cart'),$(this).val());
	});
});

function getURLVar(key) {
	var value = [];
	
	var query = String(document.location).split('?');
	
	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');
			
			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}
		
		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}

function contact_us(id) {
    $('#contact-form input[name="enquiry"]').val($('#enquiry-'+id).html()+'\n');
    $('#contact-form').submit();
}

function addToCart(product_id, quantity, is_negativeprice, el) {
	debugger
	if ($('html').attr('lang') == 'en'){
		var htmlText = `<p style="font-size:50px">🤗</p><p><strong>Welcome</strong> </p> you should Log in before adding to the cart`,
		btnCancle= `Cancle`,
		btnGoLogin=`Go to Login`
	}else{
		var htmlText = `<p style="font-size:50px">🤗</p><p><strong>مرحبا</strong> </p> تحتاج لتسجيل الدخول أولا للاضافة للسلة`,
		btnCancle= `إلغاء`,
		btnGoLogin=`اذهب للدخول`
	}
	quantity = typeof(quantity) != 'undefined' ? quantity : 1;
    is_negativeprice = typeof(is_negativeprice) != 'undefined' ? is_negativeprice : false;

    if(is_negativeprice) {
        $('#contact-form input[name="enquiry"]').val($('#enquiry-'+product_id).html()+'\n');
        $('#contact-form').submit();
        return;
	}

	$.ajax({
		url: 'index.php?route=checkout/cart/add',
		type: 'post',
		data: 'product_id=' + product_id + '&quantity=' + quantity,
		dataType: 'json',
		success: function(json) {
            if(json['success'] == 'affiliate_link') {
                document.location = json['affiliate_link'];
                return;
            }

            $('.alert-success, .alert-warning, .alert-attention, .alert-information, .alert-error').remove();

            if(json['popup_html']){
            	$('body #productpopup').remove();
            	
            	$('body').append('<div class="modal fade modal-add-to-cart-product" id="productpopup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
								  '<div class="modal-dialog modal-dialog-centered" role="document">' +
								    '<div class="modal-content">' +
								        json['popup_html'] +
								      '</div>' +
								  '</div>' +
								'</div>');

            	$('#productpopup').modal('show');
				
			} 
			else if (json['redirect'] ){
				if (json['redirect'].indexOf('account/login') == -1)
			 		location = json['redirect'];
			 }
			else{
				if (json['enable_order_popup'] != '1'){
					if (typeof (json['error']) == "undefined") {
				var elements = {
				flyer: $(el).closest(".Sec").find(".ImgContainer img"),
				// get element to fly
				basket: $('.MenuNav .TopNav .main_nav .UserNav li a.cartCount img') // get destination
			};
			var options = {
				position: {
					origin: {
						// get initial position on document
						initial: elements.flyer.offset(),
						// amout of pixels to move the cloned element from the original before flying to the basket
						offset: { x: 5, y: 15 }
					},
					destination: {
						// get initial position on document
						initial: elements.basket.offset()
					}
				}
			};
			// allow only 1 cloned element
			// if ($('#fly-to-basket').length) {
			// 	$('#fly-to-basket').remove();
			// }
			// clone original element and set initial position
			// elements.flyer
			// 	.clone()
			// 	.attr('id', 'fly-to-basket')
			// 	.appendTo('body')
			// 	.css('box-shadow', '0px 1px 10px 5px rgba(0,0,0,.15)')
			// 	.css('position', 'absolute')
			// 	.css('top', options.position.origin.initial.top)
			// 	.css('left', options.position.origin.initial.left);
			// make it fly!
			// $("#fly-to-basket").css({
			// 	height: 80,
			// 	width: 100,
			// 	zIndex: 9999
			// });
			// $('#fly-to-basket').animate(
			// 	{ top: options.position.origin.initial.top - options.position.origin.offset.y, left: options.position.origin.initial.left - options.position.origin.offset.x }, 70,
			// 	function () {
			// 		$('#fly-to-basket').delay(100).animate(
			// 			{ top: options.position.destination.initial.top, left: options.position.destination.initial.left, width: '20px', height: '20px' }, 400, 'easeInOutExpo',
			// 			function () {
			// 				$('#fly-to-basket').fadeOut(350, function () {
			// 					elements.basket.effect("bounce", "slow");
			// 				});
			// 			}
			// 		);
			// 	}
			// );
				}
			}

					$(el).find('i').addClass('fa-check');
					$(el).find('i').removeClass('fa-cart-plus');
					window.setInterval(function() {
						$(el).find('i').addClass('fa-cart-plus');
						$(el).find('i').removeClass('fa-check');
					}, 2000); 
			}
			
			if (json['success']) {
				// $('#notification').html('<br><div class="alert alert-success alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['success'] + '</div>');
				
				$('.alert-success').fadeIn('slow');
                $.get('index.php?route=common/cart', function(html) {
					 $(".cart-form").html(html);
					 $('.counter-Label').html(json['product_count']);
                });

                // if (json['enable_order_popup'] != '1')
				    // $('html, body').animate({ scrollTop: 0 }, 'slow');

                if (json['enable_order_popup'] == '1') {
					Swal.fire({
					html:json['text_cart_dialog'],
					showCancelButton: true,
					reverseButtons: true,
					cancelButtonText:json['text_cart_dialog_continue'],
					confirmButtonText:json['text_cart_dialog_cart']
					}).then((result) => {
					if (result.value) {
						window.location.href = json['cart_link']
					}
					});
                }
			}	
			 if (typeof (json['error']) != "undefined") {
                    if (typeof (json['error']['option']) != "undefined") {
                        $.each(json['error']['option'], function (index, error) {
                            // $('#notification').html('<br><div class="alert alert-warning alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + error + '</div>');

                            $('.alert-warning').fadeIn('slow');

                            // $('html, body').animate({ scrollTop: 0 }, 'slow');
                        });
                    }
                    else {
                        $.each(json['error'], function (index, error) {
                            if ($('html').attr('lang') == 'en') {
                                var btnCancle = `Cancle`,
                                    btnGoLogin = `Go to Login`
                            } else {
                                var btnCancle = `إلغاء`,
                                    btnGoLogin = `تسجيل الدخول`
							}
							if(index == 'warning'){
	                            Swal.fire({
									html: `<p style="font-size:50px">🤗</p><p><strong>Welcome</strong> </p>` + error,
									showCancelButton: true,
									reverseButtons: true,
									cancelButtonText:btnCancle,
									confirmButtonText:btnGoLogin
									}).then((result) => {
									if (result.value) {
										window.location.href = 'index.php?route=account/login'
									}
									});
	                            // $('#notification').html('<br><div class="alert alert-warning alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + error + '</div>');
	                            // $('.alert-warning').fadeIn('slow');
	                            // $('html, body').animate({ scrollTop: 0 }, 'slow');
							}
							else{
								Swal.fire({
									html: `<p style="font-size:50px">😕</p>` + error
								});
							}
                        });
                    }
                }

		}
	});
}
function addToWishList(product_id,toggleActive=false,element) {
	debugger
	if ($('html').attr('lang') == 'en'){
		var htmlText = `<p style="font-size:50px">🤗</p><p><strong>Welcome</strong> </p> You need to login for saving your favorits`,
		btnCancle= `Cancle`,
		btnGoLogin=`Go to Login`
	}else{
		var htmlText = `<p style="font-size:50px">🤗</p><p><strong>مرحبا</strong> </p> تحتاج لتسجيل الدخول أولا لحفظ مفضلاتك`,
		btnCancle= `إلغاء`,
		btnGoLogin=`اذهب للدخول`
	}
	$.ajax({
		url: 'index.php?route=account/wishlist/add',
		type: 'post',
		data: 'product_id=' + product_id,
		dataType: 'json',
		success: function(json) {
			debugger
			$('.alert-success, .alert-warning, .alert-attention, .alert-information').remove();
			if (json['success']) {
				let alertClass  = ''
                if(json['status'] == '1')
                    alertClass  = 'alert-success'
                else
                    alertClass  = 'alert-warning'
                
				// $('#notification').html('<br><div class="alert '+alertClass+' alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['success'] + '</div>');
				debugger
				if(json['status'] == '1'){
						$('.alert-success').fadeIn('slow');
						if (toggleActive) {
							element.addClass('addToWishlist').removeClass('active');
						}
						else {
							element.removeClass('addToWishlist').addClass('active');
						}
				}else{
					Swal.fire({
					html:htmlText,
					showCancelButton: true,
					reverseButtons: true,
					cancelButtonText:btnCancle,
					confirmButtonText:btnGoLogin
					}).then((result) => {
					if (result.value) {
						window.location.href = 'index.php?route=account/login'
					}
					});
				}
				
				$('#wishlist-total').html(json['total']);
				
				// $('html, body').animate({ scrollTop: 0 }, 'slow');
			}	
		}
	});
}

function removeFromWishList(product_id,toggleActive=false,element=null) {
	if ($('html').attr('lang') == 'en'){
		var htmlText = `<p style="font-size:50px">🤗</p><p><strong>Welcome</strong> </p> You need to login for saving your favorits`,
		btnCancle= `Cancle`,
		btnGoLogin=`Go to Login`
	}else{
		var htmlText = `<p style="font-size:50px">🤗</p><p><strong>مرحبا</strong> </p> تحتاج لتسجيل الدخول أولا لحفظ مفضلاتك`,
		btnCancle= `إلغاء`,
		btnGoLogin=`اذهب للدخول`
	}
	$.ajax({
		url: 'index.php?route=account/wishlist/remove',
		type: 'post',
		data: 'product_id=' + product_id,
		dataType: 'json',
		success: function(json) {
			$('.alert-success, .alert-warning, .alert-attention, .alert-information').remove();
			if (json['success']) {
				let alertClass  = ''
                if(json['status'] == '1')
                    alertClass  = 'alert-success'
                else
                    alertClass  = 'alert-warning'
                
				// $('#notification').html('<br><div class="alert '+alertClass+' alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['success'] + '</div>');
				
				if(json['status'] == '1'){
						$('.alert-success').fadeIn('slow');
						if (toggleActive) {
							element.removeClass('removeFromWishlist').addClass('addToWishlist');
						}
				}else{
					Swal.fire({
					html:htmlText,
					showCancelButton: true,
					reverseButtons: true,
					cancelButtonText:btnCancle,
					confirmButtonText:btnGoLogin
					}).then((result) => {
					if (result.value) {
						window.location.href = 'index.php?route=account/login'
					}
					});
				}
				
				$('#wishlist-total').html(json['total']);
				
				// $('html, body').animate({ scrollTop: 0 }, 'slow');
			}	
		}
	});
}
function addToCompare(product_id) { 
	$.ajax({
		url: 'index.php?route=product/compare/add',
		type: 'post',
		data: 'product_id=' + product_id,
		dataType: 'json',
		success: function(json) {
			$('.alert-success, .alert-warning, .alert-attention, .alert-information').remove();
						
			if (json['success']) {
				// $('#notification').html('<br><div class="alert alert-success alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['success'] + '</div>');
				
				$('.alert-success').fadeIn('slow');
				
				$('#compare-total').html(json['total']);
				
				// $('html, body').animate({ scrollTop: 0 }, 'slow'); 
			}	
		}
	});
}
function update_qty_cart(key,quantity){
  $.ajax({
    url: 'index.php?route=checkout/cart/update_quantity',
    data:{
        key:key,
        quantity:quantity
        },
    type: 'post',
    beforeSend:function(){
    $('.page_holder').css('display','block');
    },
    success: function(result) {
    $('.page_holder').css('display','none');
    }
});
}
function contact_us(id) {
	$('#contact-form input[name="enquiry"]').val($('#enquiry-'+id).html()+'\n');
	$('#contact-form input[name="product_id"]').val(id);
	$('#contact-form').submit();
}
$('.tt-login-form').on('change','input',function(){
	if ($('html').attr('lang') == 'ar') {
		var notValid = "برجاء اضافة بيانات صحيحة"
	}
	else{
		var notValid = "please insert valid data"
	}
	var password = $('#loginInputEmail').val() ,
	email= $('#loginInputName').val();
	if( password != '' && IsEmail(email) ){
		$('.btn-login').prop('disabled', false).css({opacity:'1', cursor: 'pointer' });
		$('.not-valid').text('')
	}
	else {
		$('.btn-login').prop('disabled', true).css({opacity:'.5', cursor: 'default' });
		$('.not-valid').text(notValid)
	}
})
function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!regex.test(email)) {
		return false;
	}else{
		return true;
	}
}


function subtractFromCart(key) {
    $.ajax({
        url: 'index.php?route=checkout/cart/updateCartQuantity',
        type: 'post',
        data: 'key=' + key + '&decrease=' + 1,
        dataType: 'json',
        success: function(json) {
            $('.alert-success, .alert-warning, .alert-attention, .alert-information, .alert-error').remove();
                        
            if (json['success']) {
                $('#notification').html('<br><div class="alert alert-success alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['message'] + '</div>');    
                $('.alert-success').fadeIn('slow');
                //Remove 0 label when cart is empty
              
                $.get('index.php?route=common/cart', function(html) {
					 $(".cart-form").html(html);
					 var counter = parseInt($('.counter-Label').html());
					 counter--;
					 $('.counter-Label').html(counter)
                });         
            }   
        }
    });
}

function increaseCart(key) {
    $.ajax({
        url: 'index.php?route=checkout/cart/updateCartQuantity',
        type: 'post',
        data: 'key=' + key + '&increase=' + 1,
        dataType: 'json',
        success: function(json) {
            $('.alert-success, .alert-warning, .alert-attention, .alert-information, .alert-error').remove();
                        
            if (json['success']) {
                $('#notification').html('<br><div class="alert alert-success alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['message'] + '</div>');    
                $('.alert-success').fadeIn('slow');
                //Remove 0 label when cart is empty
               

                $.get('index.php?route=common/cart', function(html) {
					 $(".cart-form").html(html);
					  var counter = parseInt($('.counter-Label').html());
					  counter++;
					  $('.counter-Label').html(counter)
                });      
            }   
        }
    });
}