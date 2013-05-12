$(function(){

	$(document).ajaxComplete(function (e, x, settings) {
		if(x.status == 278) {
			$("<div><p>:( Tu sesión ha caducado, por favor vuelve a iniciar sesión. <a href=\"/\">Iniciar sesión</a></p></div>").dialog({ modal:true, title: 'Sesión Expirada', draggable: false });
		}
	});

	// checar pedir login
	if(window.location.search.match(/^\?next=\/cursos\//i)) {
		$('.border').show();
		$('.loginform').show();
		$('.registro').hide();
		$('.formbutton').css('border','none');

		$('.formulario .border, .formulario .borderbutton').addClass('blink-login');
	}
	//cerrar sesion
	$('a#salir').on('click',function(){
		localStorage.pagecount = 0;
	});

	var estado = false;
	var configu = {
     over: desplegarMenu,
     timeout: 300,
     out:overout
	};

	//$(".user-name").hoverIntent(configu);

	var $caja = $('#caja');
	function desplegarMenu(){
		estado = true;
		$caja.slideDown(200);
		$('.overlay').addClass('active');
		$('#notificaciones').hide();
		
	}
	
	function overout(){
		//lo que pasa al salir de over
	}
	$caja.click(function(e){
		e.stopPropagation();
	});

	$('body').click(function(){
		if (estado) {
			$caja.slideUp(100);
			estado = false;
			
		}
		$('.overlay').removeClass('active');
	 
	});

	
	$("#caja > div").hide();
	$("#caja > #stage1").show();
	$("#stage1 #edit-perfil").click(function(){
		$("#stage1").slideUp(200);
		$("#stage2").slideDown(200);
	});

	$("#stage2 #edit-avatar").click(function(e){
		e.preventDefault();
		$("#stage2").slideUp(200);
		$("#stage3").slideDown(200);
	});
//desplegar menu
	$('#display-menu').toggle(
		function(){
		$('.menu').slideDown(200);
		},
		function(){
		$('.menu').slideUp(200);

		}
	);
	// $(window).on('resize',function(){
	// 	if($(window).width() >= 800){
	// 		$('.menu').css('display','block');
	// 	}else{
	// 		$('.menu').css('display','none');
	// 	}
	// });

//desplegar panel de bugs
	$('#display-bug').on('click',function(){
		$('#bugs').slideDown(210);
		$('#notificaciones').hide();
		$(this).addClass('active-bug');
		$('.overlay').addClass('active');

		$('#textarea_sugerencias').on('keyup paste',function(){
			var caracteres = $('#textarea_sugerencias').val().length;
			var maximo_caracteres = 140;
			$('#quedan').text(maximo_caracteres - caracteres);

			if(caracteres >= 140){
				$('.contador-js').fadeIn().fadeOut().fadeIn();
			}
		});
		return false;

	});
	
	$('body, #bugs .cerrar').on('click',function(){
		$('#display-bug').removeClass('active-bug');
		$('#bugs').fadeOut(100);
		$('#notificaciones').fadeOut(100);
	});

	$('#bugs , #notificaciones , #notify').click(function(e){
        e.stopPropagation();
	});


	$('#form-bug').submit(function () {
		var $self = $(this), $notif = $self.find('.notif');

		if(!$self.find('textarea').val().match(/^\s*$/)) {
			$.post($self.attr('action'), $self.serialize(),
				function (r) {
					$self.get(0).reset();
					$notif.text(r).fadeOut().fadeIn(1000, function(){
						$('#display-bug').removeClass('active-bug')
						$('#bugs').slideUp()
						$notif.text("")
					});
			});	
		} else {
			$notif.text('Completa todos los campos, porfavor.').fadeOut().fadeIn();
		}
		

		return false;
	});
//desplegar notificaciones 
	$('#notify').click(function(){
		$('#caja , #bugs').hide()
		$(this).removeClass('active');
		$(this).find('.count').remove();
		$('#notificaciones').slideToggle(0);

		$.post('/notificaciones_readall');
		
		return false;
	})
//Editar perfil
	$('#editar-perfil').submit(function () {
		var $self = $(this), validates = true;

		$self.find('input.validar')
			.each(function () {
				var $self = $(this);

				$self.removeClass('error');

				if($self.val().match(/^\s*$/)) $self.addClass('error')

				if($self.is('[type="email"]') && !$self.val().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) $self.addClass('error')

		});

		if($self.find('.error').size() == 0) {
			$.post($self.attr('action'), $self.serialize(), 
				function (r) {
					$self.find('.notificacion').html(r);
					$self.find('.contra').val('');
			});
		}

		return false;
	});

	$("#caja .cerrar").click(function cerrar(e){
		e.preventDefault();
		$('#caja').hide();
		$("#caja > div").hide();
		$("#caja > #stage1").show();
	})	
	$("#caja .close").click(function cerrar(e){
		e.preventDefault();
		$("#caja > div").slideUp();
		$("#caja > #stage1").slideDown();
	})
	$('#loginform').submit(function () {
		var $self = $(this);

		$.post($self.attr('action'), $self.serialize(), function (result) {
			if(result == 'OK') window.location.reload();
		});

		return false;
	});

	$('form.registro').submit(function () {
		var $self = $(this);

		$.post($self.attr('action'), $self.serialize(), function (result) {
			$self.find('.info').html(result);
			$self.find('input[type="email"]').val('');
		});

		return false;
	})

	$('#editar-avatar').submit(function () {
		var $self = $(this);

		if($self.find('input[name="image"]').val().match(/^\s*$/)) return false;

		$self.find('.notificacion').html('Subiendo...');
		
		$.post($self.attr('action'), $self.serialize(), 
			function (r) {
				$self.find('.notificacion').html(r);
		});

		return false;
	});

//drag and drop de imagenes

	var $avatar = $('.menu ul li #caja .avatar');
	function imagenSeleccionada(imagen) {

	  	var imagen = imagen;
	    var imageReader = new FileReader();
	    imageReader.onload = (function(aFile) {
	      return function(e) {      

	        $('#editar-avatar input[name="image"]').val(e.target.result);
	    	$('#editar-avatar input[name="image_filename"]').val(aFile.name);
	        $(".menu ul li #caja .avatar img").attr('src',e.target.result );

	      };
	    })(imagen);
	    imageReader.readAsDataURL(imagen);  
	 
	}

	function dropIt(e) {  
	   imagenSeleccionada(e.originalEvent.dataTransfer.files[0]);
       $avatar.css('border-color','#707982');
        return false;
	}
	$('.avatar').on('drop',function(e){
		dropIt(e);
		return false;
	}).on('dragover',function(){
        $avatar.css('border-color','lightSkyBlue');
        return false;

	}).on('dragenter',function(){
		return false;

	}).on('dragleave',function(){
        $avatar.css('border-color','#707982');
		return false;

	});

	// live notifications
	(function () {
		if(typeof user == 'undefined') return;
		if(!user.id) return;

		if(typeof io == 'undefined') return;

		var socket = window.REAL_SOCKET = io.connect(live_socket);

		// notificaciones
		socket.on('create_notificacion', function (notificacion) {
			if(notificacion.user_id == user.id) {
				var $notify = $('#notify').addClass('active'), $notifybody = $('#notifybody'), $count = $notify.find('.count');

				if($count.size() <= 0) $notify.append('<span class="count">1</span>');
				else {
					var num = parseInt($count.text(), 10);

					$count.text(num+1);
				}

				$notifybody.append('<li><a href="'+notificacion.url+'" class="'+notificacion.clase+'">'+notificacion.content+'</a></li>');
			}
		});
	})();
});
