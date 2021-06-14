<?php
class OptimizePress_LiveEditor {

    var $cur_step;
    var $sections;
    var $error = false;
    var $notification = false;
    var $js = array('post_id'=>0);
    var $post;
    var $page_builder;

    function __construct(){
        add_action('wp_ajax_'.OP_SN.'-live-editor-parse', array($this, 'parse_shortcode'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-params', array($this, 'parse_params'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-export-layout', array($this, 'export_layout'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-deleted-exported-layout', array($this, 'delete_layout'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-update-feature', array($this, 'update_feature'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-save', array($this, 'save_page'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-typography', array($this, 'update_typography'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-load-layouts', array($this, 'load_content_layouts'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-get-layout', array($this, 'get_layout'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-create-category', array($this,'create_content_layout_category'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-save-preset', array($this,'save_preset'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-headers', array($this,'save_headers'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-colours', array($this,'save_colours'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-membership', array($this,'save_membership'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-load-product', array($this,'load_product'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-get-predefined-template', array($this, 'getPredefinedTemplate'));
        add_action('wp_ajax_'.OP_SN.'-live-editor-get-menu-item', array($this, 'get_menu_item'));
        add_action('wp_ajax_'.OP_SN.'-enable-post-comments', array($this, 'enable_post_comments'));
        add_action('wp_ajax_'.OP_SN.'-get-image-thumbnail', array($this, 'get_image_thumbnail'));
        add_action('wp_footer', array($this,'print_dialogs'),20);
        add_action('wp_enqueue_scripts', array($this,'print_scripts'));
        add_action('wp_head',array($this,'wp_head'));
        do_action('op_liveeditor_init');
    }

    /**
     * Reads predefined content template config from /lib/content_layout/predefined folder
     * Renders HTML output of that template and returns it
     * @author Zvonko Biškup <zbiskup@gmail.com>
     * @return string
     */
    public function getPredefinedTemplate()
    {
        if (!empty($_POST['template'])) {
            require_once(OP_LIB . 'content_layouts/predefined/'.$_POST['template'].'.php');
            $this->init_page();
            define('OP_AJAX_SHORTCODE',true);
            require_once OP_ASSETS.'live_editor.php';
            $html = op_page_generate_layout($config['layouts']);
            echo json_encode(array('output' => $html));
        } else {
            echo json_encode(array('output' => 'error'));
        }
        exit;
    }

    /**
     * @author OptimizePress <info@optimizepress.com>
     * @return string
     */
    public function get_menu_item()
    {
        define('GETTING_MENU_ITEM', true);
        $hash = $_POST['hash'];

        $this->init_page();

        switch ($hash) {

            // Content Templates
            case 'le-layouts-dialog':
                $content_dialogs = $this->load_content_layouts_preset_dialogs();
                echo $content_dialogs[0] . $content_dialogs[1];
                break;

            // Help
            case 'le-help-dialog':
                echo op_tpl('live_editor/help');
                break;

            // Layout Settings
            case 'le-headers-dialog':
                require_once OP_LIB.'sections/page/functionality.php';
                $object = new OptimizePress_Sections_Functionality();
                $object->sections();
                echo op_tpl('live_editor/headers');
                break;

            // Colour Scheme Settings
            case 'le-colours-dialog':
                echo op_tpl('live_editor/colours');
                break;

            // Typography Settings
            case 'le-typography-dialog':
                echo op_tpl('live_editor/typography');
                break;

            // Page Settings
            case 'le-settings-dialog':
                require_once OP_LIB.'sections/page/functionality.php';
                $object = new OptimizePress_Sections_Functionality();
                $GLOBALS['functionality_sections'] = $object->sections();
                echo op_tpl('live_editor/settings');
                break;

            // Membership Settings
            case 'le-membership-dialog':
                echo op_tpl('live_editor/membership');
                break;
        }

        exit;
    }


    function load_product()
    {
        if (!empty($_POST['productId'])) {
            $product = get_post(op_post('productId'), ARRAY_A);
            $metaData = unserialize(get_post_meta(op_post('productId'), '_'.OP_SN.'_theme', true));
            $product['meta'] = $metaData;
            echo json_encode($product);die();
        }
    }

    function _check_tags($sc,$regex,$tags){
        $assets = array();
        $mc = preg_match_all('/'.$regex.'/s',$sc,$matches);
        if($mc > 0){
            for($i=0;$i<$mc;$i++){
                $tag = explode('/',$tags[$matches[2][$i]]['asset']);
                if($tag[0] == 'addon'){
                    $assets[$tag[1]] = true;
                    if(!empty($matches[5][$i])){
                        $assets = array_merge($assets,$this->_check_tags($matches[5][$i],$regex,$tags));
                    }
                }
            }
        }
        return $assets;
    }

    function save_page(){
        $this->checkPostVariableLength();

        //exit;
        $this->check_nonce();
        $this->init_page();
        $GLOBALS['op_feature_area']->save_features();
        wp_update_post(array('ID'=>OP_PAGEBUILDER_ID,'post_status'=>$_POST['status']));
        $layouts = op_post('layouts');
        //die(print_r($layouts));
        if(!is_array($layouts)){
            $layouts = array();
        }
        $usedTypes = array();
        foreach($layouts as $name => $layout){
            $usedTypes[] = $name;
            $this->_save_layout($layout,$name);
        }
        /*
         * We need to delete rows that are obsolete
         */
        op_page_clean_layouts($usedTypes);

        // Was throwing PHP notice
        if (isset($_POST['op'])) {
            $op = $_POST['op'];
        } else {
            $op = null;
        }

        $section = 'functionality';
        if(!(op_page_config('disable',$section) === true)){
            require_once OP_LIB.'sections/page/functionality.php';
            $object = new OptimizePress_Sections_Functionality();
            $data['sections'] = $object->sections();
            foreach($data['sections'] as $name => $section){
                if(is_array($section)){
                    if(isset($section['save_action'])){
                        call_user_func_array($section['save_action'],array(op_get_var($op,$name,array())));
                    }
                    if(isset($section['module']) && isset($op[$section['module']])){
                        $mod_ops = op_get_var($op,$name,array());
                        $opts = op_get_var($section,'options',array());
                        op_mod($section['module'],op_get_var($section,'module_type','blog'))->save_settings($name,$opts,$mod_ops);
                    }
                }
            }
        }

        if (is_array($op) && is_array($op['sections']) && is_array($op['sections']['typography'])) {
            op_update_page_option('typography',$this->_save_typography(true));
        }
    }

    /**
     * Compares length of $_POST variable with PHP max_input_vars and returns error if value is too low
     * @since 2.5.4
     * @return integer
     */
    function checkPostVariableLength(){
        if (isset($_POST)){
            $maxInputVars = ini_get('max_input_vars');
            if (!$maxInputVars){ return; }
            $currentVarsLength = $this->count_nested_array_keys($_POST);

            if ( intval($currentVarsLength) >= intval($maxInputVars) ){
                $increasePostMaxVariableMessage = __('ERROR: Page is not saved. You need to increase PHP variable max_input_vars to higher value. Please contact your hosting provider.','optimizepress');
                die(json_encode(array('error' => $increasePostMaxVariableMessage)));
            }
        }
    }

    /**
     * Count total number of POST variables send in request
     * @since 2.5.4
     * @return integer
     */
    function count_nested_array_keys($array) {
        $it = new RecursiveIteratorIterator(new RecursiveArrayIterator($array));

        $keyCounts = array();
        foreach ($it as $key => $value) {
            isset($keyCounts[$key]) ? $keyCounts[$key]++ : $keyCounts[$key] = 1;
        }

        $count = 0;
        foreach($keyCounts as $key){
            $count += intval($key);
        }
        return $count;
    }



    function wp_head(){
        do_action('admin_print_scripts');
        ?>
<script type="text/javascript">
addLoadEvent = function(func){if(typeof opjq!="undefined")opjq(document).ready(func);else if(typeof wpOnload!='function'){wpOnload=func;}else{var oldonload=wpOnload;wpOnload=function(){oldonload();func();}}};
var userSettings = {
        'url': '<?php echo SITECOOKIEPATH; ?>',
        'uid': '<?php if ( ! isset($current_user) ) $current_user = wp_get_current_user(); echo $current_user->ID; ?>',
        'time':'<?php echo time() ?>'
    },
    ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>',
    typenow = 'page',
    isRtl = <?php echo (int) is_rtl(); ?>,
    op_launch_funnel_enabled = <?php echo (op_page_option('launch_funnel','enabled') == 'Y' ? 'true':'false') ?>;
</script>
<?php
        echo do_action('op_live_editor_css');
    }

    function init_page(){
        if(isset($_POST['page_id'])){
            define('OP_LIVEEDITOR',true);
            define('OP_PAGEBUILDER_ID',$_POST['page_id']);
            define('OP_PAGEBUILDER',true);
            op_init_page_theme();
            OptimizePress_Default_Assets::_set_font('');
            return true;
        }
        echo json_encode(array('error'=>__('The page ID was not found, please refresh and try again', 'optimizepress')));
        exit;
    }

    function update_typography(){
        $this->check_nonce();
        $this->init_page();
        $out = '';
        $css = apply_filters('op_output_css','',$this->_save_typography());
        if($css != ''){
            $out = '
<style type="text/css" id="op_header_css">
'.$css.'
</style>';
        }
        echo json_encode(array('css'=>$out,'fonts'=>_op_fonts('fonts_array')));
        exit;
    }

    function update_feature(){
        $output = array();
        $option = op_post('option');
        $str = 'op_liveeditor_feature_'.$option;
        $this->check_nonce($str,$str);
        $this->init_page();
        $output = $GLOBALS['op_feature_area']->update_feature();
        echo json_encode($output);
        exit;
    }

    function _save_typography($update=false){
        $typography = array();

        $elements = array(
            'link_color' => array('page','link_color'),
            'link_hover_color' => array('page','link_hover_color'),
            'footer_text_color' => array('footer','text_color'),
            'footer_link_color' => array('footer','link_color'),
            'footer_link_hover_color' => array('footer','link_hover_color'),
            'feature_text_color' => array('feature_area','text_color'),
            'feature_link_color' => array('feature_area','link_color'),
            'feature_link_hover_color' => array('feature_area','link_hover_color'),
        );
        $color_scheme_advanced = op_default_page_option('color_scheme_advanced');
        $color_scheme_advanced = is_array($color_scheme_advanced) ? $color_scheme_advanced : array();

        if(($type = op_post('op','sections','typography')) && is_array($type)){
            $typography_elements = op_typography_elements();
            $typography['font_elements'] = array();
            $typography['color_elements'] = array();
            if(isset($typography_elements['font_elements'])){
                foreach($typography_elements['font_elements'] as $name => $options){
                    $tmp = op_get_var($type,$name,array());
                    $typography['font_elements'][$name] = array(
                        'size' => op_get_var($tmp,'size'),
                        'font' => op_get_var($tmp,'font'),
                        'style' => op_get_var($tmp,'style'),
                        'color' => op_get_var($tmp,'color'),
                    );
                }
            }
            if(isset($typography_elements['color_elements'])){
                foreach($typography_elements['color_elements'] as $name => $options){
                    $val = op_get_var($type,$name,'');
                    $color = op_get_var($val,'color');
                    $color_test = str_replace('#', '', $color);
                    if (empty($color_test) && !is_array($val)) $color = $val;
                    if(is_array($val)){
                        $newtmp = array(
                            'color' => $color,
                            'text_decoration' => op_get_var($val,'text_decoration')
                        );
                    } else {
                        $newtmp = $val;
                    }
                    if($update){
                        if(isset($elements[$name])){
                            $tmp = $elements[$name];
                            if(!isset($color_scheme_advanced[$tmp[0]])){
                                $color_scheme_advanced[$tmp[0]] = array();
                            }
                            $color_scheme_advanced[$tmp[0]][$tmp[1]] = $newtmp;
                        }
                    }
                    $typography['color_elements'][$name] = $newtmp;
                }
            }
        }
        $color_scheme_advanced['feature_area']['text_color'] = $typography['color_elements']['feature_text_color'];
        $color_scheme_advanced['footer']['footer_text_color'] = $typography['color_elements']['footer_text_color'];
        $color_scheme_advanced['footer']['text_color'] = $typography['color_elements']['footer_text_color'];
        if($update){
            //op_update_page_option('color_scheme_advanced',$color_scheme_advanced);
        }
        return $typography;
    }

    function load_editor($post){
        global $op_feature_area;
        $op_feature_area->generate_dialogs();
        define('OP_LIVEEDITOR',true);
        require_once OP_ADMIN.'assets.php';
        require_once OP_ASSETS.'live_editor.php';
        require_once OP_FUNC.'page.php';
        $GLOBALS['post'] =& $post;

        $theme_type = op_page_option('theme', 'type');
        $theme_dir = op_page_option('theme', 'dir');

        if ($theme_type === 'landing' && $theme_dir == 2) {
            $GLOBALS['op_content_layout'] = op_page_layout('body',false,'content_area','editable-area', array(), true);
        } else {
            $GLOBALS['op_content_layout'] = op_page_layout('body',false,'content_area','editable-area');
        }

        $GLOBALS['op_footer_layout'] = op_page_layout('footer',false,'footer_area','editable-area');

        $dialogs = $this->load_content_layouts_preset_dialogs();
        $data['content_layouts_dialog'] = $dialogs[0];
        $data['presets_dialog'] = $dialogs[1];

        op_tpl_assign($data);
        require_once OP_PAGES.$theme_type.'/'.$theme_dir.'/template.php';
    }

    function _save_layout($content_layout,$type){
        $new_layout = array();
        if($content_layout !== false && count($content_layout) > 0){
            foreach($content_layout as $row){
                $new_row = array(
                    'row_class' => isset($row['row_class']) ? $row['row_class'] : '',
                    'row_style' => isset($row['row_style']) ? $row['row_style'] : '',
                    'row_data_style' => isset($row['row_data_style']) ? $row['row_data_style'] : '',
                    'children' => array(),
                );
                if(isset($row['children']) && count($row['children']) > 0){
                    foreach($row['children'] as $col){
                        $new_col = array(
                            'col_class' => $col['object']['col_class'],
                            'children' => array()
                        );
                        if (!empty($col['object']['children']) && count($col['object']['children']) > 0) {
                            foreach ($col['object']['children'] as $child) {
                                switch ($child['type']) {
                                    case 'subcolumn':
                                        $subcol['type'] = 'subcolumn';
                                        $subcol['subcol_class'] = $child['subcol_class'];
                                        $subcol['children'] = array();
                                        if (!empty($child['children']) && count($child['children']) > 0) {
                                            $nr = 0;
                                            foreach ($child['children'] as $kid) {
                                                $subcol['children'][$nr]['type'] = 'element';
                                                // $subcol['children'][$nr]['object'] = isset($kid['object']) ? str_replace('$', '/$', addslashes(stripslashes($kid['object']))) : '';
                                                $subcol['children'][$nr]['object'] = isset($kid['object']) ? addslashes(stripslashes($kid['object'])) : '';
                                                $subcol['children'][$nr]['element_class'] = isset($kid['object']) ? $kid['element_class'] : '';
                                                $subcol['children'][$nr]['element_data_style'] = isset($kid['object']) ? $kid['element_data_style'] : '';
                                                $nr++;
                                            }
                                        }
                                        $new_col['children'][] = $subcol;
                                    break;
                                    case 'element':
                                        $element['type'] = 'element';
                                        // $element['object'] = isset($child['object']) ? str_replace('$', '/$', addslashes(stripslashes($child['object']))) : '';
                                        $element['object'] = isset($child['object']) ? addslashes(stripslashes($child['object'])) : '';
                                        $element['element_class'] = isset($child['element_class']) ? $child['element_class'] : '';
                                        $element['element_data_style'] = isset($child['element_data_style']) ? $child['element_data_style'] : '';
                                        $new_col['children'][] =  $element;
                                    break;
                                }
                            }
                        }
                        $new_row['children'][] = $new_col;
                    }
                }
                $new_layout[] = $new_row;
            }
        }
        op_page_update_layout($new_layout,$type);
    }

    function print_scripts(){
        do_action('admin_enqueue_scripts');
        op_print_scripts('live-editor');

        wp_enqueue_style(OP_SN.'-admin-live-editor', OP_CSS.'live_editor'.OP_SCRIPT_DEBUG.'.css', array(OP_SN.'-admin-common'), OP_VERSION);

        op_enqueue_backend_scripts();
    }

    function print_dialogs(){
        echo op_tpl('live_editor/index').op_tpl('live_editor/toolbar');
        do_action('admin_footer');
        do_action('admin_print_footer_scripts');
        $fonts_array = _op_fonts('fonts_array');
        if (count($fonts_array) > 0) {
            echo '
<script type="text/javascript" src="http'.(is_ssl()?'s':'').'://www.google.com/jsapi"></script>
<script type="text/javascript">
  google.load(\'webfont\',\'1\');
  google.setOnLoadCallback(function() {
    WebFont.load({
      google: {
        families: '.json_encode($fonts_array).'
      }
    });
  });
</script>';
        }
    }

    function check_nonce($field='_wpnonce',$id='op_liveeditor',$return=false,$func='op_post'){
        $check = true;
        define('OP_AJAX',true);
        if(!(($nonce = $func($field)) !== false && wp_verify_nonce( $nonce, $id ))){
            $check = false;
        }
        if($return){
            return $check;
        } elseif(!$check){
            echo json_encode(array('error'=>__('Verification failed, please refresh the page and try again.', 'optimizepress')));
            exit;
        }
    }

    function parse_shortcode(){
        $this->check_nonce();
        $this->init_page();
        // added for some plugins to make LE a page
        global $wp_query;
        $wp_query->is_page = true;
        // end
        define('OP_AJAX_SHORTCODE',true);
        $GLOBALS['OP_LIVEEDITOR_DEPTH'] = isset($_POST['depth']) && $_POST['depth'] == 1 ? 1 : 0;
        $GLOBALS['OP_ADD_ELEMENT_ROWS'] = false;
        $GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array();
        $GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = false;
        //$GLOBALS['OP_DONE_TOP_LEVEL'] = false;
        require_once OP_ASSETS.'live_editor.php';
        $sc = isset($_POST['shortcode']) ? $_POST['shortcode'] : $_GET['shortcode'];
        $sc = op_fix_embed_url_shortcodes(stripslashes($sc));

        // Popup needs to be handled differently
        $op_popup_present = false;

        // removing new line before shortcode entered in content
        $sc = str_replace(array("\n[", "\r[", "\r\n[", "\n\r["), array("[", "[", "[", "["), $sc);


        if ( strpos($sc, '[op_popup ') !== false || strpos($sc, '[op_popup_elements]') !== false) {
            $op_popup_present = true;
        }

        // if ( strpos($sc, '[op_popup_button]') !== false && strpos($sc, '[op_popup ') === false) {

        //     if ( strpos($sc, '[op_popup_elements]') === false ) {
        //         $op_popup_present = true;
        //     } else {
        //         $sc = str_replace('[op_popup_elements]', '', $sc);
        //         $sc = str_replace('[/op_popup_elements]', '', $sc);
        //     }

        // } else {
        //     $sc = str_replace('[op_popup_elements]', '', $sc);
        //     $sc = str_replace('[/op_popup_elements]', '', $sc);
        // }

        if(preg_match('/'.op_shortcode_regex('op_liveeditor_elements').'/s',$sc,$matches) || $op_popup_present){

            if($GLOBALS['OP_LIVEEDITOR_DEPTH'] === 1){

                // EDIT ELEMENT

                $GLOBALS['OP_ADD_ELEMENT_ROWS'] = true;

                if (!$op_popup_present) {
                    $processed = op_process_content_filter($sc, true);
                }

                if ($op_popup_present) {

                    // [op_popup_elements] shortcode is present here

                    $new_popup_elements = '';
                    preg_match_all('/\[op_popup_content_element[ d|\]].*?\[\/op_popup_content_element\]/is', $sc, $popup_elements);

                    foreach ($popup_elements[0] as $popup_element) {
                        $popup_element_sc = $popup_element;

                        // Change shortcodes op_popup_content_element with op_liveeditor_element (taking data-style attribute into account)
                        $popup_element = preg_replace('/\[op_popup_content_element(.*?"?)\]/is', '[op_liveeditor_element $1][op_popup_content_element]', $popup_element);

                        // Closing shortcode can't have attributes
                        $popup_element = str_replace('[/op_popup_content_element]', '[/op_popup_content_element][/op_liveeditor_element]', $popup_element);

                        $popup_element = op_process_content_filter('[op_liveeditor_elements]' . $popup_element . '[/op_liveeditor_elements]', true);
                        $popup_element = str_replace('###OP_POPUP_CONTENT_CHILDREN###', $popup_element_sc, $popup_element);
                        $popup_element = preg_replace('/\[op_popup_content_element.*?\]/is', '', $popup_element);
                        $popup_element = str_replace('[/op_popup_content_element]', '', $popup_element);

                        $new_popup_elements .= $popup_element;
                    }

                    $new_popup_elements = str_replace('$', '\$', $new_popup_elements);

                    $processed = preg_replace('/\[op_popup_elements[ d|\]].*?\[\/op_popup_elements\]/is', $new_popup_elements, $sc);
                    // $processed = str_replace('[op_popup_button]', '<div class="op-popup-button ' . $popup_button_class . '">', $processed);
                    // $processed = str_replace('[/op_popup_button]', '</div>', $processed);
                    $processed .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);

                }

                $processed = '<h1 class="op-content-liveeditor-title">' . __('Content LiveEditor', 'optimizepress') . '</h1>
                            <div class="epicbox-actual-content">' . $processed .
                                '<a href="#add_element" class="add-new-element"><span>' . __('Add Element', 'optimizepress') . '</span></a>
                            </div>
                            <div class="op-insert-button cf">
                                <button type="submit" class="editor-button"><span>' . __('Update', 'optimizepress') . '</span></button>
                            </div>';

                if ($op_popup_present) {
                    $processed .= '<div class="op-hidden op_popup_element_present"><textarea class="op-le-child-shortcode" name="shortcode[]">'. $sc .'</textarea></div>';
                }

            } else {

                // UPDATE ELEMENT

                $GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = true;
                $child_data = op_page_parse_child_elements($matches[0]);
                $processed = do_shortcode(str_replace($matches[0], '#OP_CHILD_ELEMENTS#', $sc));
                $GLOBALS['OP_LIVEEDITOR_DEPTH'] = 1;

                $child_html = '';
                $child_element_nr = 0;

                //
                $child_html = op_page_parse_child_row($child_data['liveeditorElements']);

                /**
                 * At the end of child elements "add element" button must
                 * be inserted, which is done by parsing [op_liveeditor_elements] shortcode
                 */
                $child_html .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);

                $child_html = op_process_asset_content($child_html).'<div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">'.op_attr(shortcode_unautop($matches[0])).'</textarea></div>';

                /*
                 * $ needs to be escaped
                 */
                $child_html = str_replace('$', '\$', $child_html);
                $processed = preg_replace(array('{<p[^>]*>\s*#OP_CHILD_ELEMENTS#\s*<\/p>}i','{#OP_CHILD_ELEMENTS#}i'),$child_html,$processed);


                if ($op_popup_present) {

                    $new_popup_elements = '';
                    $new_popup_elements_sc = '';

                    // Parse op_popup_content
                    preg_match_all('/\[op_popup_content_element[ d|\]].*?\[\/op_popup_content_element\]/is', $sc, $popup_elements);

                    foreach ($popup_elements[0] as $popup_element) {
                        $new_popup_elements_sc .= $popup_element;
                        $popup_element = preg_replace('/\[op_popup_content_element(.*?"?)\]/is', '[op_liveeditor_element$1]', $popup_element);
                        $popup_element = str_replace('[/op_popup_content_element]', '[/op_liveeditor_element]', $popup_element);
                        $popup_element = op_process_content_filter($popup_element, true);
                        $new_popup_elements .= $popup_element;
                    }

                    $new_popup_elements = '<div class="op-popup-content">' . $new_popup_elements . '</div>';
                    $new_popup_elements .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);
                    $new_popup_elements = str_replace('$', '\$', $new_popup_elements);
                    $processed = preg_replace('/\[op_popup_content[ d|\]].*?\[\/op_popup_content\]/is', $new_popup_elements, $sc);

                    // Parse op_popup_button
                    preg_match_all('/\[op_popup_button\].*?\[\/op_popup_button\]/is', str_replace('$', '\$', $sc), $new_popup_button);

                    $new_popup_button = $new_popup_button[0][0];
                    $new_popup_button = str_replace('[op_popup_button]', '', $new_popup_button);
                    $new_popup_button = str_replace('[/op_popup_button]', '', $new_popup_button);
                    $new_popup_button = op_process_content_filter($new_popup_button, true);
                    $new_popup_button = '<div class="op-popup-button ' . $popup_button_class . '">' . $new_popup_button . '</div>';

                    $processed = op_process_content_filter($processed, true);
                    $new_popup_button = str_replace('$', '\$', $new_popup_button);
                    $processed = preg_replace('/\[op_popup_button\].*?\[\/op_popup_button\]/is', $new_popup_button, $processed);

                    // $processed = str_replace('[op_popup_button]', '<div class="op-popup-button ' . $popup_button_class . '">', $processed);
                    // $processed = str_replace('[/op_popup_button]', '</div>', $processed);

                    $processed .= '<div class="op-hidden op_popup_element_present"><textarea class="op-le-child-shortcode" name="shortcode[]">' . op_attr(shortcode_unautop('[op_popup_elements]' . $new_popup_elements_sc . '[/op_popup_elements]')) . '</textarea></div>';

                }

            }

        } else {

            // $processed = apply_filters('the_content', $sc);
            $processed = op_process_content_filter($sc, true);

        }

        $output = array(
            'output' => $processed,
            'js' => OptimizePress_Default_Assets::_print_front_scripts(true),
            'check' => OptimizePress_Default_Assets::_check_function(),
            'font' => OptimizePress_Default_Assets::_get_font(),
        );

        if(isset($GLOBALS['OP_PARSED_SHORTCODE']) && !empty($GLOBALS['OP_PARSED_SHORTCODE'])){
            $output['shortcode'] = $GLOBALS['OP_PARSED_SHORTCODE'];
        }
        echo json_encode($output);
        exit;
    }

    function parse_params(){
        $this->check_nonce();
        require_once OP_ASSETS.'live_editor.php';
        $sc = isset($_POST['shortcode']) ? $_POST['shortcode'] : $_GET['shortcode'];
        $sc = trim(stripslashes($sc));
        $tags = op_assets_parse_list();
        $regex = op_shortcode_regex(join( '|', array_map('preg_quote', array_keys($tags)) ));

        $arr = array(
            'asset' => array('core','custom_html'),
            'attrs' => array()
        );
        $content = '';

	    // if we get prefixed pricing table shortcode through oppp, changing it to non prefixed one
	    if (strpos($sc, '[op_pricing_table ') !== false) {
		    $sc = str_replace('[op_pricing_table ', '[pricing_table ', $sc);
		    $sc = str_replace('op_pricing_table]', 'pricing_table]', $sc);
	    }
	    // end prefixed fix


        if(preg_match('/'.op_shortcode_regex('op_liveeditor_elements').'/s',$sc,$matches)){
            $content = $matches[0];
            $sc = str_replace($matches[0],'#OP_CHILD_ELEMENTS#',$sc);
        }
        if(preg_match('/^'.$regex.'$/s',$sc,$matches)){
            if(isset($tags[$matches[2]])){
                $arr['tag'] = $matches[2];
                $arr['asset'] = explode('/',$tags[$matches[2]]['asset']);
                $arr['attrs'] = shortcode_parse_atts($matches[3]);
                if(isset($tags[$matches[2]]['child_tags']) && count($tags[$matches[2]]['child_tags']) > 0){
                    $mc2 = preg_match_all('/'.op_shortcode_regex(join( '|', array_map('preg_quote', $tags[$matches[2]]['child_tags']) )).'/',$matches[5],$matches2);
                    if($mc2 > 0){
                        for($i=0;$i<$mc2;$i++){
                            $key = $matches2[2][$i];
                            if(!isset($arr[$key])){
                                $arr[$key] = array();
                            }
                            $tmp = array(
                                'type' => $key,
                                'attrs' => shortcode_parse_atts($matches2[3][$i]),
                            );
                            if(!empty($matches2[5][$i])){
                                if (!is_array($tmp['attrs'])) {
                                    $tmp['attrs'] = array();
                                }
                                $tmp['attrs']['content'] = shortcode_unautop($matches2[5][$i]);
                            }
                            $arr[$key][] = $tmp;
                        }
                    }
                    if(!empty($content) && !isset($arr['content'])){
                        $arr['content'] = $content;
                    }
                } else {
                    if(!empty($matches[5])){
                        if (!is_array($arr['attrs'])) {
                            $arr['attrs'] = array();
                        }
                        $arr['attrs']['content'] =  shortcode_unautop(str_replace('#OP_CHILD_ELEMENTS#',$content,$matches[5]));

                        if ($arr['tag'] === 'op_popup') {

                            $new_popup_elements = '';
                            preg_match_all('/\[op_popup_button[ d|\]].*?\[\/op_popup_button\]/is', $arr['attrs']['content'], $new_popup_button);
                            preg_match_all('/\[op_popup_content_element[ d|\]].*?\[\/op_popup_content_element\]/is', $arr['attrs']['content'], $popup_elements);

                            $new_popup_button = $new_popup_button[0][0];
                            $new_popup_button = str_replace('[op_popup_button]', '', $new_popup_button);
                            $new_popup_button = str_replace('[/op_popup_button]', '', $new_popup_button);

                            $arr['attrs']['content'] = $new_popup_button;

                            foreach ($popup_elements[0] as $popup_element) {
                                $new_popup_elements .= $popup_element;
                            }

                            $new_popup_elements = '[op_popup_content]' . $new_popup_elements . '[/op_popup_content]';
                            $arr['attrs']['popup_content'] = $new_popup_elements;
                        }
                    }
                }
            }
        } else {
            $arr['attrs']['content'] = $sc;
        }
        echo json_encode($arr);
        exit;
    }

    function _regex($tags){
        // WARNING! Do not change this regex without changing do_shortcode_tag() and strip_shortcode_tag()
        return
              '/\\['                              // Opening bracket
            . '(\\[?)'                           // 1: Optional second opening bracket for escaping shortcodes: [[tag]]
            . "(".$tags.")"                     // 2: Shortcode name
            . '\\b'                              // Word boundary
            . '('                                // 3: Unroll the loop: Inside the opening shortcode tag
            .     '[^\\]\\/]*'                   // Not a closing bracket or forward slash
            .     '(?:'
            .         '\\/(?!\\])'               // A forward slash not followed by a closing bracket
            .         '[^\\]\\/]*'               // Not a closing bracket or forward slash
            .     ')*?'
            . ')'
            . '(?:'
            .     '(\\/)'                        // 4: Self closing tag ...
            .     '\\]'                          // ... and closing bracket
            . '|'
            .     '\\]'                          // Closing bracket
            .     '(?:'
            .         '('                        // 5: Unroll the loop: Optionally, anything between the opening and closing shortcode tags
            .             '[^\\[]*+'             // Not an opening bracket
            .             '(?:'
            .                 '\\[(?!\\/\\2\\])' // An opening bracket not followed by the closing shortcode tag
            .                 '[^\\[]*+'         // Not an opening bracket
            .             ')*+'
            .         ')'
            .         '\\[\\/\\2\\]'             // Closing shortcode tag
            .     ')?'
            . ')'
            . '(\\]?)/';
    }

    /* Content Layout Stuff */

    function delete_layout(){
        $this->check_nonce();
        if(!$filename = op_post('filename')){
            exit(json_encode(array('error' => __('Please specify a filename', 'optimizepress'))));
        }
        $filename = stripslashes($filename);
        if(!file_exists($filename) || end(explode('.',$filename)) != 'zip'){
            exit(json_encode(array('error' => __('The filename provided could not be found', 'optimizepress'))));
        }
        @unlink($filename);
        @rmdir(dirname($filename));
        exit(json_encode(array('done'=>true)));
    }

    function export_layout(){
        global $wpdb;
        $error = null;
        if(!class_exists('ZipArchive')){
            exit(json_encode(array('error'=>__('You must have ZipArchive enabled on your server to complete the operation.', 'optimizepress'))));
        }
        if(!($layout_name = op_post('layout_name'))){
            exit(json_encode(array('error'=> __('Please supply a name for your layout', 'optimizepress'))));
        }
        if(!($layout_description = op_post('layout_description'))){
            exit(json_encode(array('error'=> __('Please supply a description for your layout', 'optimizepress'))));
        }
        if(!($image = op_post('image')) || !file_exists($image)){
            exit(json_encode(array('error'=> __('Please supply an image for your layout', 'optimizepress'))));
        }
        if(!($layout_category = op_post('layout_category'))){
            exit(json_encode(array('error'=> __('Please supply a category for your layout', 'optimizepress'))));
        } else {
            $layout_category = $wpdb->get_var( $wpdb->prepare(
                "SELECT name FROM `{$wpdb->prefix}optimizepress_layout_categories` WHERE `id` = %d",
                $layout_category
            ));
        }
        $this->save_page();
        $settings = apply_filters('op_export_settings_array',array('membership','theme','header_layout','feature_area','feature_title','footer_area','color_scheme_template','typography','color_scheme_advanced','mobile_redirect','seo','scripts','fb_share','lightbox','exit_redirect'/*,'one_time_offer'*/,'launch_gateway','launch_funnel','size_color', /*'landing_bg'*/));
        $layouts = op_post('layouts');
        if(!is_array($layouts)){
            $layouts = array();
        }
        $layouts = array_keys($layouts);
        $config_str = '<?php';
        $image_filename = basename($image);
        $preview_url = op_post('preview_url');
        $vars = array('name','description','category');
        foreach($vars as $var){
            $value = 'layout_'.$var;
            $value = $$value;
            $value = str_replace(array('â€�','â€™','â€ť','â€ś',"'"),array("'","'",'&quot;','&quot;',"\'"),stripslashes($value));
            $config_str .= '
$config[\''.$var.'\'] = \''.$value.'\';';
        }
        $config_str .= '
$config[\'image\'] = \''.str_replace("'","\'",$image_filename).'\';
$config[\'settings\'] = array();
$config[\'layouts\'] = array();
$config[\'settings\'][\'preview_url\'] = \''.str_replace("'","\'",$preview_url).'\';
';
        $url = site_url('/');
        if(preg_match('{(http|https)://(www.)?(.*?)$}i',$url,$matches)){
            $url = $matches[3];
        }
        $imgregex = '{(["\']*)(http|https)://(www.)?'.$url.'(.*?)(\.[gif|png|jpg|jpeg]+)[*\\1]*\\1}i';
        foreach($settings as $setting){
            $conf = op_page_option($setting);
            if(is_array($conf)){
                $conf = $this->_check_for_images($imgregex, $conf, array($setting));
            }
            $config_str .= "\$config['settings']['".$setting."'] = '".base64_encode(serialize($conf))."';\n";
        }
        $tags = op_assets_parse_list();
        $regex = op_shortcode_regex(join( '|', array_map('preg_quote', array_keys($tags)) ));
        $images = array();
        $assets = array();
        $new_layouts = array();
        foreach($layouts as $layout_str){
            $layout = op_page_layout($layout_str,true);
            $new_layout = array();
            /**/
            foreach($layout as $row){
                $row_image_match = preg_match_all($imgregex, $row['row_style'], $matches);
                if ($row_image_match > 0) {
                    for($i=0; $i < $row_image_match; $i++){
                        $path = $matches[4][$i].$matches[5][$i];
                        $row['row_style'] = str_replace(trim($matches[0][$i],$matches[1][$i]),'{op_filename="'.$path.'"}', $row['row_style']);
                        $temp = base64_decode($row['row_data_style']);
                        $temp = str_replace(trim($matches[0][$i],$matches[1][$i]),'{op_filename=\"'.$path.'\"}', $temp);
                        $row['row_data_style'] = base64_encode($temp);
                        $this->zip_images[$path] = trim($matches[0][$i],'"');
                    }
                }
                $new_row = array(
                    'row_class' => $row['row_class'],
                    'row_style' => $row['row_style'],
                    'row_data_style' => $row['row_data_style'],
                    'children' => array(),
                );
                if(isset($row['children']) && count($row['children']) > 0){
                    foreach($row['children'] as $col){
                        $new_col = array(
                            'col_class' => $col['col_class'],
                            'children' => array()
                        );
                        if (!empty($col['children']) && count($col['children']) > 0) {
                            foreach ($col['children'] as $child) {
                                switch ($child['type']) {
                                    case 'subcolumn':
                                        $subcol['type'] = 'subcolumn';
                                        $subcol['subcol_class'] = $child['subcol_class'];
                                        $subcol['children'] = array();

                                        if (!empty($child['children']) && count($child['children']) > 0) {
                                            $nr = 0;
                                            foreach ($child['children'] as $kid) {
                                                $subcol['children'][$nr]['type'] = 'element';
                                                $sc = trim(stripslashes($kid['object']));
                                                $mc = preg_match_all($imgregex,op_urldecode($sc),$matches);
                                                if($mc > 0){
                                                    for($i=0;$i<$mc;$i++){
                                                        $path = $matches[4][$i].$matches[5][$i];
                                                        $sc = str_replace(trim($matches[0][$i],$matches[1][$i]),'{op_filename="'.$path.'"}',op_urldecode($sc));
                                                        $this->zip_images[$path] = trim($matches[0][$i],'"');
                                                    }
                                                }
                                                $child_sc = '';
                                                if(preg_match('/'.op_shortcode_regex('op_liveeditor_elements').'/s',$sc,$matches)){
                                                    $child_sc = $matches[0];
                                                    $assets = array_merge($assets,$this->_check_tags($child_sc,$regex,$tags));
                                                    $sc = str_replace($child_sc,'#OP_CHILD_ELEMENTS#',$sc);
                                                }
                                                $assets = array_merge($assets,$this->_check_tags($sc,$regex,$tags));
                                                $sc = str_replace(OP_ASSETS_URL,'#OP_ASSETS_URL#',$sc);
                                                $sc = str_replace('#OP_CHILD_ELEMENTS#',$child_sc,$sc);
                                                //$element['object'] = str_replace('$', '&#36;', addslashes(stripslashes($sc)));
                                                $subcol['children'][$nr]['object'] = $sc;
                                                $subcol['children'][$nr]['element_class'] = $kid['element_class'];
                                                $subcol['children'][$nr]['element_data_style'] = $kid['element_data_style'];
                                                $nr++;
                                            }
                                        }
                                        $new_col['children'][] = $subcol;
                                    break;
                                    case 'element':
                                        $element['type'] = 'element';
                                        $sc = trim(stripslashes($child['object']));
                                        $mc = preg_match_all($imgregex,op_urldecode($sc),$matches);
                                        if($mc > 0){
                                            for($i=0;$i<$mc;$i++){
                                                $path = $matches[4][$i].$matches[5][$i];
                                                $sc = str_replace(trim($matches[0][$i],$matches[1][$i]),'{op_filename="'.$path.'"}',op_urldecode($sc));
                                                $this->zip_images[$path] = trim($matches[0][$i],'"');
                                            }
                                        }
                                        $child_sc = '';
                                        if(preg_match('/'.op_shortcode_regex('op_liveeditor_elements').'/s',$sc,$matches)){
                                            $child_sc = $matches[0];
                                            $assets = array_merge($assets,$this->_check_tags($child_sc,$regex,$tags));
                                            $sc = str_replace($child_sc,'#OP_CHILD_ELEMENTS#',$sc);
                                        }
                                        $assets = array_merge($assets,$this->_check_tags($sc,$regex,$tags));
                                        $sc = str_replace(OP_ASSETS_URL,'#OP_ASSETS_URL#',$sc);
                                        $sc = str_replace('#OP_CHILD_ELEMENTS#',$child_sc,$sc);
                                        //$element['object'] = str_replace('$', '&#36;', addslashes(stripslashes($sc)));
                                        $element['object'] = $sc;
                                        $element['element_class'] = $child['element_class'];
                                        $element['element_data_style'] = $child['element_data_style'];
                                        $new_col['children'][] =  $element;
                                    break;
                                }
                            }
                        }
                        $new_row['children'][] = $new_col;
                    }
                }
                $new_layout[] = $new_row;
            }
            /**/
            $new_layouts[$layout_str] = $new_layout;
        }

        $dirname = md5($layout_name);
        if(!file_exists(OP_LIB.'content_layouts/export')){
            mkdir(OP_LIB.'content_layouts/export');
        }
        $dir_base = OP_LIB.'content_layouts/export';
        $full_dir = $dir_base.'/'.$dirname;
        $tmpdirname = $dirname;
        $counter = 0;
        while(file_exists($full_dir)){
            $counter++;
            $tmpdirname = $dirname.($counter > 0 ? '-'.$counter:'');
            $full_dir = $dir_base.'/'.$tmpdirname;
        }
        mkdir($full_dir);
        $filename = preg_replace(array('/\s+/','/[^a-zA-Z0-9\_]/','/_{2,}/'),array('_','','_'),$layout_name);
        $zip = new ZipArchive;
        $zip->open($full_dir.'/'.$filename.'.zip',ZIPARCHIVE::CREATE);
        $zip->addFile(dirname($image).DIRECTORY_SEPARATOR.$image_filename,$image_filename);
        $zip->addEmptyDir('images');

        $added_images = array();
        $new_images = array();
        foreach($this->zip_images as $path => $url){
            $file = basename($path);
            $new_filename = $file;
            if(isset($added_images[$file])){
                $f = explode('.',$file);
                $ext = array_pop($f);
                $f = implode('.',$f);
                $counter = 1;
                while(isset($added_images[$new_filename])){
                    $new_filename = $f.$counter.'.'.$ext;
                    $counter++;
                }
            }
            $new_images[$path] = $new_filename;
            $added_images[$new_filename] = true;
            if (file_exists(ABSPATH.$path)) {
                $zip->addFile(ABSPATH.$path,'images/'.$new_filename);
            }
        }

        $config_str .= "\$config['layouts'] = '".base64_encode(serialize($new_layouts))."';\n";
        $config_str .= "\$config['images'] = '".base64_encode(serialize($new_images))."';\n";
        $config_str .= "\$config['settings_images'] = '".base64_encode(serialize($this->used_images))."';\n";
        $zip->addFromString('config.php',$config_str);
        if(count($assets) > 0){
            $assets = array_keys($assets);
            $file_list = array();
            foreach($assets as $asset){
                $file_list = array_merge($file_list,op_asset_file_list($asset));
            }
            foreach($file_list as $local => $zipname){
                if (file_exists($local)) {
                    $zip->addFile($local,$zipname);
                }
            }
        }
        $zip->close();
        $out = array('output'=>'<a class="op-download-file" href="'.OP_LIB_URL.'content_layouts/export/'.$tmpdirname.'/'.$filename.'.zip">'.__('Download your layout', 'optimizepress').'</a> | <a href="#delete" class="delete-file op-delete-file">'.__('Delete File', 'optimizepress').'</a><input type="hidden" name="zip_filename" id="zip_filename" value="'.$full_dir.'/'.$filename.'.zip" />');
        exit(json_encode($out));
    }

    var $used_images = array();
    var $zip_images = array();

    function _check_for_images($imgregex, $array, $keys_so_far=array())
    {
        $new_array = array();
        foreach($array as $key => $value){
            $tmp = array_merge($keys_so_far, array($key));
            if (is_array($value)) {
                $new_array[$key] = $this->_check_for_images($imgregex, $value, $tmp);
            } else {
                $encode = false;
                if ($key == 'script') { // custom scripts are encoded
                    $value = base64_decode($value);
                    $encode = true;
                }
                $mc = preg_match_all($imgregex, $value, $matches);
                if ($mc > 0) {
                    for ($i=0; $i<$mc; $i++) {
                        $path = $matches[4][$i].$matches[5][$i];
                        $this->zip_images[$path] = trim($matches[0][$i],'"');
                        if (!isset($this->used_images[$path])) {
                            $this->used_images[$path] = array();
                        }
                        $this->used_images[$path][] = $tmp;
                        $value = str_replace(trim($matches[0][$i],$matches[1][$i]),'{op_filename="'.$matches[4][$i].$matches[5][$i].'"}',$value);
                    }
                }
                if ($encode) {
                    $value = base64_encode($value);
                }
                $new_array[$key] = $value;
            }
        }
        return $new_array;
    }

    function load_content_upload(){
        //Todo: load this only when needed
        $data = array();

        include_once OP_ADMIN.'inc/presets.php';
        $data["presets"] = OptimizePress_Page_Presets::getInstance()->presetDropdown;

        if(isset($_REQUEST['_wpnonce'])){
            if(wp_verify_nonce($_REQUEST['_wpnonce'],'op_content_layout_upload')){
                /*
                echo op_tpl('admin_header');
                include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
                include_once OP_ADMIN.'inc/content_layouts.php';
                check_admin_referer('op_content_layout_upload');
                $file_upload = new File_Upload_Upgrader('pluginzip', 'package');
                $title = sprintf( __('Installing Plugin from uploaded file: %s'), basename( $file_upload->filename ) );
                $nonce = 'op_content_layout_upload';
                $url = add_query_arg(array('package' => (isset($file_upload->id) ? $file_upload->id : $file_upload->filename)), menu_page_url(OP_SN.'-page-builder',false).'&amp;section=content_upload');
                $type = 'upload'; //Install plugin type, From Web or an Upload.
                $upgrader = new OP_Content_Layout_Upgrader( new OP_Content_Layout_Skin( compact('type', 'title', 'nonce', 'url') ) );
                $result = $upgrader->install( $file_upload->package );

                if(method_exists($file_upload,'cleanup')){
                    if ( $result || is_wp_error($result) )
                        $file_upload->cleanup();
                }
                if(isset($file_upload->id)){
                    wp_delete_attachment($file_upload->id,true);
                }
                echo op_tpl('admin_footer');
                exit;
                */

                // adding multiple file(s) upload functionality:
                // since File_Upload_Upgrader class is using $_FILES variable,
                // we're altering $_FILES and initializing File_Upload_Upgrader
                // for each file in $_FILES array...
                include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
                include_once OP_ADMIN.'inc/content_layouts.php';

                check_admin_referer('op_content_layout_upload');

                $files     = $_FILES;
                $form      = 'pluginzip';
                $urlholder = 'package';
                $type      = 'upload';
                $content   = Array();
                $scripts   = Array();

                for ($i = 0; $i < count($files[$form]['name']); $i++) {
                    $_FILES = Array(
                        $form => Array(
                            'name'     => $files[$form]['name'][$i],
                            'type'     => $files[$form]['type'][$i],
                            'tmp_name' => $files[$form]['tmp_name'][$i],
                            'error'    => $files[$form]['error'][$i],
                            'size'     => $files[$form]['size'][$i]
                        ));

                    $file_upload = new File_Upload_Upgrader($form, $urlholder);
                    $title = sprintf( __('Installing Plugin from uploaded file: %s'), basename( $file_upload->filename ) );
                    $nonce = 'op_content_layout_upload';
                    $url = add_query_arg(array('package' => (isset($file_upload->id) ? $file_upload->id : $file_upload->filename)), menu_page_url(OP_SN.'-page-builder',false).'&amp;section=content_upload');
                    $skin = new OP_Content_Layout_Skin(compact('type', 'title', 'nonce', 'url'));
                    $upgrader = new OP_Content_Layout_Upgrader($skin);

                    // buffering output so we can prettify it later
                    ob_start();
                    $result  = $upgrader->install( $file_upload->package );
                    $success = $upgrader->strings['process_success'];
                    $html    = ob_get_contents();
                    ob_end_clean();
                    preg_match_all('#<script(.*?)>(.*?)</script>#is', $html, $script);
                    $html    = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $html);

                    // to do: simplify retrieving success variable
                    $content[] = Array(
                            'package' => basename($file_upload->filename),
                            'html'    => $html,
                            'success' => ($html == $success)
                        );

                    foreach ($script[0] as $value) {
                        $scripts[] = $value;
                    }

                    if(method_exists($file_upload,'cleanup')){
                        if ( $result || is_wp_error($result) )
                            $file_upload->cleanup();
                    }
                    if(isset($file_upload->id)){
                        wp_delete_attachment($file_upload->id,true);
                    }
                }

                // give $_FILES it's value
                //$_FILES = $files;

                // display layout
                $data['content'] = $content;
                $data['scripts'] = array_unique($scripts);
            } else {
                $data['error'] = __('Verification failed, please refresh and try again.', 'optimizepress');
            }
        }
        echo op_tpl('live_editor/layouts/upload',$data);
        exit;
    }

    function delete_content_layout($layoutId)
    {
        if (defined('DOING_AJAX')) {
            global $wpdb;
            return $wpdb->delete($wpdb->prefix . 'optimizepress_predefined_layouts', array('id' => $layoutId), array('%d'));
        }
    }

    function get_content_layouts($categoryId = null)
    {
        global $wpdb;

        $data =  array();

        if ($categoryId !== null) {
            $categories = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM `{$wpdb->prefix}optimizepress_layout_categories` WHERE id = %d ORDER BY name ASC",
                $categoryId
            ));
        } else {
            $categories = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_layout_categories` ORDER BY name ASC");
        }

        if ($categories) {
            foreach ($categories as $category) {
                $layouts = $wpdb->get_results($wpdb->prepare(
                    "SELECT id, name, description, preview_ext FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE category = %d ORDER BY name ASC",
                    $category->id
                ));
                if ($layouts) {
                    foreach ($layouts as $layout)
                    $data[$category->name][] = $layout;
                }
            }
        }

        return $data;
    }

    function load_content_layouts($no_missing_text=false){
        global $wpdb;
        if(defined('DOING_AJAX') && !defined('GETTING_MENU_ITEM')){
            $nonce = op_post('_wpnonce');
            $arr = array(
                'error' => __('Verification failed, please refresh the page and try again.', 'optimizepress')
            );
            $nonce_chk = 'op_liveeditor';
            if(op_post('pagebuilder') === 'Y'){
                $nonce_chk = 'op_page_builder';
            }
            if(!wp_verify_nonce($nonce,$nonce_chk)){
                echo json_encode($arr);
                exit;
            }

        }
        $content_layouts = array();
        $results = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_layout_categories` ORDER BY name ASC");
        if($results){
            $selected = false;
            foreach($results as $result){
                $results2 = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE category=%d ORDER BY name ASC",
                    $result->id
                ));
                if($results2){
                    $tmp = array(
                        'name' => $result->name,
                        'item_html' => ''
                    );
                    $previews = array();
                    foreach($results2 as $result2){
                        $input_attr = $li_class = '';
                        if($selected === false){
                            $input_attr = ' checked="checked"';
                            $li_class = 'img-radio-selected';
                            $selected = true;
                        }
                        list($t1, $t2) = explode('|', $result2->description);
                        $previews[] = array(
                            //'image' => OP_IMG.'content_layouts/'.$result2->id.'.'.$result2->preview_ext,
                            'image' => $t2,
                            'width' => 212,
                            'height' => 156,
                            'tooltip_title' => $result2->name,
                            'tooltip_description' => wpautop($t1),
                            'preview_content' => $result2->name,
                            'input' => '<input type="radio" id="op_content_layout_'.$result2->id.'" name="op[page][content_layout]" value="'.$result2->id.'"'.$input_attr.' />',
                            'li_class' => $li_class,
                        );
                    }
                    $tmp['item_html'] = op_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'content-layout-select'));
                    $content_layouts[] = $tmp;
                }
            }
        }
        $out = op_tpl('live_editor/layouts/predefined',array('content_layouts'=>$content_layouts,'no_missing_text'=>$no_missing_text));
        if(defined('DOING_AJAX') && !defined('GETTING_MENU_ITEM')){
            echo json_encode(array('content_layout' => $out));
            exit;
        }
        return $out;
    }

    function load_content_layouts_preset_dialogs(){
        $data = array();
        $data['content_layouts'] = $this->load_content_layouts();
        $cats = $this->_get_content_layout_category_drop();
        $data['content_layout_category_count'] = $cats[0];
        $data['content_layout_category_select'] = '<select name="export_layout_category" id="export_layout_category">'.$cats[1].'</select>';

        $presets = $this->_get_presets_drop();
        $data['preset_select'] = '<select name="preset_save" id="preset_save">'.$presets.'</select>';

        add_menu_page('OptimizePress', 'OptimizePress', 'edit_theme_options', OP_SN, array(),OP_LIB_URL.'images/op_menu_image16x16.png','30.284567');
        add_submenu_page(OP_SN, __('Page Builder', 'optimizepress'), __('Page Builder', 'optimizepress'), 'edit_pages', OP_SN.'-page-builder');

        return array(op_tpl('live_editor/layouts',$data),op_tpl('live_editor/presets',$data));
    }

    function _get_content_layout_category_drop($current=0){
        global $wpdb;
        $cat_dropdown = '';
        $found = false;
        $cats = $wpdb->get_results( "SELECT id,name FROM `{$wpdb->prefix}optimizepress_layout_categories` ORDER BY name ASC");
        $cat_count = 0;
        if($cats){
            $cat_count = count($cats);
            foreach($cats as $cat){
                if($current < 1){
                    $current = $cat->id;
                    $found = true;
                } elseif($current == $cat->id){
                    $found = true;
                }
                $cat_dropdown .= '<option value="'.$cat->id.'"'.($current==$cat->id?' selected="selected"':'').'>'.op_attr($cat->name).'</option>';
            }
        }
        return array($cat_count,$cat_dropdown);
    }

    function create_content_layout_category(){
        global $wpdb;
        $nonce = op_post('_wpnonce');
        $arr = array(
            'error' => __('Verification failed, please refresh the page and try again.', 'optimizepress')
        );
        if(wp_verify_nonce($nonce,'op_liveeditor')){
            $name = op_post('category_name');
            $arr['error'] = __('Please provide a name for your funnel', 'optimizepress');
            if(!empty($name)){
                $funnel_dropdown = '';
                $wpdb->insert($wpdb->prefix.'optimizepress_layout_categories',array('name'=>$name));
                $current = $wpdb->insert_id;
                $cat_dropdown = $this->_get_content_layout_category_drop($current);

                $arr = array(
                    'html' => $cat_dropdown[1],
                );
            }
        }
        echo json_encode($arr);
        exit;
    }

    function get_layout(){
        global $wpdb;
        $this->check_nonce();
        $this->init_page();
        $out = array('error' => __('Could not find the selected layout, please try again.', 'optimizepress'));
        $layout = op_post('layout');
        if($result = $wpdb->get_row($wpdb->prepare("SELECT `layouts`,`settings` FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE `id`=%d",$layout))){
            $keep = op_post('keep_options');
            if(!is_array($keep)){
                $keep = array();
            }
            op_page_set_saved_settings($result,$keep);
            $out = array('done'=>true);
        }
        echo json_encode($out);
        exit;
    }

    function _get_presets_drop($current=0){
        global $wpdb;
        $preset_dropdown = '';
        $found = false;
        $presets = $wpdb->get_results( "SELECT id,name FROM `{$wpdb->prefix}optimizepress_presets` ORDER BY name ASC");
        if($presets){
            foreach($presets as $preset){
                if($current < 1){
                    $current = $preset->id;
                    $found = true;
                } elseif($current == $preset->id){
                    $found = true;
                }
                $preset_dropdown .= '<option value="'.$preset->id.'"'.($current==$preset->id?' selected="selected"':'').'>'.op_attr($preset->name).'</option>';
            }
        }
        return $preset_dropdown;
    }

    function save_preset(){
        global $wpdb;
        $preset = op_post('preset');
        if(!is_array($preset)){
            $preset = array();
        }
        $type = op_get_var($preset,'preset_type','new');
        switch($type){
            case 'new':
                $title = op_get_var($preset,'preset_new');
                if(empty($title)){
                    exit(json_encode(array('error'=>__('You must provide a preset title', 'optimizepress'))));
                }
                break;
            case 'overwrite':
                $id = op_get_var($preset,'preset_save',0);
                if($id < 1){
                    exit(json_encode(array('error'=>__('You must select a preset to overwrite', 'optimizepress'))));
                }
                break;
        }
        $this->save_page();
        $update = array();
        $layouts = op_post('layouts');
        if(!is_array($layouts)){
            $layouts = array();
        }
        $layouts = array_keys($layouts);
        $new_layouts = array();
        foreach($layouts as $layout){
            $new_layouts[$layout] = op_page_layout($layout,true);
        }
        $update['layouts'] = base64_encode(serialize($new_layouts));


        $new_settings = array();
        $settings = apply_filters('op_export_settings_array',array('membership', 'theme','header_layout','feature_area','feature_title','footer_area','color_scheme_template','typography','color_scheme_advanced','mobile_redirect','seo','scripts','fb_share','lightbox','exit_redirect'/*,'one_time_offer'*/,'launch_gateway','launch_funnel'));
        foreach($settings as $setting){
            if($conf = op_page_option($setting)){
                $new_settings[$setting] = base64_encode(serialize($conf));
            }
        }
        $update['settings'] = base64_encode(serialize($new_settings));

        if($type == 'new'){
            $wpdb->insert($wpdb->prefix.'optimizepress_presets',array_merge(array('name'=>$title),$update));
            $current = $wpdb->insert_id;
        } else {
            $wpdb->update($wpdb->prefix.'optimizepress_presets',$update,array('id'=>$id));
            $current = $id;
        }
        echo json_encode(array('preset_dropdown'=>$this->_get_presets_drop($current)));
        exit;
    }

    /**
     *
     * Sections for headers and colour scheme settings
     * @return void
     */
    function _sections($colorScheme = false)
    {
        if ($colorScheme) {
            $sections = array(
                'color_schemes' => array(
                'title' => __('Colour Scheme', 'optimizepress'),
                'description' => __('Customize the colour scheme for your page. You can use the advanced section to customize individual element colours', 'optimizepress'),
            ));
        } else {
            $sections = array(
                'layout' => array(
                    'title' => __('Layout', 'optimizepress'),
                    'description' => __('Customize the layout of your template. Setup your headers, navigation bars, feature areas and footers.', 'optimizepress'),
                ));
        }
        $i = 1;

        foreach($sections as $name => $section){
            if(!(op_page_config('disable',$name) === true)){
                $class = str_replace('_',' ',$name);
                $class = 'OptimizePress_Sections_'.str_replace(' ','_',ucwords($class));
                require_once OP_LIB.'sections/page/'.$name.'.php';
                $obj = new $class();
                $this->sections[$name] = array(
                    'object' => $obj->sections(),
                    'title' => $i.'. '.__($section['title'], 'optimizepress'),
                    'description' => __($section['description'], 'optimizepress')
                );
                $i++;
            }
        }
    }

    /**
     * Get sections variable value
     * @return Array
     */
    function getSections($colorScheme = false)
    {
        $this->_sections($colorScheme);
        return $this->sections;
    }

    /**
     * AJAX calls this function to save headers section of Live editor
     * @return void
     */
    function save_headers()
    {
        $this->check_nonce();
        $this->init_page();
        $this->_sections();
        $op = $_POST['op'];
        foreach($this->sections as $name => $section){
            $sections = $section['object'];
            foreach($sections as $section_name => $section_section){
                if(is_array($section_section)){
                    if(isset($section_section['save_action'])){
                        call_user_func_array($section_section['save_action'], array(op_get_var($op, $section_name, array())));
                    }
                    if(isset($section_section['module'])){
                        $mod_ops = op_get_var($op,$section_name,array());
                        $opts = op_get_var($section_section,'options',array());
                        op_mod($section_section['module'],op_get_var($section_section,'module_type','blog'))->save_settings($section_name,$opts,$mod_ops);
                    }
                }
            }
        }
        $tr = op_post('page');
        $thumbnail = $op['page']['thumbnail'];
        op_update_page_option('page_thumbnail', $thumbnail);
        echo json_encode(array('done' => true));
        exit;
    }

    /**
     * AJAX calls this function to save colours section of Live editor
     * @return void
     */
    function save_colours()
    {
        $this->check_nonce();
        $this->init_page();
        $this->_sections(true);
        $op = $_POST['op'];
        foreach($this->sections as $name => $section){
            $sections = $section['object'];
            foreach($sections as $section_name => $section_section){
                if(is_array($section_section)){
                    if(isset($section_section['save_action'])){
                        call_user_func_array($section_section['save_action'], array(op_get_var($op, $section_name, array())));
                    }
                    if(isset($section_section['module'])){
                        $mod_ops = op_get_var($op,$section_name,array());
                        $opts = op_get_var($section_section,'options',array());
                        op_mod($section_section['module'],op_get_var($section_section,'module_type','blog'))->save_settings($section_name,$opts,$mod_ops);
                    }
                }
            }
        }
        echo json_encode(array('done' => true));
        exit;
    }

    /**
     * for clearing layouts, as op_page_clean_layouts did not get page id from lightbox
     */
    function clearLayouts($id) {
        global $wpdb;
        $sql = "DELETE FROM ".$wpdb->prefix."optimizepress_post_layouts WHERE post_id = " . $id;

        $wpdb->query($sql);
    }

    /**
     * AJAX calls this function to save membership section of Live editor
     * @return void
     */
    function save_membership()
    {
        global $wpdb;
        $this->check_nonce();
        $this->init_page();
        $postId = $wpdb->escape($_POST['page_id']);
        if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
            c_ws_plugin__optimizemember_meta_box_saves::save_meta_boxes($postId);
        }
        // saving membership pages options
        $op = op_post('op');
        $current = op_page_option('membership', 'layout');
        // this happens only if we have something to save (it is a membership page!)
        if (!empty($op['pageType']['type']) && $op['pageType']['type'] == 'product') {
            update_post_meta($op['pageId'], 'type', 'product');
            op_update_page_option('membership', 'layout', $op['page']['preset_option']);
            // change title and slug
            $post = array(
                    'ID' => $op['pageId'],
                    'post_title' => $op['product']['name'],
                    'post_name' => sanitize_title($op['product']['name']),
                    'post_parent' => ''
            );
            wp_update_post($post);
        }
        if (empty($op['pageType']['type']) && !empty($op) && empty($op['type'])) { // saving product!
            update_post_meta($op['pageId'], 'type', 'product');
            op_update_page_option('membership', 'layout', $op['page']['preset_option']);
            // change title and slug
            $post = array(
                'ID' => $op['pageId'],
                'post_title' => $op['product']['name'],
                'post_name' => sanitize_title($op['product']['name']),
                'post_parent' => ''
            );
            wp_update_post($post);
        } else {
            if ($op['pageType']['type'] == 'category') {
                $page_id = $op['pageId'];
                $post = array(
                    'ID' => $op['pageId'],
                    'post_title' => $op['category']['name'],
                    'post_name' => sanitize_title($op['category']['name']),
                    'post_parent' => $op['pageType']['product']
                );
                wp_update_post($post);
                $value = array(
                    'layout' => $op['page']['preset_option'],
                    'description' => base64_encode($op['category']['description'])
                );
                update_post_meta($page_id, '_'.OP_SN.'_membership', maybe_serialize($value));
                $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
                );
                update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize($value));
            } else if ($op['pageType']['type'] == 'subcategory') {
                $page_id = $op['pageId'];
                $post = array(
                    'ID' => $op['pageId'],
                    'post_title' => $op['subcategory']['name'],
                    'post_name' => sanitize_title($op['subcategory']['name']),
                    'post_parent' => $op['subcategory']['category']
                );
                wp_update_post($post);
                $value = array(
                    'layout' => $op['page']['preset_option'],
                    'description' => base64_encode($op['subcategory']['description'])
                );
                update_post_meta($page_id, '_'.OP_SN.'_membership', maybe_serialize($value));
                $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
                );
                update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize($value));
            } else if ($op['pageType']['type'] == 'content') {
                if (!empty($op['content']['subcategory'])) {
                    $parentId = $op['content']['subcategory'];
                } else if (!empty($op['content']['category'])) {
                    $parentId = $op['content']['category'];
                } else {
                    $parentId = $op['pageType']['product'];
                }
                $page_id = $op['pageId'];
                $post = array(
                    'ID' => $op['pageId'],
                    'post_title' => $op['content']['name'],
                    'post_name' => sanitize_title($op['content']['name']),
                    'post_parent' => $parentId
                );
                wp_update_post($post);
                $value = array(
                    'layout' => $op['page']['preset_option'],
                    'description' => base64_encode($op['content']['description'])
                );
                update_post_meta($page_id, '_'.OP_SN.'_membership', maybe_serialize($value));
                $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
                );
                update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize($value));
            }
            if (!empty($op['type'])) {
                $post = array(
                        'ID' => $op['pageId'],
                        'post_parent' => ''
                );
                if ($op['type'] == 'product') {
                    wp_update_post($post);
                }
                update_post_meta($op['pageId'], 'type', $op['type']);
            }
        }
        //error_log(OP_PAGEBUILDER_ID);
        if (!empty($op['typeForChange'])) {
            $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
            );
            update_post_meta(OP_PAGEBUILDER_ID, '_'.OP_SN.'_theme', maybe_serialize($value));
            update_post_meta(OP_PAGEBUILDER_ID, 'type', $op['typeForChange']);
        }
        /*
         * DAP integration
         */
        if (isset($op['membership']['dap_redirect_url'])) {
            update_post_meta($postId, 'dap_redirect_url', $op['membership']['dap_redirect_url']);
        }
        /*
         * Fast Member integration
         */
        if (isset($op['membership']['fast_member_redirect_url'])) {
            update_post_meta($postId, 'fast_member_redirect_url', $op['membership']['fast_member_redirect_url']);
        }
        /*
         * iMember360 integration
         */
        if (isset($op['membership']['imember_redirect_url'])) {
            update_post_meta($postId, 'imember_redirect_url', $op['membership']['imember_redirect_url']);
        }
        echo json_encode(array('done' => true));
        exit;
    }

    /**
     * Enables comments on current page
     * @return [type] [description]
     */
    function enable_post_comments()
    {
        $this->check_nonce();
        $updated_post = array(
            'ID' => $_POST['page_id'],
            'comment_status' => 'open'
        );
        echo wp_update_post($updated_post);
    }

    /**
     * Returns thumbnail for the current image id
     * @return [type] [description]
     */
    function get_image_thumbnail()
    {
        $this->check_nonce();
        $image_id = $_POST['image_id'];
        echo json_encode(wp_get_attachment_image_src($image_id, 'thumbnail'));
        exit;
    }
}
