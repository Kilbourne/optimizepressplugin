<?php
class OptimizePress_Fonts
{

    var $_used_fonts = array();

    function __construct()
    {
        if (!is_admin()) {
            /*
             * We can load fonts via CSS for LE pages, but for elements added in normal pages we can't attach to wp_head as it is to early in code execution
             * and we aren't aware of all the fonts needed (element shortcodes are fired after wp_head)
             */
            add_action(apply_filters('op_googleFontRenderingLocation','wp_head'), array($this, 'print_css'), 20);

            /*
             * If we load fonts without JS (even later on in the <body />) it appears without flickering (changing font after it loads)
             */
            add_action(OP_SN . '-print-footer-scripts-front', array($this, 'print_css'), 10);
        } else if (defined('OP_LIVEEDITOR')) {
            /*
             * We also need to output the fonts in the Live Editor as well
             */
            add_action('admin_footer',array($this,'print_css'));
        }
    }

    function add_font($font){
        if (empty($font)) {
            return;
        } else if(is_array($font)){
            foreach($font as $f){
                $this->add_font($f);
            }
        } else {
            if(!isset($this->_used_fonts[$font]) && (($varient = $this->google_fonts($font)) !== false)){
                $this->_used_fonts[$font] = $varient['properties'];
            }
        }
    }

    function print_css(){
        if(count($this->_used_fonts) > 0){
            $font_str = '';
            foreach($this->_used_fonts as $name => $varient){
                $font_str .= $name.$varient.'|';
            }
            $font_str = rtrim($font_str,'|');
            $url = 'http'.(is_ssl()?'s':'').'://fonts.googleapis.com/css?family='.$font_str;
            echo '
<link href="'.$url.'" rel="stylesheet" type="text/css" />';
            $this->_used_fonts = array();
        }
    }

    function fonts_array(){
        $fonts_array = array();
        foreach($this->_used_fonts as $name => $varient){
            $fonts_array[] = $name.$varient;
        }
        return $fonts_array;
    }

    function print_js($return=false){
        $out = '';
        if(defined('OP_LIVEEDITOR')){
            return $out;
        }
        if(count($this->_used_fonts) > 0){
            $fonts_array = array();
            foreach($this->_used_fonts as $name => $varient){
                $fonts_array[] = $name.$varient;
            }
            $out = '
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
        if($return){
            return $out;
        }
        echo $out;
    }

    function google_fonts($font=''){
        static $fonts;
        if(!isset($fonts)){
            $fonts = array(
                'Adamina' => array(
                    'properties' => ':r',
                    'fallback' => 'serif'
                ),
                'Alice' => array(
                    'properties' => ':r',
                    'fallback' => 'serif'
                ),
                'Arvo' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'serif'
                ),
                'Asap' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Bitter' => array(
                    'properties' => ':r,b,i',
                    'fallback' => 'sans-serif',
                ),
                'Cabin' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Calligraffitti' => array(
                    'properties' => ':r',
                    'fallback' => 'sans-serif',
                ),
                'Crimson Text' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Dancing Script' => array(
                    'properties' => ':r,b',
                    'fallback' => 'sans-serif',
                ),
                'Droid Sans' => array(
                    'properties' => ':r,b',
                    'fallback' => 'sans-serif',
                ),
                'Droid Serif' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'serif',
                ),
                'Josefin Slab' => array(
                    'properties' => ':300,r,b,i,bi',
                    'fallback' => 'serif',
                ),
                'Just Another Hand' => array(
                    'properties' => ':r',
                    'fallback' => 'serif',
                ),
                'Lato' => array(
                    'properties' => ':300,r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Lobster Two' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'serif',
                ),
                'Montserrat' => array(
                    'properties' => ':r',
                    'fallback' => 'sans-serif',
                ),
                'Nixie One' => array(
                    'properties' => ':r',
                    'fallback' => 'sans-serif',
                ),
                'Open Sans' => array(
                    'properties' => ':300,r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Oswald' => array(
                    'properties' => ':300,r',
                    'fallback' => 'sans-serif',
                ),
                'Pacifico' => array(
                    'properties' => ':r',
                    'fallback' => 'sans-serif',
                ),
                'PT Sans Narrow' => array(
                    'properties' => ':r,b',
                    'fallback' => 'sans-serif',
                ),
                'PT Sans' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Raleway' => array(
                    'properties' => ':300,r,b',
                    'fallback' => 'sans-serif',
                ),
                'Shadows Into Light' => array(
                    'properties' => ':r',
                    'fallback' => 'sans-serif',
                ),
                'Source Sans Pro' => array(
                    'properties' => ':300,r,i,b,bi',
                    'fallback' => 'sans-serif',
                ),
                'The Girl Next Door' => array(
                    'properties' => ':r',
                    'fallback' => 'sans-serif',
                ),
                'Titillium Web' => array(
                    'properties' => ':300,r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Ubuntu' => array(
                    'properties' => ':300,r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Vollkorn' => array(
                    'properties' => ':r,b,i,bi',
                    'fallback' => 'sans-serif',
                ),
                'Yanone Kaffeesatz' => array(
                    'properties' => ':300,r,b,i,bi',
                    'fallback' => 'sans-serif',
                )
            );
            $fonts = apply_filters('op_google_fonts_list',$fonts);
            ksort($fonts);
        }
        if($font != ''){
            if(isset($fonts[$font])){
                return $fonts[$font];
            }
            return false;
        }
        return $fonts;
    }

    function default_fonts($font=''){
        static $fonts;
        if(!isset($fonts)){
            $fonts = array(
                'Arial' => 'Arial, sans-serif',
                'Arial Black' => '"Arial Black", sans-serif',
                'Courier' => 'Courier, "Courier New", monospace',
                'Geneva' => 'Geneva, Tahoma, Verdana, sans-serif',
                'Georgia' => 'Georgia, serif',
                'Gill Sans' => '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
                'Helvetica' => '"Helvetica Neue", Helvetica, sans-serif',
                'Impact' => 'Impact, Charcoal, sans-serif',
                'Lucida' => '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", sans-serif',
                'Myriad Pro' => '"Myriad Pro", Myriad, sans-serif',
                'Palatino' => 'Palatino, "Palatino Linotype", serif',
                'Tahoma' => 'Tahoma, Geneva, Verdana, sans-serif',
                'Times New Roman' => '"Times New Roman", serif',
                'Trebuchet MS' => '"Trebuchet MS", Tahoma, sans-serif',
                'Verdana' => 'Verdana, Geneva, sans-serif',
            );
            $fonts = apply_filters('op_default_fonts_list',$fonts);
            ksort($fonts);
        }
        if($font != ''){
            if(isset($fonts[$font])){
                return $fonts[$font];
            }
            return false;
        }
        return $fonts;
    }

    function all_fonts_array(){
        static $fonts;
        if(!isset($fonts)){
            $fonts = array(
                'default' => array(
                    'title' => 'Default fonts',
                    'fonts' => $this->default_fonts(),
                ),
                'google' => array(
                    'title' => 'Google fonts',
                    'fonts' => $this->google_fonts(),
                ),
            );
            $fonts = apply_filters('op_all_fonts_list',$fonts);
        }
        return $fonts;
    }

    function font_dropdown($name,$value='',$id='',$extra=''){
        $font_types = $this->all_fonts_array();
        $str = '<option value="">'.OP_STRING_FONT_THEME_DEFAULT.'</option>';
        foreach($font_types as $type => $options){
            $str .= '<optgroup label="'.$options['title'].'">';
            $keys = array_keys($options['fonts']);
            foreach($keys as $key){
                $str .= '<option value="'.esc_attr($key).'"'.($key==$value ? ' selected="selected"':'').'>'.$key.'</option>';
            }
            $str .= '</optgroup>';
        }
        $extra .= ' class="font-selector"';
        return $this->_dropdown_str($str,$name,$id,$extra);
    }

    function font_visual_dropdown($id='', $value = null){
        $font_types = $this->all_fonts_array();
        $str = '<ul class="cf"><li><a href="#">'.__(OP_STRING_FONT_THEME_DEFAULT, 'optimizepress').'</a></li></ul>';
        $path = OP_IMG.'fonts/';
        $selected = __('Default', 'optimizepress');
        foreach($font_types as $type => $options){
            $str .= '<p>'.$options['title'].'</p><ul class="cf">';
            $keys = array_keys($options['fonts']);
            foreach($keys as $key){
                $font = esc_attr($key);
                $img = strtolower(preg_replace('/\s+/','-',$font)).'.jpg';
                $font_name = strtolower(preg_replace('/\s+/','-',$font));
                $font_family = '';
                if ($type === 'default') {
                    $font_family = esc_attr($options['fonts'][$key]);
                }
                // TODO: font previews
                // $imgStr = '<img src="'.$path.$img.'" alt="'.$font.'" data-family="' . $font_family . '" data-type="' . $type . '" />';
                $imgStr = '<span class="op-font op-font-' . $font_name . '" data-font="' . $font . '" alt="' . $font . '" data-family="' . $font_family . '" data-type="' . $type . '" ></span>';
                // $imgStr = '<img src="/1px.png" class="op-font op-font-' . $font_name . '" alt="' . $font . '" data-family="' . $font_family . '" data-type="' . $type . '" />';
                if (null !== $value && $value === $font . ';' . $type) {
                    $selected = $imgStr;
                }
                $str .= '<li><a href="#">' . $imgStr . '</a></li>';
            }
            $str .= '</ul>';
        }
        $str = '<div class="select-font"'.($id==''?'':' id="'.$id.'"').'><a href="#" class="selected-font">' . $selected . '</a><div class="font-dropdown">'.$str.'</div></div>';
        return $str;
    }

    /**
     * Generates font picker (dropdown) with hidden input field that holds the currently selected value (needed for form processing); Decorator method
     * @param  string $id
     * @param  string $name
     * @param  string $value
     * @return string
     */
    function font_visual_dropdown_with_input($id, $name, $value = null)
    {
        return $this->font_visual_dropdown($id, $value) . '<input name="' . $name . '" type="hidden" value="' . $value . '" id="input_' . $id . '" />';
    }

    function font_size_dropdown($name,$value='',$id='',$extra=''){
        return $this->_font_range_dropdown($name, $value, $id, $extra, 9, 70, __(OP_STRING_FONT_SIZE, OP_SN));
    }

    function font_spacing_dropdown($name,$value='',$id='',$extra=''){
        return $this->_font_range_dropdown($name, $value, $id, $extra, -2, 20, __(OP_STRING_FONT_SPACING, OP_SN));
    }

    function _font_range_dropdown($name,$value='',$id='',$extra='',$start,$end,$default_str=''){
        $str = '<option value="">'.$default_str.'</option>';
        for($i=$start;$i<($end+1);$i++){
            $str .= '<option value="'.$i.'"'.($i==$value ? ' selected="selected"':'').'>'.$i.'px</option>';
        }

        for($i=90;$i<(270);$i+=20){
            $str .= '<option value="'.$i.'"'.($i==$value ? ' selected="selected"':'').'>'.$i.'px</option>';
        }

        return $this->_dropdown_str($str,$name,$id,$extra);
    }

    function font_style_dropdown($name,$value='',$id='',$extra=''){
        static $types;
        $str = '';
        if(!isset($types)){
            $types = array(
                '' => __(OP_STRING_FONT_STYLE, 'optimizepress'),
                '300' => __('Thin', 'optimizepress'),
                'normal' => __('Normal', 'optimizepress'),
                'italic' => __('Italic', 'optimizepress'),
                'bold' => __('Bold', 'optimizepress'),
                'bold italic' => __('Bold/Italic', 'optimizepress'),
            );
        }

        foreach($types as $type => $title){
            $str .= '<option value="'.$type.'"'.($type==$value ? ' selected="selected"':'').'>'.$title.'</option>';
        }
        return $this->_dropdown_str($str,$name,$id,$extra);
    }

    function font_style_checkbox($name, $value = '', $id = '', $extra = '')
    {
        static $types;
        $str = '';
        if(!isset($types)){
            $types = array(
                'bold' => __('Bold', 'optimizepress'),
                'italic' => __('Italic', 'optimizepress'),
                'underline' => __('Underline', 'optimizepress')
            );
        }

        $str = '<div class="op-asset-checkboxes" id="' . $id . '">';
        foreach($types as $type => $title){
            $str .= '<input name="' . esc_attr($name) . '[' . $type . ']" value="1"'. checked($type, $value) .' type="checkbox" class="op-font-style-checkbox op-font-style-' . $type . '"><label class="op-font-style-checkbox-' . $type . '">' . $title . '</label>';
        }
        $str .= '</div>';

        return $str;
    }

    function font_shadow_dropdown($name,$value='',$id='',$extra=''){
        static $types;
        $str = '';
        if(!isset($types)){
            $types = array(
                '' => __(OP_STRING_FONT_SHADOW),
                'none' => __('None', 'optimizepress'),
                'dark' => __('Dark', 'optimizepress'),
                'light' => __('Light', 'optimizepress'),
            );
        }

        foreach($types as $type => $title){
            $str .= '<option value="'.$type.'"'.($type==$value ? ' selected="selected"':'').'>'.$title.'</option>';
        }
        return $this->_dropdown_str($str,$name,$id,$extra);
    }

    function _dropdown_str($str,$name,$id='',$extra=''){
        return '<select name="'.esc_attr($name).'"'.($id==''?'':' id="'.esc_attr($id).'"').' '.$extra.'>'.$str.'</select>';
    }
}
function _op_fonts(){
    static $op_fonts;
    if(!isset($op_fonts)){
        $op_fonts = new OptimizePress_Fonts;
    }
    $args = func_get_args();
    $func = array_shift($args);
    return call_user_func_array(array($op_fonts,$func),$args);
}
function op_add_fonts($font){
    return _op_fonts('add_font',$font);
}
function op_fonts_list(){
    return _op_fonts('all_fonts_array');
}
function op_google_fonts($font=''){
    return _op_fonts('google_fonts',$font);
}
function op_default_fonts($font=''){
    return _op_fonts('default_fonts',$font);
}

/*
 * FUNCTION:    op_font_selector()
 * DESCRIPTION: Will return or echo out a fully customizable font selector
 * PARAMETERS:
 *      $name_prefix - (String)  Used to prefix the font selector element's name and id attributes
 *                   Default: Empty String
 *      $fields        (Array)   Contains the fields we want to use in the font selector. The array
 *                   element key is used to determine if that element should show and
 *                   it's value is the default value for that field
 *                   Default: array('family' => '', 'size' => '', 'style' => '', 'spacing' => '', 'shadow' => '')
 *      $before        (String)  A string that will be prepended to value before it is returned or
 *                   echoed. Usually a piece of HTML such as a container div
 *                   Default: Empty String
 *      $after         (String)  A string that will be appended to value after it is returned or
 *                   echoed. Usually a piece of HTML such as a container div
 *                   Default: Empty String
 *      $return        (Boolean) Used to determine whether the value should be returned or echoed
 *                   Default: True
 *
 */
function op_font_selector($name_prefix = '', $fields = array('family' => '', 'size' => '', 'style' => '', 'style_checkbox' => '', 'spacing' => '', 'shadow' => ''), $before = '', $after = '', $return = true){
    //Generate ID prefix from the name prefix
    $id = str_replace(array('[', ']'), '_', str_replace('][', '_', $name_prefix));

    //Initialize the HTML variable
    $fontSelectorHtml = $before;

    //Loop through each field and add HTML
    //Using this method allows for customizing the order of the font selector elements
    foreach($fields as $key=>$default){
        switch($key){
            case 'family':
                $fontSelectorHtml .= _op_fonts('font_dropdown', $name_prefix.'[font_family]', $fields['family'], $id.'font_family', '');
                break;
            case 'size':
                $fontSelectorHtml .= _op_fonts('font_size_dropdown', $name_prefix.'[font_size]', $fields['size'], $id.'font_size', '');
                break;
            case 'style':
                $fontSelectorHtml .= _op_fonts('font_style_dropdown', $name_prefix.'[font_weight]', $fields['style'], $id.'font_style', '');
                break;
            case 'style_checkbox':
                $fontSelectorHtml .= _op_fonts('font_style_checkbox', $name_prefix.'[font_weight]', $fields['style'], $id.'font_style', '');
                break;
            case 'spacing':
                $fontSelectorHtml .= _op_fonts('font_spacing_dropdown', $name_prefix.'[font_spacing]', $fields['spacing'], $id.'font_spacing', '');
                break;
            case 'shadow':
                $fontSelectorHtml .= _op_fonts('font_shadow_dropdown', $name_prefix.'[font_shadow]', $fields['shadow'], $id.'font_shadow', '');
                break;
        }
    }

    //Add the after HTML to the returned string
    $fontSelectorHtml .= $after;

    //Finally, return the font selector HTML unless we are supposed to echo it
    if ($return) return $fontSelectorHtml; else echo $fontSelectorHtml;
}
function op_font_dropdown($name,$value,$id='',$extra=''){
    return _op_fonts('font_dropdown',$name,$value,$id,$extra);
}
function op_font_visual_dropdown($id=''){
    return _op_fonts('font_visual_dropdown',$id);
}
/**
 * Helper function for the ::font_visual_dropdown_with_input methog
 * @param  string $id
 * @param  string $name
 * @param  string $value
 * @return string
 */
function op_font_visual_dropdown_with_input($id, $name, $value = null)
{
    return _op_fonts('font_visual_dropdown_with_input', $id, $name, $value);
}
function op_font_size_dropdown($name,$value,$id='',$extra=''){
    return _op_fonts('font_size_dropdown',$name,$value,$id,$extra);
}
function op_font_style_dropdown($name,$value,$id='',$extra=''){
    return _op_fonts('font_style_dropdown',$name,$value,$id,$extra);
}
function op_font_style_checkbox($name,$value,$id='',$extra=''){
    return _op_fonts('font_style_checkbox',$name,$value,$id,$extra);
}
function op_font_spacing_dropdown($name,$value,$id='',$extra=''){
    return _op_fonts('font_spacing_dropdown',$name,$value,$id,$extra);
}
function op_font_shadow_dropdown($name,$value,$id='',$extra=''){
    return _op_fonts('font_shadow_dropdown',$name,$value,$id,$extra);
}
function _op_font_item($font=''){
    if($font_face = op_default_fonts($font)){
        return array('default',$font,$font_face);
    } elseif(($varient = op_google_fonts($font)) !== false){
        /*
         * Adding on demand font loading for LE
         */
        if (defined('OP_LIVEEDITOR')) {
            OptimizePress_Default_Assets::_set_font(array('google',$font,$varient));
        }
        return array('google',$font,$varient);
    }
    return false;
}
function op_font_str($font=''){
    if($font = _op_font_item($font)){
        if($font[0] == 'google'){
            op_add_fonts($font[1]);
            return '"'.$font[1].'", '.$font[2]['fallback'];
        } else {
            return $font[2];
        }
    }
    return false;
}
function op_font_options_str($title,$fieldname,$values=array()){
    static $field_count = 0;
    $fieldid = str_replace(array('[]','][','[',']'),array('_'.$field_count,'_','_',''),$fieldname).'_';
    $field_count++;
    return '
        <div class="feature-area-font-dropdown">
            <label class="form-title" for="'.$fieldid.'font">'.$title.'</label>
            <div class="font-chooser cf">
                '.op_font_size_dropdown($fieldname.'[font_size]', op_get_var($values,'font_size'), $fieldid.'size').
                op_font_dropdown($fieldname.'[font_font]', op_get_var($values,'font_font'), $fieldid.'family').
                op_font_style_dropdown($fieldname.'[font_style]', op_get_var($values,'font_style'), $fieldid.'style').
                op_color_picker($fieldname.'[font_color]', op_get_var($values,'font_color'), $fieldid.'color', false, true).'
                <a href="#reset" class="reset-link">Reset</a>
            </div>
        </div>
    ';
}