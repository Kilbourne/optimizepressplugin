<?php
class OptimizePress_LaunchFunnels {

    var $funnel_pages = array();
    var $settings = array();
    var $cookie = array();
    var $gateway_key = '';
    var $custom_key = '';
    var $custom_redirect = '';
    var $use_custom = false;
    var $open_sales_cart = false;
    var $in_gateway_key = '';
    var $redirect_url = '';
    var $page_idx = '';
    var $page_id = '';

    function __construct($id,$launch_info){
        $funnel = $launch_info['funnel_id'];
        if(!defined('OP_LAUNCH_FUNNEL')){
            define('OP_LAUNCH_FUNNEL',$funnel);
        }
        $this->funnel_pages = op_launch_option('funnel_pages');
        $this->page_id = $id;

        $this->gateway_key();
        $this->get_cookie();
        $this->get_gateway_key();
        $this->redirect_url = get_bloginfo('wpurl');
        $redirect = $this->check_page($launch_info);
        if($redirect){
            wp_redirect($this->redirect_url);
        }
    }

    function check_page($launch_info){
        if(op_launch_option('redirect_all','enabled') == 'Y' && $launch_info['funnel_page'] !== 'sales'){
            $this->redirect_url = op_launch_option('redirect_all','url');
            return true;
        }
        $last_page = op_get_var($this->cookie,'last_page',-1);
        if($launch_info['funnel_page'] == 'stage' && $launch_info['type'] == 'value_page'){
            $current = $launch_info['stage_idx'];
            $stages = op_get_var($this->funnel_pages,'stages',array());
            $current_page = op_get_var($stages,$current,array());
            if(!is_array($current_page)){
                return true;
            } else {
                $published = $this->is_stage_published($current_page,true);
                if(!$published){
                    $this->get_last_page($last_page);
                    return true;
                } else {
                    if(!$this->check_key()){
                        $this->get_last_page($current);
                        return true;
                    }
                    if(!empty($this->custom_redirect)){
                        $this->redirect_url = $this->custom_redirect;
                        if ($this->use_custom && $this->custom_key != $this->in_gateway_key){
                            return true;
                        }
                    }
                    $this->set_cookie($current);
                }
            }
        } elseif($launch_info['funnel_page'] == 'sales'){
            if(!$this->check_key() && !$this->open_sales_cart()){
                $this->get_last_page($last_page);
                return true;
            }
            $this->set_cookie('sales');
        }
        return false;
    }

    function check_key(){
        if($this->use_custom && $this->in_gateway_key == $this->custom_key){
            return true;
        } elseif($this->gateway_key == ''){
            return true;
        } elseif($this->in_gateway_key == $this->gateway_key){
            return true;
        }
        return false;
    }

    function get_last_page($last_page){
        $field = 'landing_page';
        if($this->in_gateway_key == $this->gateway_key){
            $field = 'value_page';
        }

        if($last_page > -1){
            //Checks if stage for redirect is published and if it's not it will redirect to basic landing page
            if ($this->is_stage_published($last_page)){
                $this->redirect_url = $this->get_stage_url($last_page,$field);
            } else{
                $this->redirect_url = $this->get_stage_url($last_page,'landing_page');
            }
        } else {
            if ($this->is_stage_published(0)){
                $this->redirect_url = $this->get_stage_url(0,$field);
            } else{
                $this->redirect_url = $this->get_stage_url(0,'landing_page');
            }
        }
    }

    function is_stage_published($idx,$array=false){
        if($array){
            if(_op_traverse_array($idx,array('publish_stage','publish')) == 'Y'){
                return true;
            }
        } else {
            if(_op_traverse_array($this->funnel_pages,array('stages',$idx,'publish_stage','publish')) == 'Y'){
                return true;
            }
        }
        return false;
    }

    function get_stage_url($idx,$field){
        return $this->get_url(_op_traverse_array($this->funnel_pages,array('stages',$idx,'page_setup',$field)));
    }

    function get_url($page_id){
        return $this->add_gateway_key(get_permalink($page_id));
    }

    function get_sales_url(){
        if(($id = _op_traverse_array($this->funnel_pages,array('sales','page_setup','sales_page'))) !== false){
            return $this->add_gateway_key(get_permalink($id));
        }
    }

    function add_gateway_key($url){
        if(!(isset($this->cookie['gateway_key']) && $this->cookie['gateway_key'] == $this->gateway_key) && $this->in_gateway_key == $this->gateway_key){
            $query = parse_url($url, PHP_URL_QUERY);
            return $url.($query ? '&' : '?').'gw='.urlencode($this->gateway_key);
        }
        return $url;
    }

    function open_sales_cart(){
        $return = false;
        if(_op_traverse_array($this->funnel_pages,array('sales','page_setup','open_sales_cart')) == 'Y'){
            $return = true;
        }
        return $return;
    }

    function set_cookie($page_idx, $visited = null){
        if(count($this->cookie) > 0 && !empty($this->page_id)){
            $arr = $this->cookie;
            if (!$visited) {
                $arr['visited_pages'][] = $this->page_id;
            } else {
                if (is_array($visited) && 0 !== count($visited)) {
                    foreach ($visited as $key => $val) {
                        $arr['visited_pages'][] = $val;
                    }
                }
            }
        } else {
            if (!empty($this->page_id)) {
                $arr = array(
                    'gateway_key' => $this->gateway_key
                );
                if (!$visited) {
                    $arr['visited_pages'][] = $this->page_id;
                } else {
                    if (is_array($visited) && 0 !== count($visited)) {
                        foreach ($visited as $key => $val) {
                            $arr['visited_pages'][] = $val;
                        }
                    }
                }
            }
        }
        $arr['last_page'] = $page_idx;
        if($this->use_custom){
            $arr['gateway_key_'.$this->page_id] = $this->custom_key;
        }
        if(isset($this->cookie['last_page']) && $this->cookie['last_page'] === 'sales'){
            $arr['last_page'] = 'sales';
        } elseif($page_idx !== 'sales' && isset($this->cookie['last_page']) && $this->cookie['last_page'] > $page_idx){
            $arr['last_page'] = $this->cookie['last_page'];
        }
        if (!empty($arr['visited_pages'])) {
            $arr['visited_pages'] = array_unique($arr['visited_pages']);
        }
        $this->cookie = $arr;
        setcookie('lf_'.OP_LAUNCH_FUNNEL,base64_encode(serialize($arr)),time()+(365*86400),COOKIEPATH,COOKIE_DOMAIN,false);

        if (isset($_GET['gw'])){
            wp_redirect(get_permalink($this->page_id));
        }
    }

    function get_cookie(){
        $this->cookie = _op_launch_cookie();
        if(isset($this->cookie['gateway_key_'.$this->page_id])){
            $this->in_gateway_key = $this->cookie['gateway_key_'.$this->page_id];
        } elseif(isset($this->cookie['gateway_key'])){
            $this->in_gateway_key = $this->cookie['gateway_key'];
        }
    }

    function get_gateway_key(){
        if(isset($_GET['gw'])){
            $this->in_gateway_key = $_GET['gw'];
        }
    }

    function check_auth(){
        $auth = false;
        $info = array();
        if(isset($_GET['gw']) && $_GET['gw'] == $this->gateway_key){
            $auth = false;
        } elseif(isset($_COOKIE['lf_'.OP_LAUNCH_FUNNEL])){
        }
        return $auth;
    }

    function gateway_key(){
        $gateway_override = op_page_option('launch_funnel','gateway_override');
        $found = false;
        if(op_get_var($gateway_override,'enabled') == 'Y'){
            if(($key = op_get_var($gateway_override,'code')) && $key != ''){
                $this->custom_key = $key;
                $this->use_custom = true;
                $found = true;
            }
            if(($url = op_get_var($gateway_override,'redirect')) && $url != ''){
                $this->custom_redirect = $url;
            }
        }
        if(!$found){
            $gateway_key = op_launch_option('gateway_key');
            if(op_get_var($gateway_key,'enabled','N') == 'Y'){
                $this->gateway_key = $gateway_key['key'];
            }
        }
    }

}
new OptimizePress_LaunchFunnels($id,$launch_info);