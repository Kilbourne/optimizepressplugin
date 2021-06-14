<?php
class OptimizePress_Blog_Scripts_Module extends OptimizePress_Modules_Base {

    function __construct($config=array()){
        parent::__construct($config);
        add_action('wp_head',array($this,'load_header_scripts'), 1);
        add_action('wp_head',array($this,'load_css_scripts'),20);
        add_action('wp_footer',array($this,'load_footer_scripts'));
        add_action('admin_init',array($this,'add_meta_boxes'));
        add_action('op_in_body_after', array($this, 'load_in_body_tag_scripts'));

        $this->add_meta_boxes();
    }

    function add_meta_boxes(){
        add_action(OP_SN.'-post_page-metas', array($this,'meta_box'));
        add_action('save_post', array($this,'save_meta_box'));
    }

    function meta_box($post){
        $id = 'op_scripts_';
        $name = 'op[scripts]';
        $items = maybe_unserialize(get_post_meta($post->ID, '_' . OP_SN.'_scripts',true));
        $items = is_array($items) ? $items : array();
        if(count($items) == 0){
            $items[] = array(
                'position' => 'header',
                'script' => '',
            );
        }
        wp_nonce_field( 'op_scripts_meta_box', 'op_scripts_meta_box');
        $content = '
        <div id="op-meta-scripts">
            <h4>'.__('Other Scripts', 'optimizepress').'</h4>
            <p class="op-micro-copy">'.__('Add other scripts to your website, this is great for things like Google Analytics', 'optimizepress').'</p>
            <p class="op-micro-copy">'.__('Code added here will not be rendered to pages in the LiveEditor so you will not see changes until you publish your page and view it live online', 'optimizepress').'</p>
            <div class="op-multirow">
                <ul class="op-multirow-list">';
            foreach($items as $item): $header = ($item['position'] == 'header');
                $content .= '
                    <li>
                        <select name="'.$name.'[position][]">
                            <option value="header"'.selected('header', $item['position'], false).'>'.__('Header', 'optimizepress').'</option>
                            <option value="in_body_tag"'.selected('in_body_tag', $item['position'], false).'>'.__('After &lt;body&gt; tag', 'optimizepress').'</option>
                            <option value="footer"'.selected('footer', $item['position'], false).'>'.__('Footer', 'optimizepress').'</option>
                            <option value="css"'.selected('css', $item['position'], false).'>'.__('Custom CSS', 'optimizepress').'</option>
                        </select>
                        <textarea name="'.$name.'[script][]" cols="40" rows="5">'.stripslashes(op_attr($item['script'])).'</textarea>
                        <div class="op-multirow-controls">
                            <a href="#move-up">'.__('Move Up', 'optimizepress').'</a> | <a href="#move-down">'.__('Move Down', 'optimizepress').'</a> | <a href="#remove">'.__('Remove', 'optimizepress').'</a>
                        </div>
                    </li>';
            endforeach;
            $content .= '
                </ul>
                <div class="clear"></div>
                <a href="#" class="add-new-row">'.__('Add New', 'optimizepress').'</a>
            </div>
        </div>';
        echo $content;
    }

    function save_meta_box($post_id){
        // if(!op_can_edit_page($post_id) || !isset($_POST['op_scripts_meta_box']) || !wp_verify_nonce( $_POST['op_scripts_meta_box'], 'op_scripts_meta_box' ) ){
        //  return;
        // }
        if($op = op_post('op', 'scripts')){
            $positions = op_get_var($op,'position',array());
            $scripts = array();
            for($i=0,$iteml=count($positions);$i<$iteml;$i++){
                $scripts[] = array(
                    'position' => $positions[$i],
                    'script' => stripslashes($op['script'][$i])
                );
            }
            if(count($scripts) > 0){
                update_post_meta($post_id, '_' . OP_SN.'_scripts', $scripts);
            } else {
                delete_post_meta($post_id, '_' . OP_SN.'_scripts');
            }
        }
    }

    function display_settings($section_name,$config=array(),$return=false){
        if(($items = $this->get_option($section_name)) === false){
            $items = array();
        }
        $items = is_array($items) ? $items : array();
        $custom_css = op_default_option('custom_css');
        if(count($items) == 0){
            if (empty($custom_css)) $items[] = array('position' => 'header', 'script' => ''); else $items[] = array('position' => 'css', 'script' => $custom_css);
        }
        ?>
<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
    <div class="entry-content">
        <p><?php _e('Add any scripts, code or CSS to this page. If you are using external scripts, ensure you use the Header/Footer dropdown to place them in the correct position in the page code.', 'optimizepress') ?></p>
        <p><?php _e('Code added here will not be rendered to pages in the LiveEditor so you will not see changes until you publish your page and view it live online.', 'optimizepress') ?></p>
        <?php
        $id = 'op_'.$section_name.'_';
        $name = 'op['.$section_name.']';
        ?>
        <div class="op-multirow">
            <ul class="op-multirow-list">
            <?php foreach($items as $item): ?>
                <li>
                    <select name="<?php echo $name  ?>[position][]">
                        <option value="header"<?php selected('header', $item['position']); ?>><?php _e('Header', 'optimizepress') ?></option>
                        <option value="in_body_tag"<?php selected('in_body_tag', $item['position']); ?>><?php _e('After &lt;body&gt; tag', 'optimizepress'); ?></option>
                        <option value="footer"<?php selected('footer', $item['position']); ?>><?php _e('Footer', 'optimizepress') ?></option>
                        <option value="css"<?php selected('css', $item['position']); ?>><?php _e('Custom CSS', 'optimizepress') ?></option>
                    </select>
                    <textarea name="<?php echo $name ?>[script][]" cols="40" rows="5"><?php echo  stripslashes($this->isBase64Encoded(op_attr($item['script']))); ?></textarea>
                    <div class="op-multirow-controls">
                        <a href="#move-up"><?php _e('Move Up', 'optimizepress') ?></a> | <a href="#move-down"><?php _e('Move Down', 'optimizepress') ?></a> | <a href="#remove"><?php _e('Remove', 'optimizepress') ?></a>
                    </div>
                </li>
            <?php endforeach ?>
            </ul>
            <div class="clear"></div>
            <a href="#" class="add-new-row add-new-row--noicon"><?php _e('Add New', 'optimizepress') ?></a>
        </div>
    </div>
</div>
    <?php

    }

    function save_settings($section_name,$config=array(),$op){
        $positions = op_get_var($op,'position',array());
        $scripts = array();
        for($i=0,$iteml=count($positions);$i<$iteml;$i++){
            $scripts[] = array(
                'position' => $positions[$i],
                'script' => stripslashes(base64_encode($op['script'][$i]))
            );
        }
        $this->update_option($section_name,$scripts);
    }

    function _load_scripts($type){
        static $scripts = array('header'=>array(), 'in_body_tag' => array(), 'footer'=>array(), 'css'=>array());
        static $checked;
        if(!isset($checked)){
            if($tmp_scripts = $this->get_option('scripts')){
                $tmp_scripts = is_array($tmp_scripts) ? $tmp_scripts : array();
                foreach($tmp_scripts as $script){
                    if(!empty($script['script'])){
                        if (defined('OP_LIVEEDITOR') && $script['position'] != 'css') {
                            continue;
                        }
                        $scripts[$script['position']][] =  stripslashes($this->isBase64Encoded($script['script']));
                    }
                }
            }

            if(is_single() || is_page() /*|| (defined('OP_LIVEEDITOR') && OP_LIVEEDITOR === true)*/){
                if (defined('OP_PAGEBUILDER_ID')) {
                    $page_scripts = get_post_meta(OP_PAGEBUILDER_ID, '_' . OP_SN . '_scripts', true);
                } else {
                    $page_scripts = get_post_meta(get_queried_object_id(), '_' . OP_SN . '_scripts', true);
                }
                $page_scripts = is_array($page_scripts) ? $page_scripts : array();
                //die(print_r($page_scripts));
                foreach($page_scripts as $script){
                    if(!empty($script['script'])){
                        $scripts[$script['position']][] = stripslashes($this->isBase64Encoded($script['script']));
                    }
                }
            }
            $checked = true;
        }
        if($type == 'css' && count($scripts[$type]) > 0){
            $str = '';
            foreach($scripts[$type] as $css){
                $str .= '<style type="text/css">' . $css . '</style>';
            }
            return stripslashes($str);
        }
        return implode("\n",$scripts[$type]);
    }

    /**
     * Checks if string is base64 encoded
     * @param string $string
     * @return boolean
     */
    function isBase64Encoded($string)
    {
        if (base64_encode($return = base64_decode($string)) === $string){
            return $return;
        }

        return $string;
    }

    function load_header_scripts(){
        echo do_shortcode($this->_load_scripts('header'));
    }

    function load_footer_scripts(){
        echo do_shortcode($this->_load_scripts('footer'));
    }

    function load_css_scripts(){
        echo $this->_load_scripts('css');
    }

    /**
     * Outputs "in_body_tag" script
     *
     * @author OptimizePress <info@optimizepress.com>
     * @since  2.1.4
     * @return void
     */
    function load_in_body_tag_scripts()
    {
        $code = $this->_load_scripts('in_body_tag');
        if (!empty($code)) {
            echo $code . "\n";
        }
    }
}