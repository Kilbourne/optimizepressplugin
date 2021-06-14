<?php 

/**
 * Render OptimizeLeads shortcode (posts pages)
 * @param  array $atts
 * @return string
 */
function op_leads_shortcode($atts) {

        if(defined('OP_LIVEEDITOR')) {
           return;
        }

        global $wp_version;
        $opl_api_key = get_option(OP_SN . '_optimizeleads_api_key');
        $args = array(
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ),
            'blocking'    => true,
            'headers'     => array('X-API-Token' => $opl_api_key),
            'cookies'     => array(),
            'body'        => null,
            'compress'    => false,
            'decompress'  => true,
            'sslverify'   => true,
            'stream'      => false,
            'filename'    => null
        );

        if (false === ($response = get_transient('el_opl_box_' . $atts['uid']))) {
	        $response = wp_remote_get( OP_LEADS_URL . 'api/boxes/' . $atts['uid'], $args);
	        $response = json_decode($response['body']);
	        set_transient('el_opl_box_' . $atts['uid'] ,$response, OP_LEADS_BOX_CACHE_EXPIRATION_SEC);
	   	}

        return $response->box->embed_code;
}
add_shortcode('op-opleads', 'op_leads_shortcode');