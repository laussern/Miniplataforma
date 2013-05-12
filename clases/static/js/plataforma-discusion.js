jQuery(function ($) {
    // el link del editor tiene focus
    $('a[data-wysihtml5-command="insertImage"], a[data-wysihtml5-command="createLink"]').live('click', function () {
        $(this)
            .closest('.toolbar')
            .find('.bar[data-wysihtml5-dialog="'+$self.attr('data-wysihtml5-command')+'"] input')
            .focus()
            .select();
    });

    $.mejorandola_editor.defaults.stylesheets = '/static_c/css/plataforma-editor-wysihtml5.css?v=2';
    var editor_html = function(id){
        return '<form class="editor perspectiva" id="editor'+id+'" method="POST" style="display:none;"> \
            <input type="hidden" name="parent_id" value="'+id+'" /> \
            <textarea id="textarea'+id+'" placeholder="Ingresa texto..." name="respuesta_text"></textarea> \
            <div class="botones"> \
                <a class="cancel">Cerrar</a> \
                <button type="submit" class="boton">Responder</button> \
            </div> \
        </form>';
    };

    prettyPrint();

    function update_ask_counter() {
        var $ask_counter = $('#ask_counter');

        if($ask_counter.size() > 0 ) {
            var val = parseInt($ask_counter.text(), 10)-1;

            if(val === 0) {
                $('.cant_ask').html('Podrás enviar una nueva pregunta en <strong id="ask-time" data-timestamp="'+(((new Date()).getTime()+(10*60*1000))/1000)+'"><span class="minutes">00:</span>:<span class="seconds">00</span></strong> minutos, mientras, puedes buscar y votar por otras preguntas y respuestas');
                do_asktime();
            } else {
                $ask_counter.text(val);
            }
        }
    }

    $('.sidebar , .respuestas').on('click','.like', function (e) {
        e.stopPropagation();
        var $self     = $(this),
            $post     = $self.closest('.post'),
            id        = $post.attr('data-discusion_id'),
            $dicusion = $('.post[data-discusion_id=' + id + ']'),
            $puntos   = $post.find('.puntos:eq(0)'),
            puntos    = parseInt($puntos.text(), 10),
            $disliked = $post.find('.dislike.disliked:eq(0)'),
            $like     = $dicusion.find('.like:eq(0)'),
            $dis      = $dicusion.find('.dislike.disliked:eq(0)');
            $p        = $dicusion.find('.puntos:eq(0)');

        if ($disliked.size() > 0) {
            $dis.removeClass('disliked');

            if (isNaN(puntos))
                puntos = 0;
            else
                puntos++;
        }

        if ($self.is('.liked')) {
            $like.removeClass('liked');

            if (isNaN(puntos))
                puntos = 1;
            else
                puntos--;

            $.post('/like_discusion/' + $post.attr('data-discusion_id'));
        } else {
            $like.addClass('liked');

            if (isNaN(puntos))
                puntos = 1;
            else
                puntos++;

            $.post('/like_discusion/'+$post.attr('data-discusion_id'));

            update_ask_counter();
        }

        $p.html(puntos);
    });

    $('.sidebar').on('click', '.destacar',function () {
            var $self = $(this),
            $message  = $self.closest('.message');

        $.post(window.location.href, {
            destacar_content: $message.find('> p').text(),
            user_id: $self.attr('data-user_id')
        },
        function (discusion) {
            try {
                discusion = JSON.parse(discusion);

                $('.discussionsq').prepend('<div class="discussion" id="discussion_'+discusion.id+'"><div class="post" data-discusion_id="'+discusion.id+'">'+
                    '<div class="rate">'+
                        '<button class="like icon-thumbs-up"></button>'+
                        '<span class="puntos">0</span>'+
                        '<button class="dislike icon-thumbs-down"></button>'+
                    '</div>'+

                    '<div class="der">'+
                        '<div class="datos">'+
                            '<img src="'+discusion.user.avatar+'" height="25" width="25" alt="avatar">'+
                        '</div>'+
                        '<a href="'+discusion.permalink+'" class="pregu">'+discusion.content+'<p></p></a>'+
                        '<h4 class="username">'+discusion.user.name+'</h4>'+
                        '<h4 class="fecha">justo ahora</h4>'+
                    '</div>'+
                '</div>');

                $('.respuestas').prepend('<div class="pregunta discussion_'+discusion.id+'" style="display:none"><div class="post" data-discusion_id="'+discusion.id+'">'+
                    '<div class="rate">'+
                        '<button class="like icon-thumbs-up"></button>'+
                        '<span class="puntos">0</span>'+
                        '<button class="dislike icon-thumbs-down"></button>'+
                    '</div>'+

                    '<div class="der">'+
                        '<div class="datos">'+
                            '<img src="'+discusion.user.avatar+'" height="25" width="25" alt="avatar">'+
                        '</div>'+
                        '<a href="'+discusion.permalink+'" class="pregu">'+discusion.content+'</a>'+
                        '<h4 class="username">'+discusion.user.name+'</h4>'+
                        '<h4 class="fecha">justo ahora</h4>'+
                        '<div class="action">'+
                            '<a href="#editor'+discusion.id+'" class="reply" data-discusion_id="'+discusion.id+'">Responder</a>'+

                        '</div>'+
                    '</div>'+
                '</div>');

                $('.pregunta > .post[data-discusion_id="'+discusion.id+'"]')
                    .after(editor_html(discusion.id));

                //$('#textarea'+discusion.id).mejorandola_editor();

            } catch(err) {}
        });

        return false;
    });



    $('.sidebar , .respuestas').on('click','.dislike', function (e) {
        e.stopPropagation();
        var $self     = $(this),
            $post     = $self.closest('.post'),
            id        = $post.attr('data-discusion_id'),
            $dicusion = $('.post[data-discusion_id='+id+']'),
            $puntos   = $post.find('.puntos:eq(0)'),
            puntos    = parseInt($puntos.text() , 10),
            $liked    = $dicusion.find('.like.liked:eq(0)'),
            $disliked = $dicusion.find('.dislike:eq(0)'),
            $p        = $dicusion.find('.puntos:eq(0)');

        if ($liked.size() > 0) {
            $liked.removeClass('liked');

            if (isNaN(puntos))
                puntos = 0;
            else
                puntos--;
        }

        if ($self.is('.disliked')) {
            $disliked.removeClass('disliked');

            if (isNaN(puntos))
                puntos = 0;
            else
                puntos++;

            $.post('/dislike_discusion/'+$post.attr('data-discusion_id'));

        } else {
            $disliked.addClass('disliked');

            if (isNaN(puntos))
                puntos = -1;
            else
                puntos--;

            $.post('/dislike_discusion/'+$post.attr('data-discusion_id'));

            update_ask_counter();
        }

        $p.html(puntos);
    });

    $('.sidebar , .respuestas').on('click','.delete', function () {
        var $self     = $(this),
            $post     = $self.closest('.post'),
            $id       = $post.attr('data-discusion_id');

        $('.discussions').css('left','0');
        $('.respuestas').css('left','200%');

        $('#discussion_'+$id+' , .discussion_'+$id).remove();
        $post.remove();
        $.post('/delete_discusion/'+$post.attr('data-discusion_id'));
        return false;
    });

    //discusiones

        var discusion_activa,
            discussion_estatica = true;

        $('.sidebar').on('click','a.pregu',function(){
            return false;
        });

        function slideDiscu(clase) {
            discusion_activa    = $("."+clase);
            discussion_estatica = false;
            discusion_activa.show();
            function moviles(){
                $('.discussions').hide();
                $('.respuestas').show().css('position','static');
                $(window).scrollTop($('.wrap').offset().top);

            }
            function desktop(){
                $('.discussions').css({'left':'200%'});
                $('.respuestas').css('left','0');
            }
            if(vista_completa == true ){
                if(movil == true){
                    moviles();
                }else if($(window).width() < 1000){
                    moviles();

                    }else{
                        desktop();
                }

            }else{
              if($(window).width() > 1000){
                    desktop();

                }else{
                    moviles();

                }
            }

        }

        $('.discussions').on('click','[id*="discussion_"] a.pregu , a.all-resp',function(e){
            var $self        = $(this),
                clase        = $self.parents('[id*="discussion_"]').attr("id");
            var $loading     = $self.is('.all-resp') ? $self : $self.closest('.discussion').find('a.all-resp');

            if($("."+clase).size() > 0) { slideDiscu(clase);
            } else {
                $loading.addClass('discusion-loading');

                $.get($self.attr('data-load'),
                    function (r) {
                        $loading.removeClass('discusion-loading');

                        $('#ajax-discussions').append(r);

                        // crear links con target=_blank
                        $('.pregu a').attr('target', '_blank');

                        prettyPrint();

                        slideDiscu(clase);

                });

            }

            return false;
        });

        $(".respuestas").on('click','.regresar', function(){
            function moviles(){
                discusion_activa.hide();
                discusion_activa.find('.editor').hide();

                $('.discussions').show().css('position','static');
                $('.respuestas').hide();
                $(window).scrollTop($('.wrap').offset().top);

            }
            function desktop(){
                    discusion_activa.hide();
                    discusion_activa.find('.editor').hide();

                    $('.respuestas').css('left','200%');
                    $('.discussions').css('left','0');
            }
            if(vista_completa == true ){
                if(movil == true){
                    moviles();
                }else if($(window).width() < 1000){
                    moviles();

                    }else{
                        desktop();
                }

            }else{
              if($(window).width() > 1000){
                    desktop();

                }else{
                    moviles();
                }
            }

        });



    //mostrar editor de respuesta
        $('.reply').live('click', function (){
            var $reply = $(this),
            id         = $reply.attr('data-discusion_id'),
            $editor    = $('#editor'+id);

            if(primer_editor == false){
                var contador = 0;
                $.each(editores_activos,function(i){
                    if(editores_activos[i]!= '#editor'+id){
                        contador ++;
                    }
                    if(contador == editores_activos.length){

                        $('#editor'+id+' textarea').mejorandola_editor();
                        editores_activos.push('#editor'+id);
                    }
                });

            }else{
                $('#editor'+id+' textarea').mejorandola_editor();
                editores_activos.push('#editor'+id);
                primer_editor = false;
            }

            display_editor(id);

            return false;
        });

        var editores_activos = [], primer_editor = true;

        function display_editor(id){
            var $editor = $('#editor'+id);

            $editor.fadeIn(1, function(){
                if(discussion_estatica == false){
                    discusion_activa.scrollTo($editor ,function(){
                        $editor.addClass('no-pers');
                    });
                }else{
                    $('body').scrollTo($editor ,function(){
                        $editor.addClass('no-pers');
                    });
                }

            });
        }

    // desactivar editores de respuesta
        $(document).on('click', '.respuestas .editor .cancel', function(e){
            e.preventDefault();
            $(this).parents('.editor').eq(0).fadeOut(250, function(){
                $(this).removeClass('no-pers');
            });
        });
  

        $('input[name="q"]')
        .on('focus',function(){
            $(this).parent().addClass('focus');
            // $('.botones-filtrar .buttons').addClass('focus');
            $('form.form-extend').removeClass('form-extend');
            $('.discussionsq').removeClass('discussion-extend');
        }).on('blur',function(){
            $(this).parent().removeClass('focus');
            // $('.botones-filtrar .buttons').removeClass('focus');

        });


        //editor para preguntar 
        var activoFocus = false,
            $contador = $('.botones-editor .contador'),
            $twitter = $('.botones-editor .boton'),
            $imgAnima = $('.animate-focus');

        $('.pregu').on('keyup paste keypress', function(e){
                var texto = $(this).val(),
                $tooltip  = $('.tooltip.pre'),
                length    = texto.length,
                maximo    = 140;
            if(texto.match(/http/g) || texto.match(/www\./g))
                $tooltip.addClass('active');
            else
                $tooltip.removeClass('active');



            $(this).parents('.preguntar').find('.contador .val').text(maximo - length);

            if (maximo == length) {
                $contador.css('background','red');
            } else {
                $contador.css('background','#008FD5');
            }
        })

        .on('focus',function(){
            $imgAnima.addClass('escribiendo');
            activoFocus = true;
        })

        .on('blur',function(){
            $imgAnima.removeClass('escribiendo');
            activoFocus = false;
        });


    //focus a editor de preguntar 
    +function () {
        var $form       = $('form.preguntar'),
            $textarea = $form.find('textarea.preguntando');

        $textarea.focus(function () {
            $('.discussionsq').addClass('discussion-extend');
            $form.addClass('form-extend');
        });

        $form.submit(function () {
            var $discussions  = $form.closest('.discussions'),
                $discussionsq = $discussions.find('.discussionsq'),
                $contenedor   = $discussions.parent('.cont-iframe'),
                $respuestas   = $contenedor.find('.respuestas');

            $('.animate-focus').removeClass('escribiendo');

            $textarea.removeClass('validation-error');

            if (!$textarea.val().match(/^\s*$/)) {

                $form.addClass('form-sending');

                $.post($form.attr('action'), $form.serialize(),
                    function (discusion) {
                        $form.removeClass('form-sending form-extend');
                        $('.discussionsq').removeClass('discussion-extend');

                        try {
                            discusion = JSON.parse(discusion);
                            $discussionsq.prepend('<div class="discussion" id="discussion_'+discusion.id+'"><div class="post" data-discusion_id="'+discusion.id+'">'+
                                    '<div class="rate">'+
                                        '<button class="like icon-thumbs-up liked"></button>'+
                                        '<span class="puntos">1</span>'+
                                        '<button class="dislike icon-thumbs-down"></button>'+
                                    '</div>'+
                                    '<div class="der">'+
                                        '<div class="datos">'+
                                            '<img src="'+discusion.user.avatar+'" height="25" width="25" alt="avatar">'+
                                        '</div>'+
                                        '<a href="'+discusion.permalink+'" class="pregu">'+discusion.content+'</a>'+
                                        '<h4 class="username">'+discusion.user.name+'</h4>'+
                                        '<h4 class="fecha">justo ahora</h4>'+
                                    '</div>'+
                                    '</div><a href="'+discusion.permalink+'" class="vermas all-resp" data-load="/load_discusion/'+discusion.id+'"><span>0</span> Respuestas</a>'+
                                '</div>');


                            $('.pregunta > .post[data-discusion_id="'+discusion.id+'"]').after(editor_html(discusion.id));


                            $form.addClass('disabled-cantask');
                            $form.after('<p class="cant_ask">Necesitas votar en por lo menos <strong id="ask_counter">5</strong> preguntas o respuestas antes de mandar tu próxima pregunta</p>');

                    } catch(err) {}
                });
            } else {
                $textarea.addClass('validation-error shake');
                setTimeout(function () { $textarea.removeClass('shake'); }, 1300);
            }

            $('.botones-editor .contador').css('background','#008fd5');
            $('.botones-editor .contador .val').text('140');

            $form.each(function(){
              this.reset();
            });
            return false;


        });
    }();

    $('.editor:not(.preguntar)').live('submit',function () {
        var $self = $(this),
            $text = $self.find('textarea'),
            parent_id = $self.attr('id').replace('editor', ''),
            $form = $(this).closest('form'),
            $actions = $('.reply[data-discusion_id="'+parent_id+'"]').parent(),
            level = ($actions.prev('h4.fecha').length) ? 2 : 3;

        if (!$text.val().match(/^\s*$/)) {
                $self.addClass('form-sending');
                $.post($self.attr('action'), $self.serialize(),
                    function (discusion) {

                    $self.removeClass('form-sending');

                    $form.each(function(){ this.reset(); });


                    try {
                        discusion = JSON.parse(discusion);
                        var html = '<div class="post" data-discusion_id="'+discusion.id+'">'+
                                '<div class="rate">'+
                                    '<button class="like icon-thumbs-up"></button>'+
                                    '<span class="puntos">0</span>'+
                                    '<button class="dislike icon-thumbs-down"></button>'+
                                '</div>'+
                                '<div class="der">'+
                                    '<div class="datos">'+
                                        '<img src="'+discusion.user.avatar+'" height="25" width="25" alt="avatar">'+
                                        '<h4 class="username">'+discusion.user.name+'</h4>'+
                                        '<h4 class="fecha">justo ahora</h4>'+
                                    '</div>'+
                                    '<div class="pregu">'+discusion.content+'</div>';

                        if (level == 2) {
                            html += '<div class="action">'+
                                    '<a href="#editor'+discusion.id+'" class="reply" data-discusion_id="'+discusion.id+'">Responder</a>'+
                                '</div>';
                        }

                        html += '</div></div>';

                        // colorear etiquetas <pre class="prettyprint">
                        var $html = $(html);
                        $html.find('pre.prettyprint').each(function(){
                            var $pre = $(this);
                            var code = $pre.html();
                            code = prettyPrintOne(code);
                            $pre.html(code);
                        });


                        // insertar html y crear un nuevo editor si es 2do nivel
                        if (level == 2) {
                            $html.insertAfter($self);

                            $('.post[data-discusion_id="'+discusion.id+'"]')
                                .after(editor_html(discusion.id));
                            //$('#textarea'+discusion.id).mejorandola_editor();

                        // insertar solo el html si es 3er nivel
                        } else if (level == 3) {
                            $html.insertBefore($actions);

                        }

                        $self.find('.cancel').trigger('click');

                    } catch(err) {}
                });
        }

        return false;
    });


    function setup_infinite() {
        var $container_scroll;
        if(movil == false){
            $container_scroll = $('.discussionsq'),
            behavior_ = 'local';
       }else{
           $container_scroll = $(window),
           behavior_ = '';

       }
        $('.discussionsq').infinitescroll({
            navSelector: '.pagination .next:last',
            nextSelector: '.pagination .next:last',
            itemSelector: '.discussion',
            bufferPx: 400,
            loading: {
                msgText: '',
                finishedMsg: '<em>Fin</em>',
                img: 'data:image/gif;base64,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'
            },
            behavior: behavior_ ,
            binder: $container_scroll
        });

    }
    setup_infinite();

    // filtro de preguntas

    $('.filter-bar').find('select').chosen();

    $('#pregunta_clasificar').chosen().change(function () {
        $(this).closest('.preguntar').submit();
    });

    $('#discusion-filtrar').change(function () {
        var $self = $(this);

        $self.addClass('loading');
        $('#discussions-load').load(window.location.href+'?'+$(this).serialize()+' #discussions-load',
            function () {
                $self.removeClass('loading');
                $('.discussionsq').scrollTo(0, 350);
                setup_infinite();
                $('form.form-extend').removeClass('form-extend');

        });
    });

});
