<?php

if (!class_exists("OptimizePress_Page_Presets")){
    class OptimizePress_Page_Presets
    {
        /**
         * @var OptimizePress_Page_Presets
         */
        protected static $instance;

        /**
         * @var $presetDropdown
         */
        public $presetDropdown;

        /**
         * Constructor class
         */
        protected function __construct()
        {
            /*
             * Init function calls
             */
            $this->getSavedOptimizePressPresets();
            /*
             * Allow using create_new_page.js
             */
            if ($this->presetDropdown != ""){
                define('OP_CREATE_NEW_PAGE',true);
            }

        }

        /**
         * Returns the list of saved OptimizePress presets
         * @return array
         */
        protected function getSavedOptimizePressPresets()
        {
            global $wpdb;
            $preset_html = '';
            $results = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_presets` ORDER BY name ASC");
            if($results){
                $drop_html = '';
                foreach($results as $result){
                    $drop_html .= '<option value="'.$result->id.'">'.$result->name.'</option>';
                }
                if (count($results) > 0){
                    $preset_html = '<select class="op-presets" name="op[page][preset]">'.$drop_html.'</select>';
                }                
            }
            $this->presetDropdown = $preset_html;
        }

        /**
         * Singleton
         * @return OptimizePress_Page_Presets
         */
        public static function getInstance()
        {
            if (null == self::$instance) {
                self::$instance = new self;
            }

            return self::$instance;
        }
    }
}
OptimizePress_Page_Presets::getInstance();