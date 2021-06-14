<?php

/**
 * Adds OP cache tab to Support page, which enables user to clear OP localstorage
 */
class OptimizePress_Sections_Cache
{
    /**
     * Return available sections
     * @return array
     */
    public function sections()
    {
        $sections = array(
            'localstorage' => array(
                'title'            => __('Element Cache', 'optimizepress'),
                'action'           => array($this, 'loadElementCache'),
            ),
        );

        // if (OP_TYPE === 'plugin') {
        //     $sections['theme'] = array(
        //         'title'         => __('Element Cache', 'optimizepress'),
        //         'action'        => array($this, 'loadElementCache'),
        //     );
        // }

        return apply_filters('op_edit_sections_cache', $sections);
    }


    /**
    * Load section template
    * @return void
    */
    public function loadElementCache()
    {
        echo op_load_section('clear_localstorage', array(), 'cache');
    }
}