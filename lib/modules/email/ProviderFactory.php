<?php

/**
 * Factory for creating provider object
 * @author OptimizePress
 */
class OptimizePress_Modules_Email_ProviderFactory
{
    private function __construct() {}

    public static function getFactory($type)
    {
        require_once(OP_MOD . 'email/logger/Null.php');
        $logger = apply_filters('op_ems_logger_class', new OptimizePress_Modules_Email_Logger_Null);

        switch ($type) {
            case 'mailchimp':
                require_once(OP_MOD . 'email/provider/Mailchimp.php');
                $provider = new OptimizePress_Modules_Email_Provider_Mailchimp($logger);
                break;
            case 'mailpoet':
                require_once(OP_MOD . 'email/provider/MailPoet.php');
                $provider = new OptimizePress_Modules_Email_Provider_MailPoet($logger);
                break;
            case 'emma':
                require_once(OP_MOD . 'email/provider/Emma.php');
                $provider = new OptimizePress_Modules_Email_Provider_Emma($logger);
                break;
            case 'egoi':
                require_once(OP_MOD . 'email/provider/Egoi.php');
                $provider = new OptimizePress_Modules_Email_Provider_Egoi($logger);
                break;
            case 'maropost':
                require_once(OP_MOD . 'email/provider/Maropost.php');
                $provider = new OptimizePress_Modules_Email_Provider_Maropost($logger);
                break;
            case 'arpreach':
                require_once(OP_MOD . 'email/provider/ArpReach.php');
                $provider = new OptimizePress_Modules_Email_Provider_ArpReach($logger);
                break;
            case 'aweber':
                require_once(OP_MOD . 'email/provider/Aweber.php');
                $provider = new OptimizePress_Modules_Email_Provider_Aweber($logger);
                break;
            case 'infusionsoft':
                require_once(OP_MOD . 'email/provider/Infusionsoft.php');
                $provider = new OptimizePress_Modules_Email_Provider_Infusionsoft($logger);
                break;
            case 'icontact':
                require_once(OP_MOD . 'email/provider/Icontact.php');
                $provider = new OptimizePress_Modules_Email_Provider_Icontact($logger);
                break;
            case 'getresponse':
                require_once(OP_MOD . 'email/provider/GetResponse.php');
                $provider = new OptimizePress_Modules_Email_Provider_GetResponse($logger);
                break;
            case 'getresponsev3':
                require_once(OP_MOD . 'email/provider/GetResponsev3.php');
                $provider = new OptimizePress_Modules_Email_Provider_GetResponsev3($logger);
                break;
            case 'gotowebinar':
                require_once(OP_MOD . 'email/provider/GoToWebinar.php');
                $provider = new OptimizePress_Modules_Email_Provider_GoToWebinar($logger);
                break;
            case 'oneshoppingcart':
                require_once(OP_MOD . 'email/provider/OneShoppingCart.php');
                $provider = new OptimizePress_Modules_Email_Provider_OneShoppingCart($logger);
                break;
            case 'campaignmonitor':
                require_once(OP_MOD . 'email/provider/CampaignMonitor.php');
                $provider = new OptimizePress_Modules_Email_Provider_CampaignMonitor($logger);
                break;
            case 'constantcontact':
                require_once(OP_MOD . 'email/provider/ConstantContact.php');
                $provider = new OptimizePress_Modules_Email_Provider_ConstantContact($logger);
                break;
            case 'officeautopilot':
                require_once(OP_MOD . 'email/provider/OfficeAutopilot.php');
                $provider = new OptimizePress_Modules_Email_Provider_OfficeAutopilot($logger);
                break;
            case 'ontraport':
                require_once(OP_MOD . 'email/provider/Ontraport.php');
                $provider = new OptimizePress_Modules_Email_Provider_Ontraport($logger);
                break;
            case 'activecampaign':
                require_once(OP_MOD . 'email/provider/ActiveCampaign.php');
                $provider = new OptimizePress_Modules_Email_Provider_ActiveCampaign($logger);
                break;
            case 'convertkit':
                require_once(OP_MOD . 'email/provider/ConvertKit.php');
                $provider = new OptimizePress_Modules_Email_Provider_ConvertKit($logger);
                break;
            case 'sendlane':
                require_once(OP_MOD . 'email/provider/Sendlane.php');
                $provider = new OptimizePress_Modules_Email_Provider_Sendlane($logger);
                break;
            default:
                return null;
        }

        if (true === apply_filters('op_ems_use_cache', true)) {
            require_once(OP_MOD . 'email/provider/TransientCache.php');
            $provider = new OptimizePress_Modules_Email_Provider_TransientCache($provider);
        }

        return $provider;
    }
}
