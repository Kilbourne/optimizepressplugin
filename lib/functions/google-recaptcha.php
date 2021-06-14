<?php

class OPGoogleRecaptcha {
    /**
     * @var OPGoogleRecaptcha
     */
    protected static $instance;

    protected $googleReCaptchaSiteKey = false;

    protected $googleReCaptchaSecret = false;

    protected $requestIsValid = -1;

    /**
     * Singleton pattern instance getter.
     *
     * @return OPGoogleRecaptcha
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
        $this->googleReCaptchaSiteKey = op_get_option('google_recaptcha_site_key');
        $this->googleReCaptchaSecret = op_get_option('google_recaptcha_secret_key');

        // adding Google ReCaptcha v3 scripts
        add_action('wp_footer', array($this, 'renderGoogleReCaptchaScript'));

        // Adding to this actions to be able to stop the
        // form from submitting if captcha doesn't
        // pass the validation
        //
        // First one is for email data,
        // second for integrations
        add_action('op_pre_template_include', array($this, 'processOptinForm'), 1);
        add_action('template_redirect', array($this, 'processOptinFormIntegration'), 19);
    }

    /**
     * Render Google ReCaptcha v3 API script
     */
    function renderGoogleReCaptchaScript()
    {
        // render only on frontend
        if (defined('OP_LIVEEDITOR'))
            return;

        if (empty($this->googleReCaptchaSiteKey) || empty($this->googleReCaptchaSecret))
            return;


        wp_enqueue_script('google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . $this->googleReCaptchaSiteKey, array(), OP_VERSION, true);

        if (OP_SCRIPT_DEBUG === '') {
            wp_enqueue_script(OP_SN.'-google-recaptcha', OP_JS.'google-recaptcha'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', 'google-recaptcha'), OP_VERSION, true);
        } else {
            wp_enqueue_script(OP_SN.'-google-recaptcha', OP_JS.'google-recaptcha'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-op-jquery-base-all', 'google-recaptcha'), OP_VERSION, true);
        }
    }

    /**
     * Checks Google ReCaptcha verification on server side before regular process opt-in form from OP
     */
    public function processOptinFormIntegration()
    {
        global $wp;
        if ($wp->request === 'process-optin-form') {
            if (!empty($this->googleReCaptchaSiteKey) && !empty($this->googleReCaptchaSecret)) {
                if (isset($_POST['provider']) && $_POST['provider'] !== 'email') {
                    if ($this->isInvisibleReCaptchaTokenValid() === false) {
                        wp_die("Invalid recaptcha token. Verification failed.");
                    }
                }
            }
        }
    }

    /**
     * Checks Google ReCaptcha verification on server side before regular process opt-in form from OP
     */
    public function processOptinForm()
    {
        if (isset($_POST['op_optin_form']) && $_POST['op_optin_form'] === 'Y') {
            if (!empty($this->googleReCaptchaSiteKey) && !empty($this->googleReCaptchaSecret)) {
                if ($this->isInvisibleReCaptchaTokenValid() === false) {
                    wp_die("Invalid recaptcha token. Verification failed.");
                }
            }
        }
    }

    /**
     * Checks Google ReCaptcha return code
     *
     * @return bool
     */
    public function isInvisibleReCaptchaTokenValid()
    {

        $this->requestIsValid = true;

        if (empty( $_POST['grecaptcha-token'] )) {
            return false;
        }

        $response = wp_remote_retrieve_body(
            wp_remote_get(
                add_query_arg(
                    array(
                        'secret'   => $this->googleReCaptchaSecret,
                        'response' => $_POST['grecaptcha-token'],
                    ), 'https://www.google.com/recaptcha/api/siteverify')
            )
        );


        if (empty( $response )) {
            $this->requestIsValid = false;
        }

        $json = json_decode( $response );

        if (gettype( $json ) !== 'object' || empty( $json->success )) {
            $this->requestIsValid = false;
        }

        return $this->requestIsValid;
    }
}

OPGoogleRecaptcha::getInstance();