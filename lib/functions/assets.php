<?php

class OptimizePress_Assets_Core {

    var $included_assets = array();
    var $assets = array();
    var $asset_keys = array();
    var $lang;

    function __construct(){
        global $wpdb;
        if(op_get_option('installed') == 'Y'){
            require_once OP_ASSETS.'default.php';

            // Load OPPP assets to tease customers and provide them upsell links
            if ( ! defined('OPPP_BASE_URL')) {
                require_once OP_ASSETS . 'oppp.php';
            }

            // This isn't used but it is causing unnecessary DB request
            // $assets = $wpdb->get_col( "SELECT name FROM `{$wpdb->prefix}optimizepress_assets`" );
            // if($assets){
            //  foreach($assets as $asset){
            //      $this->load_addon($asset);
            //  }
            // }

            add_action('wp_ajax_'.OP_SN.'-assets-folder-list', array($this, 'folder_list'));
            add_action('wp_ajax_'.OP_SN.'-assets-posts-list', array($this, 'posts_list'));
            /*
             * Email marketing services integration hooks
             */
            add_action('wp_ajax_'.OP_SN.'-email-provider-list', array($this, 'providerList'));
            add_action('wp_ajax_'.OP_SN.'-email-provider-enabled', array($this, 'providerEnabled'));
            add_action('wp_ajax_'.OP_SN.'-email-provider-details', array($this, 'providerDetails'));
            add_action('wp_ajax_'.OP_SN.'-email-provider-items', array($this, 'providerItems'));
            add_action('wp_ajax_'.OP_SN.'-email-provider-item-fields', array($this, 'providerItemFields'));
            add_action('wp_ajax_'.OP_SN.'-email-provider-tags', array($this, 'providerTags'));

            /**
             * Live search hooks
             */
            add_action('wp_ajax_'.OP_SN.'-live-search', array($this, 'liveSearch'));
            add_action('wp_ajax_nopriv_'.OP_SN.'-live-search', array($this, 'liveSearch'));
            add_action('the_content', array($this, 'removeContentFromSearchResults'));
            add_action('pre_get_posts', array($this, 'excludePostsFromSearch'));

            add_filter('the_content', array($this,'fixptag'));

            /*
             * Content template
             */
            add_action('wp_ajax_' . OP_SN . '-content-layout-delete', array($this, 'deleteContentLayout'));

            /**
             * OptimizeLeads
             */
            add_action('wp_ajax_'.OP_SN.'-get-optimizeleads-boxes', array($this, 'optimizeleadsBoxes'));
            add_action('wp_ajax_'.OP_SN.'-get-optimizeleads-box', array($this, 'optimizeleadsBox'));
            add_action('wp_ajax_'.OP_SN.'-get-optimizeleads-auto-boxes', array($this, 'optimizeleadsAutoBoxes'));

        }
    }

    function posts_list()
    {

        $args= array(
            'numberposts' => -1,
            'orderby' => 'post_date',
            'order' => 'DESC',
            'post_status' => 'publish',
        );
        $posts_array = get_posts($args);
        if ($posts_array) {

            foreach ($posts_array as $key => $value) {
                $categories = get_the_category($value->ID);
                $categoryString = '';
                foreach ($categories as $category) {
                    $categoryString .= $category->cat_name . ' ';
                }

                $posts_array[$key]->categories = $categoryString;
            }

            echo json_encode($posts_array);
        } else {
            json_decode("ERR10");
        }
        die();
    }


    function deleteContentLayout()
    {
        check_ajax_referer('op_content_layout_delete', 'nonce');

        $le = new OptimizePress_LiveEditor();
        if ($le->delete_content_layout(op_post('layout')) == 1) {
            wp_send_json_success();
        } else {
            wp_send_json_error();
        }
    }

    /**
     * Returns list of enabled email marketing service providers
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function providerList()
    {
        require_once(OP_LIB . 'sections/dashboard/email_marketing_services.php');
        require_once(OP_MOD . 'email/ProviderFactory.php');

        $enabledProviders = array();

        $services = new OptimizePress_Sections_Email_Marketing_Services();
        $providers = $services->sections();

        if (is_array($providers) && count($providers) > 0) {

            foreach ($providers as $type => $service) {

                /*
                 * Removing GoToWebinar from provider list
                 */
                if ('gotowebinar' === $type) {
                    continue;
                }

                $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);
                if (null !== $provider && true === $provider->isEnabled()) {
                    $enabledProviders[$type] = $service['title'];
                }
            }
        }

        $arg = func_get_arg(0);
        if (empty($arg)) {
            echo json_encode(array('providers' => $enabledProviders));

            /*
             * Every WP ajax function needs to be exited
             */
            exit();
        }
        return $enabledProviders;
    }

    /**
     * Outputs (JSON) email marketing service provider data (lists/forms)
     * @author OptimizePress <info@optimizepress.com>
     * @param string $provider
     * @param bool $return
     * @param bool $special
     * @return void
     */
    function providerItems($type = null, $return = null, $special = null)
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($type)) {
            $type = op_post('provider');
        }

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($special)) {
            $special = (bool) op_post('special');
        }

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);

        if (null === $provider) {
            exit();
        }

        try {
            if ($type === 'infusionsoft' && $special === true) {
                $data = $provider->getFollowUpSequences();
            } else {
                $data = $provider->getItems();
            }
        } catch (Exception $e) {
            error_log('There seems to be an error with the integration data for "' . $type . '". Check EMS integration data for this provider.');
            $data['lists'] = array('error' => array('name' => __('There seems to be an error with the integration data.', 'optimizepress')));
        }

        if (null === $return) {
            echo json_encode($data);

            /*
             * Every WP ajax function needs to be exited
             */
            exit();
        }

        return $data;
    }

    /**
     * Outputs (JSON) email marketing service provider data (lists/forms)
     * @author OptimizePress <info@optimizepress.com>
     * @param string $type
     * @param string $list
     * @param bool $return
     * @return void
     */
    function providerItemFields($type = null, $list = null, $return = null)
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($type)) {
            $type = op_post('provider');
        }

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($list)) {
            $list = op_post('list');
        }

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($special)) {
            $special = (bool) op_post('special');
        }

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);

        if (null === $provider) {
            exit();
        }

        if (empty($list)) {
            exit();
        }

        $data = $provider->getListFields($list);

        if (null === $return) {
            echo json_encode($data);

            /*
             * Every WP ajax function needs to be exited
             */
            exit();
        }

        return $data;
    }

    /**
     * Outputs (JSON) email marketing service provider tags (or custom fields)
     * @author OptimizePress <info@optimizepress.com>
     * @param string $provider
     * @param bool $return
     * @param bool $special
     * @return void
     */
    function providerTags($type = null, $return = null, $special = null)
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($type)) {
            $type = op_post('provider');
        }

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);

        if (null === $provider) {
            exit();
        }

        $data = $provider->getTags();

        if (null === $return) {
            echo json_encode($data);

            /*
             * Every WP ajax function needs to be exited
             */
            exit();
        }

        return $data;
    }

    /**
     * Outputs (JSON) email marketing service provider data (just list names and IDs)
     * @author OptimizePress <info@optimizepress.com>
     * @param string $provider
     * @param bool $return
     * @param bool $special
     * @return void
     */
    function providerDetails($type = null, $return = null, $special = null)
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($type)) {
            $type = op_post('provider');
        }

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($special)) {
            $special = (bool) op_post('special');
        }

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);

        if (null === $provider) {
            exit();
        }

        if ($type === 'infusionsoft' && $special === true) {
            $data = $provider->getFollowUpSequences();
        } else {
            $data = $provider->getData();
        }

        if (null === $return) {
            echo json_encode($data);

            /*
             * Every WP ajax function needs to be exited
             */
            exit();
        }

        return $data;
    }

    /**
     * Returns provider enabled status
     * @author OptimizePress <info@optimizepress.com>
     * @param  string $type
     * @return bool
     */
    function providerEnabled($type = null)
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        $return = true;

        /*
         * If $type is not null that means that we are not calling this method via AJAX
         */
        if (empty($type)) {
            $type   = op_post('provider');
            $return = false;
        }

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);

        if (!$return) {
            echo (int) $provider->isEnabled();

            /*
             * Every WP ajax function needs to be exited
             */
            exit();
        }

        return $provider->isEnabled();
    }

    /**
     * Registers user on provider
     * @author OptimizePress <info@optimizepress.com>
     * @param  string $type
     * @param  string $list
     * @param  string $email
     * @param  string $fname
     * @param  string $lname
     * @return bool
     */
    function providerRegister($type, $list, $email, $fname, $lname)
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');
        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type);
        return $provider->register($list, $email, $fname, $lname);
    }

    /**
     * Live Search function called from the live search element on key up or pressed enter
     * @author Zvonko Biškup <zbiskup@gmail.com>
     * @return string
     */
    function liveSearch()
    {
        global $wpdb;
        if (!empty($_POST['all_pages'])) { // search through all pages
            $sql = "
                SELECT ID, post_title FROM $wpdb->posts
                WHERE post_status = 'publish'
                AND post_title LIKE '%".esc_sql($_POST['searchTerm'])."%'
                OR post_content LIKE '%".esc_sql($_POST['searchTerm'])."%'
                AND (post_type = 'page' OR post_type='post')
                ORDER BY post_title
                LIMIT 10
            ";
            $results = $wpdb->get_results($sql);
        } else {
            if (!empty($_POST['product']) && empty($_POST['category']) && empty($_POST['subcategory'])) { //within product subpages
                $post_parent = esc_sql($_POST['product']);
            } else if (!empty($_POST['product']) && !empty($_POST['category']) && empty($_POST['subcategory'])) {
                $post_parent = esc_sql($_POST['category']);
            } else if (!empty($_POST['product']) && !empty($_POST['category']) && !empty($_POST['subcategory'])) {
                $post_parent = esc_sql($_POST['subcategory']);
            }
            $temp = get_pages('child_of='.$post_parent);
            $results = array();
            if (!empty($temp)) {
                foreach($temp as $result) {
                    if (false !== stripos($result->post_title, esc_sql($_POST['searchTerm']))) {
                        $obj = new stdClass();
                        $obj->ID = $result->ID;
                        $obj->post_title = $result->post_title;
                        array_push($results, $obj);
                    }
                }
            }
        }
        if (!empty($results)) {
            foreach ($results as $result) {
                echo '<li class="op-live-search-results-item"><a href="'.get_permalink($result->ID).'">'.$result->post_title.'</a></li>';
            }
        } else {
            echo '<li class="op-live-search-results-item op-live-search-results-item--empty">' . __('No results', 'optimizepress') . '</li>';
        }

        exit();
    }

    /**
     * Function that exlude "OptimizePress Content Preview Page" post from wordpress search
     * ?s=content
     * @return void
     */
    function excludePostsFromSearch($query)
    {
         if( $query->is_main_query() && is_search() ){

            $post = get_page_by_title('OptimizePress Content Preview Page');

            if (NULL === $post) {
               return;
            }

            if (!isset($post->ID)) {
                return;
            }

            $hide_posts = array($post->ID);

            //Merge arrays if some posts are already been excluded
            $excluded = $query->get('post__not_in');
            if (! empty($excluded)) {
                $post_not_in = $query->get('post__not_in');
                $hide_posts = array_merge(array($post->ID), $post_not_in);
            }

            //Exlude posts
            if (! $query->is_single && ! is_admin()) {
               $query->set('post__not_in', $hide_posts);
            }
         }
    }

    /**
     * Removes content from search results page.
     * @param $content
     * @return string
     */
    function removeContentFromSearchResults($content)
    {
        // if the op search string is found, remove the content alltogether
        if (false !== stripos($content, 'OP_SEARCH_GENERATED')) {
            $content = '';
        }

        return $content;
    }

    /**
     * Prints list of optimizeleads boxes for
     * the current optimizeleads API key,
     * or notification that user should
     * connect optimizeleads
     *
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function optimizeleadsBoxes()
    {
        $api_key = op_default_attr('optimizeleads_api_key');
        $api_key_error = op_default_attr('optimizeleads_api_key_error');

        if (!isset($api_key) || empty($api_key) || !empty($api_key_error)) {
            echo '{ "error": "no_api_key" }';
            exit();
        }

        global $wp_version;
        $args = array(
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ),
            'blocking'    => true,
            'headers'     => array('X-API-Token' => $api_key),
            'cookies'     => array(),
            'body'        => null,
            'compress'    => false,
            'decompress'  => true,
            'sslverify'   => true,
            'stream'      => false,
            'filename'    => null
        );

        if (false === ($response = get_transient('el_opl_boxes_' . $api_key))) {
            $response = wp_remote_get(OP_LEADS_URL . 'api/boxes', $args);
            set_transient('el_opl_boxes_' . $api_key, $response, OP_LEADS_BOXES_CACHE_EXPIRATION_SEC);
        }

        print_r($response['body']);
        exit();
    }

    /**
     * Prints optimizeleads boxe details for
     * the current optimizeleads API key,
     * and for the current box uid
     * or notification that user
     * should connect
     * optimizeleads
     *
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function optimizeleadsBox()
    {

        if (empty($_POST['uid'])) {
            echo '{ "error": "no_box_uid" }';
            exit();
        }

        $api_key = op_default_attr('optimizeleads_api_key');
        if (!isset($api_key) || empty($api_key)) {
            echo '{ "error": "no_api_key" }';
            exit();
        }

        $uid = $_POST['uid'];
        global $wp_version;

        $args = array(
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ),
            'blocking'    => true,
            'headers'     => array('X-API-Token' => $api_key),
            'cookies'     => array(),
            'body'        => null,
            'compress'    => false,
            'decompress'  => true,
            'sslverify'   => true,
            'stream'      => false,
            'filename'    => null
        );

        $response = wp_remote_get( OP_LEADS_URL . 'api/boxes/' . $uid, $args );
        print_r($response['body']);

        exit();
    }

    /**
     * Prints a list of optimizeleads boxes for
     * the current optimizeleads API key.
     * It only returns active boxes
     * that are not triggered
     * manually (on click)
     *
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function optimizeleadsAutoBoxes()
    {
        $api_key = op_default_attr('optimizeleads_api_key');
        if (!isset($api_key) || empty($api_key)) {
            echo '{ "error": "no_api_key" }';
            exit();
        }

        global $wp_version;
        $args = array(
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ),
            'blocking'    => true,
            'headers'     => array('X-API-Token' => $api_key),
            'cookies'     => array(),
            'body'        => null,
            'compress'    => false,
            'decompress'  => true,
            'sslverify'   => true,
            'stream'      => false,
            'filename'    => null
        );

        $response = wp_remote_get( OP_LEADS_URL . 'api/boxes', $args );
        $response = json_decode($response['body']);
        $result = array();

        foreach($response->boxes as $box) {
            if (isset($box->publish_options->open_on) && $box->publish_options->open_on !== 'click') {
                $result[] = $box;
            }
        }

        print_r(json_encode($result));
        exit();
    }

    function fixptag($pee){
        $pee = preg_replace('!\]<br \/>\s*<h([1-6]*)!i',']<h$1',$pee);
        $pee = preg_replace('!<p>\s*\[\/!', "[/", $pee);
        return $pee;
    }

    function assets($group='',$asset='',$clear=false){
        global $wpdb;
        if(count($this->assets) == 0 || $clear){
            $assets = array('core'=>array(),'addon'=>array(),'theme'=>array());
            $assets = apply_filters('op_assets_before_addons',$assets);
            $assets_results = $wpdb->get_results( "SELECT name,title,settings FROM `{$wpdb->prefix}optimizepress_assets` ORDER BY title ASC" );
            if($assets_results){
                foreach($assets_results as $result){
                    $assets['addon'][$result->name] = array(
                        'title' => $result->title,
                        'settings' => $result->settings,
                    );
                }
            }
            $assets = apply_filters('op_assets_after_addons',$assets);
            $this->assets = array_filter($assets);
        }
        if(count($this->assets) > 0 && !empty($group)){
            return isset($this->assets[$group]) && isset($this->assets[$group][$asset]) ? $this->assets[$group][$asset] : false;
        }
        return $this->assets;
    }

    function parse_assets()
    {
        return array_filter(apply_filters('op_assets_parse_list', array()));
    }

    function lang(){
        if(!isset($this->lang)){
            $arr = array();
            if(file_exists(OP_LIB.'js/assets/lang.php')){
                include OP_LIB.'js/assets/lang.php';
            }
            $this->lang = apply_filters(OP_SN.'-asset-lang',$arr);
        }
        return $this->lang;
    }

    function lang_key($key){
        $lang = $this->lang();
        if(isset($lang[$key])){
            return $lang[$key];
        }
        return $key;
    }

    function asset_keys(){
        if(count($this->assets) == 0){
            $this->assets();
        }
        if(count($this->asset_keys) == 0){
            $keys = array();
            foreach($this->assets as $assets){
                $keys = array_merge($keys,$assets);
            }
            $this->asset_keys = array_keys($keys);
        }
        return $this->asset_keys;
    }

    function refresh_assets($asset='',$clear=false){
        static $assets;
        if(!isset($assets) || $clear){
            $assets = apply_filters('op_addon_assets',array());
            $assets = array_filter($assets);
        }
        if(!empty($asset)){
            return isset($assets[$asset]) ? $assets[$asset] : false;
        }
        return $assets;
    }

    function save_assets(){
        global $wpdb;
        $dir = @ dir(OP_ASSETS.'addon');
        if($dir){
            while(($file = $dir->read()) !== false){
                if($file != '.' && $file != '..' && $file != 'index.php' && strpos($file, '.') !== 0){
                    $this->load_addon($file);
                }
            }
        }
        $assets = $this->refresh_assets('','',true);
        $keys = array_keys($assets);
        $str = '';
        for($i=0,$il=count($keys);$i<$il;$i++){
            $str .= ($str == '' ? '' :',').'%s';
        }

        /*
         * On some occasions $str was empty and this is a check for it. I don't know what this table does or if it is used in any way
         */
        if (empty($str)) {
            $wpdb->query("DELETE FROM `{$wpdb->prefix}optimizepress_assets`");
        } else {
            $wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}optimizepress_assets` WHERE name NOT IN({$str})",$keys));
        }
        foreach($assets as $tag => $info){
            $this->check_add($tag,$info['title'],op_get_var($info,'settings','N'));
        }
    }

    function check_add($name,$title,$settings='N'){
        global $wpdb;
        $entry = $wpdb->get_col( $wpdb->prepare(
            "SELECT id FROM `{$wpdb->prefix}optimizepress_assets` WHERE `name` = %s",
            $name
        ));
        if(!$entry){
            $wpdb->insert($wpdb->prefix.'optimizepress_assets',array('name'=>$name,'title'=>$title,'settings'=>$settings));
        }
    }

    function load_addon($asset){
        if(!isset($this->included_assets[$asset]) && is_dir(OP_ASSETS.'addon/'.$asset) && file_exists(OP_ASSETS.'addon/'.$asset.'/'.$asset.'.php')){
            $included_assets[$asset] = true;
            require_once OP_ASSETS.'addon/'.$asset.'/'.$asset.'.php';
        }
    }

    function folder_list(){
        $files = array();
        $checks = array('image','style','checkbox');
        foreach($checks as $chk){
            if(($folders = op_post('folders',$chk)) && is_array($folders)){
                $files[$chk] = $this->_process_files($folders,$chk);
            }
        }
        echo json_encode($files);
        exit;
    }

    function _process_files($folders,$type='style',$returnfiles=false){
        $files = array();
        static $checked_paths = array();
        foreach($folders as $f){
            if(isset($f['group']) && isset($f['tag'])){
                switch($f['group']){
                    case 'addon':
                        $path = apply_filters('op_assets_addons_path', OP_ASSETS . 'addon/', $f['tag']);
                        $url = apply_filters('op_assets_addons_url', OP_ASSETS_URL . 'addon/', $f['tag']);
                        break;
                    case 'theme':
                        if(defined('OP_THEME_PATH')){
                            $path = OP_THEME_PATH.'assets/';
                            $url = OP_THEME_URL.'assets/';
                        } elseif(defined('OP_PAGE_URL')){
                            $path = OP_PAGE_PATH.'assets/';
                            $url = OP_PAGE_URL.'assets/';
                        }
                        break;
                    default:
                        $path = apply_filters('op_assets_core_path', OP_ASSETS . 'images/', $f['tag']);
                        $url = apply_filters('op_assets_core_url', OP_ASSETS_URL . 'images/', $f['tag']);
                        break;
                }

                $folder = (!isset($f['folder']) || empty($f['folder']) ? '':'/'.$f['folder']);

                if (strpos($folder, '/../') === 0) {
                    $folder = str_replace('/../', '', $folder);
                    $tmppath = $path.$folder;
                    $url .= $folder.'/';
                } else {
                    $tmppath = $path.$f['tag'].$folder;
                    $url .= $f['tag'].$folder.'/';
                }

                if(isset($checked_paths[$tmppath])){
                    $files[$f['fieldid']] = $checked_paths[$tmppath];
                } else {
                    $newfiles = array();
                    if(is_dir($tmppath)){
                        $dir = @ dir($tmppath);
                        if($dir){
                            while(($file = $dir->read()) !== false){
                                if($file != '.' && $file != '..' && $file != 'index.php' && strpos($file, '.') !== 0){
                                    $newfiles[$file] = $url.$file;
                                }
                            }
                        }
                    }
                    natsort($newfiles);
                    $checked_paths[$tmppath] = $files[$f['fieldid']] = $newfiles;
                }

                if(!$returnfiles){
                    $func = '_generate_'.$type.'_selector';
                    $tmp = $this->$func($tmppath,$files[$f['fieldid']],$f['fieldid'],$f);
                    $files[$f['fieldid']] = $tmp[0];
                }
            }
        }
        return $files;
    }

    function _remove_ignore_vals($arr,$folder){
        if(isset($folder['ignore_vals'])){
            foreach($folder['ignore_vals'] as $ignore){
                if(isset($arr[$ignore])){
                    unset($arr[$ignore]);
                }
            }
        }
        return $arr;
    }

    function _generate_image_selector($path,$files,$fieldid,$folder){
        static $html = array();
        static $array_elements = array();
        if(!isset($html[$path])){
            $arr = array();
            $str = '<ul class="cf">';
            $strarr = array();
            foreach($files as $file => $url){
                $strarr[$file] = '<li class="op-asset-dropdown-list-item"><a href="#"><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></a></li>';
                $arr[esc_attr($file)] = $file;
            }
            $strarr = $this->_remove_ignore_vals($strarr,$folder);
            $arr = $this->_remove_ignore_vals($arr,$folder);
            $str .= implode('',$strarr).'</ul>';
            $html[$path] = $str;
            $array_elements[$path] = $arr;
        }
        return array($html[$path],$array_elements[$path]);
    }

    function _generate_style_selector($path,$files,$fieldid,$folder){
        static $html = array();
        static $array_elements = array();

        $opppStyles = apply_filters('op_assets_oppp_element_styles', array(), $fieldid);
        $disableOpppStyles = ! defined('OPPP_BASE_URL');
        $shownOpppUpsellBox = defined('OPPP_BASE_URL');

        if(!isset($html[$path])){
            $styles = array();
            $arr = array();
            foreach($files as $file => $url){
                $file = explode('.',$file);
                $file = explode('_', $file[0]);
                $file = end($file);

                $isOpppStyle = in_array($file, $opppStyles);

                // Temp fix until we turn on the upsell
                /*if ($isOpppStyle && !defined('OPPP_BASE_URL')) {
                    continue;
                }*/

                if ($isOpppStyle && $disableOpppStyles) {
                    if ( ! $shownOpppUpsellBox) {
                        $styles['oppp'] = '<li class="op-asset-dropdown-list-item op-asset-dropdown-list-item--loaded">' . OptimizePress_Oppp_Assets::getUpsellBox() . '</li>';
                    }

                    $styles[$file] = '<li class="op-asset-dropdown-list-item optimize-press-is-oppp-element"><div><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></div></li>';
                } else if ($isOpppStyle) {
                    if ( ! $shownOpppUpsellBox) {
                        $styles['oppp'] = '<li class="op-asset-dropdown-list-item op-asset-dropdown-list-item--loaded">' . OptimizePress_Oppp_Assets::getUpsellBox() . '</li>';
                    }

                    $styles[$file] = '<li class="op-asset-dropdown-list-item optimize-press-is-oppp-element"><a href="#"><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></a></li>';
                } else {
                    $styles[$file] = '<li class="op-asset-dropdown-list-item"><a href="#"><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></a></li>';
                }

                $arr[esc_attr($file)] = $file;
            }
            $styles = $this->_remove_ignore_vals($styles,$folder);
            $arr = $this->_remove_ignore_vals($arr,$folder);
            $str = '<ul class="cf">'.implode('',$styles).'</ul>';
            $html[$path] = $str;
            $array_elements[$path] = $arr;
        }
        return array($html[$path],$array_elements[$path]);
    }

    function _generate_checkbox_selector($path,$files,$fieldid){
        static $html = array();
        static $array_elements = array();
        if(!isset($html[$path])){
            $arr = array();
            $str = '<ul class="cf">';
            $count = 0;
            foreach($files as $file => $url){
                $str .= '<li><label><input type="checkbox" name="'.$fieldid.'[]" id="'.$fieldid.$count.'" value="'.$file.'" /><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></label></li>';
                $count++;
                $arr[esc_attr($file)] = $file;
            }
            $str .= '</ul>';
            $html[$path] = $str;
            $array_elements[$path] = $arr;
        }
        return array($html[$path],$array_elements[$path]);
    }

    function style_selector($folder,$fieldname='',$selected='',$addclass=''){
        $files = $this->_process_files(array($folder),'',true);
        $selecthtml = $html = '';
        //ksort($files[$folder['fieldid']]);
        foreach($files[$folder['fieldid']] as $file => $url){
            $file = explode('.',$file);
            $file = explode('_', $file[0]);
            $file = end($file);
            $html .= '<li class="op-asset-dropdown-list-item"><a href="#"><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></a></li>';
            $selecthtml .= '<option value="'.esc_attr($file).'"'.($selected==$file?' selected="selected"':'').'>'.$url.'</option>';
        }
        return '
<select name="'.$fieldname.'" id="'.$folder['fieldid'].'" class="style-selector" style="display:none">'.$selecthtml.'</select>
<div class="op-asset-dropdown '.$addclass.'" id="'.$folder['fieldid'].'_container">
    <a class="selected-item" href="#"></a>
    <div class="op-asset-dropdown-list">'.$html.'</div>
</div>';
    }

    /**
     * Generates markup for preset selector (similair to style selector but with less surrounding markup)
     * @param  string $folder
     * @param  string $fieldname
     * @param  string $selected
     * @param  string $addClass
     * @return string
     */
    function preset_selector($folder, $fieldname = '', $selected = '', $addClass = '')
    {
        $files = $this->_process_files(array($folder), '', true);
        $select = $list = '';

        foreach ($files[$folder['fieldid']] as $file => $url) {
            $file = explode('.', $file);
            $file = explode('_', $file[0]);
            $file = end($file);

            $list .= '<li class="op-asset-dropdown-list-item"><a href="#"><img alt="' . esc_attr($file) . '" src="' . esc_url($url) . '" /></a></li>';
            $select .= '<option value="' . esc_attr($file) . '"' . ($selected == $file ? ' selected="selected"' : '') . '>' . $url . '</option>';
        }

        return '
            <div class="op-asset-dropdown-list"><ul>' . $list . '</ul></div>
            <select name="' . $fieldname . '" id="' . $folder['fieldid'] . '" class="preset-selector" style="display:none">' . $select . '</select>';
    }

    function image_selector($folder,$fieldname='',$selected='',$addclass=''){
        $files = $this->_process_files(array($folder),'',true);
        $selecthtml = $html = '';
        //ksort($files[$folder['fieldid']]);
        foreach($files[$folder['fieldid']] as $file => $url){
            $html .= '<li class="op-asset-dropdown-list-item"><a href="#"><img alt="'.esc_attr($file).'" src="'.esc_url($url).'" /></a></li>';
            $selecthtml .= '<option value="'.esc_attr($file).'"'.($selected==$file?' selected="selected"':'').'>'.$url.'</option>';
        }
        return '
<select name="'.$fieldname.'" id="'.$folder['fieldid'].'" class="style-selector" style="display:none">'.$selecthtml.'</select>
<div class="op-asset-dropdown '.$addclass.'" id="'.$folder['fieldid'].'_container">
    <a class="selected-item" href="#"></a>
    <div class="op-asset-dropdown-list">'.$html.'</div>
</div>';
    }
}
function _op_assets(){
    static $op_assets;
    if(!isset($op_assets)){
        $op_assets = new OptimizePress_Assets_Core;
    }
    $args = func_get_args();
    if(count($args)){
        $func = array_shift($args);
        return call_user_func_array(array($op_assets,$func),$args);
    }
}
function op_assets_provider_list()
{
    return _op_assets('providerList', true);
}
function op_assets_provider_details($provider, $special = false)
{
    return _op_assets('providerDetails', $provider, true, $special);
}
function op_assets_provider_items($provider, $special = false)
{
    return _op_assets('providerItems', $provider, true, $special);
}
function op_assets_provider_item_fields($provider, $list, $special = false)
{
    return _op_assets('providerItemFields', $provider, $list, true, $special);
}
function op_assets_provider_enabled($provider)
{
    return _op_assets('providerEnabled', $provider);
}
function op_assets_provider_register($provider, $list, $email, $fname, $lname)
{
    return _op_assets('providerRegister', $provider, $list, $email, $fname, $lname);
}
function op_assets($group='',$asset=''){
    return _op_assets('assets',$group,$asset);
}
function op_assets_parse_list(){
    return _op_assets('parse_assets');
}
function op_asset_tags(){
    return _op_assets('asset_keys');
}
function op_assets_lang(){
    return _op_assets('lang');
}
function op_assets_lang_key($key=''){
    return _op_assets('lang_key',$key);
}
function op_asset_font_style($atts,$prefix='font_'){
    $vars = shortcode_atts(array(
        $prefix.'size' => '',
        $prefix.'font' => '',
        $prefix.'style' => '',
        $prefix.'color' => '',
        $prefix.'spacing' => '',
        $prefix.'shadow' => '',
    ), $atts);
    return op_font_style_str($vars,$prefix);
}
