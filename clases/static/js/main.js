$(document).on('ready', main);

function main() {
	console.log('Website Cargado');
	$('#clases').on('click', 'a', cargar_contenido_clase);
}

function cargar_contenido_clase(data) {
	var id = $(data.currentTarget).data('id');
	$.get('cargar-contenido-clase/' + id, cargar_clase);
	console.log('Contenido de la clase cargado');
}

function cargar_clase(data){
	console.log('COmenzando a xcargar la clase que escirtira la mia xD');
	var contenido = $('#lectura-container');
	
	//contenido.html('');

	$('#titulo-clase').html(data.nombre).appendTo(contenido);

	$(data.url).appendTo(contenido);

	$('#contenido').html(data.descripcion).appendTo(contenido);

	$('#clases').css('visibility', 'hidden');
	contenido.css('right', '100%'); 

	$('#regresar-clases').on('click', function(){
		contenido.css('left', '-110%');
		$('#clases').css('left', '0');
	});
	console.log('Clase Cargada y mostrada');
}