<?php
function op_on_off_switch(){
    return _op_on_off_switch(func_get_args());
}
function op_page_on_off_switch(){
    return _op_on_off_switch(func_get_args(),'op_default_page_option');
}
function op_launch_on_off_switch(){
    return _op_on_off_switch(func_get_args(),'op_launch_default_option');
}
function _op_on_off_switch($sections,$func='op_default_option'){
    $on = false;
    if (isset($sections[2]) && is_bool($sections[2])){
        $on = $sections[2];
        array_splice($sections, 2, -1);
    }
    $opts = array('Y' => 'On', 'N' => 'Off');
    $str = '';
    if(isset($sections[0]) && is_array($sections[0])){
        $id = 'op_'.implode('_',$sections[0]);
        $name = 'op['.implode('][',$sections[0]).'][enabled]';
    } else {
        $id = 'op_'.implode('_',$sections);
        $name = 'op['.implode('][',$sections).'][enabled]';
    }
    $sections[] = 'enabled';
    $val = call_user_func_array($func,$sections);
    return _op_on_off_switch_html($name,$id,$val,'',$on);
}
function _op_on_off_switch_html($name,$id,$value,$add_class='',$on=false){
    $checked = $value == 'Y' ? true : false;
    $checked = $on ? $on : $checked;
    echo '
    <div class="panel-control"><input type="checkbox" name="'.$name.'" id="'.$id.'_enabled" value="Y" class="panel-controlx'.($add_class==''?'':' '.$add_class).'"'.($checked?' checked="checked"':'').' /></div>';
    return $checked;
}
function op_asset_file_list($asset){
    $file_list = array();
    $path = OP_ASSETS.'addon/'.$asset;
    $dir = @ dir($path);
    $prefix = 'assets/'.$asset.'/';
    if($dir){
        while(($file = $dir->read()) !== false){
            if($file != '.' && $file != '..' && $file != 'index.php' && strpos($file, '.') !== 0){
                if(is_dir($path.'/'.$file)){
                    $file_list = array_merge($file_list,op_asset_file_list($asset.'/'.$file,$prefix));
                } else {
                    $file_list[$path.'/'.$file] = $prefix.$file;
                }
            }
        }
    }
    return $file_list;
}
function op_tiny_mce( $content, $editor_id, $settings = array() ) {
    // static $wysiwygs;

    $wysiwygs = function_exists('wp_editor');

    if($wysiwygs){
        // if (!class_exists('_WP_Editors')) require OP_FUNC.'tinymce.php';
        if (defined('OP_POST_PAGE')) $settings['disable_init'] = true;
        // $settings['dfw'] = true;
        // wp_enqueue_script('tiny_mce');
        // _WP_Editors::editor($content, $editor_id, $settings);
        // echo 'editorid: ' . $editor_id;
        wp_editor( $content, $editor_id, $settings );
    } else {
        echo '<textarea name="'.op_get_var($settings,'textarea_name',$editor_id).'" id="'.$editor_id.'" rows="5" cols="40">'.op_attr($content).'</textarea>';
    }
}
function _op_file_info($return=false){
    $type = op_post('attach_type');
    $url = $html = $file = '';
    if($type == 'url'){
        $url = op_post('media_url');
        $ext = preg_match('/\.([^.]+)$/', $url, $matches) ? strtolower($matches[1]) : false;
        if(in_array($ext,array('jpg', 'jpeg', 'gif', 'png'))){
            $html .= '<a href="'.$url.'" target="_blank" class="preview-image"><img src="'.$url.'" alt="uploaded-image" /></a><a href="#remove" class="remove-file">'.__('Remove Image', 'optimizepress').'</a>';
        } else {
            $html .= '<a href="'.$url.'" target="_blank" class="preview-image">'.__('View File', 'optimizepress').'</a><a href="#remove" class="remove-file">'.__('Remove File', 'optimizepress').'</a>';
        }
    } else {
        $item_id = op_post('media_item');
        $size = op_post('media_size');
        $file = get_attached_file($item_id);
        if(wp_attachment_is_image($item_id)){
            $url = wp_get_attachment_image_src($item_id,$size);
            $html = '<a href="'.$url[0].'" target="_blank" class="preview-image"><img src="'.$url[0].'" alt="uploaded-image" data-width="' . $url[1] .'" data-height="' . $url[2] .'" data-id="' . $item_id . '" /></a><a href="#remove" class="remove-file">'.__('Remove Image', 'optimizepress').'</a>';
            $url = $url[0];
        } else {
            $url = wp_get_attachment_url( $item_id );
            $html = '<a href="'.$url.'" target="_blank" class="preview-image">'.__('View File', 'optimizepress').'</a><a href="#remove" class="remove-file">'.__('Remove File', 'optimizepress').'</a>';
        }
    }
    echo json_encode(array('url'=>$url,'html'=>$html,'file'=>$file));
    exit;
}
add_action('wp_ajax_'.OP_SN.'-file-attachment','_op_file_info');
function op_upload_field($fieldid,$value='',$return=false,$file_or_url='url',$disable_url=false){
    static $upload_count = 0;
    $html = '
    <div class="op-file-uploader">
        <a href="media-upload.php?post_id=0&amp;op_uploader=true'.($disable_url?'&amp;op_uploader_url_disable=Y':'').'&amp;TB_iframe=1" class="thickbox button" title="'.esc_attr__( 'Add Media' ).'">'.__('Select File', 'optimizepress').'</a>';
        $id = str_replace(array('[]','][','[',']'),array('_'.$upload_count,'_','_',''),$fieldid);
        if($file_or_url == 'url'){
            $html .= '
        <input type="hidden" name="'.$fieldid.'" id="'.$id.'" value="'.op_attr($value).'" class="op-uploader-value" />';
        } else {
            $url = $path = '';
            if(is_array($value)){
                $url = $value['url'];
                $path = $value['path'];
            }
            $html .= '
        <input type="hidden" name="'.$fieldid.'[url]" id="'.$id.'_url" value="'.op_attr($url).'" class="op-uploader-value" />
        <input type="hidden" name="'.$fieldid.'[path]" id="'.$id.'_path" value="'.op_attr($path).'" class="op-uploader-path" />';
        }
        $html .= '
        <span class="file-preview cf">
            <div class="op-waiting"><img class="op-bsw-waiting op-show-waiting op-hidden" alt="" src="images/wpspin_light.gif" /></div>
            <div class="content cf">';
        if($value != '' && $value !== false){
            $ext = preg_match('/\.([^.]+)$/', $value, $matches) ? strtolower($matches[1]) : false;
            if(in_array($ext,array('jpg', 'jpeg', 'gif', 'png'))){
                $html .= '<a href="'.$value.'" target="_blank" class="preview-image"><img src="'.$value.'" alt="uploaded-image" /></a><a href="#remove" class="remove-file">'.__('Remove Image', 'optimizepress').'</a>';
            } else {
                $html .= '<a href="'.$value.'" target="_blank" class="preview-image">'.__('View File', 'optimizepress').'</a><a href="#remove" class="remove-file">'.__('Remove File', 'optimizepress').'</a>';
            }
        }
        $html .= '
            </div>
        </span>
    </div>';
    $upload_count++;
    if($return){
        return $html;
    }
    echo $html;
}
/*
 * Function: op_thumb_gallery
 * Description: Adds a view gallery button to a page and an image slider as well.
 * Parameters:
 *  $fieldid (string): The name attribute, of the gallery button
 *  $value (string): The default value for this control
 *  $gallery_dir (string): The thumb directory that will be scanned
 *  $return (boolean): Determines whether value will be returned or echoed
 */
function op_thumb_gallery($fieldid, $value = '', $gallery_dir = '', $id = '', $return = false){
    static $gallery_count = 0;
    $id = (empty($id) ? str_replace(array('[]','][','[',']'),array('_'.$gallery_count,'_','_',''),$fieldid) : str_replace(array('[]','][','[',']'),array('_'.$gallery_count,'_','_',''),$id));
    $html = '
    <div id="'.$id.'" class="op-thumb-gallery">
        <a data-target="'.$id.'_gallery" href="#" class="button op-content-slider-button" title="'.esc_attr__( 'Select From Gallery' ).'">'.__('Select From Gallery', 'optimizepress').'</a>
    ';
    $html .= '
        <input type="hidden" name="'.$fieldid.'" id="'.$id.'" value="'.op_attr($value).'" class="op-gallery-value" />
        <span class="file-preview cf">
            <div class="op-waiting"><img class="op-bsw-waiting op-show-waiting op-hidden" alt="" src="images/wpspin_light.gif" /></div>
            <div class="content cf">
    ';
    if($value != '' && $value !== false){
        $ext = preg_match('/\.([^.]+)$/', $value, $matches) ? strtolower($matches[1]) : false;
        if(in_array($ext,array('jpg', 'jpeg', 'gif', 'png'))){
            $html .= '<a href="'.$value.'" target="_blank" class="preview-image"><img src="'.$value.'" alt="uploaded-image" /></a><a href="#remove" class="remove-file button">'.__('Remove Image', 'optimizepress').'</a>';
        } else {
            $html .= '<a href="'.$value.'" target="_blank" class="preview-image">'.__('View File', 'optimizepress').'</a><a href="#remove" class="remove-file button">'.__('Remove File', 'optimizepress').'</a>';
        }
    }
    $html .= '
            </div>
        </span>
    </div>
    ';
    $gallery = op_list_directory_images(OP_THUMB.$gallery_dir);
    $html .= op_image_slider($id.'_gallery', $gallery, true);
    //$html .= '<script type="text/javascript">bind_content_sliders();</script>';
    $gallery_count++;

    if($return) return $html; else echo $html;
}
/**
 * Renders CHECKBOX element
 * @author OptimizePress <info@optimizepress.com>
 * @param  string  $name
 * @param  integer $value
 * @param  boolean $checked
 * @param  string  $attributes
 * @param  boolean $return
 * @return mixed
 */
function op_checkbox_field($name, $value = 1, $checked = '', $attributes = null, $return = false) {
    $id = str_replace(array('[]', '][', '[', ']'), array('_', '_', '_', ''), $name);
    $html = '
    <input type="hidden" name="' . $name . '" value="0" />
    <input type="checkbox" id="'. $id .'" name="' . $name . '" value="' . $value . '"'. $checked . $attributes . ' />';

    if($return) return $html; else echo $html;
}
function op_text_field($fieldid,$value='',$return=false){
    $id = str_replace(array('[]','][','[',']'),array('_','_','_',''),$fieldid);
    $html = '<input type="text" id="'.$id.'" name="'.$fieldid.'" value="'.$value.'" />';

    if($return) return $html; else echo $html;
}
function op_text_area($fieldid,$value='',$return=false){
    $id = str_replace(array('[]','][','[',']'),array('_','_','_',''),$fieldid);
    $html = '<textarea id="'.$id.'" name="'.$fieldid.'">'.$value.'</textarea>';

    if($return) return $html; else echo $html;
}
/*
 * Function: op_content_slider
 * Description: Adds a javascript content slider to the page. Note this just inserts HTML, not javascript.
 * Parameters:
 *  $content (string): The content that will be displayed in content slider
 *  $id (string): Optionally can choose the sliders ID here
 *  $return (boolean): Determines whether value will be returned or echoed
 */
function op_content_slider($content = '', $id = '', $return = false){
    //Initialize the static slider counter. Since its static, it will hold value even after function call
    //has ended. This will allow us to keep track of how many we have created
    static $count = 0;

    //If the id is empty then we make an ID with the current number of sliders active, including this one
    if (empty($id) || $id=='op-content-slider'){
        $id = 'op-content-slider-'.$count;
        $count++;
    }

    //Generate the HTML
    $html = '
        <div id="'.$id.'" class="sneezing-panda op-content-slider">
            <div class="content">'.$content.'</div>
            <a href="#" class="hide-the-panda"><span></span></a>
        </div>
    ';

    if ($return) return $html; else echo $html;
}

/**
 * Function: op_image_slider
 * Description: Wrapper for op_content_slider(). Adds a javascript image slider to the page. Note this just inserts HTML, not javascript.
 * Parameters:
 *  $id (string): ID of the slider element
 *  $gallery (array): The array of images that the image slider will use
 *  $return (boolean): Determines whether value will be returned or echoed
 */
function op_image_slider($id = '', $gallery = array(), $return = false){
    // Initialize content variable
    $content = '<ul class="op-image-slider-content">';

    // Loop through images
    sort($gallery);
    foreach($gallery as $img){
        // If the image is not an array, presumably a string, recreate it with the correct structure and defaults
        if (!is_array($img)){
            //Get the image size for this image
            $realImagePath = str_replace(site_url(), $_SERVER['DOCUMENT_ROOT'], $img);
            list($width, $height) = @getimagesize($realImagePath);

            //Create array with defaults and assign to $img
            $img_array = array(
                'title' => '',
                'src' => $img,
                'width' => 270,
                'height' => 152
            );
            $img = $img_array;
        }

        $img['name'] = str_replace(OP_DIR.'lib/images/thumbs/page_thumbs/', '', $img['src']);
        $img['name'] = str_replace('.jpg', '', $img['name']);

        // Convert raw filesystem path to URL
        $img['src'] = str_replace(OP_DIR, OP_URL, $img['src']);


        // Add image to content
        // $content .= '<li><a href="#"><img src="'.$img['src'].'"'.(!empty($img['title']) ? ' alt="'.$img['title'].'"' : '').(!empty($img['width']) ? ' width="'.$img['width'].'"' : '').(!empty($img['height']) ? ' height="'.$img['height'].'"' : '').' /></a></li>';
        if ($img['name'] != 'page_thumbs_sprite') {
            $content .= '<li><a href="#" class="op-' . $img['name'] . '" src="' . $img['src'] . '">' . (!empty($img['title']) ? ' '.$img['title'] : $img['name']) . '</a></li>';
        }
    }

    $content .= '</ul>';

    // Put image slider content into content slider and get html from that
    $html = op_content_slider($content, $id);

    if ($return) return $html; else echo $html;
}
function op_can_edit_page($post_id){
    static $allowed;
    if(!isset($allowed)){
        if(!isset($_POST['post_type'])){
            $allowed = false;
            return $allowed;
        }
        if ( 'page' == $_POST['post_type'] ) {
            if ( !current_user_can( 'edit_page', $post_id ) ){
                $allowed = false;
                return $allowed;
            }
        } elseif ( !current_user_can( 'edit_post', $post_id ) ){
            $allowed = false;
            return $allowed;
        }
        $allowed = true;
    }
    return $allowed;
}
function op_default_link($fieldid,$value,$return=false){
    if($value){
        $default = '
            <a href="#'.$fieldid.'" class="default-val-link">'.__('Default', 'optimizepress').'</a>
            <input type="hidden" id="'.$fieldid.'_default" value="'.esc_attr($value).'" />
        ';
        if ($return) return $default; else echo $default;
    }
}
function op_default_help_vids(){
    static $videos;
    if(!isset($videos)){
        $default = array(
            'url' => 'http://d376poxu706s4t.cloudfront.net/contextual_update-001.mp4',
            'width' => '600',
            'height' => '338',
        );
        $videos = array(
            'theme' => array(
                'url' => '',
                'width' => '712',
                'height' => '400'
            ),
            'brand' => array(
                'blog_header' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'favicon' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-favicon.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'color_scheme' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-color-settings-001.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'nav_color_scheme' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'copyright_notice' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-copyright.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'info_bar' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-infobar.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'typography' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'layout' => array(
                'column_layout' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-sidebar-column.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'header_prefs' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-navigation-001.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'footer_prefs' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-footer.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'modules' => array(
                'home_feature' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-homepage-feature-001.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'advertising' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-advertising-001.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'sidebar_optin' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-sidebar-optin-001.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'sharing' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-sharing.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'related_posts' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-related-posts.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'promotion' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'comments' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-comments.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'seo' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'scripts' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-custom-scripts.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'continue_reading' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-blog-continue-reading-links.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'asset_browser' => array(
                'step_1' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'step_2' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'step_3' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
                'step_4' => array(
                    'url' => '',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'global_settings' => array(
                'header_logo_setup' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-header-logo.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'favicon_setup' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-favicon.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'site_footer' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-footer.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'custom_css' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-custom-css.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'api_key' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-api-key.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'seo' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-seo.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'typography' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-typography.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'promotion' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-promotion-settings.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'analytics_and_tracking' => array(
                'analytics_and_tracking' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-analytics-and-tracking.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'email_marketing_services' => array(
                'aweber' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-email-aweber.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'infusionsoft' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-email-infusionsoft.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'icontact' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-email-icontact.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'mailchimp' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-email-mailchimp.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'gotowebinar' => array(
                    'url' => 'https://player.vimeo.com/external/245204430.hd.mp4?s=badf7a33b4c748da75f94142cd3fcb484c2766fb&profile_id=174',
                    'width' => '712',
                    'height' => '400'
                ),
                'getresponse' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-email-getresponse.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
                'campaignmonitor' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-email-campaignmonitor.mp4',
                    'width' => '712',
                    'height' => '400'
                ),
            ),
            'social_integration' => array(
                'facebook_app_id' => array(
                    'url' => 'http://dk570e8aei0zb.cloudfront.net/op-short-facebook-app-id.mp4',
                    'width' => '712',
                    'height' => '400'
                )
            ),
            'page' => array(
                'functionality' => array(
                    'launch_funnel' => array(
                        'url' => '',
                        'width' => '712',
                        'height' => '400'
                    )
                )
            )
        );
        $videos = apply_filters('op_help_videos',$videos);
    }
    return $videos;
}

function op_asset_help_vid($sections,$return=false){
    if(!is_array($sections)){
        $sections = array($sections);
    }
    array_unshift($sections,'asset_browser');
    return op_help_url($sections,'<a href="{url}" {sizing} tabindex="-1" title="'.__('Help', 'optimizepress').'" class="help-me"><span>?</span></a>',$return);
}

function op_help_vid($sections,$return=false){
    return op_help_url($sections,'<a href="{url}" {sizing} title="'.__('Help', 'optimizepress').'" class="help-video op-help-vid tooltip animated pulse"><img src="'.op_img('',true).'help-video.png" alt="Help" width="22" height="22" /></a>',$return);
}

function op_help_url($sections,$html,$return){
    static $video_counter = 0;
    $vid = '';
    $func = 'op_theme_config';
    if(defined('OP_PAGEBUILDER')){
        $func = 'op_page_config';
    }

    if(!$video = $func('help_videos',$sections)){
        if(!$video = _op_traverse_array(op_default_help_vids(),$sections)){
            return '';
        }
    }
    $width = '511';
    $height = '288';
    $url = $video;
    if(is_array($video)){
        $width = op_get_var($video,'width',$width);
        $height = op_get_var($video,'height',$height);
        $url = op_get_var($video,'url',$url);
    }
    $out = '';
    if(!empty($url)){
        $video_counter++;

        // $arr = array(
        //     'playlist' => array(
        //         array(
        //             'autoPlay' => true,
        //             'autoBuffering' => true,
        //             'url' => $url
        //         )
        //     ),
        //     'plugins' => array(
        //         'controls' => array(
        //             'url' => OP_MOD_URL.'blog/video/flowplayer/flowplayer.controls-3.2.5.swf'
        //         )
        //     )
        // );
        // $url = OP_MOD_URL.'blog/video/flowplayer/flowplayer-3.2.7.swf?config='.str_replace('"',"'",json_encode($arr));
        // $vid = '
        //     <div>
        //         <input type="hidden" name="help_vid_width[]" value="'.$width.'" class="help_vid_width" />
        //         <input type="hidden" name="help_vid_height[]" value="'.$height.'" class="help_vid_height" />
        //     </div>
        // ';
        $sizing = ' data-width="' . $width . '" data-height="' . $height . '" ';
        $out = str_replace(array('{url}','{sizing}'),array($url,$sizing),$html);
    }

    if($return){
        return $out;
    }
    echo $out;
}
function op_text_decoration_drop($name,$value,$id='',$return=false){
    $options = array(
        //'' => OP_STRING_FONT_DECORATION,
        'none' => '(None)',
        'blink' => 'Blink',
        'line-through' => 'Line Through',
        'overline' => 'Overline',
        'underline' => 'Underline'
    );
    $out = '<select class="op_sections_default_typography_text_decoration" name="'.$name.'"'.($id == '' ? '':' id="'.$id.'"').'>';
    foreach($options as $option => $title){
        $out .= '<option value="'.$option.'"'.($value==$option?' selected="selected"':'').'>'.$title.'</option>';
    }
    $out .= '</select>';
    if ($return) return $out; else echo $out;
}
function op_color_picker($name,$value,$id='',$hidden=false,$return=false){
    $field = '
        <div class="color-picker-container cf">
            <input type="text" name="'.$name.'"'.($id!=''?' id="'.$id.'"':'').' value="'.$value.'" />
            <a class="pick-color hide-if-no-js" href="#"'.(!empty($value)?' style="background-color:'.$value.'"':'').'></a>
        </div>
    ';

    if($return) return $field; else echo $field;
}

/**
 * Generates jQuery UI slider markup
 * @param  string  $name
 * @param  string  $value
 * @param  string  $id
 * @param  integer $min
 * @param  integer $max
 * @param  string  $unit
 * @param  boolean $display
 * @param  boolean $return
 * @param  boolean $disabled
 * @return void|string depending on $return param
 */
function op_slider_picker($name, $value, $id, $min = 0, $max = 100, $unit = 'px', $display = true, $return = false, $disabled = false)
{
    $output = '';
    if (true === $display) {
        $output .= '<div class="slider-output"><span id="output_' . $id . '" data-unit="' . $unit . '">' . $value . $unit . '</span></div>';
    }

    $output .= '<div class="slider-item" id="' . $id . '" data-min="' . $min . '" data-max="'. $max . '" data-value="' . $value . '"' . ($disabled === true ? ' data-disabled="true"': '') . '><input type="hidden" value="' . $value .'" name="' . $name .'" id="input_' . $id . '" /></div>';

    if (true === $return) {
        return $output;
    }

    echo $output;
}

function op_sort_theme_array($a,$b){
    if ($a['name'] == $b['name']) {
        return 0;
    }
    return ($a['name'] < $b['name']) ? -1 : 1;
}
function op_sort_asset_array($a,$b){
    if ($a['title'] == $b['title']) {
        return 0;
    }
    return ($a['title'] < $b['title']) ? -1 : 1;
}
function op_show_error($msg = '', $echo = true, $extra_class = '', $element_id = ''){
    _op_notification($msg, OP_NOTIFY_ERROR, false, $echo, $extra_class, $element_id);
}
function op_show_warning($msg = '', $echo = true, $extra_class = '', $element_id = ''){
    _op_notification($msg, OP_NOTIFY_WARNING, false, $echo, $extra_class, $element_id);
}
function op_notify($msg = '', $hide_button=false, $echo = true, $extra_class = '', $element_id = ''){
    _op_notification($msg, OP_NOTIFY_SUCCESS, $hide_button, $echo, $extra_class, $element_id);
}
/*
 * Function: _op_notification
 * Description: Will display a notification with a custom message and a custom look
 * Parameters:
 *  $msg (string): The body of the notification
 *  $type (int): Type of message. Values can be of the following:
 *      0 (Also can use constant OP_NOTIFY_SUCCESS): Uses the success CSS class
 *      1 (Also can use constant OP_NOTIFY_WARNING): Uses the warning CSS class
 *      2 (Also can use constant OP_NOTIFY_ERROR): Uses the error CSS class
 *  $hide_button (boolean): Will hide the close button on notification if true
 *  $echo (boolean): Determines whether value will be returned or echoed
 *  $extra_class (string): Additional class that will be appended to the element.
 *  $element_id (string): Id that will be appended to the element.
 *      If the key with id of the element ('op-notification-' . $element_id) exists in cookie and its value is equal to 'notification_hidden', notification is not displayed.
 *
 * Extra Notes: The above three functions are wrappers for this function
 */
function _op_notification($msg='', $type = 0, $hide_button = false, $echo = true, $extra_class = '', $element_id = ''){
    switch($type){
        case 1:
            $className = 'warning';
            break;
        case 2:
            $className = 'error';
            break;
        case 0:
        default:
            $className = 'success';
    }

    $extra_class = $extra_class ? ' ' . trim($extra_class) : '';
    $id = $element_id ? 'id="op-notification-' . $element_id . '"' : '';

    $notification = '<div class="op-notify ' . $className . $extra_class . '" ' . $id . '><img src="'.op_img('notify-'.$className.'.png',true).'" alt="'.ucfirst($className).'"/><span><strong>'.ucfirst($className).'! </strong>'.__($msg, 'optimizepress').'</span>'.($hide_button?'':'<div class="op-notify-close"></div>').'</div>';

    //If notification is in the cookie, don't show it.
    if (isset($_COOKIE['op-notification-' . $element_id]) && $_COOKIE['op-notification-' . $element_id] === 'notification_hidden') {
        return;
    }

    if ($echo) {
        echo $notification;
    } else {
        return $notification;
    }
}

function op_check_file($filename,$path,$file=true,$dir=true,$types=array(),$natypes=array()){
    $na = array('','.','..');
    if(in_array($filename,$na)){
        return false;
    }
    $filename = $path.'/'.$filename;
    if($file && is_file($filename)){
        return (count($types) > 0 || count($natypes) > 0)?op_check_file_type($filename,$types,$natypes):true;
    }
    if($dir && is_dir($filename)){
        return true;
    }
    return false;
}
function op_dir_list($dir){
    $dir = rtrim($dir,'/');
    $t_dir = @opendir($dir);
    if(!$t_dir)
        return false;
    $dirs = array();
    $hiddenDirs = apply_filters('op_dir_filter', array(), $dir);
    while(($file = readdir($t_dir)) !== false){
        if(op_check_file($file,$dir,false) && false === in_array($file, $hiddenDirs)){
            $dirs[] = $file;
        }
    }
    if($t_dir) {
        @closedir($t_dir);
    }
    /*
     * This filter allows us to add addon themes (with external plugins)
     */
    $dirs = apply_filters('op_theme_dirs', $dirs);

    return count($dirs) ? $dirs : false;
}
function op_file_list($dir,$dirs=false,$types=array(),$natypes=array()){
    $dir = rtrim($dir,'/');
    $t_dir = @opendir($dir);
    if(!$t_dir)
        return false;
    $files = array();
    while(($file = readdir($t_dir)) !== false){
        if(op_check_file($file,$dir,true,$dirs,$types,$natypes)){
            $files[] = $file;
        }
    }
    if($t_dir)
        @closedir($t_dir);
    return count($files) ? $files : false;
}
function op_check_file_type($file,$types=array(),$natypes=array()){
    if(empty($file))
        return false;
    if(count($types) == 0 && count($natypes) == 0)
        return true;
    $lower = strtolower($file); $fl = strlen($file);
    if(count($natypes) > 0){
        foreach($natypes as $n){
            $nl = strlen($n);
            $tmp = substr($lower,($fl-$nl),$nl);
            if($tmp == $n)
                return false;
        }
    }
    if(count($types) > 0){
        foreach($types as $t){
            $tl = strlen($t);
            $tmp = substr($lower,($fl-$tl),$tl);
            if($tmp == $t)
                return true;
        }
    }
    return false;
}
function op_delete_folder($tmp_path){
    if(!is_writeable($tmp_path) && is_dir($tmp_path)){
        chmod($tmp_path,0777);
    }
    $handle = opendir($tmp_path);
    while($tmp=readdir($handle)){
        if($tmp!='..' && $tmp!='.' && $tmp!='' && strpos($tmp, '.') !== 0){
            if(is_writeable($tmp_path.DS.$tmp) && is_file($tmp_path.DS.$tmp)){
                unlink($tmp_path.DS.$tmp);
            } elseif(!is_writeable($tmp_path.DS.$tmp) && is_file($tmp_path.DS.$tmp)){
                chmod($tmp_path.DS.$tmp,0666);
                unlink($tmp_path.DS.$tmp);
            }
            if(is_writeable($tmp_path.DS.$tmp) && is_dir($tmp_path.DS.$tmp)){
                op_delete_folder($tmp_path.DS.$tmp);
            } elseif(!is_writeable($tmp_path.DS.$tmp) && is_dir($tmp_path.DS.$tmp)){
                chmod($tmp_path.DS.$tmp,0777);
                op_delete_folder($tmp_path.DS.$tmp);
            }
        }
    }
    closedir($handle);
    rmdir($tmp_path);
    if(!is_dir($tmp_path)){
        return true;
    } else {
        return false;
    }
}
function op_upload_file($name){
    $uploads = wp_upload_dir();
    $fileobj = is_array($name) ? $name : $_FILES[$name];
    if(!empty($fileobj['tmp_name']) && file_is_displayable_image($fileobj['tmp_name'])){
        if($file = wp_handle_upload($fileobj,array('test_form'=>false,'action'=>'wp_handle_upload'))){
            $sizes = array();
            if(isset($field['field_opts'])){
                $opts = $field['field_opts'];
                if(isset($opts['max_w']) && isset($opts['max_h']))
                    $sizes = array($opts['max_w'],$opts['max_h']);
            }
            $image_url = $file['url'];
            if(count($sizes) == 2){
                $resized = image_make_intermediate_size($file['file'],$sizes[0],$sizes[1]);
                if($resized)
                    $image_url = $uploads['url'].'/'.$resized['file'];
            }
            $attachment = array('post_title' => $fileobj['name'],
                                'post_content' => '',
                                'post_status' => 'inherit',
                                'post_mime_type' => $file['type'],
                                'guid' => $image_url);
            $aid = wp_insert_attachment($attachment,$file['file'],0);
            if(!is_wp_error($aid)){
                wp_update_attachment_metadata($aid,wp_generate_attachment_metadata($aid,$file['file']));
                return array('image' => $image_url);
            } else {
                return array('error' => $aid->get_error_message());
            }
        }
    } else {
        return array('error' => ($fileobj['error'] == 4 ? false : __('The file you tried to upload is not a valid image.', 'optimizepress')));
    }
}
/*
 * Function: op_list_directory
 * Description: Returns an array of files in the directory with the ability to filter by extension
 * Parameters:
 *  $dir (string): Absolute file system directory to be searched through
 *  $blacklist (array): Contains a list of extensions to be filtered out from results
 *  $whitelist (array): Contains a list of extensions to be included in results
 *
 *  Extra Notes: If the whitelist is used, it makes the blacklist useless since
 *  only whitelist results are included when used
 */
function op_list_directory($dir, $blacklist = array(), $whitelist = array()){
    //Initialize the results array
    $results = array();

    //If the last character of the directory is not a trailing slash, make it one
    if (substr($dir, 0, -1)) $dir .= '/';

    //Find all files in directory
    if ($handle = opendir($dir)){
        //Loop through each file
        while (false !== ($entry = readdir($handle))){
        //The . and .. directories are listed so we make sure we do not use those
        if ($entry != "." && $entry != ".." && $entry != 'index.php' && strpos($entry, '.') !== 0){
            //Get the file extension
            $ext = op_get_file_extension($entry);

            //Check if we are using the whitelist or the blacklist
            if (!empty($whitelist)){ //Whitelist
            //If this extension is in the whitelist then we add it
            if (in_array($ext, $whitelist)) array_push($results, $dir.$entry);
            } else { //Blacklist
            //Add to the results array if this file should not be filtered out
            if (!in_array($ext, $blacklist)) array_push($results, $dir.$entry);
            }
        }
        }

        //Finally we close the directory to free up memory
        closedir($handle);
    }

    return $results;
}
/*
 * Function: op_list_directory_images
 * Description: Returns an array of image files in the directory specified
 * Parameters:
 *  $directory (string): Absolute file system directory to be searched through
 */
function op_list_directory_images($dir){
    return op_list_directory($dir, array(), array('jpg', 'jpeg', 'gif', 'png', 'bmp'));
}

/*
 * Function: op_get_file_extension
 * Description: Returns the extension of a file
 * Parameters:
 *  $file (string): Filename to extract extension from
 */
function op_get_file_extension($file){
    $file_array = explode('.', $file);
    return end($file_array);
}

/*
 * Function: op_get_current_browser
 * Description: Returns browser info in an array (name, full_name, version)
 */
function op_get_current_browser() {
    $ua = strtolower($_SERVER['HTTP_USER_AGENT']);

    if (preg_match('/(chromium)[ \/]([\w.]+)/', $ua)) {
        $browser = 'chromium';
        $browser_name = 'Chromium';
    } elseif (preg_match('/(chrome)[ \/]([\w.]+)/', $ua)) {
        $browser = 'chrome';
        $browser_name = 'Chrome';
    } elseif (preg_match('/(safari)[ \/]([\w.]+)/', $ua)) {
        $browser = 'safari';
        $browser_name = 'Safari';
    } elseif (preg_match('/(opera)[ \/]([\w.]+)/', $ua)) {
        $browser = 'opera';
        $browser_name = 'Opera';
    } elseif (preg_match('/(msie)[ \/]([\w.]+)/', $ua)) {
        $browser = 'msie';
        $browser_name = 'Internet Explorer';
    } elseif (preg_match('/(trident)[ \/]([\w.]+)/', $ua)) {
        $browser = 'trident';
        $browser_name = 'Internet Explorer';
    } elseif (preg_match('/(firefox)[ \/]([\w.]+)/', $ua)) {
        $browser = 'firefox';
        $browser_name = 'Firefox';
    } else {
        $browser = 'unknown';
        $browser_name = '';
    }

    if ($browser === 'trident') {
        preg_match('/(rv\:)([\w]+)/', $ua, $version);
        $browser = 'msie';
    } elseif ($browser === 'safari' || $browser === 'opera') {
        preg_match('/(version)[ \/]([\w]+)/', $ua, $version);
    } else {
        preg_match('/('.$browser.')[ \/]([\w]+)/', $ua, $version);
    }

    return array(
        'name'=>$browser,
        'full_name'=>$browser_name,
        'version'=>$version[2]
    );
}


/**
 * Get revisions
 */
add_action('wp_ajax_'.OP_SN.'-op_ajax_get_page_revisions','_op_ajax_get_page_revisions');
function _op_ajax_get_page_revisions () {

    global $revisions_page_id;

    if ($_POST['page_id'] != '') {
        $revisions_page_id = $_POST['page_id'];
    }

    echo op_tpl('live_editor/revisions');
    exit;
}

/**
 * Clears transient SL cache for given element key.
 * @param  string $key
 * @since 2.5.4.4
 * @return void
 */
function op_clear_element_cache($key)
{
    global $wpdb;

    $wpdb->query($wpdb->prepare("
        DELETE FROM {$wpdb->options}
        WHERE option_name LIKE %s OR option_name LIKE %s
        ",
        '_transient_' . $wpdb->esc_like($key) . '%',
        '_transient_timeout_' . $wpdb->esc_like($key) . '%'
    ));
}

/**
 * Clears all element SL cache. Uses "op_cacheable_elements" filter to fetch list of element keys.
 * @since 2.5.4.4
 * @return void
 */
function op_clear_elements_cache()
{
    $elements = apply_filters('op_cacheable_elements', array());
    foreach ($elements as $key => $element) {
        op_clear_element_cache($key);
    }

    wp_send_json_success();
}
add_action('wp_ajax_' . OP_SN . '-clear-elements-cache', 'op_clear_elements_cache');