$(function ($) {
    //variables de mensajes directos
        
    var $overlay          = $('.overlay_mensajes'),
        $mensajes         = $('.mensaje_directo'),
        $open             = $('.enviar_mensaje'),
        $close            = $('.mensaje_directo .close'),
        $lista_usuarios   = $('.content_usuarios'),
        $lista_usuario    = $('.content_usuario'),
        $title            = $mensajes.find('.title'),
        $mensajes_content = $('.messages-content'),
        $form_container   = $('.mensajes_form');

    var perfil = {
        mensajes : function() {

            var mensajes = {
                

                //abre el panel de mesajes directos
                abrir : function(){
                    //listener a los botones de mensaje
                    $('.messages-button').on('click',function(){
                        mensajes.ver_interacciones(this);
                             
                        return false;
                    });

                },
                //cierra mensaje directos
                cerrar : function(){
                    $close.click(cerrar);
                    $overlay.click(cerrar);

                    function cerrar(){
                        $overlay.removeClass("active");
                        $mensajes.removeClass("active");
                        setTimeout(function(){
                            $lista_usuarios.addClass('active');
                            $lista_usuario.removeClass('active');
                            $('.regresa').removeClass('regresa');
                            $title.removeClass('icon-arrowTimeline');
                            $form_container.html('');
                            
                        }, 750);
                    }

                },
                ver_interacciones : function(elemento){
                    var $self = $(elemento);
                    // limpia los antiguos mensajes
                    $lista_usuarios.html('');
                    $mensajes_content.html('');

                    $mensajes.addClass("active");
                    $overlay.addClass("active");

                    if($self.is('.perfil')){
                        mensajes.ver(elemento);
                    
                    }else{

                        $lista_usuarios.addClass("loading");
                        
                        $lista_usuario.removeClass('active');
                        $lista_usuarios.addClass('active');

                        $.get('/messages/',function(data){
                            if($.trim(data) == '')
                            {
                                $lista_usuarios.html("<p class='lo_siento'>No Tienes mensajes, puedes enviarle un mensaje a tus compañeros desde su perfil.</p> <span class='back-ico icon-comments-2'></span>");
                                $lista_usuarios.removeClass("loading");
                            }else{
                               $lista_usuarios.html(data);
                                $lista_usuarios.removeClass("loading");

                            }
                            
                            

                        });

                    }
                },
                
                
                ver_form : function(){
                    if($lista_usuario.is('.active')){
                        $form_container.addClass('active');
                    }else{
                        $form_container.removeClass('active');

                    }
                },
                ver_mensaje : function(){
                    $('.content_usuarios').on('click','.mensaje',function(){
                      mensajes.ver(this);
                    });

                    

                },
                ver : function(elemento){


                        var $self    = $(elemento);
                            

                        $('.re').addClass('regresa');
                        $title.addClass('icon-arrowTimeline');
                          
                        $lista_usuarios.removeClass('active');
                        $lista_usuario.addClass('active');

                        $lista_usuario.addClass('loading');
                        $.get($self.attr('data-load'), function (r) {
                            r = r.split('////');


                            $mensajes_content.html(r[0]);
                            $form_container.html(r[1]);
                            $lista_usuario.removeClass('loading');
                        });

                        mensajes.ver_form();

                },
                ver_lista_mensajes : function(){
                    var $regresar = $('.regresa');
                        
                    $mensajes.on('click','.icon-arrowTimeline',function(){

                        mensajes.ver_interacciones(this);

                        $regresar.removeClass('regresa');
                        $title.removeClass('icon-arrowTimeline');
                        setTimeout(removeHtml, 300);
                        function removeHtml(){
                            $mensajes_content.html('');
                            $form_container.html('');
                            
                        }
                        mensajes.ver_form();

                    });
                },
                focus_form : function(){
                    $form_container.on('focus','form',function(){
                        
                        $lista_usuario.addClass('focus');
                    });

                },
                enviar_mensaje : function(){
                    $lista_usuario.on('submit','form',function(){
                        var $self    = $(this),
                            $mensaje = $self.find('textarea'),
                            $overlay = $form_container.find('.enviando');

                        if(!$mensaje.val().match(/^\s*$/))
                        {
                            //enviando mensaje por ajax
                            $overlay.addClass('loading');
                            $.post($self.attr('action'), $self.serialize(), function (r) {
                                $mensajes_content.append(r);

                                $mensaje.val('');
                                $overlay.removeClass('loading');
                            });
                        }

                        return false;
                    });
                },

                init : function(){
                    mensajes.abrir();
                    mensajes.cerrar();
                    mensajes.ver_mensaje();
                    mensajes.enviar_mensaje();
                    mensajes.ver_lista_mensajes();
                    mensajes.focus_form();
                }
            };
            mensajes.init();
        },
        init : function(){
            perfil.mensajes();
        }
    };
    
    perfil.init();
    
});