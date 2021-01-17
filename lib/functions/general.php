<?php
/*
 * Function: empty_allow_zero
* Description: Mimics the empty() function but allows the value 0.
*       By design, the empty() function will count 0 as being
*       empty. There are cases where we do not want this so
*       for those we use this function.
* Parameters:
*   $value (multi): A string, boolean, array, etc that we want to test
*
*/
function empty_allow_zero($value = ''){
    return (empty($value) && '0' != $value ? true : false);
}

/**
 * Check if LE page is protected with DAP
 *
 * If page's post content is not empty and its ID is 0 then redirect the user to page specified in dashboard settings.
 * DAP hijacks global $post and adds to $post->post_content its "members only message" as well as login form.
 *
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.0.8.
 * @param  string $template
 * @return mixed
 */
function dap_allowed_page($template)
{
    global $post;

    if (!empty($post->post_content) && $post->ID == 0) {
        if ('' !== $pageRedirectUrl = get_post_meta(get_queried_object_id(), 'dap_redirect_url', true)) {
            wp_redirect($pageRedirectUrl, 302);
        } else if (false === $redirectUrl = op_get_option('dap_redirect_url')) {
            wp_redirect(home_url(), 302);
        } else {
            wp_redirect($redirectUrl, 302);
        }
        exit();
    }

    return $template;
}

/**
 * Check if LE page is protected with Fast Member
 *
 * If page's post content is not empty and its ID is 0 then redirect the user to page specified in dashboard settings.
 * FM hijacks global $post and adds to $post->post_content its "members only message" as well as login form.
 *
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.1.0.
 * @param  string $template
 * @return mixed
 */
function fast_member_allowed_page($template)
{
    global $post;
    $originalPost = get_queried_object();
    if (!empty($post->post_content) && $post->post_content !== $originalPost->post_content) {
        if ('' !== $pageRedirectUrl = get_post_meta($originalPost->ID, 'fast_member_redirect_url', true)) {
            wp_redirect($pageRedirectUrl, 302);
        } else if (false === $redirectUrl = op_get_option('fast_member_redirect_url')) {
            wp_redirect(home_url(), 302);
        } else {
            wp_redirect($redirectUrl, 302);
        }
        exit();
    }

    return $template;
}

/**
 * Check if LE page is protected with iMember360
 *
 * If page is created with Live Editor and is_404() func returns true (and ofcourse, iMember is active)
 * we redirect user to defined page.
 *
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.1.0.
 * @param  string $template
 * @return mixed
 */
function imember_allowed_page($template)
{
    global $post;
    if (true === is_404()) {
        if ('' !== $pageRedirectUrl = get_post_meta(get_queried_object_id(), 'imember_redirect_url', true)) {
            wp_redirect($pageRedirectUrl, 302);
        } else if (false === $redirectUrl = op_get_option('imember_redirect_url')) {
            wp_redirect(home_url(), 302);
        } else {
            wp_redirect($redirectUrl, 302);
        }
        exit();
    }

    return $template;
}

/**
 * Process email integration for optin box.
 *
 * @return void
 */
function op_check_optin_form()
{
    if (isset($_POST['op_optin_form']) && $_POST['op_optin_form'] === 'Y') {

        /**
         * op_process_optin_before
         *
         * @hooked addUserToOpm - 10
         */
        do_action('op_process_optin_before', 'email');

        $message = '';

        // sanitizing
        $serializedData = sanitize_text_field(base64_decode($_POST['op_optin_form_data']));

        // checking data
	    if (0 === strpos($serializedData, 'O:') || false !== strpos($serializedData, ';O:')) {
	        wp_die('Not allowed!');
		}

		// we are checking if $serialzedData is JSON (new version)
	    if (0 === strpos($serializedData, '{')) {
			$data = json_decode($serializedData, true);
	    } else { // we have older legacy version
		    $data = unserialize($serializedData);
	    }


        foreach ($data['fields'] as $field) {
            $val = isset($_POST[$field['name']]) ? $_POST[$field['name']] : '';
            $message .= $field['text'] . ': ' . $val . "\n";
        }
        $message .= "\n";
        foreach ($data['extra_fields'] as $name => $text) {
            $val = isset($_POST[$name]) ? $_POST[$name] : '';
            $message .= $text . ': ' . $val . "\n";
        }
        $email = op_post('email');
        $webinar = op_post('gotowebinar');
        /*
         * Triggering GoToWebinar
         */
        if (false !== $webinar) {
            processGoToWebinar($webinar, $email);
        }

        // WP 4.3 started throwing 404 for requests with "name" parameter
        unset($_POST['name']);

        $status = wp_mail($data['email_to'], sprintf(__('Optin Form Submission - %s', 'optimizepress'), opGetRefererURL()),$message);

        /**
         * op_process_optin_after
         *
         * @hooked OptimizePress_Optin_Stats::recordOptin - 10
         */
        do_action('op_process_optin_after', 'email', $status);

        if ($data['redirect_url'] !== '') {
            wp_redirect($data['redirect_url']);
            exit;
        } else {
            $GLOBALS['op_optin_form_sent'] = true;
        }
    }
}
add_action('op_pre_template_include','op_check_optin_form');

/**
 * Check optin form nonce.
 * @param  string $type
 * @return void
 */
function optinFormCheckNonce($type)
{
    if (! defined("SiteGround_Optimizer\VERSION")) {
        if (false === wp_verify_nonce($_POST['op_optin_nonce'], 'op_optin')) {
            wp_die('Invalid request. Please refresh previous page and try again.');
        }
    }
}
add_action('op_process_optin_before', 'optinFormCheckNonce');

/**
 * Add user as registered WordPress user through OPM native method.
 *
 * @return void
 */
function addUserToOpm($integration)
{
    // Check if OPM is active
    if (!defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
        return;
    }

    // Check if OPM integration is on
    $level      = op_post('opm_level');
    $packages   = op_post('opm_packages');
    if (false === $level && empty($packages)) {
        return;
    }

    // Fetch email
    $email = op_post('email');
    if (empty($email)) {
        // InfusionSoft has special email field name
        // And there can be some strange case where email field name is located in "email_field" param
        if (isset($_POST['inf_field_Email'])) {
            $email = $_POST['inf_field_Email'];
        } elseif (isset($_POST['email_field']) && isset($_POST[$_POST['email_field']])) {
            $email = $_POST[$_POST['email_field']];
        } else {
            return;
        }
    }

    // Parse first and last name
    $firstName = $lastName = '';
    foreach ($_POST as $key => $value) {
        $key = strtolower($key);
        if ($key === 'name' || false !== stripos($key, 'fname') || false !== stripos($key, 'first')) {
            $firstName = $value;
            continue;
        }
        if (false !== stripos($key, 'lname') || false !== stripos($key, 'last')) {
            $lastName = $value;
        }
    }

    // Prepare data in OPM format
    $data = array(
        'op'    => 'create_user',
        'data'  => array(
            'user_login'            => $email,
            'user_email'            => $email,
            'first_name'            => $firstName,
            'last_name'             => $lastName,
            'optimizemember_level'  => $level,
            'optimizemember_ccaps'  => $packages,
            'opt_in'                => apply_filters('opm_optin_integration_opt_in', 1),
            'notification'          => apply_filters('opm_optin_integration_notification', 1),
        )
    );

    // Call OPM native method for user creation
    if (class_exists("c_ws_plugin__optimizemember_pro_remote_ops_in")) {
        c_ws_plugin__optimizemember_pro_remote_ops_in::create_user($data);
    }
}
add_action('op_process_optin_before', 'addUserToOpm', 10);

/**
 * Add user to OPM through AJAX for some providers.
 *
 * @return void
 */
function ajaxAddUserToOpm()
{
    check_ajax_referer('op_gtw_nonce', 'nonce');
    addUserToOpm('email');

    wp_send_json_success();
}
add_action('wp_ajax_' . OP_SN . '_add_to_opm', 'ajaxAddUserToOpm');
add_action('wp_ajax_nopriv_' . OP_SN . '_add_to_opm', 'ajaxAddUserToOpm');

/**
 * Record optin stat through AJAX for some providers (InfusionSoft).
 *
 * @return void
 */
function ajaxRecordOptin()
{
    check_ajax_referer('op_gtw_nonce', 'nonce');

    $type = sanitize_text_field($_POST['provider']);

    /**
     * op_process_optin_after
     *
     * @hooked OptimizePress_Optin_Stats::recordOptin - 10
     */
    do_action('op_process_optin_after', $type, true);

    wp_send_json_success();
}
add_action('wp_ajax_' . OP_SN . '_record_optin', 'ajaxRecordOptin');
add_action('wp_ajax_nopriv_' . OP_SN . '_record_optin', 'ajaxRecordOptin');

/**
 * Processes GoToWebinar interception request
 * @author OptimizePress <info@optimizepress.com>
 * @param  string $webinar
 * @param  email $email
 * @return void
 */
function processGoToWebinar($webinar, $email)
{
    $firstName  = 'Friend';
    $lastName   = '.';

    foreach ($_POST as $key => $value) {
        $key = strtolower($key);
        if ((in_array($key, array('first_name', 'first-name', 'first', 'name'))
        || false !== stripos($key, 'fname') || false !== stripos($key, 'firstname'))
        && !empty($value)) {
            $firstName = $value;
            continue;
        }
        if ((in_array($key, array('last_name', 'last-name', 'last', 'name'))
        || false !== stripos($key, 'lname') || false !== stripos($key, 'lastname'))
        && !empty($value)) {
            $lastName = $value;
            continue;
        }
    }

    require_once(OP_MOD . 'email/ProviderFactory.php');
    $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory('gotowebinar');
    if ($provider->isEnabled()) {

        $gotowebminarFields = array(
            'list'      => $webinar,
            'email'     => $email,
            'firstName' => $firstName,
            'lastName'  => $lastName
        );

        $gotowebminarFields = apply_filters('op_gotowebminarCustomFieldMaping', $gotowebminarFields, $_POST);

        $data = $provider->subscribe($gotowebminarFields);
    }
}

/**
 * Check for AJAX nonce before processing GoToWebinar integration
 * @return void
 */
function processAjaxGoToWebinar()
{
    check_ajax_referer('op_gtw_nonce', 'nonce');
    processGoToWebinar(op_post('webinar'), op_post('email'));

    wp_send_json_success();
}

/**
 * Returns full link to referer URL
 * @return string
 */
function opGetRefererURL()
{
    return 'http'.(is_ssl()?'s':'').'://'.$_SERVER['HTTP_HOST'].wp_get_referer();
}

/*
 * GoToWebinar AJAX hooks
 */
add_action('wp_ajax_' . OP_SN . '_process_gtw', 'processAjaxGoToWebinar');
add_action('wp_ajax_nopriv_' . OP_SN . '_process_gtw', 'processAjaxGoToWebinar');

function op_current_url(){
    return 'http'.(is_ssl()?'s':'').'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
}
function op_optin_box($options,$values,$output,$tpl='',$wrap_elems=array()){
    static $global_imgs;
    if(!isset($global_imgs)){
        $global_imgs = op_page_img('',true,'global');
    }
    $disable_name = isset($options['disable_name']);
    $content_fields = op_get_var($options,'content_fields',array());
    $ignore = array();
    if(isset($options['ignore_fields'])){
        $ignore = is_array($options['ignore_fields'])?$options['ignore_fields']:array_filter(explode('|',$options['ignore_fields']));
    }
    if(!isset($values['content']) || count($values['content']) == 0){
        $content = op_get_var($options,'content_fields',array());
        $values['content'] = array();
        foreach($content as $name => $field){
            $values['content'][$name] = op_get_var($field,'default');
        }
    }
    if(!isset($values['form_open']) || !isset($values['form_close'])){
        $values['form_open'] = '<form action="#" class="op-optin-validation">';
        $values['form_close'] = '</form>';
        $values['hidden_elems'] = '';
        $values['email_input'] = '<input type="email" required="required" name="email" placeholder="'.$values['content']['email_default'].'" class="email" />';
        if(!$disable_name){
            $values['name_input'] = '<input type="text" name="name" required="required" placeholder="'.$values['content']['name_default'].'" class="name" />';
        }
    }
    $content = op_get_var($values,'content',array());
    $fields = array(
        'title' => '<h2>%s</h2>',
        'form_header' => '<p>%s</p>',
        'footer_note' => '<p class="secure-icon"><img src="'.$global_imgs.'secure.png" alt="secure" width="16" height="15"> %s</p>',
    );
    $btn_config = op_get_var($options,'submit_button_config',array());
    $vars = array(
        'form_open' => op_get_var($values,'form_open'),
        'form_close' => op_get_var($values,'form_close'),
        'hidden_elems' => op_get_var($values,'hidden_elems'),
        'name_input' => (!$disable_name ? op_get_var($values,'name_input') : ''),
        'email_input' => op_get_var($values,'email_input'),
        'submit_button' => op_mod('submit_button')->output(array('submit_button'),$btn_config,$values['submit_button'],true),
        'extra_fields' => ''
    );
    if(isset($values['extra_fields']) && is_array($values['extra_fields'])){
        $vars['extra_fields'] = implode('',$values['extra_fields']);
    }
    foreach($content_fields as $name => $settings){
        if(!isset($content[$name])){
            $value = op_get_var($settings,'default');
        } else {
            $value = $content[$name];
        }
        $wrap = '';
        if(isset($wrap_elems[$name])){
            $wrap = $wrap_elems[$name];
        } elseif(isset($fields[$name])){
            $wrap = $fields[$name];
        }
        $vars[$name] = $wrap == '' ? $value : sprintf($wrap,$value);
    }
    if($tpl != ''){
        $output = $tpl;
    } else {
        $output = '
    <div class="op_signup_form">
        {title}
        {form_header}
        {form_open}
        <div>
            {hidden_elems}
            {name_input}
            {email_input}
            {extra_fields}
            {submit_button}
        </div>
        {footer_note}
        {form_close}
    </div>';
    }
    $out = op_convert_template($output,$vars);

    return $out;
}
function op_convert_template($tpl,$output){
    $keys = array_map('op_wrap_tpl_key',array_keys($output));
    return str_replace($keys,$output,$tpl);
}
function op_wrap_tpl_key($el){
    return '{'.$el.'}';
}
function op_texturize($content){
    return shortcode_unautop(wpautop(wptexturize($content)));
}
function op_clean_shortcode_content($str){
    if(substr($str,0,4) == '</p>'){
        $str = substr($str,4);
    }
    if(substr($str,strlen($str)-3) == '<p>'){
        $str = substr($str,0,-3);
    }
    return $str;
}
function op_get_column_width($column){
    static $layout;
    static $has_cols = true;
    if($has_cols && !isset($layout)){
        if($layouts = op_theme_config('layouts')){
            $tmp_layout = $layouts['layouts'][op_get_current_item($layouts['layouts'],op_get_option('column_layout','option'))];
            if(isset($tmp_layout['widths'])){
                $layout = $tmp_layout['widths'];
            } else {
                $has_cols = false;
            }
        } else {
            $has_cols = false;
        }
    }
    if($has_cols){
        $col = op_get_var($layout,$column);
        if($conf = op_get_option('column_layout','widths',$column)){
            $conf = intval($conf);
            if((isset($col['min']) && $conf < $col['min']) || (isset($col['max']) && $conf > $col['max'])){
                return $col['width'];
            } else {
                return $conf;
            }
        }
        return $col['width'];
    }
}
function op_post(){
    $args = func_get_args();
    return _op_traverse_array($_POST,$args);
}
function op_get(){
    $args = func_get_args();
    return _op_traverse_array($_GET,$args);
}
function _op_traverse_array($array,$args){
    if(count($args) == 0){
        return $array;
    } else {
        $found = true;
        for($i=0,$al=count($args);$i<$al;$i++){
            /// fixing notice if $args[$i] is not set, I don't know what I am doing (Zvonko)
            // this was manifested in Dashboard
            if (!isset($args[$i])) continue;
            if(is_array($args[$i])){
                if(!$array = _op_traverse_array($array,$args[$i])){
                    $found = false;
                    break;
                }
            } else {
                if(isset($array[$args[$i]])){
                    $array = $array[$args[$i]];
                } else {
                    $found = false;
                    break;
                }
            }
        }
        return $found ? $array : false;
    }
}
function op_truncate($title,$length=33,$more_text='&hellip;'){
    if(strlen($title) > $length){
        $parts = explode(' ',$title);
        $plength = count($parts);
        $title = '';
        $i = 0;
        while(strlen($title) < $length && $i < $plength){
            if(strlen($parts[$i]) + strlen($title) > $length){
                return $title.$more_text;
            } else {
                $title .= ' '.$parts[$i];
                $i++;
            }
        }
        return $title.$more_text;
    } else {
        return $title;
    }
}
function op_section_config($section){
    static $module_list;
    if(!isset($module_list)){
        if(defined('OP_PAGEBUILDER_ID')){
            require_once OP_LIB.'sections/page/functionality.php';
            $module_list = OptimizePress_Sections_Functionality::sections();
        } else {
            require_once OP_LIB.'sections/blog/modules.php';
            $module_list = OptimizePress_Sections_Modules::sections();
        }
    }
    if(isset($module_list[$section])){
        return $module_list[$section];
    }
    return false;
}
function op_get_current_item($array,$current_val){
    if(!is_array($array) || count($array) == 0){
        return false;
    }
    $cur = $current_val == '' ? key($array) : $current_val;
    return isset($array[$cur]) ? $cur : key($array);
}
function op_attr($str,$echo=false){
    if (strtolower(gettype($str))=='array'){
        foreach($str as $key=>$item){
            $str[$key] = htmlspecialchars($item, ENT_QUOTES);
            $str[$key] = str_replace(array("'",'"'),array('&#39;','&quot;'),$item);
        }
    } else {
        $str = htmlspecialchars($str, ENT_QUOTES);
        $str = str_replace(array("'",'"'),array('&#39;','&quot;'),$str);
        if($echo){
            echo $str;
        }
    }
    return $str;
}
function op_search_form(){
    if(op_check_include_tpl(array('searchform')) === false){
        get_search_form();
    }
}
function op_post_meta(){
    $cn = get_comments_number();
    $comments = sprintf(_n('1 Comment','%1$s Comments',$cn, 'optimizepress'), number_format_i18n( $cn ));
    $args = array(__('<p class="post-meta"><a href="%1$s" title="%2$s" rel="author">%3$s</a><a href="%4$s">%5$s</a></p>', 'optimizepress'),
        esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
        sprintf( esc_attr__( 'View all posts by %s', 'optimizepress'), get_the_author() ),
        esc_html( get_the_author() ),
        esc_url( get_comments_link() ),
        $comments
    );
    $args = apply_filters('op_post_meta',$args);
    call_user_func_array('printf',$args);
}
function op_get_enabled($array){
    $enabled = op_get_var($array,'enabled','N');
    return op_check_enabled($enabled);
}
function op_check_enabled($val){
    return ($val == 'N' || $val == 'Y' ? $val : 'N');
}
function op_img($file='',$return=false){
    $url = OP_IMG.$file;
    if($return){
        return $url;
    }
    echo $url;
}
function op_theme_img($file='',$return=false){
    $url = OP_THEME_URL.'images/'.$file;
    if($return){
        return $url;
    }
    echo $url;
}
function op_page_img($file='',$return=false,$folder=null){
    $path = is_null($folder) ? OP_PAGE_URL.'images/' : OP_PAGES_URL.$folder.'/images/';
    $url = $path.$file;
    if($return){
        return $url;
    }
    echo $url;
}
function op_get_var($array,$key,$default='',$wrap='',$force=false){
    $val = isset($array[$key]) ? $array[$key] : $default;

    $run = true;
    if(!$force && $val == ''){
        $run = false;
    }
    if($wrap != '' && $run){
        $val = sprintf($wrap,$val);
    }
    return $val;
}
function op_get_var_e($array,$key,$default='',$wrap='',$force=false){
    echo op_get_var($array,$key,$default,$wrap,$force);
}
function op_sidebar($name=null,$force=false){
    if(is_null($name) && (defined('OP_SIDEBAR') && OP_SIDEBAR === false) && $force !== true){
        return;
    }
    $templates = array();
    if ( isset($name) )
        $templates[] = "sidebar-{$name}";
    $templates[] = 'sidebar';
    op_check_include_tpl($templates);
}
function op_check_include_tpl($templates=array(),$return=false){
    $file = '';
    foreach($templates as $template){
        if(file_exists(OP_THEME_DIR.$template.'.php')){
            $file = $template;
            break;
        }
    }
    if(!empty($file)){
        if($return){
            return $file;
        } else {
            return op_theme_file($template);
        }
    }
    return false;
}
function op_init_theme($load_modules=true){
    op_theme_file('functions');
    $tpl_dir = op_get_option('theme','dir');

    // fixing the dreaded 4.0.1 issue with encoded quotes in sc attributes on normal pages/posts
    //add_filter( 'run_wptexturize', '__return_false' );

    if($tpl_dir){
        define('OP_THEME_DIR', OP_THEMES.$tpl_dir.'/');
        define('OP_THEME_URL', OP_URL.'themes/'.$tpl_dir.'/');
    }
    if($load_modules){
        $modules = op_theme_config('modules');
        $modules = is_array($modules) ? $modules : array();
        foreach($modules as $mod){
            op_mod($mod);
        }
    }
    do_action('op_init_theme');
}
function op_init_page($id){
    global $wp_query;
    define('OP_PAGEBUILDER',true);
    define('OP_PAGEBUILDER_ID',$id);
    do_action('op_pre_init_page');
    require_once OP_ASSETS.'live_editor.php';
    wp_enqueue_script('jquery', false, false, OP_VERSION);

    op_enqueue_base_scripts();

    // if (OP_SCRIPT_DEBUG === '') {
    //     //If jQuery version is higher than 1.9 we require jQuery migrate plugin (which is by default registered in WP versions that come with jQuery 1.9 or higher)
    //     if (wp_script_is('jquery-migrate', 'registered')) {
    //         wp_enqueue_script(OP_SN.'-noconflict-js', OP_JS.'jquery/jquery.noconflict'.OP_SCRIPT_DEBUG.'.js', array('jquery', 'jquery-migrate'), OP_VERSION);
    //     } else {
    //         wp_enqueue_script(OP_SN.'-noconflict-js', OP_JS.'jquery/jquery.noconflict'.OP_SCRIPT_DEBUG.'.js', array('jquery'), OP_VERSION);
    //     }
    //     wp_enqueue_script(OP_SN.'-loadScript', OP_JS.'jquery/jquery.loadScript'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
    // } else {
    //     if (wp_script_is('jquery-migrate', 'registered')) {
    //         wp_enqueue_script(OP_SN.'-op-jquery-base-all', OP_JS.'op-jquery-base-all.min.js', array('jquery', 'jquery-migrate'), OP_VERSION);
    //     } else {
    //         wp_enqueue_script(OP_SN.'-op-jquery-base-all', OP_JS.'op-jquery-base-all.min.js', array('jquery'), OP_VERSION);
    //     }
    // }

    op_init_page_theme();
    if(have_posts()){
        the_post();
    }
    $GLOBALS['op_content_layout'] = op_page_layout('body',false,'content_area','');
    $GLOBALS['op_footer_layout'] = '';
    if(op_page_option('footer_area','enabled') == 'Y' && op_page_option('footer_area','large_footer','enabled') == 'Y'){
        $GLOBALS['op_footer_layout'] = op_page_layout('footer',false,'footer_area');
    }
    do_action('op_after_init_page');
}
function op_init_page_theme($load_modules=true){
    require_once OP_FUNC.'page.php';
    op_page_file('functions');
    op_page_file('functions',array(),OP_PAGES.'global/');
    $tpl_type = op_page_option('theme','type');
    $tpl_dir = op_page_option('theme','dir');
    if($tpl_dir){
        define('OP_PAGE_DIR', OP_PAGES.$tpl_type.'/'.$tpl_dir.'/');
        define('OP_PAGE_DIR_REL', '/pages/'.$tpl_type.'/'.$tpl_dir.'/');
        define('OP_PAGE_URL', OP_URL.'pages/'.$tpl_type.'/'.$tpl_dir.'/');
        require_once OP_FUNC.'feature_area.php';
        $class = 'OptimizePress_Page_Feature_Area';
        if(file_exists(OP_PAGE_DIR.'feature_area.php')){
            require_once OP_PAGE_DIR.'feature_area.php';
        } elseif(file_exists(OP_PAGES.'global/feature_areas/'.$tpl_type.'.php')){
            require_once OP_PAGES.'global/feature_areas/'.$tpl_type.'.php';
        } else {
            $class = 'OptimizePress_Page_Feature_Area_Base';
        }
        $GLOBALS['op_feature_area'] = new $class();
    }
    if($load_modules){
        if(!(op_page_config('disable','functionality') === true)){
            require_once OP_LIB.'sections/page/functionality.php';
            $object = new OptimizePress_Sections_Functionality();
            $GLOBALS['functionality_sections'] = $object->sections();
            foreach($GLOBALS['functionality_sections'] as $name => $section){
                if(isset($section['module'])){
                    op_mod($section['module'],op_get_var($section,'module_type','blog'),array('section'=>$name));
                }
            }
        }
        do_action('op_page_module_init');
    }
}
function op_textdomain($var=OP_SN, $path=OP_DIR){
    static $loaded = array();
    if(!isset($loaded[$var])){
        $loaded[$var] = true;
        load_theme_textdomain($var, $path.'languages');
        $locale = get_locale();
        $locale_file = $path."languages/$locale.php";
        if ( is_readable($locale_file) )
            require_once($locale_file);
    }
}
function op_theme_url($path,$dir=null){
    if(is_null($dir)){
        $dir = op_get_option('theme','dir');
    }
    return OP_URL.'themes/'.$dir.'/'.ltrim($path,'/');
}
function op_page_url($path,$dir=null,$type=null){
    static $page_type;
    if(!isset($page_type)){
        $page_type = op_page_option('theme','type');
    }
    if(is_null($dir)){
        $dir = op_page_option('theme','dir');
    }
    return OP_URL.'pages/'.$page_type.'/'.$dir.'/'.ltrim($path,'/');
}
function op_pagination(array $args=array()){
    global $wp_query, $paged;
    $cur = $paged < 2 ? 1 : $paged;
    if ($paged == 0) {
        $cur = 1;
    }
    $defaults = array(
        'pages' => '',
        'range' => 4,
        'echo' => true
    );
    extract(wp_parse_args( $args, $defaults ));

    $showitems = ($range * 2)+1;

    if($pages == ''){
        if(!$pages = $wp_query->max_num_pages){
            $pages = 1;
        }
    }
    $out = array();
    if($pages != 1){
        if($paged > 2 && $paged > $range+1 && $showitems < $pages){
            $out[] = '<li class="first-link"><a href="'.get_pagenum_link(1).'">' . __('First', 'optimizepress') . '</a></li>';
        }
        if($paged > 1 && $showitems < $pages){
            $out[] = '<li class="previous-link"><a href="'.get_pagenum_link($paged - 1).'">' . __('Previous', 'optimizepress') . '</a></li>';
        }

        for($i=1; $i<= $pages; $i++){
            if($pages != 1 && ( !($i >= $paged+$range+1 || $i <= $paged-$range-1) || $pages <= $showitems)){
                $out[] = '<li class="numbered-link'.($cur == $i ? ' selected':'').'"><a href="'.get_pagenum_link($i).'">'.$i.'</a></li>';
            }
        }
        if($paged < $pages && $showitems < $pages){
            $out[] = '<li class="next-link"><a href="'.get_pagenum_link($cur + 1).'">' . __('Next', 'optimizepress') . '</a></li>';
        }
        if($paged < $pages-1 && $paged+$range-1 < $pages && $showitems < $pages){
            $out[] = '<li class="last-link"><a href="'.get_pagenum_link($pages).'">' . __('Last', 'optimizepress') . '</a></li>';
        }
    }
    if(count($out) > 0){
        $out = '
<div class="clear"></div>
<div class="pagination-details cf">
    <ul class="pagination">
    '.implode('',$out).'
    </ul>
    <p><em>'.sprintf(__('Page %1$s of %2$s', 'optimizepress'), $cur, $pages).'</em></p>
</div>';
        if($echo){
            echo $out;
        }
        return $out;
    }
}
function &op_mod($name,$type='blog',$extra_args=array()){
    static $mods = array();
    static $default = null;
    if(!isset($mods[$type])){
        $mods[$type] = array();
    }
    $isset = false;
    if(!isset($mods[$type][$name]) && file_exists(OP_LIB.'modules/'.$type.'/'.$name.'/'.$name.'.php')){
        require_once OP_LIB.'modules/base.php';
        require_once OP_LIB.'modules/'.$type.'/'.$name.'/'.$name.'.php';
        $class = 'OptimizePress_'.ucfirst($type).'_'.op_classname($name).'_Module';
        if(class_exists($class)){
            $mods[$type][$name] = new $class(array('url'=>OP_LIB_URL.'modules/'.$type.'/'.$name.'/','path'=>OP_LIB.'modules/'.$type.'/'.$name.'/','shortname'=>$name));
            $isset = true;
        }
    } else {
        $isset = true;
    }
    /*if(count($extra_args) > 0 && $isset){
        call_user_func(array($mods[$type][$name],'set_config'),$extra_args);
    }*/
    return $mods[$type][$name];
}
function op_classname($name){
    return str_replace(' ','_',ucwords(str_replace('_',' ',$name)));
}
function op_safe_string($str){
    return str_replace(Array(',', '\'', '/', '"', '&', '?', '!', '*', '(', ')', '^', '%', '$', '#', '@', '{', '}', '[', ']', '|', ':', ';', '<', '>', '.', '~', '`', '+', '_', '='), '', str_replace(Array(' '), '-', $str));
}

/*
 * Function: op_generate_id
 * Description: Returns a unique string based on the current time,
 *      a random number and applying an md5 hash to it
 * Parameters:
 *
 */
function op_generate_id(){
    return md5(strtotime('now').rand());
}

/**
 * Flattens multidimensional array (and sorts it by its keys if needed)
 *
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.1.4
 * @param  array $array
 * @param  bool $sort
 * @return array
 */
function flatten_multidim_array($array, $sort = false)
{
    if ($sort) {
        ksort($array);
    }

    $data = array();
    foreach ($array as $item) {
        if (is_array($item)) {
            foreach ($item as $field) {
                $data[] = $field;
            }
        }
    }

    return $data;
}

/**
 * Displays OP screen with warning message
 *
 * It uses 'wp_die' method but later on we can implement our own style/design
 *
 * @author OptimizePress <info@optimizepress.com>
 * @since  2.1.5
 * @param  string $message
 * @param  string $title
 * @param  mized $action
 * @return void
 */
function op_warning_screen($message, $title, $action = null)
{
    $message = '<p class="op-warning-screen-message">' . $message . '</p>';
    if (null !== $action) {
        $message .= '<p class="op-warning-screen-action">' . $action . '</p>';
    }

    wp_die($message, $title, array('response' => 409));
}

/**
 * Get all revisions for postID in chronologically reversed order
 * @author Zvonko Biskup <zbiskup@gmail.com>
 * @since 2.1.9
 * @param int $postID
 * @return mixed
 */
function op_get_page_revisions($postID)
{
    global $wpdb;

    $table = $wpdb->prefix . 'optimizepress_post_layouts';

    $revisions = $wpdb->get_results($wpdb->prepare(
        "SELECT id, modified FROM `{$table}` WHERE `post_id` = %d AND `type` = %s AND status = 'revision' ORDER BY modified DESC",
        $postID,
        'body'
    ));

    return $revisions;
}

/**
 * Restore page revision
 * @author Zvonko Biskup <zbiskup@gmail.com>
 * @since 2.1.9
 * @return mixed
 */
function restore_page_revision()
{
    global $wpdb;
    $table = $wpdb->prefix . 'optimizepress_post_layouts';

    $postID = op_post('postID');
    $revisionID = op_post('revisionID');

    if (empty($postID) || empty($revisionID)) {
        return 0;
        exit;
    }


    $wpdb->update($table, array('status' => 'revision'), array('post_id' => $postID, 'status' => 'publish'));
    $sql = "UPDATE " . $table . " SET status='publish', modified=NOW() WHERE post_id = " . $postID . " AND id=" . $revisionID;
    $wpdb->query($sql);
    //$wpdb->update($table, array('status' => 'publish'), array('id' => $revisionID));

    return 1;
    exit;
}

// adding action for AJAX call
add_action('wp_ajax_'.OP_SN.'-restore-page-revision', 'restore_page_revision');

/**
 * Processes the_content filter, and if needed ($shortcodes list of elements) removes wpautop filter.
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.1.10
 * @param string $sc
 * @param bool $force_remove_filter
 * @return string
 */
function op_process_content_filter($sc, $force_remove_filter=false) {

    // wordpress guys said this will fix our problems
    //add_filter('run_wptexturize', '__return_false');

    $shortcodes = array('[custom_html]');
    $shortcode_pattern = implode('|', $shortcodes);

    // hot and dirty patch for WP 4.0.1 and OP 2.3.2 issue
    //$sc = str_replace('&#8221;', '"', $sc);

    // We need to add escape characters for shortcode braces
    $shortcode_pattern = '/' . str_replace(array('[', ']'), array('\[', '\]'), $shortcode_pattern) . '/';
    $shortcode_match = preg_match($shortcode_pattern, $sc);

    if ($shortcode_match === 1 || $force_remove_filter) {

        remove_filter( 'the_content', 'wpautop' );
        // Removing gutenberg editor filter as it breaks OP
        if (function_exists('gutenberg_wpautop')) {
            remove_filter( 'the_content', 'gutenberg_wpautop', 6 );
        }
        remove_filter( 'the_content', 'wptexturize' );

        $processed = apply_filters('the_content', $sc);

        if(!defined('OP_LIVEEDITOR')){
            $processed = do_shortcode($processed);
        }

        /**
         * If we don't remove/add shortcode_unautop filter,
         * it stays at the wrong priority order in relation
         * to wpautop and shortcodes get wrapped in <p> tags.
         */
        remove_filter( 'the_content', 'shortcode_unautop' );
        add_filter( 'the_content', 'wptexturize' );
        add_filter( 'the_content', 'wpautop' );
        add_filter( 'the_content', 'shortcode_unautop' );
        if (function_exists('gutenberg_wpautop')) {
            add_filter('the_content', 'gutenberg_wpautop', 6);
        }

    } else {

        $processed = apply_filters('the_content', $sc);

    }

    return $processed;

}

/**
 * Processes shortcodes (do_shortcode) taking into account elements that need to have wpautop added.
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.1.10
 * @param string $sc
 * @param bool $force_remove_autop
 * @return string
 */
function op_do_shortcode($sc, $force_remove_autop=false) {

    $shortcodes = array('[custom_html]');
    $shortcode_pattern = implode('|', $shortcodes);

    // We need to add escape characters for shortcode braces
    $shortcode_pattern = '/' . str_replace(array('[', ']'), array('\[', '\]'), $shortcode_pattern) . '/';
    $shortcode_match = preg_match($shortcode_pattern, $sc);

    if ($shortcode_match === 1 || $force_remove_autop) {

        $processed = do_shortcode(shortcode_unautop($sc));

    } else {

        $processed = do_shortcode(shortcode_unautop(wpautop($sc)));

    }

    return $processed;

}

/**
 * Check whether we are in page created with Live Editor
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.4.0
 * @param $id integer
 * @return boolean
 */
function is_le_page($id = null)
{
    if (null === $id) {
        // Let's leave early if this isn't the page
        if (!is_page()) {
            return false;
        }

        global $wp_query;
        $id = $wp_query->get_queried_object_id();
    }

    return 'Y' === get_post_meta($id, '_optimizepress_pagebuilder', true);
}

/**
 * Get Client IP address
 * @since 2.3.4
 * @return string
 */
function op_get_client_ip_env()
{
    $ipaddress = '';

    if (getenv('HTTP_CLIENT_IP')) {
        $ipaddress = getenv('HTTP_CLIENT_IP');
    } else if(getenv('HTTP_X_FORWARDED_FOR')) {
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    } else if(getenv('HTTP_X_FORWARDED')) {
        $ipaddress = getenv('HTTP_X_FORWARDED');
    } else if(getenv('HTTP_FORWARDED_FOR')) {
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    } else if(getenv('HTTP_FORWARDED')) {
        $ipaddress = getenv('HTTP_FORWARDED');
    } else if(getenv('REMOTE_ADDR')) {
        $ipaddress = getenv('REMOTE_ADDR');
    } else {
        $ipaddress = 'UNKNOWN';
    }

    if ($ipaddress === '::1') {
        $ipaddress = '192.168.0.1';
    }

    /*
    *   On some server configurations, HTTP_X_FORWARDED_FOR or REMOTE_ADDR returns
    *   multiple comma-separated IPs This brakes some email integration,
    *   so we want to return only one IP.
    */
    if (strpos($ipaddress, ',') !== false) {
        $ipaddress = explode(',', $ipaddress);
        $ipaddress = $ipaddress[0];
    }

    return $ipaddress;
}

/**
 * Add "LiveEditor" filter to page lists table header
 * @param  array $views
 * @since 2.4.0
 * @return array
 */
function op_add_le_pages_filter($views)
{
    // Return if params are not met
    if (!isset($_GET['post_type']) || $_GET['post_type'] !== 'page') {
        return $views;
    }

    $class  = '';
    $count  = op_le_count_pages();

    // Active class
    if (isset($_GET['le_page_filter']) && $_GET['le_page_filter'] == '1') {
        $class = ' class="current"';
    }

    $views['live-editor'] = sprintf('<a href="%1$s"%2$s>%3$s <span class="count">(%4$d)</span></a>', admin_url('edit.php?post_type=page&le_page_filter=1&post_status=le'), $class, __('LiveEditor Pages', 'optimizepress'), $count);

    return $views;
}
add_filter('views_edit-page', 'op_add_le_pages_filter');

/**
 * Filter out pages not built with LE
 * @param  WP_Query $query
 * @since 2.4.0
 * @return WP_Query
 */
function op_table_le_pages_filter($query)
{
    if (!is_admin()) {
        return $query;
    }

    global $pagenow, $typenow;

    if ($pagenow === 'edit.php' && $typenow === 'page'
    && isset($_GET['le_page_filter']) && $_GET['le_page_filter'] == '1') {
        $query->set('meta_key', '_optimizepress_pagebuilder');
        $query->set('meta_value', 'Y');
    }

    return $query;
}
add_filter('pre_get_posts', 'op_table_le_pages_filter');

/**
 * Return number of LE pages
 * @since 2.4.0
 * @return integer
 */
function op_le_count_pages()
{
    $query = new WP_Query(array(
        'post_type'         => 'page',
        'meta_key'          => '_optimizepress_pagebuilder',
        'meta_value'        => 'Y',
        'posts_per_page'    => -1,
    ));

    return $query->found_posts;
}

/**
 * Set filters for adding OptimizeLeads button in WYSIWYG
 * @return void
 */
function custom_mce_button()
{
    // Check if user have permission
    if (!current_user_can('edit_posts') || !current_user_can('edit_pages')) {
        return;
    }

    // Check if user have  OptimizeLeads API Key
    $apikey = get_option(OP_SN . '_optimizeleads_api_key');
    if (empty($apikey)) {
        return;
    }

    // Check if WYSIWYG is enabled
    if ( 'true' == get_user_option('rich_editing') ) {
        add_filter( 'mce_external_plugins', 'custom_tinymce_plugin' );
        add_filter( 'mce_buttons', 'register_mce_button' );
    }
}
add_action('admin_head', 'custom_mce_button');

/**
 * Create new WYSIWYG editor button
 * @param  Array $plugin_array
 * @return Array
 */
function custom_tinymce_plugin($plugin_array) {
  $plugin_array['custom_mce_button'] =  OP_JS.'/optimizeleads_wysiwyg_button'.OP_SCRIPT_DEBUG.'.js';
  return $plugin_array;
}

/**
 * Register new button in the editor
 * @param  Array $plugin_array
 * @return Array
 */
function register_mce_button($buttons) {
    array_push($buttons, 'custom_mce_button');
    return $buttons;
}
