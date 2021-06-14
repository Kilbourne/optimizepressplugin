<?php
class OptimizePress_LiveEditor_Assets {

    private static $check_id = array();
    private static $wrap_elements = '';
    private static $lang_keys = array();
    private static $temp_vars = array();

    static function init(){
        add_filter('op_assets_before_addons',array('OptimizePress_LiveEditor_Assets','asset_list'));
        add_filter('op_asset_check_js',array('OptimizePress_LiveEditor_Assets','_check_element'));
        add_filter('op_assets_parse_list',array('OptimizePress_LiveEditor_Assets','_parse_list'),2);
        add_filter('op_asset_js',array('OptimizePress_LiveEditor_Assets','_print_js'));
        self::set_lang_keys();
        self::init_shortcodes();
    }

    static function init_shortcodes()
    {
        $assets_array = apply_filters('op_assets_before_le_shortcode_init', self::_asset_list());

        foreach ($assets_array as $tag => $title) {
            add_shortcode($tag,array('OptimizePress_LiveEditor_Assets',$tag));
        }

        // Intrinsic LE shortcodes needed for nested elements to work
        add_shortcode('op_liveeditor_elements',array('OptimizePress_LiveEditor_Assets','liveeditor_elements'));
        add_shortcode('op_liveeditor_element',array('OptimizePress_LiveEditor_Assets','liveeditor_element'));
    }

    static function _asset_list(){
        $assets_array = array(
            'comments' => __('WordPress Comments', 'optimizepress'),
            'custom_html' => __('Custom HTML / Shortcode', 'optimizepress'),
            'fb_comments' => __('Facebook Comments', 'optimizepress'),
            'javascript' => __('JavaScript', 'optimizepress'),
            'launch_navigation' => __('Launch Navigation', 'optimizepress'),
            // 'one_time_offer_counter' => __('One Time Offer Count Down', 'optimizepress'),
            'op_popup' => __('OverlayOptimizer', 'optimizepress'),
            'optimizeleads' => __('OptimizeLeads', 'optimizepress'),
            'text_block' => __('Text Block', 'optimizepress'),
        );
        // insert the element only if one membership product page exists
        // always insert because of content templates
        //if (self::productExist()) {
            $assets_array['membership_sidebar'] = __('Membership Navigation Sidebar', 'optimizepress');
            $assets_array['membership_breadcrumbs'] = __('Membership Breadcrumb Trails', 'optimizepress');
            $assets_array['membership_page_listings'] = __('Membership Page Listings', 'optimizepress');
        //}
        return $assets_array;
    }

    /**
     * Check if membership product page exists
     * @return boolean
     */
    static function productExist()
    {
        global $wpdb;
        $query = "SELECT o.id FROM {$wpdb->posts} o
            INNER JOIN {$wpdb->postmeta} p
            ON o.id = p.post_id
            WHERE p.meta_key = 'type' AND p.meta_value='product'";
        if($rows = $wpdb->get_results($query)){
            return true;
        }
        return false;
    }

    static function asset_list($assets){
        $assets_array = self::_asset_list();
        $new_assets = array();
        foreach($assets_array as $tag => $title){
            $new_assets[$tag] = array(
                'title' => $title,
                'description' => self::lang_key($tag.'_description'),
                'settings' => file_exists(OP_JS_PATH.'assets/core/'.$tag.'.js') ?'Y':'N',
                'image' => file_exists(OP_ASSETS.'thumbs/'.$tag.'.png') ? OP_ASSETS_URL.'thumbs/'.$tag.'.png' : ''
            );
        }
        $assets['core'] = array_merge($assets['core'],$new_assets);
        return $assets;
    }

    static function _parse_list($assets){
        $assets_array = self::_asset_list();
        $new_assets = array();
        foreach($assets_array as $tag => $title){
            $new_assets[$tag] = array('asset'=>'core/'.$tag,'child_tags'=>array());
        }
        $assets = array_merge($assets,$new_assets);
        return $assets;
    }

    static function liveeditor_element($atts,$content=''){
        $content = op_clean_shortcode_content(op_process_content_filter($content, true));
        return $content;
    }

    static function liveeditor_elements($atts,$content=''){

        $popup_child_element = false;

        if (strpos($content, 'op_popup_content_element') !== false) {
            $popup_child_element = true;
            $content = str_replace('[op_popup_content_element]', '', $content);
            $content = str_replace('[/op_popup_content_element]', '', $content);
        }

        $newcontent = $content;

        if(defined('OP_AJAX_SHORTCODE') && isset($GLOBALS['OP_LIVEEDITOR_DEPTH']) && $GLOBALS['OP_LIVEEDITOR_DEPTH'] === 1 && $GLOBALS['OP_ADD_ELEMENT_ROWS'] === true){
            $mc = preg_match_all('/'.op_shortcode_regex('op_liveeditor_element').'/s',$content,$matches);
            $new_content = '';
            if($mc > 0){
                for($i=0;$i<$mc;$i++){
                    $sc = op_clean_shortcode_content($matches[5][$i]);

                    /*
                     * If it is one of the elements that can have children we'll show "parent settings" button
                     */
                    if (strpos($sc, 'feature_box') === 1 || strpos($sc, 'feature_box_creator') === 1 || strpos($sc, 'order_box') === 1
                        || strpos($sc, 'content_toggle') === 1 || strpos($sc, 'delayed_content') === 1 || strpos($sc, 'terms_conditions') === 1
                        || strpos($sc, 'op_popup')) {

                        $new_content .= '<div class="row element-container cf">
                            <div class="op-element-links">
                                <a class="element-parent-settings" href="#parent-settings">' . esc_attr__('Edit Parent Element', 'optimizepress') . '</a>
                                <a class="element-settings" href="#settings">' . esc_attr__('Edit Element', 'optimizepress') . '</a>
                                <a class="element-clone" href="#clone-element">' . esc_attr__('Clone Element', 'optimizepress') . '</a>
                                <a class="element-advanced" href="#op-le-advanced">' . __('Advanced Element Options', 'optimizepress') . '</a>
                                <a class="element-move" href="#move">' . __('Move', 'optimizepress') . '</a>
                                <a class="element-delete" href="#delete">' . __('Remove Element', 'optimizepress') . '</a>
                            </div>
                            <div class="op-hidden op-waiting">
                                <img class="op-bsw-waiting op-show-waiting" alt="" src="images/wpspin_light.gif" />
                            </div>
                            <div class="element">' . op_do_shortcode($sc) . '</div>
                            <div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">'.op_attr(trim(shortcode_unautop($sc))).'</textarea></div></div>';

                    } else {

                        $m_child_data_style = '';
                        preg_match('/data-style="(.*?)"{1}/i', $matches[0][$i], $m_child_data_style);

                        $childDataStyle = '';
                        $childElemBefore = '';
                        $childElemAfter = '';

                        if ($m_child_data_style[1]) {
                            $childDataStyle = $m_child_data_style[1];
                            $childElementStyle = base64_decode($m_child_data_style[1]);
                            $childElementStyle = json_decode($childElementStyle);

                            if (!empty($childElementStyle->codeBefore)) {
                                $childElemBefore = $childElementStyle->codeBefore;
                            } else {
                                $childElemBefore = '';
                            }

                            if (!empty($childElementStyle->codeAfter)) {
                                $childElemAfter = $childElementStyle->codeAfter;
                            } else {
                                $childElemAfter = '';
                            }

                            if (!empty($childElementStyle->fadeIn)) {
                                $child_data_fade = ' data-fade="' . $childElementStyle->fadeIn . '"';
                                $child_data_fade .= defined('OP_LIVEEDITOR') ? '' : ' style="display:none;" ';
                            } else {
                                $child_data_fade = ' ';
                            }

                            if (!empty($childElementStyle->advancedClass)) {
                                $childAdvancedClass = $childElementStyle->advancedClass;
                            } else {
                                $childAdvancedClass = '';
                            }

                            $hideClasses = $childElementStyle->hideMobile ? ' hide-mobile' : '';
                            $hideClasses .= $childElementStyle->hideTablet ? ' hide-tablet' : '';

                        }
                        $sc_processed = op_do_shortcode($sc);
                        $sc_processed = $childElemBefore . $sc_processed . $childElemAfter;

                        if ($popup_child_element) {
                            $sc = '###OP_POPUP_CONTENT_CHILDREN###';
                        }

                        $new_content .= '<div class="row element-container cf ' . $childAdvancedClass . $hideClasses . '" data-style="' . $childDataStyle . '"' . $child_data_fade .'>
                                <div class="op-element-links">' .
                                    '<a class="element-settings" href="#settings">' . esc_attr__('Edit Element', 'optimizepress') . '</a>' .
                                    '<a class="element-clone" href="#clone-element">' . esc_attr__('Clone Element', 'optimizepress') . '</a>' .
                                    '<a class="element-advanced" href="#op-le-advanced">' . __('Advanced Element Options', 'optimizepress') . '</a>' .
                                    '<a class="element-move" href="#move">' . __('Move', 'optimizepress') . '</a>' .
                                    '<a class="element-delete" href="#delete">' . __('Remove Element', 'optimizepress') . '</a>' .
                                '</div>
                                <div class="op-hidden op-waiting"><img class="op-bsw-waiting op-show-waiting" alt="" src="images/wpspin_light.gif" /></div>
                                <div class="element">'.$sc_processed.'</div>
                                <div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">'.op_attr(trim(shortcode_unautop($sc))).'</textarea></div></div>';
                    }
                }
            }

            return $new_content;

        }

        $newcontent = op_do_shortcode(op_clean_shortcode_content($content)) .
            (defined('OP_LIVEEDITOR') ? '<a href="#add_element" class="add-new-element"><span>' . __('Add Element', 'optimizepress') . '</span></a>' : '');
        return $newcontent;

    }

    /**
     * shortcode parsing of membership sidebar element
     * @param array $atts
     * @return String
     */
    static function membership_sidebar($atts){

        // Decode encoded chars
        $atts = op_urldecode($atts);

        extract(shortcode_atts(array(
            'style' => '1',
            'product' => 0,
            'category' => 0,
            'show' => 'subcategory',
            'subcategory' => 0,
            'title' => '',
            'show_children' => '',
            'same_level' => '',
            'order' => ''
        ), $atts));

        $product = intval($product);
        $page_id = defined('OP_PAGEBUILDER_ID') ? OP_PAGEBUILDER_ID : $post->ID;
        $title_styles = array(4, 6, 7, 8, 9, 10);
        $title_span_styles = array(9, 10);
        $js_styles = array(6, 7, 8, 9, 10);
        $title_font = op_asset_font_style($atts);
        if (!empty($title_font)) {
            $title_style = "style='".$title_font."'";
        } else {
            $title_style = '';
        }
        $content_font = op_asset_font_style($atts, 'content_font_');
        if (!empty($content_font)) {
            $content_style = "".$content_font."";
        } else {
            $content_style = '';
        }

        if (!empty($order)) {
            $temp = explode('|', $order);
            $order_column = $temp[0];
            $order_direction = $temp[1];
        } else {
            $order_column = 'post_title';
            $order_direction = 'asc';
        }

        $element_id = 'asset-membership-sidebar-'.(!empty($title) ? op_safe_string($title) : op_generate_id());

        $titleHtml = (!empty($title) && in_array($style, $title_styles) ? '<li class="title">'.(in_array($style, $title_span_styles) ? '<span '.$title_style.'>'.$title.'</span>' : '<h2 '.$title_style.'>'.$title.'</h2>').'</li>' : '');

        /** OPM for hiding stuff **/
        if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
            global $current_user;
            $hideContent = false;
            if (isset($GLOBALS['WS_PLUGIN__']['optimizemember']['o']['filter_wp_query']) && 'all' === $GLOBALS['WS_PLUGIN__']['optimizemember']['o']['filter_wp_query'][0]) {
                $hideContent = true;
            }
            $unavailableContent = c_ws_plugin__optimizemember_utils_gets::get_unavailable_singular_ids_with_dripped_content($current_user);
        }

        if (!empty($show_children) && empty($same_level)) {
            // get top level ancestor
            $ancestors = array_reverse(get_post_ancestors($page_id));
            if (count($ancestors) > 0) {
                $args = array(
                        'posts_per_page' => -1,
                        'sort_column' => $order_column,
                        'sort_order' => $order_direction,
                        'parent' => $ancestors[0],
                        'hierarchical' => 0,
                        'post_status' => 'publish'
                );

                $pages = get_pages($args);
                if ($order_column == 'post_title') {
                    if ($order_direction == 'asc') {
                        usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalAsc"));
                    } else {
                        usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalDesc"));
                    }
                }
                $list = '';
                if (!empty($pages)) {
                    foreach ($pages as $page) {
                        if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
                            if (!is_permitted_by_optimizemember($page->ID, "page") && true === $hideContent) {
                                continue;
                            }
                            if (true === $hideContent && in_array($page->ID, $unavailableContent) && !current_user_can('level_10')) {
                                continue;
                            }
                        }
                        $list .= '<li><a href="'.get_permalink($page->ID).'">'.$page->post_title.'</a></li>';
                    }
                }
                $nav_html = '
                <ul>' . $titleHtml .$list. '</ul>
                ';
            } else {
                if (is_admin()) {
                    return __('No child membership pages found! Note: Pages will only show in this once they are Published in Wordpress. Draft pages will not show', 'optimizepress');
                }
            }
        } if (!empty($show_children) && !empty($same_level)) {
            $ancestors = get_post_ancestors($page_id);
            if (count($ancestors) > 0) {
                $args = array(
                        'posts_per_page' => -1,
                        'sort_column' => $order_column,
                        'sort_order' => $order_direction,
                        'parent' => $ancestors[0],
                        'hierarchical' => 0,
                        'post_status' => 'publish'
                );

                $pages = get_pages($args);
                if ($order_column == 'post_title') {
                    if ($order_direction == 'asc') {
                        usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalAsc"));
                    } else {
                        usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalDesc"));
                    }
                }
                $list = '';
                if (!empty($pages)) {
                    foreach ($pages as $page) {
                        if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
                            if (!is_permitted_by_optimizemember($page->ID, "page") && true === $hideContent) {
                                continue;
                            }
                            if (true === $hideContent && in_array($page->ID, $unavailableContent) && !current_user_can('level_10')) {
                                continue;
                            }
                        }
                        $list .= '<li><a href="'.get_permalink($page->ID).'">'.$page->post_title.'</a></li>';
                    }
                }
                $nav_html = '
                <ul>' . $titleHtml .$list. '</ul>
                ';
            } else {
                if (is_admin()) {
                    return __('No child membership pages found! Note: Pages will only show in this once they are Published in Wordpress. Draft pages will not show', 'optimizepress');
                }
            }
        } else if (empty($category) && empty($subcategory) && !empty($product)) { // only product selected show all children of that product
            $args = array(
                    'posts_per_page' => -1,
                    'sort_column' => $order_column,
                    'sort_order' => $order_direction,
                    'parent' => $product,
                    'hierarchical' => 0,
                    'post_status' => 'publish'
            );

            $pages = get_pages($args);
            if ($order_column == 'post_title') {
                if ($order_direction == 'asc') {
                    usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalAsc"));
                } else {
                    usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalDesc"));
                }
            }
            $list = '';
            if (!empty($pages)) {
                foreach ($pages as $page) {
                    if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
                        if (!is_permitted_by_optimizemember($page->ID, "page") && true === $hideContent) {
                            continue;
                        }
                        if (true === $hideContent && in_array($page->ID, $unavailableContent) && !current_user_can('level_10')) {
                            continue;
                        }
                    }
                    $list .= '<li><a href="'.get_permalink($page->ID).'">'.$page->post_title.'</a></li>';
                }
            }
            if (!empty($list)) {
                $nav_html = '
                <ul>' . $titleHtml .$list. '</ul>
                ';
            } else {
                if (is_admin()) {
                    return __('No child membership pages found! Note: Pages will only show in this once they are Published in Wordpress. Draft pages will not show', 'optimizepress');
                }
            }
        } else if (!empty($category) && empty($subcategory)) { // only categories selected show all subcategories of that category
            if ($show == 'subcategories') {
                $list = self::get_membership_html('subcategory', $category, $order_column, $order_direction);
            } else {
                $list = self::get_membership_html('content', $category, $order_column, $order_direction);
            }
            if (!empty($list)) {
                $nav_html = '
                <ul>' . $titleHtml .$list. '</ul>
                ';
            } else {
                return __('No child membership pages found! Note: Pages will only show in this once they are Published in Wordpress. Draft pages will not show', 'optimizepress');
            }
        } else if (!empty($category) && !empty($subcategory)) { // show content pages
            $list = self::get_membership_html('content', $subcategory, $order_column, $order_direction);
            if (!empty($list)) {
                $nav_html = '
                <ul>' . $titleHtml .$list. '</ul>
                ';
            } else {
                if (is_admin()) {
                    return __('No child membership pages found! Note: Pages will only show in this once they are Published in Wordpress. Draft pages will not show', 'optimizepress');
                }
            }
        }

        $js = (in_array($style, $js_styles) ? "
        <script type=\"text/javascript\">
            (function ($) {
                $(document).ready(function() {
                    $('.navigation-sidebar-".$style." li > a').unbind('click').click(function(e) {
                        //e.preventDefault();

                        var li = $(this).closest('li');
                        li.find(' > ul').slideToggle('fast');
                        $(this).toggleClass('active');
                    });
                });
            }(opjq));
            </script>
        " : '');
        if (!isset($style_str)) {
            $style_str = '';
        }
        return '
            <style>#'.$element_id.'.navigation-sidebar-'.$style.' > ul > li > a{ '.str_replace("'", "", $content_style).' }</style>
            <div id="'.$element_id.'" class="navigation-sidebar navigation-sidebar-'.$style.'" style=\''.$style_str.'\''.'>'.($style == 5?'
                <div class="navigation-sidebar-inner">'.$nav_html.'</div>':$nav_html).'
            </div>
        '.$js;
    }

    static function get_membership_html($type, $parent_id=0, $order='post_title', $order_dir= 'asc')
    {
        global $wpdb;
        if ($parent_id > 0) {
            $parent = ' AND post_parent = ' . $parent_id . ' ';
        } else {
            $parent = ' ';
        }
        $query = "SELECT o.* FROM {$wpdb->prefix}posts o INNER JOIN {$wpdb->postmeta} p ON o.id = p.post_id WHERE o.post_status = 'publish' and p.meta_key = 'type' AND p.meta_value = '{$type}' ".$parent." ORDER BY o.".$order." ".$order_dir;
        $output = '';
        if($rows = $wpdb->get_results($query)){
            foreach($rows as $row) {
                if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
                    global $current_user;
                    $hideContent = false;
                    if (isset($GLOBALS['WS_PLUGIN__']['optimizemember']['o']['filter_wp_query']) && 'all' === $GLOBALS['WS_PLUGIN__']['optimizemember']['o']['filter_wp_query'][0]) {
                        $hideContent = true;
                    }
                    if (!is_permitted_by_optimizemember($row->ID, "page") && true === $hideContent) {
                        continue;
                    }
                    $unavailableContent = c_ws_plugin__optimizemember_utils_gets::get_unavailable_singular_ids_with_dripped_content($current_user);
                    if (true === $hideContent && in_array($row->ID, $unavailableContent) && !current_user_can('level_10')) {
                        continue;
                    }
                }
                $output .= '<li><a href="'. get_page_link($row->ID) .'">' . $row->post_title . '</a></li>';
            }
        }

        return $output;
    }

    /**
     * shortcode parsing of membership breadcrumbs element
     * @param array $atts
     * @return String
     */
    static function membership_breadcrumbs($atts)
    {
        // Decode encoded chars
        $atts = op_urldecode($atts);

        $page_id = defined('OP_PAGEBUILDER_ID') ? OP_PAGEBUILDER_ID : $post->ID;
        extract(shortcode_atts(array(
            'style' => '1'
        ), $atts));
        if ($page_id > 0) {
            $post = get_post($page_id);
        }

        $ancestors = get_post_ancestors($post->ID);
        $element_id = 'asset-membership-breadcrumb-'.(!empty($title) ? op_safe_string($title) : op_generate_id());
        $breadcrumb_html = '';
        if (count($ancestors) > 0) {
            $ancestors = array_reverse($ancestors);
            foreach ($ancestors as $ancestor) {
                $tempObject = get_post($ancestor);
                $breadcrumb_html .= '<li><a href="'.get_permalink($ancestor).'">'.$tempObject->post_title.'</a></li>';
            }
            $breadcrumb_html .= '<li><a href="#">' . $post->post_title . '</a></li>';
        } else {
            $breadcrumb_html = '<li><a href="#">' . $post->post_title . '</a></li>';
        }
        return '<ul id="'.$element_id.'" class="breadcrumb-style-'.$style.'">'.$breadcrumb_html.'</ul>';
    }

    static function sortNaturalDesc($el1, $el2)
    {
        return strnatcasecmp($el2->post_title, $el1->post_title);
    }

    static function sortNaturalAsc($el1, $el2)
    {
        return strnatcasecmp($el1->post_title, $el2->post_title);
    }

    /**
     *
     * Shortcode parsing method for Membership page listings
     * @param array $atts
     * @return string|void
     */
    static function membership_page_listings($atts)
    {
        // Decode encoded chars
        $atts = op_urldecode($atts);

        extract(shortcode_atts(array(
            'style' => '',
            'columns' => 1,
            'product' => 0,
            'category' => 0,
            'subcategory' => 0,
            'comments' => 0,
            'drip_content' => 0,
            'resize_thumb_height' => 0,
            'show_children' => '',
            'order' => '',
            'hide_description' => 'N'
        ), $atts));

        $product = intval($product);
        $category = intval($category);
        $subcategory = intval($subcategory);
        $parentId = 0;
        $page_id = defined('OP_PAGEBUILDER_ID') ? OP_PAGEBUILDER_ID : $post->ID;

        $title_font = op_asset_font_style($atts);
        if (!empty($title_font)) {
            $title_style = "style='".$title_font."'";
        } else {
            $title_style = '';
        }
        $content_font = op_asset_font_style($atts,'content_font_');
        if (!empty($content_font)) {
            $content_style = "style='".$content_font."'";
        } else {
            $content_style = '';
        }

        // which children should we take?
        if (!empty($show_children)) {
            $parentId = $page_id;
        } else if (!empty($product) && empty($category) && empty($subcategory)) {
            $parentId = $product;
        } else if (!empty($product) && !empty($category) && empty($subcategory)) {
            $parentId = $category;
        } else if (!empty($product) && !empty($category) && !empty($subcategory)) {
            $parentId = $subcategory;
        }
        if (!empty($order)) {
            $temp = explode('|', $order);
            $order_column = $temp[0];
            $order_direction = $temp[1];
        } else {
            $order_column = 'post_title';
            $order_direction = 'asc';
        }
        $args = array(
            'posts_per_page' => -1,
            'sort_column' => $order_column,
            'sort_order' => $order_direction,
            'parent' => $parentId,
            'hierarchical' => 0,
            'post_status' => 'publish'
        );

        $pages = get_pages($args);

        if ($order_column == 'post_title') {
            if ($order_direction == 'asc') {
                usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalAsc"));
            } else {
                usort($pages, array("OptimizePress_LiveEditor_Assets", "sortNaturalDesc"));
            }
        }

        if (!empty($resize_thumb_height)) {
            $img_class = ' thumb_resize ';
        } else {
            $img_class= '';
        }

        if (empty($pages) || $parentId == 0) {
            if (is_admin()) {
                    return __('No child membership pages found! Note: Pages will only show in this once they are Published in Wordpress. Draft pages will not show', 'optimizepress');
                }
        }
        $html = '';

        switch ($columns) {
            case 1:
                $class = 'page-listing one-col';
            break;
            case 2:
                $class = 'page-listing two-col';
            break;
            case 3:
                $class = 'page-listing three-col';
            break;
            case 4:
                $class = 'page-listing four-col';
            break;
        }
        foreach ($pages as $page) {
            /*if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
                if (!is_permitted_by_optimizemember($page->ID, "page")) {
                    continue;
                }
            }*/
            // drip content
            $dripContentHtml = '';
            if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) {
                global $current_user;
                $hideContent = false;
                if (isset($GLOBALS['WS_PLUGIN__']['optimizemember']['o']['filter_wp_query']) && 'all' === $GLOBALS['WS_PLUGIN__']['optimizemember']['o']['filter_wp_query'][0]) {
                    $hideContent = true;
                }
                if (!is_permitted_by_optimizemember($page->ID, "page") && true === $hideContent) {
                    continue;
                }
                $unavailableContent = c_ws_plugin__optimizemember_utils_gets::get_unavailable_singular_ids_with_dripped_content($current_user);
                // getting content drip days setting
                $drip_days = get_post_meta($page->ID, "optimizemember_drip_days", true);
                if ($drip_days) {
                    // if hide links is disabled in OPM general settings, content by this ID is not available to current user and show drip content timer is checked on
                    // membership page listings element
                    if (false === $hideContent && in_array($page->ID, $unavailableContent) && !empty($drip_content) && !current_user_can('level_10')) {
                        //if ($array = is_page_protected_by_optimizemember($page->ID)) { // is it protected?
                            $time = optimizemember_paid_registration_time();
                            if (!empty($time) && $time > (strtotime("-".$drip_days." days"))){
                                $daysTo = intval(($time + ($drip_days * 86400) - time()) / 86400);
                                if (0 === $daysTo) {
                                    $dripContentHtml = '<p class="pagelisting-drip-content">' . __('Less than a day left to be able to access this content', 'optimizepress') . '</p>';
                                } else {
                                    $dripContentHtml = '<p class="pagelisting-drip-content">' . sprintf(_n('%d day left to be able to access this content', '%d days left to be able to access this content', $daysTo, OP_SN), $daysTo) . '</p>';
                                }
                            }
                        //}
                    }
                    // if hide links is enabled in OPM general settings, content by this ID is not available to current user and show drip content timer is disabled on
                    // membership page listings element - hide content completely
                    if (true === $hideContent && in_array($page->ID, $unavailableContent) /*&& empty($drip_content)*/ && !current_user_can('level_10')) {
                        continue;
                    }
                    // if user is not logged in
                    if (true === $hideContent && !is_user_logged_in()) {
                        continue;
                    }
                }
            }
            $meta = get_post_meta($page->ID);
            if (!empty($meta['_'.OP_SN.'_page_thumbnail'])) {
                $image = $meta['_'.OP_SN.'_page_thumbnail'][0];
                $alt = $page->post_title;
            }
            if (!empty($comments)) {
                $comments = wp_count_comments($page->ID);
                $commentCount = $comments->approved;
                $commentHtml = '<p class="pagelisting-comment">' . sprintf(__('%d comments', 'optimizepress'), $commentCount) . '</p>';
            } else {
                $commentHtml = '';
            }
            $meta = $meta['_'.OP_SN.'_membership'][0];
            $meta = unserialize(unserialize($meta));

            $html .= '<div class="'.$class.'">';
            $html .= '
                <a href="'.get_permalink($page->ID).'" class="pagelisting-style-'.$style.' border">
                    <div class="thumb">';
                        if ($image != '') {
                            $img_size = op_get_image_html_attribute($image);
                            $html .= '<img src="' . $image . '" alt="' . $alt . '" class="scale-with-grid ' . $img_class . '" ' . $img_size . ' />';
                        } else {
                            $img_size = op_get_image_html_attribute(OP_IMG . 'default-page-listings.png');
                            $html .= '<img src="'.OP_IMG.'default-page-listings.png" alt="' . $alt . '" class="scale-with-grid ' . $img_class . '" ' . $img_size . ' />';
                        }
                    $html .= '</div>
                    <div class="content">
                        <h3 '.$title_style.'>'.$page->post_title.'</h3>'.$commentHtml . $dripContentHtml;
                    if ($hide_description !== 'Y') {
                        $description = stripslashes(base64_decode($meta['description']));
                        if (strlen($description) > 140) {
                            $html .= '<p '.$content_style.'>'.mb_substr($description,0,140).'...</p>';
                        } else {
                            $html .= '<p '.$content_style.'>'.$description.'</p>';
                        }
                    }
                    $html .= '</div>
                </a>
            ';
            $html .= '</div>';
        }

        return $html;
    }

    static function comments(){
        if(defined('OP_LIVEEDITOR')){
            self::$check_id['#wp_comments'] = __('You can only have Wordpress comments on the page once.', 'optimizepress');
            return '<div class="comments-placeholder" id="wp_comments">'.__('WordPress Comments', 'optimizepress').'</div>';
        }
        setup_userdata(0);
        if(file_exists(OP_PAGE_DIR.'comments.php')){
            $tmp = OP_PAGE_DIR_REL.'comments.php';
        } else {
            $tmp = '/pages/global/templates/comments.php';
        }
        ob_start();
        comments_template($tmp,true);
        $output = ob_get_contents();
        ob_end_clean();
        return $output;
    }

    static function fb_comments($atts){

        // Decode encoded chars
        $atts = op_urldecode($atts);

        if (defined('OP_LIVEEDITOR')) {
            $width = isset($atts['width']) ? $atts['width'] : 550;
            self::$check_id['#fb_comments'] = __('You can only have Facebook comments on the page once.', 'optimizepress');

            if (!comments_open()) {
                $comments_disabled = '<span class="op-enable-post-comments-container">';
                    $comments_disabled .= '<br />' . __('Comments for the current page are disabled. ', 'optimizepress');
                    $comments_disabled .= '<a class="op-enable-post-comments" href="#">' . __('Enable comments for this page.', 'optimizepress') . '</a>';
                $comments_disabled .= '</span>';
            } else {
                $comments_disabled = '';
            }

            return '<div class="fb_comments-placeholder" id="fb_comments" style="width:'.$width.'px">'.__('Facebook Comments', 'optimizepress').$comments_disabled.'</div>';
        }
        $atts['dark_site'] = (op_get_var($atts,'style','light') == 'light' ? 'N' : 'Y');
        unset($atts['style']);
        return op_mod('comments')->output_comments(array(),true,$atts);
    }

    static function text_block($atts,$content=''){

        // Decode encoded chars
        $atts = op_urldecode($atts);

        extract(shortcode_atts(array(
            'style' => '1',
            'align' => 'left',
            'top_padding' => '',
            'bottom_padding' => '',
            'left_padding' => '',
            'right_padding' => '',
            'top_margin' => '',
            'bottom_margin' => '',
            'width' => '',
            'line_height' => '',
        ), $atts));

        $style = 'text-align:'.$align.';'.($top_margin==''?'':'margin-top:'.$top_margin.'px;').($bottom_margin==''?'':'margin-bottom:'.$bottom_margin.'px;').($width==''?'':'width:'.$width.'px;').($line_height==''?'':'line-height:'.$line_height.'px;');
        $style = ($top_margin==''?'':'margin-top:'.$top_margin.'px;').($bottom_margin==''?'':'margin-bottom:'.$bottom_margin.'px;').($width==''?'width:100%;':'width:'.$width.'px;').($line_height==''?'':'line-height:'.$line_height.'px;').($align=='center' ? 'margin: 0 auto;text-align:center;' : 'text-align: '.$align.';');
        $chks = array('top','bottom','left','right');
        foreach($chks as $chk){
            $var = $chk.'_padding';
            $style .= ($$var==''?'':'padding-'.$chk.':'.$$var.'px;');
        }
        $font = op_asset_font_style($atts).($line_height==''?'':'line-height:'.$line_height.'px;');
        $original_font_str = $GLOBALS['OP_LIVEEDITOR_FONT_STR'];
        if($font != ''){;
            $GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array('elements' => array('p', 'li'), 'style_str' => $font);
        }
        $processed = op_process_asset_content(op_clean_shortcode_content(apply_filters('the_content',wpautop($content))));
        $GLOBALS['OP_LIVEEDITOR_FONT_STR'] = $original_font_str;
        return '<div class="op-text-block" style="'.$style.'">'.$processed.'</div>';
    }

    static function custom_html($atts,$content=''){
        //$content = str_replace('', '', $content);
        $content = html_entity_decode($content);
        $content_without_script_tag = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $content);
        
        if (defined('OP_LIVEEDITOR')) {
            return '!!! CUSTOM HTML CODE ELEMENT !!!' . '<div class="op-custom-html-block">'.$content_without_script_tag.'</div>';
        } else {
            return '<div class="op-custom-html-block">'.op_do_shortcode($content, true).'</div>';
        }
    }

    static function one_time_offer_counter(){
        if(defined('OP_LIVEEDITOR')){
            return '<div class="one-time-offer-placeholder">&nbsp;</div>';
        }
        $time_left = op_mod('one_time_offer','page')->get_time_left();
        if(is_array($time_left)){
            if($time_left[0] === 0){
                header('Location: '.$time_left[1]);
                exit;
            } else {
                if(isset(self::$temp_vars['one_time_offer'])){
                    self::$temp_vars['one_time_offer']++;
                } else {
                    self::$temp_vars['one_time_offer'] = 1;
                }
                self::$temp_vars['one_time_offer_url'] = $time_left[1];
                self::$temp_vars['one_time_offer_time'] = $time_left[0];
                self::$temp_vars['one_time_offer_format'] = $time_left[2];
                return '<div id="one-time-offer-counter-'.self::$temp_vars['one_time_offer'].'" class="onetime-offer-counter" style="width:'.$time_left[3].'px"></div>';
            }
        }
    }

    static function launch_navigation($atts){
        $op_fonts = new OptimizePress_Fonts;

        // Decode encoded chars
        $atts = op_urldecode($atts);

        extract(shortcode_atts(array(
            'style' => 1,
            'font_size' => '',
            'font_family' => '',
            'font_style' => '',
            'font_color' => '',
            'font_spacing' => '',
            'font_shadow' => ''
        ),$atts));
        $active = $inactive = '';
        switch($style){
            case 1:
            case 2:
                $active = '<a href="{link}"><img width="163" height="102" src="{image}" alt="" /> {text}</a>';
                $inactive = '<p><img width="163" height="102" src="{image}" alt="" /> {text}</p>';
                break;
            case 3:
                $active = '<p><a href="{link}">{text}</a></p>';
                $inactive = '<p><span>{text}</span></p>';
                break;
            case 4:
            case 7:
            case 8:
            case 9:
                $active = '<a href="{link}">{text}</a>';
                $inactive = '<span>{text}</span>';
                break;
            case 10:
                $active = '<a href="{link}"><div class="thumb"><img src="{image}" class="scale-with-grid" /></div><span>{text}</span></a>';
                $inactive = '<div class="thumb"><img src="{image}" class="scale-with-grid" /></div><span>{text}</span>';
                break;
        }
        $str = '';
        $menu_items = _op_launch_menu_list();
        if (!empty($menu_items)) {
            foreach($menu_items as $menu){
                $tpl = $inactive;
                $class = '';
                if($menu['active'] === true){
                    /*$class = 'active';*/
                    $class = '';
                    $tpl = $active;
                }
                if($menu['selected'] === true){
                    $class .= ($class==''?'':' ').'active current-page';
                }
                if (!empty($menu['text'])) {
                    $menu['text'] = stripslashes($menu['text']);
                }
                $str .= '<li'.($class==''?'':' class="'.$class.'"').'>'.op_convert_template($tpl,$menu).'</li>';
            }

            $font_family_css = '';
            $font_style_css = '';
            $font_shadow_css = '';
            if (!empty($font_family) && $font_family!='undefined'){
                $font_family_css = 'font-family: '.$font_family.';';
                $op_fonts->add_font($font_family);
            }
            if (!empty($font_style) && $font_style!='undefined'){
                if ($font_style=='italic'){
                    $font_style_css = 'font-style: italic;';
                } elseif ($font_style=='bold italic'){
                    $font_style_css = 'font-style: italic; font-weight: bold;';
                } else {
                    $font_style_css = 'font-weight: '.$font_style.';';
                }
            }
            if (!empty($font_shadow) && $font_shadow!='undefined'){
                switch(strtolower(str_replace(' ', '', $font_shadow))){
                        case '':
                        case 'none':
                                $font_shadow_css = 'none';
                                break;
                        case 'light':
                                $font_shadow_css = '1px 1px 0px rgba(255,255,255,0.5)';
                                break;
                        case 'dark':
                        default:
                                $font_shadow_css = '0 1px 1px #000000, 0 1px 1px rgba(0, 0, 0, 0.5)';
                }

                $font_shadow_css = 'text-shadow: '.$font_shadow_css.';';
            }
            $id = op_generate_id();
            $className = ($style>=7 && $style<=10 ? 'launch-nav-style-'.$style : 'video-navigation-'.$style);

            $str = '
            <style>
                #video-navigation-'.$id.' ul li a{
                    '.(!empty($font_size) && $font_size!='undefined' ? 'font-size: '.$font_size.'px;' : '').'
                    '.(!empty($font_family_css) ? $font_family_css : '').'
                    '.(!empty($font_style_css) ? $font_style_css : '').'
                    '.(!empty($font_color) && $font_color!='undefined' ? 'color: '.$font_color.';' : '').'
                    '.(!empty($font_spacing) && $font_spacing!='undefined' ? 'letter-spacing: '.$font_spacing.'px;' : '').'
                    '.(!empty($font_shadow_css) ? $font_shadow_css : '').'
                }
            </style>
            <div id="video-navigation-'.$id.'" class="video-navigation '.$className.'">
                <ul class="cf">'.$str.'</ul>
            </div>';
        } else {
            if (is_admin()) {
                $str = '<p>' . __('This navigation bar will only display when added to a page which has been added to funnel as a funnel stage', 'optimizepress') . '</p>';
            }
        }
        return $str;
    }

    /*
    * Function: op_popup
    * Description: Display function for the OverlayOptimizer element (popup element)
    * Parameters:
    *   $atts: Contains all the attributes for this asset
    *   $content: Contains what is inside the shortcode tags
    */
    static function op_popup($atts,$content=''){

        // Decode encoded chars
        $atts = op_urldecode($atts);

        //Extract the attributes into variables
        extract(shortcode_atts(array(
            'style' => '1',
            'title' => '',
            'letter_spacing' => '',
            'width' => '',
            'top_margin' => '',
            'bottom_margin' => '',
            'top_padding' => '',
            'bottom_padding' => '',
            'left_padding' => '',
            'right_padding' => '',
            'alignment' => '',

            'popup_width' => '700',
            'popup_open_effect' => 'fade',
            'popup_close_effect' => 'fade',
            // 'popup_open_method' => 'zoomIn',
            // 'popup_close_method' => 'zoomOut',
            'popup_open_speed' => 'normal',
            'popup_close_speed' => 'normal',
            'popup_border_size' => '0',
            'popup_border_color' => '#ffffff',

            'popup_padding_top' => '20',
            'popup_padding_bottom' => '20',
            'popup_padding_left' => '30',
            'popup_padding_right' => '30',

            'pop_exit_intent' => 'N',
            'pop_trigger_time' => '0',
            'pop_trigger_dontshow' => '0',
            'pop_dont_show_on_tablet' => '0',
            'pop_dont_show_on_mobile' => '0',
            'popup_id' => '0',
        ), $atts));

        //Set up font
        $font = op_asset_font_style($atts,'content_font_');
        $original_font_str = $GLOBALS['OP_LIVEEDITOR_FONT_STR'];
        $GLOBALS['OP_LIVEEDITOR_FONT_STR'] = (!empty($font) ? array('elements' => array('p','a'), 'style_str' => $font) : $GLOBALS['OP_LIVEEDITOR_FONT_STR']);

        //Set the temporary asset tag to the feature box
        // self::$temp_tag = 'op_popup';

        //Get content
        $args = func_get_args();

        //Get the content for adding an element field
        $content = call_user_func_array(array('OptimizePress_Default_Assets', '_add_element_field'), $args);

        //Process content from above
        $content = op_process_asset_content($content);

        //Set the font back to the original string
        $GLOBALS['OP_LIVEEDITOR_FONT_STR'] = ($GLOBALS['OP_LIVEEDITOR_DEPTH'] == 1 ? $original_font_str : $GLOBALS['OP_LIVEEDITOR_FONT_STR']);

        //Init the block style variable
        $block_style = '';

        //Set up attributes for the asset
        $chks = array(
            'width' => 'width',
            'top_margin' => 'margin-top',
            'bottom_margin' => 'margin-bottom'
        );

        //Loop through each attribute
        foreach($chks as $chk => $prob){
            //Add attribute to the block style string
            $block_style .= (!empty_allow_zero($$chk) ? $prob.': '.$$chk.'px;' : '');
        }

        //Add the style HTML attribute if we have styles in the block style string
        $block_style = (!empty($block_style) ? ' style=\''.$block_style.'\'' : $block_style);

        //Init the content style string
        $content_style = '';

        //Init the attributes for the content styling
        $chks = array(
            'top_padding' => 'padding-top',
            'bottom_padding' => 'padding-bottom',
            'left_padding' => 'padding-left',
            'right_padding' =>' padding-right'
        );

        //Loop through each attribute
        foreach($chks as $chk => $prob){
            //Add attribute to the content style string
            $content_style .= (!empty_allow_zero($$chk) ? $prob.': '.$$chk.'px;' : '');
        }

        //Add font to content style string
        $content_style .= $font;

        //Add the style HTML attribute if we have styles in the content style string
        $content_style = (!empty($content_style) ? ' style=\''.$content_style.'\'' : $content_style);

        if (!defined('OP_LIVEEDITOR')) {
            wp_enqueue_script(OP_SN.'-popup', OP_JS.'popup'.OP_SCRIPT_DEBUG.'.js', array(OP_SCRIPT_BASE), OP_VERSION, true);
        }

        // fancybox options
        $popup_data = ' data-width="' . $popup_width . '" ';

        $popup_data .= ' data-open-effect="' . $popup_open_effect . '" ';
        $popup_data .= ' data-close-effect="' . $popup_close_effect . '" ';
        // $popup_data .= ' data-open-method="' . $popup_open_method . '" ';
        // $popup_data .= ' data-close-method="' . $popup_close_method . '" ';
        $popup_data .= ' data-open-speed="' . $popup_open_speed . '" ';
        $popup_data .= ' data-close-speed="' . $popup_close_speed . '" ';
        $popup_data .= ' data-border-color="' . $popup_border_color . '" ';
        $popup_data .= ' data-border-size="' . $popup_border_size . '" ';

        $popup_data .= ' data-padding-top="' . $popup_padding_top . '" ';
        $popup_data .= ' data-padding-bottom="' . $popup_padding_bottom . '" ';
        $popup_data .= ' data-padding-left="' . $popup_padding_left . '" ';
        $popup_data .= ' data-padding-right="' . $popup_padding_right . '" ';

        $popup_data .= ' data-exit-intent="' . $pop_exit_intent . '" ';
        $popup_data .= ' data-trigger-time="' . $pop_trigger_time . '" ';
        $popup_data .= ' data-trigger-dontshow="' . $pop_trigger_dontshow . '" ';
        $popup_data .= ' data-dont-show-on-tablet="' . $pop_dont_show_on_tablet . '" ';
        $popup_data .= ' data-dont-show-on-mobile="' . $pop_dont_show_on_mobile . '" ';

        $popup_data .= ' data-popup-id="' . $popup_id . '" ';
        $popup_data .= ' data-epicbox-title="' . __('OverlayOptimizer Content', 'optimizepress') . '" ';

        return '<div class="op-popup cf"' . $content_style . $popup_data . '>' . $content . '</div>';
    }

    /**
     * shortcode parsing of javascript element
     * @param array $atts
     * @return String
     */
    static function javascript($atts, $content='')
    {
        $content = html_entity_decode($content, ENT_QUOTES);

        // Decode encoded chars
        $atts = op_urldecode($atts);

        preg_match_all('#<script(.*?)>(.*?)</script>#is', $content, $matches);
        // foreach $matches[2] if they are not empty and do our magic then
        $scripts = '';
        $output = '';
        $externals = '';
        //die(print_r($matches));
        if (!empty($matches[2])) {
            foreach ($matches[2] as $key => $script) {
                if (!empty($script)) {
                    $script = str_replace('<![CDATA[', '', $script);
                    $script = str_replace(']]>', '', $script);
                    $script = str_replace('// ', '', $script);
                    $scripts .= $script;
                } else {
                    // is it external?
                    if (stripos($matches[0][$key], 'src="') !== false) {
                        $externals .= $matches[0][$key];
                    }
                }
            }
        }
        /* if (!empty($scripts)) {
            $output .= $externals . '<script>try{'.$scripts.'} catch (err) {};</script>';
        } */

        if (defined('OP_LIVEEDITOR')) {
            $output .= '!!!JAVASCRIPT ELEMENT!!!';
        } else {
            $output .= $externals . '<script>try{'.$scripts.'} catch (err) {};</script>';
        }

        return $output;
    }

    /**
     * Function: optimizeleads
     * Description: Display function for this asset
     * Parameters:
     * $atts: Contains all the attributes for this asset
     */
    static function optimizeleads($atts, $content)
    {
        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            $extCache = wp_using_ext_object_cache();
            if (true === $extCache) {
                wp_using_ext_object_cache(false);
            }
        }

        // Decode encoded chars
        $atts = op_urldecode($atts);
        $content = op_urldecode($content);

        $atts = shortcode_atts(array(
            'content' => '',
            'optimizeleads_box_title' => '',
        ), $atts);

        if (defined('OP_LIVEEDITOR')) {

            $output = '!!! OPTIMIZELEADS ELEMENT ';
            $output .= !empty($atts['optimizeleads_box_title']) ? ' - ' . $atts['optimizeleads_box_title'] . ' ' : '';
            $output .= '!!!';

        } else {

            $uid = 'optimizeleads_' . md5(serialize($atts) . $content);
            if (false === $output = get_transient('el_' . $uid)) {
                $output = '<div class="optimizeleads-element cf">' . $content . '</div>';

                if (is_string($content) && 0 === strpos($content, '##')) {
                    $content = substr($content, 2);
                } elseif (!empty($content)) {
                    set_transient('el_' . $uid, $content, OP_SL_ELEMENT_CACHE_LIFETIME);
                }
            }

        }


        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        return $output;
    }

    static function _print_css(){
        // echo '<link href="'.OP_ASSETS_URL.'live_editor.css" type="text/css" rel="stylesheet" media="screen" />';
        wp_enqueue_style(OP_SN.'-live_editor', OP_ASSETS_URL.'live_editor'.OP_SCRIPT_DEBUG.'.css', false, OP_VERSION);
    }

    static function _print_js($js){
        if(isset(self::$temp_vars['one_time_offer'])){
            //echo '<script type="text/javascript" src="'.OP_JS.'jquery/jquery.countdown.min.js"></script>';
            wp_enqueue_script(OP_SN.'-countdown', OP_JS.'jquery/jquery.countdown.min.js', array(OP_SCRIPT_BASE), OP_VERSION);

            $str = '';
            $length = self::$temp_vars['one_time_offer']+1;
            for($i=1;$i<$length;$i++){
                $str .= ($str==''?'':',').'#one-time-offer-counter-'.$i;
            }
            $js[] = "\$('".$str."').countdown({image: '".OP_IMG."digits.png',startTime: '".self::$temp_vars['one_time_offer_time']."',format: '".self::$temp_vars['one_time_offer_format']."', timerEnd:function(){ window.location.href='".self::$temp_vars['one_time_offer_url']."'; }});";
        }
        return $js;
    }

    static function _check_element($js){
        if(count(self::$check_id) > 0){
            $js = array_merge($js,self::$check_id);
        }
        return $js;
    }

    static function set_lang_keys(){
        self::$lang_keys = array(
            'comments_description' => __('Insert a Wordpress comments block into your page.   Note this element can only be used once on the page and will not render in the LiveEditor.', 'optimizepress'),

            'custom_html_description' => __('Insert custom HTML or shortcodes into your page using this element.  Some shortcodes may not render in the LiveEditor but will show when you preview your page.', 'optimizepress'),

            'fb_comments_description' => __('Insert a Facebook comments block into your page.  Note this element can only be used once and will not render in the LiveEditor', 'optimizepress'),

            'javascript_description' => __('Add your custom JavaScript on page', 'optimizepress'),

            'text_block_description' => __('Insert a normal block of text into your page.  Customize the text styling with the advanced options. You can also insert images and other elements using the WYSIWYG editor', 'optimizepress'),

            'one_time_offer_counter_description' => __('If you have activated the One-Time offer countdown in the page settings, you can use this element to display a timer which will count down until the page expires.', 'optimizepress'),

            'launch_navigation_description' => __('Insert a navigation bar showing your launch pages. Please note this element will only work on pages which have been added to a funnel stage in the Launch Suite', 'optimizepress'),

            'membership_sidebar_description' => __('Insert a menu listing pages from a membership product or category onto your page', 'optimizepress'),

            'membership_breadcrumbs_description' => __('Insert breadcrumb trails for your membership pages to help with navigation', 'optimizepress'),

            'membership_page_listings_description' => __('Insert a list of pages from a membership product or category, including thumbnails and descriptions from your pages', 'optimizepress'),

            'optimizeleads_description' => __('Use OptimizeLeads element to inser OptimizeLeads boxes into your pages. ', 'optimizepress'),

            'op_popup_description' => __('Use OverlayOptimizer element to create a lightbox with any OP elements inside of it.', 'optimizepress'),

        );
    }

    static function lang_key($key){
        if(isset(self::$lang_keys[$key])){
            return self::$lang_keys[$key];
        }
        return '';
    }

    static function add_check_element($id, $message)
    {
        self::$check_id[$id] = $message;
    }
}
OptimizePress_LiveEditor_Assets::init();