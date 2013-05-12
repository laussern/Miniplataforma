(function($) {
	var editor_html, wysihtml5ParserRules;

	editor_html = function(){
		return ' \
		        <div class="toolbar" style="display: none;"> \
		            <div class="alignleft"> \
		                <a data-wysihtml5-command="bold" class="bold">N</a> \
		                <a data-wysihtml5-command="italic" class="italic">C</a> \
		                <a data-wysihtml5-command="createLink" class="link">Enlace</a> \
		            </div> \
		             \
		            <div class="alignright"> \
		                <a data-wysihtml5-command="insertImage" class="image">Insertar<br>Imagen</a> \
	                <a class="code">Insertar<br>C&oacute;digo</a> \
		            </div> \
		    		 \
		            <div class="clear"></div> \
		    		 \
		            <div class="bar link-bar" data-wysihtml5-dialog="createLink" style="display: none;"> \
		                <input data-wysihtml5-dialog-field="href" value="http://" class="text"> \
		                <a class="save" data-wysihtml5-dialog-action="save">Insertar enlace</a> \
		                <a class="cancel" data-wysihtml5-dialog-action="cancel">X</a> \
		            </div> \
		    		 \
		            <div class="bar image-bar" data-wysihtml5-dialog="insertImage" style="display: none;"> \
		                <input data-wysihtml5-dialog-field="src" value="http://"> \
		                <a class="save" data-wysihtml5-dialog-action="save">Insertar imagen</a> \
		                <a class="cancel" data-wysihtml5-dialog-action="cancel">X</a> \
		            </div> \
		        </div> \
		';
	};


	wysihtml5ParserRules = {
		tags: {
			a: {
				check_attributes: {
					href: 'url'
				},
				'set_attributes': {
					rel: 'nofollow',
					target: '_blank'
				}
			},
			b: {
				rename_tag: 'strong'
			},
			br: 1,
			em: 1,
			i: {
				rename_tag: 'em'
			},
			img: {
				check_attributes: {
					alt: 'alt',
					height: 'numbers',
					src: 'url',
					width: 'numbers'
				}
			},
			pre: {
				'set_attributes': {
					class: 'prettyprint'
				}
			},
			strong: 1
		}
	};

	$.mejorandola_editor = {};
	$.mejorandola_editor.defaults = {
		parserRules:  wysihtml5ParserRules,
		stylesheets: '/static_c/css/plataforma-editor-wysihtml5.css?v=1.1'
	}

	$.fn.mejorandola_editor = function(options) {
		return this.each(function(){
			// get the current textarea
			var textarea = this,
			    $textarea = $(textarea),

			    // create new editor html with toolbar and wrapping div
			    html = editor_html(),

			    opt = {
			    	classname: $textarea.attr('class'),
			    	id: $textarea.attr('id'),
			    	name: $textarea.attr('name'),
			        placeholder: $textarea.attr('placeholder')
			    },

			    uid = _.uniqueId('textarea_'),
			    o = $.extend({}, {
			        classname: '',
			        id: uid,
			        name: uid,
			        placeholder: 'Insertar texto..'
			    }, opt);

			o.classname += ' mejorandola-editor';

			$textarea
				.attr({
					id: o.id,
					placeholder: o.placeholder,
					name: o.name,
					'class': o.classname
				})
				.wrap('<div class="editor-container"></div>')
				// .before(html);

			var $toolbar = $(html).insertBefore($textarea);
			$toolbar.on('click', 'a.code', function(e){
				e.preventDefault();
				
				editor.composer.commands.exec('formatBlock', 'pre');
				
				var iframe = editor.composer.iframe;
				var iframe_doc = (iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document);
				var $body = $(iframe_doc.body);

				// if last child is a <pre> add a breakline
				if ($body.children().last().is('pre'))
					$body.append('<br>');
			});

			// extending options
			var o = $.extend($.mejorandola_editor.defaults, {
				toolbar: $textarea.parent().find('.toolbar')[0]
			}, options);
			
			// instance the editor
			var editor = new wysihtml5.Editor($textarea[0], o);

			// save the editor variable in case we need it on another event
			$textarea.data('editor', editor);

			// trigger a callback after the editor has fully loaded
			editor.observe('load', function(){
				var editor = this;
				
				// autoresize the height of the editor if the text is longer than the current editor's height
				$(editor.composer.iframe).autoResize();

				// replace tab key with 4 spaces if caret is inside a tag <pre>
				wysihtml5.dom.observe(editor.composer.element, 'keydown', function(e){
					var TAB_KEY = 9;
					if (e.which !== TAB_KEY)
						return;

					if (editor.composer.selection.getSelectedNode().parentNode.nodeName !== 'PRE')
						return;

					e.preventDefault();
					editor.composer.commands.exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
					editor.composer.commands.exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
					
				});
			});
		});
	};

})(jQuery);