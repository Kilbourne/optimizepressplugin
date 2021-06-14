;(function($){
	var loaded = false;
	$(document).ready(function(){
		$('.img-radio-selector.menu-position :radio').change(function(){
			var $t = $(this), func = 'hide';
			if(typeof op_menu_link_colors != 'undefined' && typeof op_menu_link_colors[$t.val()] != 'undefined'){
				func = 'show';
			}
			$t.closest('.op-bsw-grey-panel-content').find('.link-color-container')[func]();
		});
		$('.img-radio-selector.footer-columns :radio').change(function(){
			var $t = $(this), v = $t.val(), cont = $t.closest('.op-bsw-grey-panel-content').find('.column-container');
			if($t.is(':checked')){
				if(v > 1){
					cont.show();
					cont = cont.find('.column-editor');
					cont.find('p').hide();
					v++;
					for(var i=1;i<v;i++){
						cont.find('p.width-'+i).show();
					}
				} else {
					cont.hide();
				}
			}
		});
		init_color_schemes();
		init_layout_options();
		loaded = true;
	});
	function init_color_schemes(){
		if(typeof op_color_schemes !== 'undefined'){
			$('.section-color_scheme .color-schemes .img-radio-item input[type="radio"]').change(function(){
				var scheme = op_color_schemes[$(this).val()].colors || {};
				$.each(scheme,function(key,val){
					var el = $('#op_sections_color_scheme_field_'+key);
					if((el.val() != '' && loaded) || el.val() == ''){
						el.val(val).trigger('change');
					}
				});
				//$('.section-color_scheme .color-options :input').trigger('change');
			}).filter(':checked').trigger('change');
		}
	};
	function init_layout_options(){
		var container = $('.column-container'),
			editor = $('.column-layout .column-editor');
		$('.column-layout :radio').change(function(){
			var layout = {}, v = $(this).val();
			if(typeof op_column_widths.widths[v] !== 'undefined'){
				container.show();
				layout = op_column_widths.widths[v];
				editor.find('p').hide();
				var last_el = null, el, func = 'prepend', el2, input;
				$.each(layout,function(i,v){
					el = editor.find('p.width-'+i);
					if(el.length == 0){
						if(last_el !== null){
							el2.after(width_field(i,v.title));
						} else {
							editor.prepend(width_field(i,v.title));
						}
					}
					last_el = i;
					el = editor.find('p.width-'+i);
					el2 = el;
					el.show();
					input = el.find(':input');
					if(input.val() == '' || loaded){
						input.val(v.width);
					}
				});
			} else {
				container.hide();
			}
		}).filter(':checked').trigger('change');
	};
	function width_field(classname,title){
		var fieldid = 'op_sections_column_layout_widths_'+classname;
		return '<p class="width-'+classname+'">'+
				'<label for="'+fieldid+'">'+title+'</label>'+
		    	'<input type="text" name="op[sections][column_layout][widths]['+classname+']" id="'+fieldid+'" />'+
			'</p>';
	};
}(opjq));