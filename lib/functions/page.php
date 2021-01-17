<?php
function _op_launch_define(){
    static $launch_arr;
    if(!isset($page_id)){
        if($launch_info = op_page_option('launch_suite_info')){
            if(defined('OP_PAGEBUILDER_ID')){
                $page_id = OP_PAGEBUILDER_ID;
            } else {
                global $post;
                $page_id = $post->ID;
            }
            if(!defined('OP_LAUNCH_FUNNEL')){
                define('OP_LAUNCH_FUNNEL',$launch_info['funnel_id']);
            }
            $launch_arr = array('launch_info'=>$launch_info,'page_id'=>$page_id);
        }
    }
    return $launch_arr;
}

function _op_launch_is_evergreen(){
    static $evergreen;
    if(!isset($evergreen) && _op_launch_define()){
        $evergreen = (op_launch_option('perpetual_launch','enabled') == 'Y');
    }
    return $evergreen;
}

function _op_launch_is_key_on(){
    static $is_on;
    if(!isset($is_on) && _op_launch_define()){
        $is_on = (op_launch_option('gateway_key','enabled') == 'Y');
    }
    return $is_on;
}

function _op_launch_type(){
    static $type;
    if(!isset($type)){
        $evergreen = _op_launch_is_evergreen();
        $is_key_on = _op_launch_is_key_on();

        if(!$is_key_on && !$evergreen){
            $type = 1;
        } elseif(!$is_key_on && $evergreen){
            $type = 2;
        } elseif($is_key_on && !$evergreen){
            $type = 3;
        } elseif($is_key_on && $evergreen){
            $type = 4;
        }
    }
    return $type;
}

function _op_launch_cookie(){
    static $cookie;
    if(!isset($cookie) && _op_launch_define()){
        $cookie = array();
        if(isset($_COOKIE['lf_'.OP_LAUNCH_FUNNEL])){
            $arr = $_COOKIE['lf_'.OP_LAUNCH_FUNNEL];
            try {
                $arr = unserialize(base64_decode(stripslashes($arr)));
                $cookie = is_array($arr) ? $arr : $cookie;
            } catch(Exception $e){}
        }
    }
    return $cookie;
}

function _op_launch_menu_list(){
    static $menu_items;
    if(!isset($menu_items)){
        $cookie = _op_launch_cookie();
        $last_page = op_get_var($cookie,'last_page',-1);
        $visited_pages = op_get_var($cookie, 'visited_pages', array());
        $menu_items = array();
        if(op_page_option('launch_funnel','enabled') == 'Y' && $launch_info = _op_launch_define()){
            extract($launch_info);
            //if($last_page == 'sales'
            $hide_coming_soon = (op_launch_option('hide_coming_soon','enabled') == 'Y');
            $type = $launch_info['funnel_page'];
            $funnel_pages = op_launch_option('funnel_pages');
            $idx = $type == 'stage' ? $launch_info['stage_idx'] : 100;
            $highest = $idx;
            $stages = $funnel_pages['stages'];
            $sales = op_get_var($funnel_pages,'sales',array());
            $open_cart = (_op_traverse_array($sales,array('page_setup','open_sales_cart')) == 'Y');
            $hide_cart = (_op_traverse_array($sales,array('page_setup','hide_cart')) == 'Y');
            switch(_op_launch_type()){
                case 1:
                    foreach($stages as $key => $stage){
                        if($stage['publish_stage']['publish'] == 'Y'){
                            $menu_items[] = _op_launch_menu_item('value_page',$stage,true,($idx==$key));
                        } elseif(!$hide_coming_soon){
                            $menu_items[] = _op_launch_menu_item('value_page',$stage,false);
                        }
                    }
                    if(($type === 'sales' || $open_cart) && !$hide_cart) {
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,true,($type=='sales'));
                    } elseif(!$hide_coming_soon && !$hide_cart){
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,false);
                    }
                    break;
                case 2:
                    global $post;

                    if($last_page === 'sales'){
                        $highest = count($funnel_pages['stages']);
                    } elseif($last_page > $idx){
                        $highest = $last_page;
                    }

                    $found = false;
                    $visited = null;
                    foreach($funnel_pages['stages'] as $key => $stage){
                        if($stage['publish_stage']['publish'] == 'Y'){
                            if (in_array($stage['value_page'], $visited_pages) || $found == false || $stage['value_page'] == $post->ID) {
                                $menu_items[] = _op_launch_menu_item('value_page',$stage,true,($idx==$key));
                                $visited[] = $stage['value_page'];
                            } elseif(!$hide_coming_soon){
                                $menu_items[] = _op_launch_menu_item('value_page',$stage,false);
                            }

                            if ($stage['value_page'] == $post->ID) {
                                $found = true;
                            }
                        }
                    }

                    if(($last_page === 'sales' || $type === 'sales' || $open_cart) && !$hide_cart){
                        if (in_array($funnel_pages['sales']['sales_page'], $visited_pages) || $funnel_pages['sales']['sales_page'] == $post->ID) {
                            $menu_items[] = _op_launch_menu_item('sales_page',$sales,true,($type=='sales'));
                        } elseif (!$hide_coming_soon){
                            $menu_items[] = _op_launch_menu_item('sales_page',$sales,false);
                        }
                    } elseif(!$hide_coming_soon && !$hide_cart){
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,false);
                    }
                    if (is_array($visited) && 0 !== count($visited)) {
                            require_once OP_FUNC . 'launch.php';
                            $lf = new OptimizePress_LaunchFunnels($post->ID, $launch_info);
                            $lf->set_cookie($idx, $visited);
                    }

                    break;
                case 3:
                    foreach($stages as $key => $stage){
                        if($stage['publish_stage']['publish'] == 'Y'){
                            $menu_items[] = _op_launch_menu_item('value_page',$stage,true,($idx==$key));
                        } elseif(!$hide_coming_soon){
                            $menu_items[] = _op_launch_menu_item('value_page',$stage,false);
                        }
                    }
                    if(($last_page === 'sales' || $type === 'sales' || $open_cart) && !$hide_cart){
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,true,($type=='sales'));
                    } elseif(!$hide_coming_soon && !$hide_cart){
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,false);
                    }
                    break;
                case 4:
                    if($last_page === 'sales'){
                        $highest = count($funnel_pages['stages']);
                    } elseif($last_page > $idx){
                        $highest = $last_page;
                    }
                    foreach($funnel_pages['stages'] as $key => $stage){
                        if($stage['publish_stage']['publish'] == 'Y'){
                            if($highest >= $key){
                                $menu_items[] = _op_launch_menu_item('value_page',$stage,true,($idx==$key));
                            } elseif(!$hide_coming_soon){
                                $menu_items[] = _op_launch_menu_item('value_page',$stage,false);
                            }
                        } elseif(!$hide_coming_soon){
                            $menu_items[] = _op_launch_menu_item('value_page',$stage,false);
                        }
                    }
                    if(($last_page === 'sales' || $type === 'sales' || $open_cart) && !$hide_cart) {
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,true,($type=='sales'));
                    } elseif(!$hide_coming_soon && !$hide_cart){
                        $menu_items[] = _op_launch_menu_item('sales_page',$sales,false);
                    }
                    break;
            }
        }
    }
    return $menu_items;
}

function _op_launch_menu_item($page_type,$arr,$active=true,$selected=false){
    $pref = (!$active?'in':'');
    $objs = array('page_setup','navigation','page_thumbnails');
    foreach($objs as $o){
        $$o = _op_traverse_array($arr,array($o));
    }
    $page_id = op_get_var($page_setup,$page_type,0);
    $menu = array(
        'active' => $active,
        'text' => op_get_var($navigation,$pref.'active_link_text'),
        'image' => op_get_var($page_thumbnails,$pref.'active_thumbnail'),
        'selected' => $selected,
        'page_id' => $page_id
    );
    if($active){
        $menu['link'] = get_permalink($page_id);
    }
    return $menu;
}

function op_launch_nav(){
    $nav = op_page_option('launch_nav');
    if((op_get_var($nav,'enabled','N') == 'Y') && ($nav = op_get_var($nav,'nav')) && $nav != ''):
    ?>
        <div class="full-width launch-navbar">
            <div class="row cf">
                <div class="fixed-width">
                    <nav class="launchbar-navigation navigation">
                        <ul class="twentyfour columns">
                            <?php wp_nav_menu( array( 'menu' => $nav, 'items_wrap' => '%3$s', 'container' => false ) ) ?>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    <?php
    endif;
}

/**
 * Adds title tag to pages
 *
 * @since 2.5.7  Added OP_TYPE check because plugin version of OptimizePress renders double title tag
 */
function op_set_seo_title()
{
    if (OP_SEO_ENABLED != 'Y' && OP_TYPE !== 'plugin') {
        if (!defined('GENESIS_LIB_DIR') && !defined('CATALYST_LIB')) { // non GENESIS/CATALYST theme
            echo '<title>';
            echo wp_title(' ', false, 'right' );
            echo '</title>' . "\n";
        } else if (defined('GENESIS_LIB_DIR') && PARENT_THEME_BRANCH >= '2.1'){ // GENESIS fix for version 2.1.*
            echo '<title>';
            echo wp_title(' ', false, 'right' );
            echo '</title>' . "\n";
        } else { // GENESIS version < 2.1 and CATALYST
            echo wp_title(' ', false, 'right' );
        }
    }
}

remove_action('wp_head','adjacent_posts_rel_link_wp_head');
function op_page_header($color=''){
    if(defined('OP_LIVEEDITOR')){
        echo '
        <script>
            if (window.top && window.top.opjq.fancybox) {
                window.top.opjq.fancybox.hideLoading();
            }
        </script>';
        echo '<div id="op_loading" style="opacity:1;"></div><div id="op_overlay" style="opacity:1;"></div>';
    }
    $op_fonts = new OptimizePress_Fonts;
    $header_layout = op_page_option('header_layout');
    if(op_get_var($header_layout,'enabled','N') == 'N'){
        return;
    }
    if((($nav = op_get_var($header_layout,'nav_bar_above',array())) !== false) && op_get_var($nav,'enabled') == 'Y' && !empty($nav['nav'])):
        ?>
        <div class="nav-bar-above op-page-header cf">
            <div class="fixed-width">
                <div class="twentyfour columns">
                    <?php
                    if(isset($nav['logo']) && !empty($nav['logo'])){
                        echo '<h1 class="op-logo"><a href="#"><img src="'.$nav['logo'].'" alt="" /></a></h1>';
                    }
                    if(isset($nav['nav']) && !empty($nav['nav'])){
                        $nav_bar_above_font_styles = '';
                        if (!empty($nav['font_family']) || !empty($nav['font_size']) || !empty($nav['font_weight'])){
                            $nav_bar_above_font_styles = '
                                <style>
                                    .nav-bar-above.op-page-header nav.navigation ul li a{
                                        ';
                                        if (!empty($nav['font_family'])){
                                            $op_fonts->add_font($nav['font_family']);
                                            $nav_bar_above_font_styles .= 'font-family: "'.$nav['font_family'].'", sans-serif;';
                                        }
                                        if (!empty($nav['font_weight'])){
                                            if ($nav['font_weight']=='300') $nav_bar_above_font_styles .= 'font-weight: 300;';
                                            if (strtolower($nav['font_weight'])=='bold') $nav_bar_above_font_styles .= 'font-weight: bold;';
                                            if (strtolower($nav['font_weight'])=='italic') $nav_bar_above_font_styles .= 'font-style: italic;';
                                            if (strtolower($nav['font_weight'])=='bold/italic') $nav_bar_above_font_styles .= 'font-style: italic;';
                                        }
                                        if (!empty($nav['font_size'])) $nav_bar_above_font_styles .= 'font-size: '.$nav['font_size'].'px;';
                                        if (!empty($nav['font_shadow'])){
                                                $textShadow = '';
                                                switch(strtolower(str_replace(' ', '', $nav['font_shadow']))){
                                                        case 'textshadow':
                                                        case 'none':
                                                                $textShadow = 'none';
                                                                break;
                                                        case 'light':
                                                                $textShadow = '1px 1px 0px rgba(255,255,255,0.5)';
                                                                break;
                                                        case 'dark':
                                                        default:
                                                                $textShadow = '0 1px 1px #000000, 0 1px 1px rgba(0, 0, 0, 0.5)';
                                                }

                                                $nav_bar_above_font_styles .= 'text-shadow: '.$textShadow.';';
                                        }
                                        $nav_bar_above_font_styles .= '
                                    }
                                </style>
                            ';
                        }
                    echo $nav_bar_above_font_styles.'
                    <nav class="navigation">
                        <ul id="navigation-above">'.wp_nav_menu( array( 'menu' => $nav['nav'], 'walker' => new Op_Arrow_Walker_Nav_Menu(), 'items_wrap' => '%3$s', 'container' => false, 'echo'=>false ) ).'
                        </ul>
                    </nav>';
                    }
                    ?>
                </div>
            </div>
        </div>
    <?php
    endif;
    $disable_link = op_get_var($header_layout, 'disable_link');
    $header_link = op_get_var($header_layout, 'header_link');
    $alongside = (op_get_var($header_layout,'menu-position') == 'alongside');
    $logo = $banner_class = $style = $title = $title_str = $slogan = $logoH1Start = $logoH1End = '';
    $title = get_bloginfo( 'name' );
    $slogan = get_bloginfo( 'description' );
    $title_str = apply_filters('bloginfo',$title,'name');
    $alt = esc_attr( $title_str );
    $title_str = ' title="'.esc_attr($title_str).'"';
    if ($logoH1 = op_get_var($header_layout,'logoh1') == 'on'){
        $logoH1Start = '<h1>'; $logoH1End = '</h1>';
    }
    if($alongside && $logoimg = op_page_option('header_layout','logo')){
        if (empty($disable_link) && empty($header_link)) {
            $logo = '<div class="op-logo">'.$logoH1Start.'<a href="'.esc_url( home_url( '/' ) ).'"'.$title_str.' rel="home"><img src="'.$logoimg.'" alt="'.$alt.'" /></a>'.$logoH1End.'</div>';
        } else {
            if ($disable_link === 'on') {
                $logo = '<div class="op-logo">'.$logoH1Start.'<img src="'.$logoimg.'" alt="'.$alt.'" />'.$logoH1End.'</div>';
            } else {
                $logo = '<div class="op-logo">'.$logoH1Start.'<a href="'.esc_url( $header_link ).'"'.$title_str.' rel="home"><img src="'.$logoimg.'" alt="'.$alt.'" /></a>'.$logoH1End.'</div>';
            }
        }
    } elseif($bannerimg = op_page_option('header_layout','bgimg')){
        if (empty($disable_link) && empty($header_link)) {
            $logo = '<div class="banner-logo">'.$logoH1Start.'<a href="'.esc_url( home_url( '/' ) ).'"'.$title_str.' rel="home"><img src="'.$bannerimg.'" alt="'.$alt.'" /></a>'.$logoH1End.'</div>';
        } else {
            if ($disable_link === 'on') {
                $logo = '<div class="banner-logo">'.$logoH1Start.'<img src="'.$bannerimg.'" alt="'.$alt.'" />'.$logoH1End.'</div>';
            } else {
                $logo = '<div class="banner-logo">'.$logoH1Start.'<a href="'.esc_url( $header_link ).'"'.$title_str.' rel="home"><img src="'.$bannerimg.'" alt="'.$alt.'" /></a>'.$logoH1End.'</div>';
            }
        }
        $banner_class = ' centered-banner';
    } else {
        $banner_class = ' no-logo';
        if (empty($disable_link) && empty($header_link)) {
            $logo = '<div class="site-logo"><div class="site-title">'.$logoH1Start.'<a href="'.esc_url( home_url( '/' ) ).'"'.$title_str.' rel="home">'.$title.'</a>'.$logoH1End.'</div><div class="site-description">'.$slogan.'</div>';
        } else {
            if ($disable_link === 'on') {
                $logo = '<div class="site-logo"><div class="site-title">'.$logoH1Start.$title.$logoH1End.'</div><div class="site-description">'.$slogan.'</div></div>';
            } else {
                $logo = '<div class="site-logo"><div class="site-title">'.$logoH1Start.'<a href="'.esc_url( $header_link ).'"'.$title_str.' rel="home">'.$title.'</a>'.$logoH1End.'</div><div class="site-description">'.$slogan.'</div></div>';
            }
        }
    }
    if($bgimg = op_page_option('header_layout','repeatbgimg')){
        $style = ' style="background:url(\''.esc_url($bgimg).'\')"';
    } elseif($bgcolor = op_page_option('header_layout','bgcolor')){
        $style = ' style="background-color:'.$bgcolor.'"';
    }
    ?>
        <div class="banner<?php echo ($alongside? ' include-nav':'').$banner_class ?>"<?php echo $style ?>>
            <div class="fixed-width cf">
                <?php if($alongside): ?>
                <div class="eight columns">
                    <?php echo $logo ?>
                </div>
                <?php else:
                echo $logo;
                endif;
                if($alongside && (($nav = op_get_var($header_layout,'nav_bar_alongside',array())) !== false) && op_get_var($nav,'enabled') == 'Y' && !empty($nav['nav'])):?>
                <div class="sixteen columns"><?php
                    if(isset($nav['nav']) && !empty($nav['nav'])){
                        $nav_bar_alongside_font_styles = '
                                <style>
                                    .banner .navigation a{
                                        ';
                                        if (!empty($nav['font_family'])){
                                            $op_fonts->add_font($nav['font_family']);
                                            $nav_bar_alongside_font_styles .= 'font-family: "'.$nav['font_family'].'", sans-serif;';
                                        }
                                        if (!empty($nav['font_weight'])){
                                            if (strstr(strtolower($nav['font_weight']), '300')) $nav_bar_alongside_font_styles .= 'font-weight: 300;';
                                            if (strstr(strtolower($nav['font_weight']), 'bold')) $nav_bar_alongside_font_styles .= 'font-weight: bold;';
                                            if (strstr(strtolower($nav['font_weight']), 'italic')) $nav_bar_alongside_font_styles .= 'font-style: italic;';
                                        }
                                        if (!empty($nav['font_size'])) $nav_bar_alongside_font_styles .= 'font-size: '.$nav['font_size'].'px;';
                                        if (!empty($nav['font_shadow'])){
                                                $textShadow = '';
                                                switch(strtolower(str_replace(' ', '', $nav['font_shadow']))){
                                                        case 'textshadow':
                                                        case 'none':
                                                                $textShadow = 'none';
                                                                break;
                                                        case 'light':
                                                                $textShadow = '1px 1px 0px rgba(255,255,255,0.5)';
                                                                break;
                                                        case 'dark':
                                                        default:
                                                                $textShadow = '0 1px 1px #000000, 0 1px 1px rgba(0, 0, 0, 0.5)';
                                                }

                                                $nav_bar_alongside_font_styles .= 'text-shadow: '.$textShadow.';';
                                        }
                                        $nav_bar_alongside_font_styles .= '
                                    }
                                </style>
                            ';
                        }
                    if (isset($nav['nav']) && !empty($nav['nav']) && is_nav_menu($nav['nav'])) {
                        echo $nav_bar_alongside_font_styles . '
                        <nav class="navigation fly-to-left">
                            <ul id="navigation-alongside">' . wp_nav_menu(array('menu'       => $nav['nav'],
                                                                                'walker'     => new Op_Arrow_Walker_Nav_Menu(),
                                                                                'items_wrap' => '%3$s',
                                                                                'container'  => false,
                                                                                'echo'       => false
                                )) . '
                            </ul>
                        </nav>';
                    }
                    ?>
                </div>
                <?php endif ?>
            </div>
        </div>
        <?php if((($nav = op_get_var($header_layout,'nav_bar_below',array())) !== false) && op_get_var($nav,'enabled') == 'Y' && !empty($nav['nav'])):
        ?>
        <div class="nav-bar-below op-page-header<?php echo $color == '' ? '' :' op-page-header-'.$color ?> cf">
            <div class="fixed-width">
                <div class="twentyfour columns">
                    <?php
                    if(isset($nav['logo']) && !empty($nav['logo'])){
                        echo '<h1 class="op-logo"><a href="#"><img src="'.$nav['logo'].'" alt="" /></a></h1>';
                    }
                    if(isset($nav['nav']) && !empty($nav['nav'])){
                        $nav_bar_below_font_styles = '
                            <style>
                                .op-page-header .navigation #navigation-below a{
                                    ';
                                    if (!empty($nav['font_family'])){
                                        $op_fonts->add_font($nav['font_family']);
                                        $nav_bar_below_font_styles .= 'font-family: "'.$nav['font_family'].'", sans-serif;';
                                    }
                                    if (!empty($nav['font_weight'])){
                                        if (strstr(strtolower($nav['font_weight']), '300')) $nav_bar_below_font_styles .= 'font-weight: 300;';
                                        if (strstr(strtolower($nav['font_weight']), 'bold')) $nav_bar_below_font_styles .= 'font-weight: bold;';
                                        if (strstr(strtolower($nav['font_weight']), 'italic')) $nav_bar_below_font_styles .= 'font-style: italic;';
                                    }
                                    if (!empty($nav['font_size'])) $nav_bar_below_font_styles .= 'font-size: '.$nav['font_size'].'px;';
                                    if (!empty($nav['font_shadow'])){
                                        $textShadow = '';
                                        switch(strtolower(str_replace(' ', '', $nav['font_shadow']))){
                                                case 'textshadow':
                                                case 'none':
                                                        $textShadow = 'none';
                                                        break;
                                                case 'light':
                                                        $textShadow = '1px 1px 0px rgba(255,255,255,0.5)';
                                                        break;
                                                case 'dark':
                                                default:
                                                        $textShadow = '0 1px 1px #000000, 0 1px 1px rgba(0, 0, 0, 0.5)';
                                        }

                                        $nav_bar_below_font_styles .= 'text-shadow: '.$textShadow.';';
                                    }
                                    $nav_bar_below_font_styles .= '
                                }
                            </style>
                        ';
                        }
                    echo $nav_bar_below_font_styles.'
                    <nav class="navigation">
                        <ul id="navigation-below">'.wp_nav_menu( array( 'menu' => $nav['nav'], 'walker' => new Op_Arrow_Walker_Nav_Menu(), 'items_wrap' => '%3$s', 'container' => false, 'echo'=>false ) ).'
                        </ul>
                    </nav>';
                    ?>
                </div>
            </div>
        </div>
        <?php endif;
}

function op_page_feature_title(){
    global $post;
    $feature_title = op_page_option('feature_title');
    if(op_get_var($feature_title,'enabled','N') == 'Y'):
        $GLOBALS['op_feature_enabled'] = true;
        $title = op_get_var($feature_title,'title');
        if(empty($title)){
            $title = $post->post_title;
        }
        ?>
        <div class="full-width product-feature-tour">
            <div class="row cf">
                <div class="fixed-width">
                    <h2><?php echo $title ?></h2>
                </div>
            </div> <!-- row end -->
        </div>
        <?php
    endif;
}

function op_page_footer(){
    $op_fonts = new OptimizePress_Fonts;
    if((($footer = op_page_option('footer_area')) !== false) && op_get_var($footer,'enabled') == 'Y'): ?>
        <div class="full-width footer small-footer-text">
            <?php
            if(!(op_page_config('disable','layout','footer_area','large_footer') === true)){
                if(isset($footer['large_footer']) && isset($footer['large_footer']['enabled']) && $footer['large_footer']['enabled'] == 'Y'){
                    echo $GLOBALS['op_footer_layout'];
                }
            }
            ?>
            <div class="row">
                <div class="fixed-width">
                <?php
                    //Init the style variables
                    $font_family_style = '';
                    $font_weight_style = '';
                    $font_size_style = '';
                    $font_style = '';

                    //If not empty, set the font family style and add font to system
                    if (!empty($footer['font_family'])){
                        $op_fonts->add_font($footer['font_family']);
                        $font_family_style .= 'font-family: "'.$footer['font_family'].'", sans-serif;';
                    }

                    //If not empty, set the font style
                    if (!empty($footer['font_weight'])){
                        if (strstr(strtolower($footer['font_weight']), '300')) $font_weight_style .= 'font-weight: 300;';
                        if (strstr(strtolower($footer['font_weight']), 'bold')) $font_weight_style .= 'font-weight: bold;';
                        if (strstr(strtolower($footer['font_weight']), 'italic')) $font_weight_style .= 'font-style: italic;';
                    }

                    //If not empty, set the font size
                    if (!empty($footer['font_size'])) $font_size_style .= 'font-size: '.$footer['font_size'].'px;';

                    //If not empty, set the font shadow
                    if (!empty($footer['font_shadow'])){
                            $textShadow = '';
                            switch(strtolower(str_replace(' ', '', $footer['font_shadow']))){
                                    case 'textshadow':
                                    case 'none':
                                            $textShadow = 'none';
                                            break;
                                    case 'light':
                                            $textShadow = '1px 1px 0px rgba(255,255,255,0.5)';
                                            break;
                                    case 'dark':
                                    default:
                                            $textShadow = '0 1px 1px #000000, 0 1px 1px rgba(0, 0, 0, 0.5)';
                            }

                            $font_style .= 'text-shadow: '.$textShadow.';';
                    }

                    //Output the styles to the page
                    echo '
                        <style>
                            .footer-navigation ul li a,
                            .footer-navigation ul li a:hover{
                                '.$font_family_style.$font_size_style.$font_style.$font_weight_style.'
                            }

                            .footer,
                            .footer p,
                            .op-promote a,
                            .footer .footer-copyright,
                            .footer .footer-disclaimer{
                                '.$font_family_style.$font_style.$font_weight_style.'
                            }

                            .footer p{ '.$font_size_style.' }
                        </style>
                    ';

                    //Get the disclaimer text ready
                    $disclaimer = op_get_var($footer,'footer_disclaimer',array());
                    $site_footer = op_default_option('site_footer');
                    $disc = (!empty($disclaimer['message']) ? $disclaimer['message'] : $site_footer['disclaimer']);
                    //Print out the disclaimer if it's not empty
                    echo (!empty($disc) && $disclaimer['enabled']=='Y' ? '<small class="footer-disclaimer">'.stripslashes($disc).'</small>' : '');
                    //Echo out the nav if it's set
                    echo (!empty($footer['nav']) ? '
                        <nav class="footer-navigation">
                            <ul id="nav-footer" class="inline-nav">
                                '.wp_nav_menu(
                                    array('menu' => $footer['nav'],
                                          'items_wrap' => '%3$s',
                                          'container' => false,
                                          'depth' => 1,
                                          'echo' => false
                                    )
                                ).'
                            </ul>
                        </nav>
                    ' : '');

                    //Print out the copyright notice
                    //$copy = op_default_option('copyright_notice');
                    echo (!empty($site_footer['copyright']) ? '<p class="footer-copyright">'.$site_footer['copyright'].'</p>' : '');

                    //Display any additional information
                    op_mod('promotion')->display();
                ?>
                </div>
            </div>
        </div>
        <?php
    endif;
}

function op_page_advanced_color_scheme($css){
    if(op_page_config('disable','color_schemes') === true){
        return $css;
    }
    $advanced = op_page_option('color_scheme_advanced');
    $advanced = is_array($advanced) ? $advanced : array();
    $type = op_page_option('theme','type');

    $options = array(
        'page' => array(
            array('background-image','body','repeating_bg'),
            array('background-color','body','bg_color'),
            array('color', 'a, a:visited, a:link', "['link_color']['color']"),
            array('text-decoration', 'a,a:visited', "['link_color']['text_decoration']"),
            array('color', 'a:hover,a:hover', "['link_hover_color']['color']"),
            array('text-decoration', 'a:hover', "['link_hover_color']['text_decoration']"),
        ),
        'feature_area' => array(
            array('gradient','.featured-panel','feature_start','feature_end'),
            array('background-image','.featured-panel','bg'),
            array('background-size','.featured-panel','bg_options'),
            array('background-repeat','.featured-panel','bg_options'),
            array('background-position','.featured-panel','bg_options')
        ),
        'footer' => array(
            array('gradient','.footer','footer_start','footer_end'),
            array('color','.footer-navigation ul li a',"['footer_link_color']['color']"),
            array('text-decoration','.footer-navigation ul li a',"['footer_link_color']['text_decoration']"),
            array('color','.footer-navigation ul li a:hover',"['footer_link_hover_color']['color']"),
            array('text-decoration','.footer-navigation ul li a:hover',"['footer_link_hover_color']['text_decoration']"),
            array('color','.footer p','footer_text_color'),
            array('color','.footer h1','footer_text_color'),
            array('color','.footer h2','footer_text_color'),
            array('color','.footer h3','footer_text_color'),
            array('color','.footer h4','footer_text_color'),
            array('color','.footer h5','footer_text_color'),
            array('color','.footer h6','footer_text_color'),
            array('color','.footer a',"['footer_link_color']['color']"),
            array('text-decoration','.footer a',"['footer_link_color']['text_decoration']"),
            array('color','.footer a:hover',"['footer_link_hover_color']['color']"),
            array('text-decoration','.footer a:hover',"['footer_link_hover_color']['text_decoration']"),
            array('color','.footer small.footer-copyright','footer_text_color'),
            array('color','.footer small.footer-copyright a',"['footer_link_color']['color']"),
            array('text-decoration','.footer small.footer-copyright a',"['footer_link_color']['text_decoration']"),
            array('color','.footer small.footer-copyright a:hover',"['footer_link_hover_color']['color']"),
            array('text-decoration','.footer small.footer-copyright a:hover',"['footer_link_hover_color']['text_decoration']"),
            array('color','.footer small.footer-disclaimer','footer_text_color'),
            array('color','.footer small.footer-disclaimer a',"['footer_link_color']['color']"),
            array('text-decoration','.footer small.footer-disclaimer a',"['footer_link_color']['text_decoration']"),
            array('text-decoration','.footer small.footer-disclaimer a:hover',"['footer_link_hover_color']['text_decoration']"),
            array('color','.footer small.footer-disclaimer a:hover',"['footer_link_hover_color']['color']")
        ),
        'nav_bar_alongside' => array(
            array('background-color','#navigation-alongside li:hover > a','nav_bar_bg_nav_hover'),
            array('background-color','#navigation-alongside li ul.sub-menu, #navigation-alongside li ul.sub-menu li','nav_bar_bg'),
            array('background-color','#navigation-alongside li ul.sub-menu li:hover > a','nav_bar_bg_hover'),
            array('color','body .container .include-nav .navigation ul li:hover > a,body .container .include-nav .navigation ul a:focus','nav_bar_hover'),
            array('color','div.include-nav .navigation ul li a','nav_bar_link'),
            array('color','body .container .include-nav .navigation ul li ul li:hover > a,body .container .include-nav .navigation ul li ul li a:focus','nav_bar_dd_hover'),
            array('color','div.include-nav .navigation ul li ul li a','nav_bar_dd_link')
        ),
        'nav_bar_above' => array(
            array('gradient','.nav-bar-above','nav_bar_start','nav_bar_end','is_gradient'=>false),
            array('gradient','.nav-bar-above ul li:hover, .nav-bar-above ul li:hover > a','nav_bar_hover_start','nav_bar_hover_end','is_gradient'=>false),
            array('background-color','body .container .nav-bar-above .navigation ul ul li','nav_bar_bg','default'=>'nav_bar_end'),
            //array('gradient','body .container .nav-bar-above .navigation ul ul li:hover > a,body .container .navigation ul a:focus','nav_bar_bg_hover_start','nav_bar_bg_hover_end'),
            array('background-color','body .container .nav-bar-above .navigation ul ul li:hover > a,body .container .navigation ul a:focus','nav_bar_bg_hover_start'),
            array('color','.nav-bar-above a, .nav-bar-above .navigation a','nav_bar_link'),
            array('color','body .container .nav-bar-above .navigation ul li:hover > a, body .container .nav-bar-above .navigation ul a:focus','nav_bar_hover'),
            array('color','body .container .nav-bar-above .navigation ul li ul li > a, body .container .nav-bar-above .navigation ul li ul a','nav_bar_dd_link'),
            array('color','body .container .nav-bar-above .navigation ul li ul li:hover > a,body .container .nav-bar-above .navigation ul li ul a:focus','nav_bar_dd_hover')
        ),
        'nav_bar_below' => array(
            array('gradient','.nav-bar-below.op-page-header','nav_bar_start','nav_bar_end','is_gradient'=>false),
            array('gradient','.nav-bar-below ul li:hover, .nav-bar-below ul li:hover > a','nav_bar_hover_start','nav_bar_hover_end','is_gradient'=>false),
            array('background-color','body .container .nav-bar-below .navigation ul ul li','nav_bar_bg','default'=>'nav_bar_end'),
            //array('gradient','body .container .nav-bar-below .navigation ul ul li:hover > a,body .container .nav-bar-below .navigation ul a:focus','nav_bar_bg_hover_start','nav_bar_bg_hover_end'),
            array('background-color','body .container .nav-bar-below .navigation ul ul li:hover > a,body .container .nav-bar-below .navigation ul a:focus','nav_bar_bg_hover_start'),
            array('color','.nav-bar-below a, .nav-bar-below .navigation a','nav_bar_link'),
            array('color','body .container .nav-bar-below .navigation ul li:hover > a,body .container .nav-bar-below .navigation ul a:focus','nav_bar_hover'),
            array('color','body .container .nav-bar-below .navigation ul li ul li > a,body .container .nav-bar-below .navigation ul li ul a:focus','nav_bar_dd_link'),
            array('color','body .container .nav-bar-below .navigation ul li ul li:hover > a,body .container .nav-bar-below .navigation ul li ul a:focus','nav_bar_dd_hover')
        ),
    );
    if($type != 'launch' && $type != 'landing'){
        $options['feature_title'] = array(
            array('gradient','.product-feature-tour','feature_title_start','feature_title_end'),
            array('color','.product-feature-tour h2','feature_title_text_color')
        );
    }
    $options = apply_filters('op_page_color_options_selectors',$options);
    $selectors = array();
    foreach($options as $section => $elements){
        $vals = op_get_var($advanced,$section,array());
        $selectors = op_page_css_element($selectors,$elements,$vals);
    }

    foreach($selectors as $selector => $output){

        // We want to add additional class to the body tag if user is setting custom background in
        // Colour Scheme Settings -> Page Colour Settings -> Overall Page Colour Options -> Upload a Repeating Background Image
        if ($selector == 'body' && isset($output[0]) && strrpos($output[0], 'background-image:url') !== false) {
            $selector .= ', body.op-custom-background';
            add_filter( 'body_class', 'op_custom_background_body_class' );
        }

        $css .= $selector.'{'.implode('',$output).'}';
    }
    return $css;
}
add_filter('op_output_css','op_page_advanced_color_scheme',10);

function op_custom_background_body_class( $classes ) {
    $classes[] = 'op-custom-background';
    return $classes;
}

function op_page_css_element($selectors,$elements,$vals){
    foreach($elements as $el){
        $tmp = '';
        if (stripos($el[2], '[') !== false) {
            $temp = explode('][', $el[2]);
            $key1 = str_replace("'", "" ,substr($temp[0], 1));
            $key2 = str_replace("'", "" ,substr($temp[1], 0, strlen($temp[1]) -1));
            if (isset($vals[$key1]) && is_array($vals[$key1]) && isset($vals[$key1][$key2])) {
                $val = $vals[$key1][$key2];
            } else {
                $val = '';
            }
        } else {
            $val = op_get_var($vals,$el[2]);
        }
        //opLog($val);
        if($val == '' && isset($el['default'])){
            $val = op_get_var($vals,$el['default']);
        }
        if($val != ''){
            $str = '';
            if($el[0] == 'gradient'){
                $color_1 = $val;
                $gradient = true;
                $val2 = op_get_var($vals,$el[3]);
                if($val2 == ''){
                    $gradient = false;
                } else {
                    $color_2 = $val2;
                }

                //Commented out following line to fix gradient issue in IE
                //if($val == $val2) $gradient = false;

                if($gradient){
                    $str = '
background: '.$color_2.';background: -moz-linear-gradient(top, '.$color_1.' 0%, '.$color_2.' 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,'.$val.'), color-stop(100%,'.$color_2.'));background: -webkit-linear-gradient(top, '.$color_1.' 0%,'.$color_2.' 100%);background: -o-linear-gradient(top, '.$color_1.' 0%,'.$color_2.' 100%);background: -ms-linear-gradient(top, '.$color_1.' 0%,'.$color_2.' 100%);background: linear-gradient(top, '.$color_1.' 0%,'.$color_2.' 100%));filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''.$color_1.'\', endColorstr=\''.$color_2.'\',GradientType=0 );';
                } else {
                    if(op_get_var($el,'is_gradient',true) !== true){
                        $str = 'background: '.$color_1.';';
                    } else {
                        $str = '
background: '.$color_1.';background: -moz-linear-gradient(none);background: -webkit-gradient(none);background: -webkit-linear-gradient(none);background: -o-linear-gradient(none);background: -ms-linear-gradient(none);background: linear-gradient(none);';
                    }
                }
            } elseif($el[0] == 'background-image'){
                $str = 'background-image:url(\''.$val.'\');';
            } elseif($el[0]=='background-repeat'){
                if ($val=='tile_horizontal' || $val=='repeat-x'){
                    $str = 'background-position: top; background-repeat: repeat-x; filter: none;';
                } elseif($val=='tile' || $val=='repeat'){
                    $str = 'background-position: top; background-repeat: repeat; filter: none;';
                } else {
                    $str = 'background-position: top; background-repeat: no-repeat; filter: none;';
                }
            } elseif($el[0]=='background-position'){
                if ($val=='center') $str = 'background-position: center; filter: none;';
            } elseif($el[0]=='background-size'){
                if ($val=='cover') $str = 'background-size: cover; filter: none;';
            } elseif($el[0] == 'text' || $el[0] == 'background-color'){
                if(is_array($val)){
                    foreach($val as $prop => $value){
                        if($prop == 'text_decoration'){
                            $prop = 'text-decoration';
                            if($value == ''){
                                $value = 'none';
                            }
                            $str .= $prop.':'.$value.';';
                        } elseif($value != ''){
                            $str .= $prop.':'.$value.';';
                        }
                    }
                } else {
                    $str = $el[0].':'.$val.' !important;';
                }
            } else {
                $str = $el[0].':'.$val.';';
            }
            if($str != ''){
                if(!isset($selectors[$el[1]])){
                    $selectors[$el[1]] = array();
                }
                $selectors[$el[1]][] = $str;
            }
        }
    }
    return $selectors;
}
function op_page_typography_elements_selectors($elements){
    unset($elements['color_elements']['.latest-post .continue-reading a, .post-content .continue-reading a, .older-post .continue-reading a,.main-content-area .single-post-content a,.featured-panel a,.sub-footer a'],$elements['color_elements']['.latest-post .continue-reading a:hover, .post-content .continue-reading a:hover, .older-post .continue-reading a:hover,.main-content-area .single-post-content a:hover,.featured-panel a:hover,.sub-footer a:hover']);
    $new_elements = array(
        'a, a:visited, a:link' => 'link_color',
        'a:hover' => 'link_hover_color',
        '.footer a' => 'footer_link_color',
        '.footer a:hover' => 'footer_link_hover_color',
        '.featured-panel p,.featured-panel h1,.featured-panel h2,.featured-panel h3,.featured-panel h4' => 'feature_text_color',
        '.featured-panel a' => 'feature_link_color',
        '.featured-panel a:hover' => 'feature_link_hover_color'
    );
    $elements['color_elements'] = array_merge($elements['color_elements'],$new_elements);
    return $elements;
}

add_filter('op_typography_output_elements','op_page_typography_elements_selectors');

function op_page_typography_elements($elements){
    $new_elements = array(
        'footer_link_color' => array(
            'name' => __('Footer Link Text Colour', 'optimizepress'),
            'help' => __('Choose the hyperlink text colour for your page footer area', 'optimizepress'),
            'text_decoration' => true,
        ),
        'footer_link_hover_color' => array(
            'name' => __('Footer Link Hover Text Colour', 'optimizepress'),
            'help' => __('Choose the hyperlink hover text colour for your page footer area', 'optimizepress'),
            'text_decoration' => true,
        ),
        'feature_text_color' => array(
            'name' => __('Feature Area Text Colour', 'optimizepress'),
            'help' => __('Choose the text colour for the feature area content', 'optimizepress'),
        ),
        'feature_link_color' => array(
            'name' => __('Feature Area Link Colour', 'optimizepress'),
            'help' => __('Choose the hyperlink colour for the feature area content', 'optimizepress'),
            'text_decoration' => true,
        ),
        'feature_link_hover_color' => array(
            'name' => __('Feature Area Link Hover Colour', 'optimizepress'),
            'help' => __('Choose the hyperlink hover colour for the feature area content', 'optimizepress'),
            'text_decoration' => true,
        )
    );
    $elements['color_elements'] = array_merge($elements['color_elements'],$new_elements);
    return $elements;
}
add_filter('op_typography_elements','op_page_typography_elements');

/*
 * Function: op_hex_encode_string
 * Description: Encodes a string into a hex format so it can be
 *      transferred through networks without failing. Basic hex escaping.
 * Parameters:
 *  $string (string): String to be escaped
 *
 */
function op_hex_encode_string($string) {
    $hexString = '';
    for ($i=0; $i < strlen($string); $i++) {
        $hexString .= '%' . bin2hex($string[$i]);
    }
    return $hexString;
}

/*
 * Function: op_hex_decode_string
 * Description: Decodes a string from a hex format so it can be
 *      transferred through networks without failing.
 *      Will basically allow unescaping of javascript escaped strings
 * Parameters:
 *  $string (string): String to be unescaped
 *
 */
function op_hex_decode_string($hexString) {
    return pack("H*" , str_replace('%', '', $hexString));
}

/**
 * Helper that generates CSS style for background gradient (if the colors are set and different)
 * @param  string $startColor
 * @param  string $endColor
 * @param  string $separator
 * @return string
 */
function op_generate_css_background($startColor, $endColor, $separator = '')
{
    if ($startColor !== $endColor && !empty($endColor)) {
        return
            'background-color:' . $startColor . ';' . $separator .
            'background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' . $startColor . '), color-stop(100%, ' . $endColor .'));' . $separator .
            'background:-webkit-linear-gradient(top, ' . $startColor . ' 0%, ' . $endColor . ' 100%);' . $separator .
            'background:-moz-linear-gradient(top, ' . $startColor . ' 0%, ' . $endColor. ' 100%);' . $separator .
            'background:-ms-linear-gradient(top, ' . $startColor . ' 0%, ' . $endColor . ' 100%);' . $separator .
            'background:-o-linear-gradient(top, ' . $startColor . ' 0%, ' . $endColor . ' 100%);' . $separator .
            'background:linear-gradient(to bottom, ' . $startColor . ' 0%, ' . $endColor . ' 100%);' . $separator .
            'filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=' . $startColor . ', endColorstr=' . $endColor . ', GradientType=0);' . $separator;
    } else {
        return 'background:' . $startColor . ';' . $separator;
    }
}