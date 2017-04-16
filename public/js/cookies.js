
    $(document).ready(function() {

        var iScroll = $(window).scrollTop(),
            aviso_cookies = true;

        $(window).scroll(function() {

            iScroll = $(window).scrollTop();                                            // animacion aviso cookies
            if ((iScroll > 250) && (aviso_cookies)) {
                $('.alerta-cookies').removeClass('animated bounceInDown');
                $('.alerta-cookies').toggleClass('animated bounceOutLeft');
                aviso_cookies = false;
            };


            $('.ocultar').each(function(i) {                                            // .ocultar fadeIn() cuando visible en pantalla
                var bottom_of_object = $(this).offset().top + $(this).outerHeight();    // Check the location of each desired element .ocultar
                var bottom_of_window = $(window).scrollTop() + $(window).height();
                if (bottom_of_window > bottom_of_object) {                              // If the object is completely visible in the window, fade it it
                    $(this).animate({
                        'opacity': '1'
                    }, 1000);
                };
            });


        });

        $('#contacto_form').submit(function() {

            swal("¡Solicitud enviada!", "success");

        });

    });
