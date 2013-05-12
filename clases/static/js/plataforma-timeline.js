/*
$(function(){
	// $('#filtros-curso').chosen();
	// templates de rendereo
	var DEFAULT_TEMPLATE = _.template('<div class="lectura"><div class="video"><iframe src="<%= url %>" width="640" height="360" frameborder="0" allowfullscreen=""></iframe><img src="/static_c/images/plataforma-live/video.png" /></div><p><%= content %></p></div>'),
		YOUTUBE_TEMPLATE = _.template('<div class="lectura"><div class="video">[<%= tipo %>=<%= url %>] </div><p><%= content %></p></div>'),
		LECTURE_TEMPLATE = _.template('<div class="lectura"><p><%= content %></p></div>');

	// configure video embedder
	$.mb_videoEmbedder.defaults.width = "100%";

	var $container = $('#lectura-container .lec'),
		$render_materiales = $('.render-materiales'),
		$materiales = $('.materiales'),
		$slides = $('#slides'),
		$titulos = $slides.find('.nombre .lec_titulos'),
		$libro = $('#libro'),
		$columnas = $('#libro , .sidebar'),
		$boton_regresar = $('.re-timeline');

	function handle_video(params) {
		var tipo = params.url.match(/youtube|vimeo/i);
		// vimeo o youtube
		if(tipo) {
			params.tipo = tipo[0];

			$container.html(YOUTUBE_TEMPLATE(params));

			$container.mb_embedMovies();
			$('.mb_video').append('<img src="/static_c/images/plataforma-live/video.png" class="video-img">');

		// defaults to mediastream?
		} else {
			$container.html(DEFAULT_TEMPLATE(params));
			$container.mb_embedMovies();
			$('.mb_video').append('<img src="/static_c/images/plataforma-live/video.png" class="video-img">');


		}
	}


	function handle_lecture(params) {
		$container.html(LECTURE_TEMPLATE(params));
		prettyPrint();
	}

	function handle_class(params) {
		$render_materiales.html(params.content);
	}

	// do content swiching
	function do_content_switch(params) {

		$libro.scrollTop(0);
		$titulos.html(params.titulo);
	}

	//manejadores de transiciones
	$materiales.on('click','a.material_enlace',function(){
		$boton_regresar.removeClass('second_nivel').addClass('primer_nivel');
	});

	$render_materiales.on('click','a.material_enlace',function(){
		$boton_regresar.addClass('second_nivel').removeClass('primer_nivel');
	});


	$('#lecciones , .segundo_nivel').on('click', 'a.material_enlace', function (e) {
		var $self = $(this),
			params = {
				id: $self.attr('data-id'),
				url: $self.attr('href'),
				titulo: $self.closest('.leccion').find('.tit').html()
			};

		if($self.is('.MIR, .LEE.LOAD, .CLS')) {
			e.preventDefault();

			$libro.addClass('loading');

			var html = '';

			if($self.is('.MIR , .LEE')) {

				$columnas.addClass('leyendo');
				$slides.removeClass('alternate');

			}else if($self.is('.CLS')) {

				$slides.addClass('alternate');

			}

			do_content_switch(params);



			// cargar contenidos
			$.get('/load_material/' + params.id, function (content) {
				$libro.removeClass('loading');

				params.content = content;

				// handle video
				var html = '';
				if($self.is('.MIR')) {
					
					handle_video(params);

				// handle lectures
				} else if($self.is('.LEE')) {

					handle_lecture(params);

				// handle classes
				} else if($self.is('.CLS')) {

					handle_class(params);

				}


			});
		}

		// registrar actividad
		$.post('/activity/material/'+ params.id);
	});

	$('.primer_nivel').live('click',function () {
		$slides.removeClass('alternate');
		$columnas.removeClass('leyendo');
		$render_materiales.html('');
		$container.html('');

	});

	$('.second_nivel').live('click',function () {
		$boton_regresar.removeClass('second_nivel').addClass('primer_nivel');
		$slides.addClass('alternate');
		$columnas.removeClass('leyendo');
		$container.html('');
	});
	
	// vivo countdown
	(function () {
		var $vivo_time = $('#vivo_time');

		if($vivo_time.size() <= 0) return;

		var $mins = $vivo_time.find('.minutes'),
			$secs = $vivo_time.find('.seconds');

		$vivo_time.countdown(parseInt($vivo_time.attr('data-timestamp'), 10) * 1000,
			function (e) {
				switch(e.type) {
					case 'minutes':
						$mins.text(e.value);
						break;
					case 'seconds':
						$secs.text(e.value);
						break;
					case 'finished':
						$vivo_time.closest('.descripcion').html('<h2 class="tit">Estamos en vivo</h2><a href="' + window.location.href.replace('/cursos/', '/live/') + '" class="boton icon-camera" target="_blank">Ir al Stream</a>');

				}
		});
	})();
});



*/