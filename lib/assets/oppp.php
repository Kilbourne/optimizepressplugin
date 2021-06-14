<?php

/**
 * Handle OPPP upsell teasers.
 */
class OptimizePress_Oppp_Assets
{
    /**
     * Hook actions and filters.
     */
    public function __construct()
    {
        add_filter('op_assets_after_addons', array($this, 'addOpppElementsToList'));
        add_filter('optimizepress-script-localize', array($this, 'addUpsellMarkupToJs'));
        add_filter('op_assets_oppp_element_styles', array($this, 'elementOpppStyles'), 10, 2);

        add_action('op_advanced_element_options_after', array($this, 'advancedElementOptions'));
        add_action('op_le_after_row_options', array($this, 'advancedElementOptions'));
    }

    /**
     * Add OPPP exclusive element styles to list for style picker to style differently.
     * @param  array $styles
     * @param  string $id
     * @return array
     */
    public function elementOpppStyles($styles, $id)
    {
        switch ($id) {
            // Calendar date
            case 'op_assets_core_calendar_date_style':
                return array_merge($styles, array(4, 5));
            // Countdown timer
            case 'op_assets_core_countdown_timer_style':
                return array_merge($styles, array(4, 5, 6, 7, 8, 9, 10, 11, 12, 13));
            // File download
            case 'op_assets_core_file_download_style':
                return array_merge($styles, array(5));
            // Guarantee box
            case 'op_assets_core_guarantee_box_style':
                return array_merge($styles, array(19, 20, 21, 22, 23, 24, 25));
            // News bar
            case 'op_assets_core_news_bar_style':
                return array_merge($styles, array(2, 3, 4, 5));
            // Optin box
            case 'op_assets_core_optin_box_style':
                return array_merge($styles, array(25, 26, 27, 28, 29, 30, 31));
            // Pricing table
            case 'op_assets_core_pricing_table_style':
                return array_merge($styles, array(4, 5, 6, 7, 8));
            // Progress bar
            case 'op_assets_core_progress_bar_style':
                return array_merge($styles, array(4, 5, 6, 7));
            // QNA elements
            case 'op_assets_core_qna_elements_style':
                return array_merge($styles, array("style3", "style4", "style5", "style6", "style7"));
            // Social sharing
            case 'op_assets_core_social_sharing_style':
                return array_merge($styles, array("style-22", "style-23", "style-24"));
            // Tabs
            case 'op_assets_core_tabs_style':
                return array_merge($styles, array(2, 3, 4, 5));
            // Testimonials
            case 'op_assets_core_testimonials_style':
                return array_merge($styles, array(17, 18, 19, 20, 21, 22));
        }

        return $styles;
    }

    /**
     * Add upsell box to JS data (via wp_localize_script).
     * @param array $data
     * @return array
     */
    public function addUpsellMarkupToJs($data)
    {
        if (defined('OP_LIVEEDITOR')) {
            $data['oppp']['upsell_box']['op_advanced_headline'] = self::getUpsellBox('Advanced Headline');
            $data['oppp']['upsell_box']['op_comparison_table'] = self::getUpsellBox('Comparison Table');
            $data['oppp']['upsell_box']['op_evergreen_countdown_timer'] = self::getUpsellBox('Evergreen Countdown timer');
            $data['oppp']['upsell_box']['op_product_showcase'] = self::getUpsellBox('Product Showcase');
            $data['oppp']['upsell_box']['op_scroll_enhancer'] = self::getUpsellBox('Scroll Enhancer');
            $data['oppp']['upsell_box']['op_slider'] = self::getUpsellBox('Slider');
            $data['oppp']['upsell_box']['op_testimonial_slider'] = self::getUpsellBox('Testimonial Slider');
            $data['oppp']['upsell_box']['op_wp_comments_duplicator'] = self::getUpsellBox('WordPress Comments Duplicator');
        }

        return $data;
    }

    /**
     * Add OPPP elements to list.
     * @param array $assets
     * @return array
     */
    public function addOpppElementsToList($assets)
    {
        $assets['addon']['op_advanced_headline'] = array(
            'title'         => __('Advanced Headline', 'optimizepress'),
            'description'   => __('Draw the attention to your headlines with this powerful headline element', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_advanced_headline.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',
        );

        $assets['addon']['op_comparison_table'] = array(
            'title'         => __('Pricing Comparison Table', 'optimizepress'),
            'description'   => __('Educate visitors and increase conversions with the pricing comparisons table element.', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_comparison_table.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',
        );

        $assets['addon']['op_evergreen_countdown_timer'] = array(
            'title'         => __('Evergreen Countdown timer', 'optimizepress'),
            'description'   => __('Insert an evergreen countdown timer on your pages that restarts for every new user. Great for creating urgency for conversions', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_evergreen_countdown_timer.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',
        );

        $assets['addon']['op_product_showcase'] = array(
            'title'         => __('Product Showcase', 'optimizepress'),
            'description'   => __('Showcase your products like industry leaders such as Apple and Amazon with the product showcase element.', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_product_showcase.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',
        );

        $assets['addon']['op_scroll_enhancer'] = array(
            'title'         => __('Scroll Enhancer', 'optimizepress'),
            'description'   => __('Use the scroll enhancer element to help guide your visitors to scroll down your page content, which leads to lower bounce rates and better conversions.', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_scroll_enhancer.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',
        );

        $assets['addon']['op_slider'] = array(
            'title'         => __('Slider', 'optimizepress'),
            'description'   => __('Effectively showcase your content with this engaging slider element', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_slider.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',

        );

        $assets['addon']['op_testimonial_slider'] = array(
            'title'         => __('Testimonial Slider', 'optimizepress'),
            'description'   => __('Share testimonials in a compact and engaging way using this slider. Testimonials are a great way to provide social proof for your product or service.', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_testimonial_slider.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',

        );

        $assets['addon']['op_wp_comments_duplicator'] = array(
            'title'         => __('WordPress Comments Duplicator', 'optimizepress'),
            'description'   => __('Add a WordPress comments block to your page and show the comments from any page on your site. Perfect for launch pages where you want to show the same comments stream on multiple pages.', 'optimizepress'),
            'settings'      => 'Y',
            'image'         => OP_ASSETS_URL . 'oppp/op_wp_comments_duplicator.png',
            'base_path'     => OP_ASSETS_URL . 'oppp/',

        );

        return $assets;
    }

    /**
     * Display upsell box on row and element advanced options.
     * @return void
     */
    public function advancedElementOptions()
    {
        ?>
        <div style="margin-top: 20px; margin-right: 30px;">
            <?php
                $title = 'WANT TO INCREASE YOUR SITES OPTIMIZATION AND CONVERSIONS?';
                $content = '<strong>OPTIMIZEPRESS PLUSPACK</strong> Bonus elements for the LiveEditor are avaliable for users with the OptimizePress PlusPack.';
                $content .= 'To find out more about the additional features and elements included in the PlusPack - ';
                $content .= '<a href="http://www.optimizepress.com/plus-pack/" target="_blank" class="oppp-upsell-link">CLICK HERE</a>';
                echo self::getAdvancedUpsellBox($title, $content);
            ?>
        </div>
        <?php
    }

    /**
     * Return upsell box markup.
     * @return string
     */
    public static function getUpsellBox($element = '')
    {
        $title = $element . ' element';
        if (empty($element)) {
            $title = 'Element';
        }

        $html = '<div class="oppp-upsell-box">';
        $html .= '<p class="oppp-upsell-copy">' . $title . ' is avaliable for users with the OptimizePress PlusPack. To find out more about the additional features and elements included in the PlusPack -  <a href="http://www.optimizepress.com/plus-pack/"
                    target="_blank" class="oppp-upsell-link">CLICK HERE</a></p>';
        $html .= '</div>';

        return $html;
    }
    public static function getAdvancedUpsellBox($title, $content)
    {
        $html = '<div class="oppp-upsell-box">';
        $html .= '<h3 class="oppp-upsell-title">'.$title.'</h3>';
        $html .= '<p class="oppp-upsell-copy">' . $content . ' </p>';
        $html .= '</div>';

        return $html;
    }
}

new OptimizePress_Oppp_Assets;
