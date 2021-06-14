<?php
class OptimizePress_Admin_Post_Page {

	var $tpls = array();

	function __construct(){
		add_action('admin_init',array($this,'init_admin'));
	}

	function init_admin(){
		$this->tpls = op_theme_config('post_layouts');
		$tpls = array(
			'no-sidebar' => 'no-sidebar.php',
			'sidebar-left' => 'left-sidebar.php',
			'sidebar-right' => 'right-sidebar.php',
		);
		$this->tpls = apply_filters('op_page_template_options',$tpls);
		if($this->tpls && count($this->tpls) > 0){
			add_action(OP_SN.'-post_page-metas', array($this,'page_template'));
			add_action('pre_post_update',array($this,'save_page_template'));
		}
		add_action('admin_print_styles', array($this,'print_scripts'));
		add_action('edit_page_form', array($this,'build_layout'));
		add_action('edit_form_advanced', array($this,'build_layout'));
		//add_action('admin_footer', array($this,'iframe_output'));
	}

	function build_layout(){
		global $post;
		$pb = ('Y' === get_post_meta($post->ID,'_'.OP_SN.'_pagebuilder',true));
		if (OP_TYPE === 'theme' || true === $pb) {
			echo op_tpl('post_page/index', array('pb' => $pb));
		}
	}

	function iframe_output(){
		echo '<div id="op_preview_container"><iframe frameborder="0" style="width: 940px; height: 600px;" name="op_preview_iframe" id="op_preview_iframe" src="about:blank" hspace="0"></iframe></div>';
	}

	function print_scripts(){
		wp_enqueue_script(OP_SN.'-post-page', OP_JS.'post_page'.OP_SCRIPT_DEBUG.'.js', array(OP_SCRIPT_BASE, 'autosave'), OP_VERSION);
		op_print_scripts('post_page');
	}


	function page_template($post){
		$id = 'op_page_tpl_';
		$cur_tpl = get_post_meta($post->ID,'_op_page_template',true);
		wp_nonce_field( 'op_page_template', 'op_page_template');

		if($cur_tpl == ''){
			$cur_tpl = op_default_attr('column_layout','option');
		}
		$previews = array();
		foreach($this->tpls as $name => $tpl){
			$li_class = $input_attr = $image = '';
			$width = 152; $height = 115;
			if(is_array($tpl)){
				extract($tpl);
			}
			if($cur_tpl == $name){
				$li_class = 'img-radio-selected';
				$input_attr = ' checked="checked"';
			}
			$preview = array(
				'width' => $width,
				'height' => $height,
				'li_class' => $li_class,
				'input' => '<input type="radio" id="op_page_tpl_file_'.$name.'" name="op_page_tpl_file" value="'.$name.'"'.$input_attr.' />',
				'image' => (empty($image) ? OP_IMG.$name.'.jpg' : $image)
			);
			$previews[] = $preview;
		}
		echo '
		<div id="op-meta-page-template">
			<h4>'.__('Page Template Options', 'optimizepress').'</h4><p class="op-micro-copy">'.__('Select the template style for your page/post', 'optimizepress').op_tpl('generic/img_radio_selector',array('previews'=>$previews)).'
		</div>';
	}

	function save_page_template($post_id){
		if(!op_can_edit_page($post_id) || !isset($_POST['op_page_template']) || !wp_verify_nonce( $_POST['op_page_template'], 'op_page_template' ) ){
			return;
		}
		$remove = true;
		$cur_tpl = op_default_attr('column_layout','option');
		if($tpl = op_post('op_page_tpl_file')){
			if($cur_tpl != $tpl){
				update_post_meta($post_id, '_op_page_template', $tpl);
				$remove = false;
			}
		}
		if($remove){
			delete_post_meta($post_id,'_op_page_template');
		}
	}
}
new OptimizePress_Admin_Post_Page();