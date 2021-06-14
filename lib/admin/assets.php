<?php
class OptimizePress_Admin_Assets {

    function __construct(){
        if(defined('OP_POST_PAGE') && OP_POST_PAGE === true){
            add_action('admin_init',array($this,'init'));
            add_filter(OP_SN.'-script-localize',array($this,'localize'));
        }
        if(defined('OP_LIVEEDITOR')){
            $this->liveeditor_init();
            add_filter(OP_SN.'-script-localize',array($this,'localize'));
        }
    }

    function init(){
        add_action('admin_print_styles', array($this,'print_scripts'));
        add_action('admin_footer', array($this,'dialog_output'));
        add_action('media_buttons',array($this,'media_button'));
    }

    function liveeditor_init(){
        add_action('wp_print_styles', array($this,'print_scripts'));
        add_action('admin_footer', array($this,'dialog_output'));
        add_action('media_buttons',array($this,'media_button'));
    }

    function media_button(){
        echo (!(isset($GLOBALS['op_disable_asset_link']) && $GLOBALS['op_disable_asset_link'] === true) ? '
            <a onclick="return false;" title="'.esc_attr__('Add Element', 'optimizepress').'" href="#"  class="button add-op-element op-insert-asset">
                <span class="op-element-buttons-icon"></span>Add Element
            </a>
        ' : '');
    }

    function add_language($lang_array){
        $mce_locale = ( '' == get_locale() ) ? 'en' : strtolower( substr(get_locale(), 0, 2) );
        $lang_array['OptimizePressAssets'] = OP_JS_PATH.'assets/langs/'. $mce_locale . '.php';
        return $lang_array;
    }

    function add_plugin($plugin_array){
        $plugin_array['OptimizePressAssets'] = OP_JS.'assets/plugin.js';
        return $plugin_array;
    }

    function register_plugin($buttons){
        array_push($buttons, 'separator', 'optimizepress_assets_button');
        return $buttons;
    }

    function print_scripts(){
        wp_enqueue_style(OP_SN.'-admin-assets',  OP_CSS.'assets'.OP_SCRIPT_DEBUG.'.css', array(OP_SN.'-admin-common'), OP_VERSION);

        op_enqueue_backend_scripts();
        op_enqueue_fancybox_images();
    }

    function localize($js){
        $js = array_merge($js,array(
            'core_assets_url' => OP_JS.'assets/core/',
            'addon_assets_url' => OP_ASSETS_URL.'addon/',
            'theme_assets_url' => (defined('OP_THEME_URL')?OP_THEME_URL.'assets/':(defined('OP_PAGE_URL')?OP_PAGE_URL.'assets/':''))
        ));
        return $js;
    }

    function dialog_output(){
        echo op_tpl('assets/dialog');
    }

}
new OptimizePress_Admin_Assets();