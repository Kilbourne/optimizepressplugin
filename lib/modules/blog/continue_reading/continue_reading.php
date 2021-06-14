<?php
class OptimizePress_Blog_Continue_Reading_Module extends OptimizePress_Modules_Base {
	
	function __construct($config=array()){
		parent::__construct($config);
		add_filter( 'get_the_excerpt', array($this, 'display'));
	}
	
	function display($section_name, $return = false, $add_to_config = array()){
		$section_name .= '</p><p class="continue-reading"><a href="'. esc_url( get_permalink() ) .'">'.op_default_option('continue_reading','link_text').'</a></p>';
		return $section_name;
	}
	
	function display_settings($section_name,$config=array(),$return=false){ ?>
    <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
		<label for="op_<?php echo $section_name ?>_link_text" class="form-title"><?php _e('Link text', 'optimizepress') ?></label>
		<p class="op-micro-copy"><?php _e('Enter the Continue Reading link text for your blog.  To add arrows to your link use &amp;rarr;', 'optimizepress') ?></p>
		<input type="text" id="op_<?php echo $section_name ?>_link_text" name="op[<?php echo $section_name ?>][link_text]" value="<?php echo op_default_attr($section_name,'link_text') ?>" />
    </div>
    <?php	
	}
	
	function save_settings($section_name,$config=array(),$op){
		$this->update_option($section_name,'link_text',$op['link_text']);
	}
}