<?php
class OptimizePress_Blog_Comments_Module extends OptimizePress_Modules_Base {

    var $facebook_config = array();
    var $language = '';
    var $id = '';
    var $need_js = false;

    function __construct($config=array()){
        parent::__construct($config);
        if (is_admin()){
            // we need this only in OP old theme
            if (defined('OP_TYPE') && OP_TYPE == 'theme') {
                add_action('admin_init', array($this, 'add_comments_meta_boxes'));
                add_action('save_post', array($this, 'op_save_comments_meta_box'));
            }
            add_action('op_asset_footer_js',array($this,'asset_js'));
        } else {
            add_filter('op_post_meta', array($this,'post_meta'));
            add_action('get_header',array($this,'init'));
        }
        add_action('op_footer',array($this,'insert_js'));
    }

    function init(){
        if($this->enabled('facebook')){
            add_filter('language_attributes', array($this,  'language_attrs'));
            if(!defined('OP_PAGEBUILDER')){
                add_filter('comments_array', array($this,'output_comments'));
            }
        }
    }

    function add_meta_boxes(){
        add_action('add_metaboxes', array($this,'add_comments_meta_boxes'));
        add_action( 'save_post', array($this,'op_save_comments_meta_box'), 10, 1);
    }

    /* Adds a box to the main column on the Post and Page edit screens */
    function add_comments_meta_boxes() {
        $screens = array( 'post', 'page' );
        foreach ($screens as $screen) {
            add_meta_box(
                'op_comments_meta_box',
                __( 'Comments', 'optimizepress'),
                array($this, 'op_comments_meta_box'),
                $screen,
                'normal',
                'low',
                array( '__block_editor_compatible_meta_box' => true )
            );
        }
    }

    function op_comments_meta_box($post){
        $id = 'op_comments_';
        $name = 'op[comments]';
        $comment = maybe_unserialize(get_post_meta($post->ID,'op_comments',true));
        $comment = is_array($comment) ? $comment : array();
        wp_nonce_field( 'op_comment_meta_box', 'op_comment_meta_box');
        $fb = $wp = false;
        if(($def = $this->get_option('comments','wordpress','enabled')) && $def == 'Y'){
            $wp = true;
        }
        if(($def = $this->get_option('comments','facebook','enabled')) && $def == 'Y'){
            $fb = true;
        }
        if(isset($comment['wordpress'])){
            $wp = ($comment['wordpress'] == 'Y');
        }
        if(isset($comment['facebook'])){
            $fb = ($comment['facebook'] == 'Y');
        }
        echo '
        <div id="op-meta-comments">
            <label for="'.$id.'wordpress_enabled">'.__('WordPress Comments', 'optimizepress').'</label>
            <p class="op-micro-copy">'.__('Let your visitors comment on this content via the Wordpress comments system', 'optimizepress').'</p>
            <div class="panel-control"><input type="checkbox" name="'.$name.'[wordpress][enabled]" id="'.$id.'wordpress_enabled" value="Y" class="panel-controlx"'.($wp?' checked="checked"':'').' /></div>
            <label for="'.$id.'facebook_enabled">'.__('Facebook Comments', 'optimizepress').'</label>
            <p class="op-micro-copy">'.__('Let your visitors comment on this content via the Facebook comments system. Ensure you have setup your Facebook App ID in the OptimizePress Blog Settings', 'optimizepress').'</p>
            <div class="panel-control"><input type="checkbox" name="'.$name.'[facebook][enabled]" id="'.$id.'facebook_enabled" value="Y" class="panel-controlx"'.($fb?' checked="checked"':'').' /></div>
        </div>';
    }

    function op_save_comments_meta_box($post_id){
        if(!op_can_edit_page($post_id) || !isset($_POST['op_comment_meta_box']) || !wp_verify_nonce( $_POST['op_comment_meta_box'], 'op_comment_meta_box' ) ){
            return;
        }
        $fb = $wp = false;
        $newcomments = array();
        if(($comments = op_post('op','comments','facebook','enabled')) && $comments == 'Y'){
            $fb = true;
        }
        $def = $this->get_option('comments','facebook','enabled');
        if($def == 'Y' && $fb === false){
            $newcomments['facebook'] = 'N';
        } elseif($def != 'Y' && $fb === true){
            $newcomments['facebook'] = 'Y';
        }
        if(($comments = op_post('op','comments','wordpress','enabled')) && $comments == 'Y'){
            $wp = true;
        }
        $def = $this->get_option('comments','wordpress','enabled');
        if($def == 'Y' && $wp === false){
            $newcomments['wordpress'] = 'N';
        } elseif($def != 'Y' && $wp === true){
            $newcomments['wordpress'] = 'Y';
        }
        if(count($newcomments) > 0){
            //echo 'update1 ==== '.$post_id;
            update_post_meta($post_id, 'op_comments', $newcomments);
        } else {
            //echo 'delete';
            delete_post_meta($post_id,'op_comments');
        }
        //exit;
    }

    function display_settings($section_name,$config=array(),$return=false){
        $languages = $this->_get_facebook_languages();
        $vars = array(
            'appid' => 'id',
            'title' => 'title',
            'lang' => 'language',
            'hide_like' => 'hide_like',
            'dark_site' => 'dark_site',
            'posts_number' => 'posts_number',
            'src_url' => 'src_url',
        );
        $page = defined('OP_PAGEBUILDER');
        foreach($vars as $var => $prop){
            $$var = $this->default_attr($section_name,'facebook',$prop);
            $page && empty($$var) && $$var = op_default_attr($section_name,'facebook',$prop);
        }
        $lang = op_get_current_item($languages,$lang);
    ?>
<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
    <div class="op-bsw-grey-panel">
        <div class="op-bsw-grey-panel-header cf">
            <h3><?php _e('WordPress Comments', 'optimizepress') ?></h3>
            <div class="op-bsw-panel-controls cf">
                <?php $enabled = $this->on_off($section_name,'wordpress') ?>
            </div>
        </div>
    </div>
    <div class="op-bsw-grey-panel">
        <div class="op-bsw-grey-panel-header cf">
            <h3><a href="#"><?php _e('Facebook Comments', 'optimizepress') ?></a></h3>
            <div class="op-bsw-panel-controls cf">
                <?php $enabled = $this->on_off($section_name,'facebook') ?>
                <div class="show-hide-panel"><a href="#"></a></div>
            </div>
        </div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <?php if(!$page): ?>

            <label for="op_<?php echo $section_name ?>_facebook_title" class="form-title"><?php _e('Title', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Enter the title for your Facebook comments section', 'optimizepress') ?></p>
            <input type="text" name="op[<?php echo $section_name ?>][facebook][title]" id="op_<?php echo $section_name ?>_facebook_title" value="<?php echo $title ?>" />
            <?php
            endif;
            ?>
            <div class="op-checkbox-container">
                <input type="checkbox" name="op[<?php echo $section_name ?>][facebook][hide_like]" id="op_<?php echo $section_name ?>_facebook_hide_like"<?php echo $hide_like == 'Y' ? ' checked="checked"' : '' ?> value="Y" />
                <label for="op_<?php echo $section_name ?>_facebook_hide_like"><?php _e('Hide Like button', 'optimizepress') ?></label>
                <p class="op-micro-copy"><?php _e('Hide the Facebook Like button above the comments', 'optimizepress') ?></p>
            </div>

            <label for="op_<?php echo $section_name ?>_facebook_language" class="form-title"><?php _e('Language', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Set the language for your Facebook comments system here', 'optimizepress') ?></p>
            <select name="op[<?php echo $section_name ?>][facebook][language]" id="op_<?php echo $section_name ?>_facebook_language">
            <?php
            foreach($languages as $key => $language){
                echo '<option value="'.$key.'"'.($lang==$key?' selected="selected"':'').'>'.$language.'</option>';
            }
            ?>
            </select>

            <div class="op-checkbox-container">
                <input type="checkbox" name="op[<?php echo $section_name ?>][facebook][dark_site]" id="op_<?php echo $section_name ?>_facebook_dark_site"<?php echo $dark_site == 'Y' ? ' checked="checked"' : '' ?> value="Y" />
                <label for="op_<?php echo $section_name ?>_facebook_dark_site"><?php _e('Dark Site?', 'optimizepress') ?></label>
                <p class="op-micro-copy"><?php _e('Check if your site is dark to allow easier to see colours', 'optimizepress') ?></p>
            </div>

            <label for="op_<?php echo $section_name ?>_facebook_posts_number" class="form-title"><?php _e('Number of posts to show', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Enter the number of Facebook comments to show by default_attr(we recommend 10)', 'optimizepress') ?></p>
            <input type="text" name="op[<?php echo $section_name ?>][facebook][posts_number]" id="op_<?php echo $section_name ?>_facebook_posts_number" value="<?php echo $posts_number ?>" />
            <?php if($page): ?>
            <label for="op_<?php echo $section_name ?>_facebook_src_url" class="form-title"><?php _e('Facebook Comments Source URL', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you would like to associate all your comments with a particular page on your site, or show the same comments on multiple pages (perhaps for a launch) enter the URL here. We recommend using your root domain URL.', 'optimizepress') ?></p>
            <input type="text" name="op[<?php echo $section_name ?>][facebook][src_url]" id="op_<?php echo $section_name ?>_facebook_src_url" value="<?php echo $src_url ?>" />
            <?php endif ?>
        </div>
    </div>
</div>
    <?php
    }

    function save_settings($section_name,$config=array(),$op){
        $update = array();
        $arr = array('facebook','wordpress');
        $page = defined('OP_PAGEBUILDER');
        foreach($arr as $a){
            $tmp = op_get_var($op,$a,array());
            $update[$a] = array(
                'enabled' => op_get_var($tmp,'enabled','N')
            );
            if($a == 'facebook'){
                $update[$a]['id'] = op_default_option('comments', 'facebook', 'id');
                if(!$page){
                    $update[$a]['title'] = op_get_var($tmp,'title');
                } else {
                    $update[$a]['src_url'] = op_get_var($tmp,'src_url');
                }
                //$update[$a]['secret'] = op_get_var($tmp,'secret');
                $update[$a]['hide_like'] = op_get_var($tmp,'hide_like','N');
                $update[$a]['dark_site'] = op_get_var($tmp,'dark_site','N');
                $update[$a]['language'] = op_get_var($tmp,'language');
                $update[$a]['posts_number'] = intval(op_get_var($tmp,'posts_number'));
            }
        }

        $this->update_option($section_name,$update);
    }

    function post_meta($array){
        if($this->get_option('comments','wordpress','enabled') == 'Y'){
            return $array;
        }
        $args = array(
            __('<p class="post-meta"><a href="%1$s" title="%2$s" rel="author">%3$s</a></p>', 'optimizepress'),
            esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
            sprintf( esc_attr__( 'View all posts by %s', 'optimizepress'), get_the_author() ),
            esc_html( get_the_author() )
        );
        return $args;
    }



    /* Output hook functions for facebook stuff */
    function language_attrs($attributes=''){
        $attributes .= ' xmlns:fb="http://ogp.me/ns/fb#"';// xmlns:fb="http://www.facebook.com/2008/fbml" xmlns:og="http://opengraphprotocol.org/schema/"';
        return $attributes;
    }

    function insert_js(){
        if(!$this->need_js){
            return;
        }
        $arr = array('comments','facebook');
        $checks = array();
        if($this->id == ''){
            $checks[] = 'id';
        }
        if($this->language == ''){
            $checks[] = 'language';
        }
        $pb = defined('OP_PAGEBUILDER');
        foreach($checks as $chk){
            if($chk == 'language'){
                $$chk = $this->default_option($arr,$chk);
            } else {
                $$chk = $this->get_option($arr,$chk);
            }
            if($pb && (!isset($$chk) || $$chk == '' || $$chk === false)){
                $$chk = op_default_option($arr,$chk);
            }
            $this->$chk = $$chk;
        }
    // echo '
    // <script type="text/javascript" src="http://connect.facebook.net/'.$this->language.'/all.js#appId='.$this->id.'&amp;xfbml=1"></script>';
    ?>
    <script>
        (function ($) {
            <?php $fbAppId = $this->id ? 'appId: ' . $this->id . ',' : ''; ?>
            <?php $fb_lang = $this->language; ?>
            if (typeof window.fbAsyncInit === 'undefined') {
                window.fbAsyncInit = function() {
                    FB.init({
                        <?php echo $fbAppId; ?>
                        xfbml      : true,
                        version    : 'v2.7'
                    });
                    $(window).trigger("OptimizePress.fbAsyncInit");
                };

                (function(d, s, id){
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/<?php echo $fb_lang; ?>/all.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }

            if (typeof FB !== 'undefined') {
                FB.XFBML.parse();
            }
        }(opjq));
    </script>
    <?php
    }

    function output_comments($comments=array(),$return=false,$settings=array()){

        if (!comments_open()) {
            if (is_array($comments) && empty($comments)) {
                return '';
            }
            return $comments;
        }

        $post_id = get_queried_object_id();
        $url = get_permalink($post_id);
        $xid = 'post_'.$post_id;

        $arr = array('comments','facebook');
        $checks = array('id','language','hide_like','dark_site','posts_number','width','title','src_url', 'order');
        $pb = defined('OP_PAGEBUILDER');
        foreach($checks as $chk){
            if(isset($settings[$chk])){
                $$chk = $settings[$chk];
            } else {
                if($chk == 'language' || $chk == 'posts_number' || $chk == 'title'){
                    $$chk = $this->default_option($arr,$chk);
                } elseif($chk == 'src_url'){
                    if(($op = $this->get_option($arr,$chk)) !== false){
                        $$chk = $op;
                    }
                } else {
                    $$chk = $this->get_option($arr,$chk);
                }
            }
            if($pb && (!isset($$chk) || $$chk == '' || $$chk === false)){
                $$chk = op_default_option($arr,$chk);
            }
        }
        $this->id = $id;
        if (empty($language)) {
            if (isset($settings['lang'])) {
                $language = $settings['lang'];
            } else {
                $language = 'en_GB';
            }
        }
        // if it is element, override blog language setting
        if (isset($settings['lang'])) {
            $language = $settings['lang'];
        }
        $this->language = $language;
        $this->need_js = true;
        if(empty($src_url)){
            $src_url = $url;
        }
        $widthstr = $widthstr2 = $widthstr3 ='';
        if(empty($width)){
            $widths = apply_filters('op_column_widths',array());
            if(isset($widths['content-area'])){
                $width = $widths['content-area'];
            }
        }
        if(!empty($width)){
            $width = $width;
            //$widthstr .= '&amp;width='.$width;
            $widthstr3 = ' style="width:'.$width.'px;"';
            $width .= 'px';
        }
        $class = ' class="no-title"';
        if(!empty($title)){
            $class = '';
            $title = '<h3>'.$title.'</h3>';
        }
        $color_scheme = ($dark_site == 'Y' ? ' colorscheme="dark"' : '');
        $out = '
<div id="fb-root"></div>
<div id="fbComments" ' . $class . $widthstr3 . '>
'.urldecode($title).
($hide_like != 'Y' ? '<div class="fb-like op-fbComments--like" data-href="'.$src_url.'" data-colorscheme="'.$color_scheme.'" data-layout="standard" data-action="like" data-show-faces="false"></div>':'').'
    <fb:comments href="'.$src_url.'"'.$color_scheme.' num_posts="'.$posts_number.'" publish_feed="true" migrated="1" data-width="100%" data-order-by="'.$order.'" class="op-fbComments--comments"></fb:comments>
</div>';
// xid="'.$xid.'"
//<iframe src="https://www.facebook.com/plugins/like.php?href='.urlencode($url).'&amp;layout=standard&amp;show_faces=false&amp;action=like&amp;font=arial&amp;colorscheme='.($darksite == 'Y' ? 'dark' : 'light').$widthstr.'" scrolling="no" frameborder="0" allowTransparency="true" style="height:62px;'.($width==''?'':'width:'.$width).'"></iframe>
        if($return){
            return $out;
        }
        echo $out;
        return $comments;
    }


    function _get_facebook_languages(){
        $arr = array(
            'af_ZA' => 'Afrikaans',
            'sq_AL' => 'Albanian',
            'ar_AR' => 'Arabic',
            'hy_AM' => 'Armenian',
            'ay_BO' => 'Aymara',
            'az_AZ' => 'Azeri',
            'eu_ES' => 'Basque',
            'be_BY' => 'Belarusian',
            'bn_IN' => 'Bengali',
            'bs_BA' => 'Bosnian',
            'bg_BG' => 'Bulgarian',
            'ca_ES' => 'Catalan',
            'ck_US' => 'Cherokee',
            'hr_HR' => 'Croatian',
            'cs_CZ' => 'Czech',
            'da_DK' => 'Danish',
            'nl_BE' => 'Dutch (Belgi&euml;)',
            'nl_NL' => 'Dutch',
            'en_PI' => 'English (Pirate)',
            'en_GB' => 'English (UK)',
            'en_US' => 'English (US)',
            'en_UD' => 'English (Upside Down)',
            'eo_EO' => 'Esperanto',
            'et_EE' => 'Estonian',
            'fo_FO' => 'Faroese',
            'tl_PH' => 'Filipino',
            'fb_FI' => 'Finnish (test)',
            'fi_FI' => 'Finnish',
            'fr_CA' => 'French (Canada)',
            'fr_FR' => 'French (France)',
            'gl_ES' => 'Galician',
            'ka_GE' => 'Georgian',
            'de_DE' => 'German',
            'el_GR' => 'Greek',
            'gn_PY' => 'Guaran&iacute;',
            'gu_IN' => 'Gujarati',
            'he_IL' => 'Hebrew',
            'hi_IN' => 'Hindi',
            'hu_HU' => 'Hungarian',
            'is_IS' => 'Icelandic',
            'id_ID' => 'Indonesian',
            'ga_IE' => 'Irish',
            'it_IT' => 'Italian',
            'ja_JP' => 'Japanese',
            'jv_ID' => 'Javanese',
            'kn_IN' => 'Kannada',
            'kk_KZ' => 'Kazakh',
            'km_KH' => 'Khmer',
            'tl_ST' => 'Klingon',
            'ko_KR' => 'Korean',
            'ku_TR' => 'Kurdish',
            'la_VA' => 'Latin',
            'lv_LV' => 'Latvian',
            'fb_LT' => 'Leet Speak',
            'li_NL' => 'Limburgish',
            'lt_LT' => 'Lithuanian',
            'mk_MK' => 'Macedonian',
            'mg_MG' => 'Malagasy',
            'ms_MY' => 'Malay',
            'ml_IN' => 'Malayalam',
            'mt_MT' => 'Maltese',
            'mr_IN' => 'Marathi',
            'mn_MN' => 'Mongolian',
            'ne_NP' => 'Nepali',
            'se_NO' => 'Northern S&aacute;mi',
            'nb_NO' => 'Norwegian (bokmal)',
            'nn_NO' => 'Norwegian (nynorsk)',
            'ps_AF' => 'Pashto',
            'fa_IR' => 'Persian',
            'pl_PL' => 'Polish',
            'pt_BR' => 'Portuguese (Brazil)',
            'pt_PT' => 'Portuguese (Portugal)',
            'pa_IN' => 'Punjabi',
            'qu_PE' => 'Quechua',
            'ro_RO' => 'Romanian',
            'rm_CH' => 'Romansh',
            'ru_RU' => 'Russian',
            'sa_IN' => 'Sanskrit',
            'sr_RS' => 'Serbian',
            'zh_CN' => 'Simplified Chinese (China)',
            'sk_SK' => 'Slovak',
            'sl_SI' => 'Slovenian',
            'so_SO' => 'Somali',
            'es_CL' => 'Spanish (Chile)',
            'es_CO' => 'Spanish (Colombia)',
            'es_MX' => 'Spanish (Mexico)',
            'es_ES' => 'Spanish (Spain)',
            'es_VE' => 'Spanish (Venezuela)',
            'es_LA' => 'Spanish',
            'sw_KE' => 'Swahili',
            'sv_SE' => 'Swedish',
            'sy_SY' => 'Syriac',
            'tg_TJ' => 'Tajik',
            'ta_IN' => 'Tamil',
            'tt_RU' => 'Tatar',
            'te_IN' => 'Telugu',
            'th_TH' => 'Thai',
            'zh_HK' => 'Traditional Chinese (Hong Kong)',
            'zh_TW' => 'Traditional Chinese (Taiwan)',
            'tr_TR' => 'Turkish',
            'uk_UA' => 'Ukrainian',
            'ur_PK' => 'Urdu',
            'uz_UZ' => 'Uzbek',
            'vi_VN' => 'Vietnamese',
            'cy_GB' => 'Welsh',
            'xh_ZA' => 'Xhosa',
            'yi_DE' => 'Yiddish',
            'zu_ZA' => 'Zulu'
        );
        return $arr;
    }

    function enabled($type){
        static $comments;
        if(!isset($comments)){
            $comments = maybe_unserialize(get_post_meta(get_queried_object_id(),'op_comments',true));
            $comments = is_array($comments) ? $comments : array();
        }
        if(isset($comments[$type])){
            return ($comments[$type] == 'Y');
        } else {
            if(($comment = $this->get_option('comments',$type,'enabled')) && $comment == 'Y'){
                return true;
            }
        }
        return false;
    }

    function asset_js(){
        $languages = $this->_get_facebook_languages();
        $vars = array(
            'appid' => 'id',
            'title' => 'title',
            'lang' => 'language',
            'hide_like' => 'hide_like',
            'dark_site' => 'dark_site',
            'posts_number' => 'posts_number',
            'src_url' => 'src_url',
        );
        $options = array();
        foreach($vars as $var => $prop){
            $options[$var] = $this->default_attr('comments','facebook',$prop);
            if(empty($options[$var])){
                $options[$var] = op_default_attr('comments','facebook',$prop);
            }
        }
        $options['lang'] = op_get_current_item($languages,$options['lang']);
        echo '
var op_fb_comments_asset = '.json_encode(array('languages'=>$languages,'options'=>$options)).';';
    }

}