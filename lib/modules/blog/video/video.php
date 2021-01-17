<?php
class OptimizePress_Blog_Video_Module extends OptimizePress_Modules_Base {

    var $use_controls = false;
    var $player_count = 0;

    function __construct($config=array()){
        parent::__construct($config);
    }

    function display_settings($section_name,$config=array(),$return=false){
        $data = array(
            'fieldid' => $this->get_fieldid($section_name),
            'fieldname' => $this->get_fieldname($section_name),
            'section_name' => $section_name,
            'fields' => array()
        );

        $fields = array('type','embed','url','url1', 'url2', 'placeholder','hide_controls','auto_play','auto_buffer','width','height',
        'youtube_url', 'youtube_auto_play', 'youtube_hide_controls', 'youtube_remove_logo', 'youtube_show_title_bar', 'youtube_force_hd', 'margin_top', 'margin_bottom', 'border_size', 'border_color');
        $section = $this->get_option($section_name);
        if($section !== false && is_array($section)){
            foreach($fields as $key=>$field){
                $data['fields'][$field] = op_get_var($section,$field);
            }
        }
        if(isset($config['values'])){
            foreach($fields as $field){
                if(!isset($data['fields'][$field])){
                    $data['fields'][$field] = isset($config['values'][$field]) ? $config['values'][$field] : '';
                } elseif(empty($data['fields'][$field])){
                    $data['fields'][$field] = '';
                }
            }
        }
        $out = $this->load_tpl('video_panel',$data);
        if($return){
            return $out;
        }
        echo $out;
    }

    function save_settings($section_name,$config=array(),$op,$return=false){
        $video = array('type'=>'url','embed'=>'','url'=>'', 'url1'=>'','url2'=>'');
        if(isset($op['type'])){
            $width = 511;
            $height = 288;
            if(isset($config['values'])){
                extract($config['values']);
            }
            if($op['type'] == 'embed' || $op['type'] == 'url' || $op['type'] == 'youtube'){
                $video = array(
                    'type' => $op['type'],
                    'embed' => stripslashes(op_get_var($op,'embed')),
                    'url' => op_get_var($op,'url'),
                    'url1' => op_get_var($op,'url1'),
                    'url2' => op_get_var($op,'url2'),
                    'placeholder' => op_get_var($op,'placeholder'),
                    'width' => op_get_var($op,'width',$width),
                    'height' => op_get_var($op,'height',$height),
                    'hide_controls' => op_get_var($op,'hide_controls','N'),
                    'auto_play' => op_get_var($op,'auto_play','N'),
                    'auto_buffer' => op_get_var($op,'auto_buffer','N'),
                    'youtube_url' => op_get_var($op,'youtube_url'),
                    'youtube_auto_play' => op_get_var($op,'youtube_auto_play','N'),
                    'youtube_hide_controls' => op_get_var($op,'youtube_hide_controls','N'),
                    'youtube_remove_logo' => op_get_var($op,'youtube_remove_logo','N'),
                    'youtube_show_title_bar' => op_get_var($op,'youtube_show_title_bar','N'),
                    'youtube_force_hd' => op_get_var($op,'youtube_force_hd','none'),
                    'margin_top' => op_get_var($op,'margin_top',0),
                    'margin_bottom' => op_get_var($op,'margin_bottom',20),
                    'border_size' => op_get_var($op,'border_size','0'),
                    'border_color' => op_get_var($op,'border_color','#fff')
                );
                if(empty($video['width'])){
                    $video['width'] = $width;
                }
                if(empty($video['height'])){
                    $video['height'] = $height;
                }
            }
        }
        if($return){
            return $video;
        }
        $this->update_option($section_name,$video);
    }

    function output($section_name,$config,$options,$return=false,$withoptions=false)
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

        $uid = 'vp_' . md5(serialize(func_get_args()));
        if (false === $data = get_transient('mod_' . $uid)) {
            $data = op_sl_parse('video_player', array(
                'section_name'  => $section_name,
                'config'        => $config,
                'options'       => $options,
                'use_controls'  => $this->use_controls,
                'player_count'  => $this->player_count
            ));

            if (is_string($data) && 0 === strpos($data, '##')) {
                $data = substr($data, 2);
            } elseif (!empty($data)) {
                set_transient('mod_' . $uid, $data, OP_SL_ELEMENT_CACHE_LIFETIME);
            } else {
                $data = array(
                    'use_controls'  => $this->use_controls,
                    'player_count'  => $this->player_count,
                    'out'           => '',
                    'new_options'   => array()
                );
            }
        }

        if (isset($data['use_controls'])) {
            $this->use_controls = $data['use_controls'];
        }

        if (isset($data['player_count'])) {
            $this->player_count = $this->player_count + (int) $data['player_count'];
        }

        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        if ($return) {
            return ($withoptions ? array('output'=>$data['out'],'options'=>$data['new_options']) : $data['out']);
        }
        echo $data['out'];
    }
}

function youtube_id_from_url($url) {
       $pattern =
        '%^# Match any youtube URL
        (?:https?://)?  # Optional scheme. Either http or https
        (?:www\.)?      # Optional www subdomain
        (?:             # Group host alternatives
          youtu\.be/    # Either youtu.be,
        | youtube\.com  # or youtube.com
          (?:           # Group path alternatives
            /embed/     # Either /embed/
          | /v/         # or /v/
          | .*v=        # or /watch\?v=
          )             # End path alternatives.
        )               # End host alternatives.
        ([\w-]{10,12})  # Allow 10-12 for 11 char youtube id.
        ($|&).*         # if additional parameters are also in query string after video id.
        $%x'
        ;
        $result = preg_match($pattern, $url, $matches);
        if (false !== $result) {
          return $matches[1];
        }
        return false;
 }
