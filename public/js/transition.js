
    $(document).ready(function() {

        $('img.bgfade').hide();                                         // transicion inico
		$('#wrap').css({'height':'100vh','width':'100%'});
		function anim() {
			$("#wrap img.bgfade").first().appendTo('#wrap').fadeOut(8000);
			$("#wrap img").first().fadeIn(8000);
			setTimeout(anim, 14000);
		}
		anim();

    });
