<?php
class OptimizePress_Blog_Autosave_Module extends OptimizePress_Modules_Base {

    function __construct($config = array())
    {
        parent::__construct($config);
        // if first time, enable autosave by default
        $autosaveOption = unserialize(get_option(OP_SN . '_autosave'));
        if (empty($autosaveOption)) {
            $autosave['enabled'] = 'Y';
            $this->update_option('autosave', $autosave);
        }
    }
	
	function display($section_name = '', $return = false, $add_to_config = array()){
		/**/
	}

	function display_settings($section_name,$config=array(),$return=false){ 
		/**/
	?>
    <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
		<p class="op-micro-copy"><?php _e('Use this option to turn off the autosave feature inside the LiveEditor. This is <strong>NOT recommended</strong> and is for advanced users only. Turning off this feature will prevent your pages being saved automatically, so please use caution as your pages will <strong>not be saved unless you save them manually</strong>. Page revisions will only be created when you manually save if autosave is off.', 'optimizepress') ?></p>
    </div>
    <?php	
	}
	
	function save_settings($section_name,$config=array(),$op){
		$autosave = array(
			'enabled' => op_get_var($op,'enabled','N')
		);
		$this->update_option('autosave',$autosave);
	}
}