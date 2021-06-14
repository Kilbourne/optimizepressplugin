<?php
class OptimizePress_Sections_Layout {

    function __construct(){
        add_filter('op_mod_feature_area_styles',array($this,'feature_styles'));
    }

    // Get the list of step 3 sections these can be overridden by the theme using the 'op_edit_sections_layout' filter
    function sections(){
        static $sections;

        if(!isset($sections)){
            $keys = array('header_layout','feature_area','feature_title','footer_area');
            $vals = array(__('Header &amp; Navigation', 'optimizepress'),__('Feature Area', 'optimizepress'),__('Feature Title', 'optimizepress'),__('Footer Area', 'optimizepress'));
            $type = op_page_option('theme','type');
            if($type == 'launch'){
                array_splice($keys,1,2,array('feature_area','launch_nav'));
                array_splice($vals,1,2,array(__('Feature Area', 'optimizepress'),__('Launch Funnel Menu', 'optimizepress')));
            } elseif($type == 'landing'){
                unset($keys[1],$keys[2],$vals[1],$vals[2]);
                array_splice($keys,0,1,array('header_layout', 'landing_bg', 'size_color'));
                array_splice($vals,0,1,array(__('Header &amp; Navigation', 'optimizepress'), __('Landing Page Background', 'optimizepress'), __('Size &amp; Colour', 'optimizepress')));
            }
            $section_names = array_combine($keys,$vals);
            $sections = array();
            foreach($section_names as $name => $title){
                if(!(op_page_config('disable','layout',$name) === true)){
                    $sections[$name] = array('title' => $title);
                    $func = array($this,$name);
                    if(is_callable($func)){
                        $sections[$name]['action'] = $func;
                    }
                    $func = array($this,'save_'.$name);
                    if(is_callable($func)){
                        $sections[$name]['save_action'] = $func;
                    }
                    if($name == 'landing_bg' || $name === 'size_color'){
                        $sections[$name]['on_off'] = false;
                    }
                }
            }
            $sections = apply_filters('op_edit_sections_page_layout',$sections);
        }
        return $sections;
    }

    function header_layout(){
        echo op_load_section('layout/header','page');
    }

    function save_header_layout($op){
        $blog_header = op_page_option('header_layout');
        $blog_header = $blog_header === false ? array() : $blog_header;
        $fields = array('logo','bgimg','repeatbgimg','bgcolor','link_color', 'disable_link', 'header_link', 'logoh1');
        $has_error = false;
        foreach($fields as $field){
            $blog_header[$field] = op_get_var($op,$field,op_default_page_option('header',$field));
        }

        /*
        $default = op_default_page_option('header', 'bgcolor');
        $blog_header['bgcolor'] = op_get_var($op,'bgcolor',($default?$default:''));

        $default = op_default_page_option('header', 'link_color');
        $blog_header['link_color'] = op_get_var($op,'link_color',($default?$default:''));*/
        if(isset($op['menu_position'])){
            $blog_header['menu-position'] = $op['menu_position'];
        }
        $blog_header['enabled'] = op_get_var($op,'enabled','N');

        $navs = array('nav_bar_above','nav_bar_below','nav_bar_alongside');
        foreach($navs as $nav){
            $tmp = op_get_var($op,$nav,array());
            $nava = op_get_var($blog_header,$nav,array());
            $nava['enabled'] = op_get_var($tmp,'enabled','N');
            $nava['nav'] = op_get_var($tmp,'nav');
            $nava['font_shadow'] = op_get_var($tmp, 'font_shadow');
            $nava['font_weight'] = op_get_var($tmp, 'font_weight');
            $nava['font_size'] = op_get_var($tmp, 'font_size');
            $nava['font_family'] = op_get_var($tmp, 'font_family');
            if($nav != 'nav_bar_alongside'){
                $nava['logo'] = op_get_var($tmp,'logo');
            }
            $blog_header[$nav] = $nava;
        }
        op_update_page_option('header_layout',$blog_header);
    }

    function feature_area(){
        $theme_type = op_page_option('theme','type');
        $defaults = array();
        $total = 0;
        switch($theme_type){
            case 'landing':
                $total = 7;
                break;
            case 'membership':
                $total = 2;
                break;
        }
        $total++;
        $current = op_page_option('feature_area','type');
        $current = $current === false ? 1 : $current;
        for($i=1;$i<$total;$i++){
            $defaults[$i] = array(
                'image' => OP_IMG.'previews/feature_areas/'.$theme_type.'/feature_'.$i.'.jpg',
                'width' => 265,
                'height' => 115,
                'input' => '<input type="radio" name="op[feature_area][type]" id="op_layout_feature_area_type_'.$i.'" value="'.$i.'"'.($i==$current? ' checked="checked"':'').' />',
                'li_class' => ($i == $current ? ' img-radio-selected' : ''),
            );
        }
        $previews = apply_filters('op_page_feature_area_'.$theme_type.'_selection',$defaults,$current);
        echo op_load_section('layout/feature_area',array('previews'=>$previews),'page');
    }

    function save_feature_area($op){
        $feature = op_page_option('feature_area');
        $feature = is_array($feature) ? $feature : array();
        $feature['enabled'] = op_get_var($op,'enabled','N');
        $feature['type'] = op_get_var($op,'type',1);
        op_update_page_option('feature_area',$feature);
    }

    function feature_title(){
        echo op_load_section('layout/feature_title','page');
    }

    function save_feature_title($op){
        $feature_title = array(
            'enabled' => op_get_var($op,'enabled','N'),
            'title' => op_get_var($op,'title')
        );
        op_update_page_option('feature_title',$feature_title);
    }

    function footer_area(){
        echo op_load_section('layout/footer_area','page');
    }

    function save_footer_area($op){
        $footer_area = op_page_option('footer_area');
        $footer_area = is_array($footer_area) ? $footer_area : array();
        $footer_area['enabled'] = op_get_var($op,'enabled','N');
        $footer_area['nav'] = op_get_var($op,'nav');
        $footer_area['font_shadow'] = op_get_var($op, 'font_shadow');
        $footer_area['font_weight'] = op_get_var($op, 'font_weight');
        $footer_area['font_size'] = op_get_var($op, 'font_size');
        $footer_area['font_family'] = op_get_var($op, 'font_family');

        if(!(op_page_config('disable','layout','footer_area','large_footer') === true)){
            $lf = op_get_var($op,'large_footer',array());
            $footer_area['large_footer'] = array('enabled' => op_get_var($lf,'enabled','N'));
        }

        $fd = op_get_var($op,'footer_disclaimer',array());
        $footer_area['footer_disclaimer'] = array('enabled' => op_get_var($fd,'enabled','N'), 'message' => op_get_var($fd,'message'));
        op_update_page_option('footer_area',$footer_area);
    }

    function launch_nav(){
        echo op_load_section('layout/launch_nav','page');
    }

    function save_launch_nav($op){
        $launch_nav = array(
            'enabled' => op_get_var($op,'enabled','N'),
            'nav' => op_get_var($op,'nav')
        );
        op_update_page_option('launch_nav',$launch_nav);
    }

    function landing_bg(){
        echo op_load_section('layout/landing_bg','page');
    }

    function save_landing_bg($op){
        $landing = op_page_option('landing_bg');
        $landing = $landing === false ? array() : $landing;
        $landing['image'] = op_get_var($op,'image',op_default_page_option('landing_bg','image'));
        op_update_page_option('landing_bg',$landing);
    }

    function size_color()
    {
        echo op_load_section('layout/size_color','page');
    }

    function save_size_color($op)
    {
        $theme_option = op_page_option('feature_area','type');
        $size_color = op_page_option('size_color');
        $size_color = $size_color === false ? array() : $size_color;

        $size_color['box_color_start'] = op_get_var($op, 'box_color_start', op_default_page_option($theme_option, 'size_color','box_color_start'));
        $size_color['box_color_end'] = op_get_var($op, 'box_color_end', op_default_page_option($theme_option, 'size_color','box_color_end'));
        $size_color['box_width'] = op_get_var($op, 'box_width', op_default_page_option($theme_option, 'size_color','box_width'));

        op_update_page_option('size_color',$size_color);
    }
}