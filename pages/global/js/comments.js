;(function($){
	$(document).ready(function(){
		$('#comments .tabs a').click(function(e){
			var hash = $(this).attr('href').split('#'), li = $(this).parent();
			li.parent().find('.selected').removeClass('selected').end().end().addClass('selected').closest('#comments').find('.tab-content').hide().end().find('.'+hash[1]+'-panel.tab-content').show();
			e.preventDefault();
		});
	});
}(opjq));