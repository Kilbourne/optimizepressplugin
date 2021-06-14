<?php
class OptimizePress_Blog_Promotion_Module extends OptimizePress_Modules_Base {
	
	function display($section_name = '', $return = false, $add_to_config = array()){
		$promotion = op_default_option('promotion');
		if(($this->get_option('promotion','enabled') == 'Y' && ($url = $this->get_option('promotion','aff_url')) && !empty($url))){
			echo '<p class="op-promote"><a href="'.$url.'" target="_blank">'.__('Powered by OptimizePress 2.0', 'optimizepress').'</a></p>';
		} else {
			$promotion = op_default_option('promotion');
			if (isset($promotion['enabled']) && $promotion['enabled'] == 'Y' && ($url = $promotion['aff_url']) && !empty($url)) {
				echo '<p class="op-promote"><a href="'.$url.'" target="_blank">'.__('Powered by OptimizePress 2.0', 'optimizepress').'</a></p>';
			}
		}
	}

	function display_settings($section_name,$config=array(),$return=false){ 
		$option = $this->default_option('promotion');
		if(!is_array($option) || !isset($option['aff_url'])){
			$url = 'http://www.optimizepress.com/';
		} else{
			$url = $option['aff_url'];
		}
	?>
    <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
		<label for="op_promotion_aff_url" class="form-title"><?php _e('Affiliate URL', 'optimizepress') ?></label>
		<p class="op-micro-copy"><?php printf(__('Enter your OptimizePress affiliate URL here. This will link to the "Powered by OptimizePress " message in the footer. To promote OptimizePress join at %1$shttp://www.optimizepress.com/affiliates%2$s. ; Leave blank to remove "Powered by…" message.', 'optimizepress'),'<a href="http://www.optimizepress.com/affiliates" target="_blank">','</a>') ?></p>
		<input type="text" id="op_promotion_aff_url" name="op[promotion][aff_url]" value="<?php echo $url ?>" />
    </div>
    <?php	
	}
	
	function save_settings($section_name,$config=array(),$op){
		$promotion = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'aff_url' => op_get_var($op,'aff_url')
		);
		$this->update_option('promotion',$promotion);
	}
}