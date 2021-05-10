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

	$(document).on('click', '.SidebarBody .rowItemcart .delete', function() {
		var del_id = $(this).attr('id');

		if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
            location = 'index.php?route=checkout/cart&remove=' + del_id;
		} else {
            $.get('index.php?route=common/cart&remove=' + del_id, function(html) {
                $.ajax({
                    url: 'index.php?route=checkout/cart/count',
                    dataType: 'json',
                    success: function(json) {
                        $('#counterLabel').html(json['product_count']);
                        $('#cartDropList').html(html);
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

function addToCart(product_id, quantity, is_negativeprice) {
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
            	
            	$('body').append('<div class="modal fade" id="productpopup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
								  '<div class="modal-dialog modal-dialog-centered" role="document">' +
								    '<div class="modal-content">' +
								      '<div class="modal-header">' +
								        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
								          '<span aria-hidden="true">&times;</span>' +
								        '</button>' +
								      '</div>' +
								      '<div class="modal-body">' +
								        json['popup_html'] +
								      '</div>' +
								    '</div>' +
								  '</div>' +
								'</div>');

            	$('#productpopup').modal('show');
            }

			else if (json['redirect']) {
				location = json['redirect'];
			}
			
			if (json['success']) {
				// $('#notification').html('<br><div class="alert alert-success alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + json['success'] + '</div>');
				
				$('.alert-success').fadeIn('slow');
				
				$('#counterLabel').html(json['product_count']);

                $.get('index.php?route=common/cart', function(html) {
                    $('#cartDropList').html(html);
                });

                if (json['enable_order_popup'] != '1')
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
                            // $('#notification').html('<br><div class="alert alert-warning alert-dismissible" style="display: none;" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + error + '</div>');

                            // $('.alert-warning').fadeIn('slow');

                            // $('html, body').animate({ scrollTop: 0 }, 'slow');
                        });
                    }
                }	
		}
	});
}
function addToWishList(product_id) {
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
							element.removeClass('addToWishlist').addClass('removeFromWishlist');
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