<?php

/**
 * Class for handling GDPR actions and rendering of GDPR related shortcodes
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Gdpr
{
    /**
     * @var OptimizePress_Gdpr
     */
    protected static $instance;

    /**
     * @var array
     */
    protected $gdprCountries = array(
        'AT', 'BE', 'BG', 'CY', 'CZ',
        'DE', 'DK', 'EE', 'ES', 'FI',
        'FR', 'GR', 'HR', 'HU', 'IE',
        'IT', 'LT', 'LU', 'LV', 'MT',
        'NL', 'PL', 'PT', 'RO', 'SE',
        'SI', 'SK', 'UK', 'GB',
    );

    /**
     * @var OP2_GeoIP
     */
    protected $geoIp;

    /**
     * Well "cache" the isFromEu() call so we don't query Geo IP DB multiple times.
     *
     * @var boolean|null
     */
    protected $isFromEu = null;

    /**
     * Singleton pattern instance getter.
     *
     * @return OptimizePress_Gdpr
     */
    public static function getInstance()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Hook into WP actions, filters and shortcodes.
     */
    private function __construct()
    {
        add_action('op_after_optin_submit_button', array($this, 'renderGdprReplacementKey'), 10, 1);

        add_shortcode('op_gdpr_consent', array($this, 'renderGdprConsentShortcode'));
        add_shortcode('op_gdpr_checkbox', array($this, 'renderGdprCheckboxShortcode'));
    }

    /**
     * Render GDPR consent key that is to be replaced during form rendering (not on SL).
     *
     * @return void
     */
    public function renderGdprReplacementKey()
    {
        echo '%%_op_gdpr_consent_%%';
    }

    /**
     * Render GDPR parent shortcode. It triggers rendering of checkboxes if GDPR enabled.
     *
     * @param  array $atts
     * @param  string $content
     * @return string
     */
    public function renderGdprConsentShortcode($atts, $content)
    {
        // Nothing to do here. Consent is disabled.
        if ( ! isset($atts['enabled']) || $atts['enabled'] === 'disabled') {
            return;
        }

        $atts = shortcode_atts(
            array(
                'enabled' => 'all_visitors',
                'button_label' => '',
                'consent_notes_field' => '',
                'integration_type' => '',
            ),
            $atts,
            'op_gdpr_consent'
        );

        // If no consent notes field defined skip hidden fields
        if ( ! isset($atts['consent_notes_field']) || empty($atts['consent_notes_field']) || $atts['consent_notes_field'] === '-') {
            return '
            <input type="hidden" name="op_gdpr_button_label" value="' . esc_attr($atts['button_label']) . '">
            ' . do_shortcode($content);
        }

        if ($atts['integration_type'] === 'infusionsoft') {
            $labels = $this->getConsentLabels($content);

            $consentNotes = 'Button Text: ' . $atts['button_label'];

            if ($labels) {
                foreach ($labels as $index => $label) {
                    $consentNotes .= " | Consent " . ($index + 1) . " Text: $label";
                }
            }

            return '
            <input type="hidden" name="' . esc_attr($atts['consent_notes_field']) . '" value="' . esc_attr($consentNotes) . '">
            ' . do_shortcode($content);
        }

        return '
        <input type="hidden" name="op_gdpr_consent_notes_field" value="' . esc_attr($atts['consent_notes_field']) . '">
        <input type="hidden" name="op_gdpr_button_label" value="' . esc_attr($atts['button_label']) . '">
        ' . do_shortcode($content);
    }

    /**
     * Return consent labels from child shortcodes.
     *
     * @param  string $content
     * @return array|null
     */
    protected function getConsentLabels($content)
    {
        $count = preg_match_all('/' . op_shortcode_regex('op_gdpr_checkbox') . '/s', $content, $matches);

        if ($count === 0) {
            return null;
        }

        $labels = array();

        for ($a = 0; $a < $count; $a++) {
            $labels[] = op_clean_shortcode_content($matches[5][$a]);
        }

        return $labels;
    }

    /**
     * Render GDPR child checkbox shortcode.
     *
     * @param  array $atts
     * @param  string $content
     * @return string
     */
    public function renderGdprCheckboxShortcode($atts, $content)
    {
        $atts = shortcode_atts(
            array(
                'key'               => '1',
                'type'              => 'all_visitors',
                'tag_accepted'      => '',
                'tag_declined'      => '',
                'tag_not_shown'     => '',
                'integration_type'  => '',
            ),
            $atts,
            'op_gdpr_checkbox'
        );

        // InfusionSoft case - of course it has to be special
        if ($atts['integration_type'] === 'infusionsoft') {
            $checkboxAcceptedValue = apply_filters('op_gdpr_consent_custom_field_value', 'yes', 'infusionsoft', null);
            $checkboxDeclinedValue = apply_filters('op_gdpr_consent_custom_field_value', 'no', 'infusionsoft', null);
            $checkboxNotShownValue = apply_filters('op_gdpr_consent_custom_field_value', 'not_shown', 'infusionsoft', null);

            if ($this->isFromEu() || $atts['type'] === 'all_visitors') {
                return '
                <p class="op-form-privacy-checkbox op-gdpr-consent-item">
                    <label>
                        <input type="hidden" name="' . esc_attr($atts['tag_accepted']) . '" value="' . esc_attr($checkboxDeclinedValue) . '">
                        <input type="checkbox" name="' . esc_attr($atts['tag_accepted']) . '" value="' . esc_attr($checkboxAcceptedValue) . '" class="op-form-privacy-gdpr-consent-checkbox op-form-privacy-gdpr-consent-checkbox-' . esc_attr($atts['key']) . '">
                        <span class="privacy-text">' . $content . '</span>
                    </label>
                </p>';
            }

            return sprintf('<input type="hidden" value="%1$s" name="%2$s">', $checkboxNotShownValue, $atts['tag_accepted']);
        }

        if ($this->isFromEu() || $atts['type'] === 'all_visitors') {
            return '
            <p class="op-form-privacy-checkbox op-gdpr-consent-item">
                <label>
                    <input type="hidden" name="op_gdpr_consent_label[' . esc_attr($atts['key']) . ']" value="' . esc_attr(strip_tags($content)) . '">
                    <input type="hidden" name="op_gdpr_consent_tag[' . esc_attr($atts['key']) . ']" value="' . esc_attr($atts['tag_declined']) . '">
                    <input type="checkbox" name="op_gdpr_consent_tag[' . esc_attr($atts['key']) . ']" value="' . esc_attr($atts['tag_accepted']) . '" class="op-form-privacy-gdpr-consent-checkbox op-form-privacy-gdpr-consent-checkbox-' . esc_attr($atts['key']) . '">
                    <span class="privacy-text">' . $content . '</span>
                </label>
            </p>';
        }

        return sprintf('<input type="hidden" value="%1$s" name="op_gdpr_consent_tag[]">', $atts['tag_not_shown']);
    }

    /**
     * Return compiled shortcode with GDPR elements.
     *
     * @param  array $atts
     * @return string
     */
    public function compileShortcode($atts)
    {
        $shortcode = '[op_gdpr_consent enabled="' . esc_attr($atts['gdpr_consent']) . '" button_label="' . esc_attr(strip_tags($atts['button_label'])) . '" consent_notes_field="' . esc_attr($atts['consent_notes_field']). '" integration_type="' . esc_attr($atts['integration_type']) . '"]';

        if (isset($atts['consent_1_enabled']) && $atts['consent_1_enabled'] === 'yes') {
            $shortcode .= sprintf('[op_gdpr_checkbox key="1" tag_accepted="%1$s" tag_declined="%2$s" tag_not_shown="%3$s" type="%4$s" integration_type="%5$s"]%6$s[/op_gdpr_checkbox]', $atts['consent_1_tag_accepted'], $atts['consent_1_tag_declined'], $atts['consent_1_tag_not_shown'], $atts['gdpr_consent'], $atts['integration_type'], $atts['consent_1_label']);
        }

        if (isset($atts['consent_2_enabled']) && $atts['consent_2_enabled'] === 'yes') {
            $shortcode .= sprintf('[op_gdpr_checkbox key="2" tag_accepted="%1$s" tag_declined="%2$s" tag_not_shown="%3$s" type="%4$s" integration_type="%5$s"]%6$s[/op_gdpr_checkbox]', $atts['consent_2_tag_accepted'], $atts['consent_2_tag_declined'], $atts['consent_2_tag_not_shown'], $atts['gdpr_consent'], $atts['integration_type'], $atts['consent_2_label']);
        }

        $shortcode .= '[/op_gdpr_consent]';

        return $shortcode;
    }

    /**
     * Check if given request is comming from EU. Based on IP address.
     *
     * @return boolean
     */
    protected function isFromEu()
    {
        if (is_null($this->isFromEu)) {
            require_once OP_LIB . 'vendor/geoip/geoip/src/geoip.inc.php';

            $ipAddress = op_get_client_ip_env();
            $countryCode = op2_geoip_country_code_by_addr($this->getGeoIp(), $ipAddress);

            // Can be empty for localhost addresses
            if (empty($countryCode)) {
                $countryCode = 'GB';
            }

            $this->isFromEu = in_array($countryCode, $this->gdprCountries);
        }

        return $this->isFromEu;
    }

    /**
     * Initialize and return GEO IP client.
     *
     * @return OP2_GeoIP
     */
    protected function getGeoIp()
    {
        if ($this->geoIp === null) {
            require_once OP_LIB . 'vendor/geoip/geoip/src/geoip.inc.php';

            $this->geoIp = op2_geoip_open(OP_LIB . 'data/GeoIP.dat', OP2_GEOIP_STANDARD);
        }

        return $this->geoIp;
    }
}

OptimizePress_Gdpr::getInstance();

/**
 * Return compiled GDPR checkbox shortcode from given attributes.
 *
 * @param  array $atts
 * @return string
 */
function op_gdpr_compile_shortcode($atts)
{
    return OptimizePress_Gdpr::getInstance()->compileShortcode($atts);
}