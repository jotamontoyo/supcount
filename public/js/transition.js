
    $(document).ready(function() {

        $('img.bgfade').hide();                                         // transicion inico
		$('#wrap').css({'height':'100vh','width':'100%'});
		function anim() {
			$("#wrap img.bgfade").first().appendTo('#wrap').fadeOut(8000);
			$("#wrap img").first().fadeIn(8000);
			setTimeout(anim, 14000);
		}
		anim();


        $('#subir-inicio-icon').css('opacity', '0.8');                                  // control de opacity/visibility del icono subir
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            $('#subir-inicio-icon').css('opacity', '0.3');
        }, 250));
        if ($(window).scrollTop() === 0) {
            $('#subir-inicio').css('visibility', 'hidden');
        } else {
            $('#subir-inicio').css('visibility', 'visible');
        };

    });
