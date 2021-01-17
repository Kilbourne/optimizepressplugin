;(function($){
	$(document).ready(function(){
		$('.module-video .video-url').each(function(){
			new OP_Video(this);
		});/*.change(function(){
			var preview = $(this).closest('div').find('.video-preview');
			preview.css('background-image',"url('wspin_light.gif')").filter(':not(:visible)').fadeIn('fast');
			var url = $(this).val(), u = url.replace(/https?:\/\/(www.)?/,'');
			try {
				if(u.indexOf('youtube.com') > -1){
					add_youtube(preview,url,u.split('/')[1].split('v=')[1].split('&')[0]);
				} else if(u.indexOf('youtu.be') > -1){
					add_youtube(preview,url,u.split('/')[1]);
				} else {
					var tests = [[/^vimeo.com\/[0-9]+/,'/',1],[/^vimeo.com\/channels\/[\d\w]+#[0-9]+/,'#',1],[/vimeo.com\/groups\/[\d\w]+\/videos\/[0-9]+/,'/',4]], found = false;
					for(var i=0;i<3;i++){
						if(u.match(tests[i][0])){
							found = true;
							add_vimeo(preview,url,u.split(tests[i][1])[tests[i][2]]);
							break;
						}
					}
				}
			} catch(e){

			}
		});*/
	});
	var OP_Video = function(input){
		var self = this,
			el = $(input),
			parent = el.closest('div');

		el.data('preview',parent.find('.video-preview')).data('hidden_elems',parent.find('.hidden-inputs')).change(function(){
			var $t = $(this),
				url = $t.val(),
				u = url.replace(/https?:\/\/(www.)?/,''),
				preview = $t.data('preview');
			preview.html('').fadeIn('fast');
			try {
				if(u.indexOf('youtube.com') > -1){
					self.add_youtube(url,u.split('/')[1].split('v=')[1].split('&')[0]);
				} else if(u.indexOf('youtu.be') > -1){
					self.add_youtube(url,u.split('/')[1]);
				} else {
					var tests = [[/^vimeo.com\/[0-9]+/,'/',1],[/^vimeo.com\/channels\/[\d\w]+#[0-9]+/,'#',1],[/vimeo.com\/groups\/[\d\w]+\/videos\/[0-9]+/,'/',4]], found = false;
					for(var i=0;i<3;i++){
						if(u.match(tests[i][0])){
							found = true;
							self.add_vimeo(url,u.split(tests[i][1])[tests[i][2]]);
							break;
						}
					}
					if(found === false){
						preview.fadeOut('fast');
					}
				}
			} catch(e){
				preview.fadeOut('fast');
			}
		});

		this.add_vimeo = function(url, id){
			$.ajax({
				url:'http://vimeo.com/api/v2/video/'+id+'.json',
				dataType:'jsonp',
				success:function(resp){
					var video = {image:resp[0].thumbnail_large,embed:'http://player.vimeo.com/video/'+id,width:resp[0].width,height:resp[0].height};
					$.extend(video,get_new_size(resp[0].width,resp[0].height,400,220));
					self.set_preview(video.image,video.thumb_w,video.thumb_h);
					self.update_fields(video);
				}
			});
		};

		this.add_youtube = function(url, id){
			var video = {image:'http://i2.ytimg.com/vi/'+id+'/hqdefault.jpg',embed:'http://www.youtube.com/embed/'+id+'?wmode=opaque',width:'640',height:'390'};
			$.extend(video,get_new_size(640,390,400,220));
			self.set_preview(video.image,video.thumb_w,video.thumb_h);
			self.update_fields(video);
		};

		this.set_preview = function(image,w,h){
			var tmp = new Image();
			tmp.src = image;
			if(tmp.complete){
				self.set_real_image(tmp,w,h);
			} else {
				$(tmp).load(function(){
					self.set_real_image(tmp,w,h);
				});
			}
		};

		this.set_real_image = function(tmp_img,w,h){
			el.data('preview').html('<img src="'+tmp_img.src+'" alt="" border="0" height="'+h+'" width="'+w+'" />');
		};

		this.update_fields = function(video){
			var hidden = el.data('hidden_elems');
			$.each(video,function(i,v){
				hidden.find('.video-'+i).val(v);
			});
		}
	};
	function get_new_size(width,height,new_w,new_h){
		var thumb = {},
			x = new_w / width,
			y = new_h / height;
		if(width <= new_w){
			thumb = {thumb_w:width,thumb_h:height};
		} else if(new_h > 0 && (x*height < new_h)){
			thumb = {thumb_w:new_w,thumb_h:Math.ceil(x*height)};
		} else {
			thumb = {thumb_w:Math.ceil(y*width),thumb_h:new_h};
		}
		return thumb;
	};
	/*
	function add_youtube(el,url,id){
		video = {url:url,image:'http://i2.ytimg.com/vi/'+id+'/hqdefault.jpg',embed:'http://www.youtube.com/v/'+id,width:'640',height:'390'};
		set_preview(el,video.image);
	};
	function add_vimeo(el,url,id){
		$.ajax({
			url:'http://vimeo.com/api/v2/video/'+id+'.json',
			dataType:'jsonp',
			success:function(resp){
				video = {url:url,image:resp[0].thumbnail_large,embed:'http://player.vimeo.com/video/'+id,width:resp[0].width,height:resp[0].height};
				set_preview(el,video.image);
			}
		});
	};
	function set_preview(el,image){
		var tmp = new Image();
		tmp.src = image;
		if(tmp.complete){
			set_real_image(el,tmp);
		} else {
			$(tmp).load(function(){
				set_real_image(el,tmp);
			});
		}
	};
	function set_real_image(el,img){
		el.css('background-image',"url('"+img.src+"')");
	};*/
})(opjq);