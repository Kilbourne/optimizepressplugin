<?php
class OptimizePress_Page_Exit_Redirect_Module extends OptimizePress_Modules_Base {

    function __construct($config=array()){
        parent::__construct($config);
        if($this->is_enabled('exit_redirect')){
            add_action('wp_enqueue_scripts',array($this,'print_scripts'));
            add_filter(OP_SN.'-script-localize',array($this,'localize_script'));
        }
    }

    function print_scripts(){
        !defined('OP_LIVEEDITOR') && wp_enqueue_script(OP_SN.'-module-exit-redirect', $this->url.'exit_redirect'.OP_SCRIPT_DEBUG.'.js', array(OP_SCRIPT_BASE), OP_VERSION);
    }

    function localize_script($data=array()){
        if(!defined('OP_LIVEEDITOR')){
            $options = op_get_var($this->_options,'op_exit_redirect_',array());
            $data['exit_redirect_message'] = str_replace('\"', '"', op_get_var($options,'message'));
            $data['exit_redirect_url'] = op_get_var($options,'url');
        }
        return $data;
    }

    function display_settings($section_name,$config=array(),$return=false){
        $data = array(
            'fieldid' => $this->get_fieldid($section_name),
            'fieldname' => $this->get_fieldname($section_name),
            'section_name' => $section_name,
        );
        $out = $this->load_tpl('settings',$data);
        if($return){
            return $out;
        }
        echo $out;
    }

    function save_settings($section_name,$config=array(),$op,$return=false){
        $data = array(
            'enabled' => op_get_var($op,'enabled','N'),
            'url' => op_get_var($op,'url'),
            'message' => addslashes(stripslashes(op_get_var($op,'message')))
        );
        if($return){
            return $data;
        }
        $this->update_option($section_name,$data);
    }
}
?>