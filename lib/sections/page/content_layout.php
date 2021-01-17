<?php
class OptimizePress_Sections_Content_Layout {
	
	// Get the list of step 4 sections these can be overridden by the theme using the 'op_edit_sections_modules' filter
	function sections(){
		static $sections;
		if(!isset($sections)){
			$section_names = array(
				'content_layout' => 'Pre-Made Content Layouts',
			);
			$sections = array();
			foreach($section_names as $name => $title){
				if(!(op_page_config('disable','content_layout',$name) === true)){
					$sections[$name] = array('title' => __($title,OP_SN), 'on_off' => false);
					$func = array($this,$name);
					if(is_callable($func)){
						$sections[$name]['action'] = $func;
					}
					$func = array($this,'save_'.$name);
					if(is_callable($func)){
						$sections[$name]['save_action'] = $func;
					}
				}
			}
			$sections = apply_filters('op_edit_sections_page_content_layout',$sections);
		}
		return $sections;
	}
	
	function content_layout(){
		global $wpdb;
		$has_layout = false;
		if($current = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM `{$wpdb->prefix}optimizepress_post_layouts` WHERE `type`='body' AND `post_id`=%d",OP_PAGEBUILDER_ID))){
			if($current > 0){
				$has_layout = true;
			}
		}
		$results = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_predefined_layouts` ORDER BY id DESC");
		$data = array('has_layout'=>$has_layout);
		$previews = array();
		if($results){
			$count = 0;
			foreach($results as $result){
				$li_class = $input_attr = '';
				$selected = false;
				$previews[] = array(
					'image' => OP_IMG.'content_layouts/'.$result->id.'.'.$result->preview_ext,
					'width' => 212,
					'height' => 156,
					'preview_content' => $result->name,
					'input' => '<input type="radio" id="op_content_layout_'.$result->id.'" name="op[content_layout]" value="'.$result->id.'"'.$input_attr.' />',
					'li_class' => $li_class
				);
				$count++;
			}
		}
		$data['previews'] = $previews;
		/*
		global $wpdb;
		$results = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_predefined_layouts` ORDER BY id DESC");
		$data = array();
		if($results){
			$html = '';
			foreach($results as $result){
				$id = 'op_content_layout_layouts_option_'.$result->id;
				$html .= '<li><input type="radio" name="op[content_layout][option]" id="'.$id.'" value="'.$result->id.'" /><label for="'.$id.'">'.$result->name.'</label><p class="preview-layout"><a href="'.OP_IMG.'content_layouts/'.$result->id.'.'.$result->preview_ext.'" target="_blank">'.__('Preview').'</a></p></li>';
			}
			$data['layout_list'] = $html;
		}*/
		echo op_load_section('content_layout/layouts',$data,'page');
	}
	
	function save_content_layout($op){
		global $wpdb;
		$layout = op_get_var($op,'option');
		if($layout == 'current'){
			return;
		}
		$content_layout = array();
		if($layout != 'blank'){
			if($result = $wpdb->get_var($wpdb->prepare("SELECT layout FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE id=%d",$layout))){
				$content_layout = unserialize(base64_decode($result));
			}
		}
		op_page_update_layout($content_layout,'body');
	}
}