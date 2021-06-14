<?php
class OptimizePress_Blog_Related_Posts_Module extends OptimizePress_Modules_Base {

	function display_settings($section_name,$config=array(),$return=false){
			
	}
	
	function save_settings($section_name,$config=array(),$op){
		$this->update_option($section_name,'enabled',op_get_var($op,'enabled','N'));
	}
	
	function output($section_name,$config,$op,$return=false){
		global $post;
		$defaults = array(
			'before' => '', 'after' => '', 'ulclass' => '', 'post_id' => 0,
		);
		$config = wp_parse_args($config,$defaults);
		extract($config);
		$ulclass = $ulclass == '' ? '' : ' class="'.$ulclass.'"';
		
		$post_id = $post_id > 0 ? $post_id : $post->ID;
		
		
		if($post_tags = get_the_tags($post_id)){
			$tmp_post = $post;
			$tags = array();
			foreach($post_tags as $tag){
				$tags[] = $tag->term_id;
			}
			$related_posts = get_posts(array(
				'tag__in' => $tags,
				'numberposts' => 4,
				'exclude' => $post_id
			));
			$html = '';
			foreach($related_posts as $related){
				if($related->ID == $post_id){
					continue;
				}
				$url = get_permalink($related->ID);
				$cn = get_comments_number($related->ID);
				$title = get_the_title($related->ID);
				$comments = sprintf(_n('1 Comment','%1$s Comments',$cn, 'optimizepress'), number_format_i18n( $cn ));
				$atag = ' href="'.$url.'" rel="bookmark" title="'.sprintf( esc_attr__( 'Permalink to %s', 'optimizepress'), esc_attr($title) ).'"';
				$img = '';
				$class = '';
				if(has_post_thumbnail($related->ID)){
					$img = '<a'.$atag.' class="thumbnail">'.get_the_post_thumbnail($related->ID,'small-image').'</a>';
				} else {
					$class = ' class="no-thumbnail"';
				}
				$html .= '<li'.$class.'>'.$img.'<h4><a'.$atag.'>'.op_truncate($title).'</a></h4><a href="'.get_comments_link($related->ID).'">'.$comments.'</a></li>';
			}
			if(!empty($html)){
				$html = $before.'<ul'.$ulclass.'>'.$html.'</ul>'.$after;
			}
			$post = $tmp_post;
			if($return){
				return $html;
			}
			echo $html;
		}
	}	
}