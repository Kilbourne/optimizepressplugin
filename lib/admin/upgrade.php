<?php

class OptimizePress_Upgrade
{
    /**
     * Register action hooks
     * @return void
     */
    public function __construct()
    {
        // Register init actions
        add_action('init', array($this, 'updatePostLayoutsTable'));
        //add_action('init', array($this, 'updatePredefinedLayoutsTable'));

        // Register upgrade_process_complete actions
    }

    /**
     * Update optimizepress_post_layouts table, add status and modified fields if OP DB version is lower than 1.1.0
     * @return void
     */
    public function updatePostLayoutsTable()
    {
        $target = '1.1.1';

        // Fetch OP DB version from options table and compare to needed version
        if (version_compare($this->getDbVersion(), $target, '<')) {
            global $wpdb;
            $table = $wpdb->prefix . "optimizepress_post_layouts";
            $structure = "CREATE TABLE `" . $table . "` (
                    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                    post_id bigint(20) unsigned NOT NULL,
                    type varchar(255) NOT NULL,
                    layout longtext NOT NULL,
                    status varchar(30) DEFAULT 'publish' NOT NULL,
                    modified datetime DEFAULT NULL,
                    PRIMARY KEY  (id)
                );";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($structure);

            // Save OP DB version to options table
            $this->setDbVersion($target);
        }
    }

    /**
     * Update optimizepress_predefined_layouts table, add guid column, add guid for existing templates
     * @return [type] [description]
     */
    public function updatePredefinedLayoutsTable()
    {
        $target = '1.2.0';

        if (version_compare($this->getDbVersion(), $target, '<')) {
            global $wpdb;
            $structure = "CREATE TABLE `{$wpdb->prefix}optimizepress_predefined_layouts` (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                `guid` varchar(100) NULL DEFAULT NULL,
                `name` varchar(100) NOT NULL DEFAULT '',
                `category` int(10) unsigned NOT NULL,
                `description` text NOT NULL,
                `preview_ext` varchar(4) NOT NULL DEFAULT '',
                `layouts` longtext NOT NULL,
                `settings` longtext NOT NULL,
                PRIMARY KEY (`id`)
            );";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($structure);

            // We need to update the table with the GUIDs
            $this->updatePredefinedLayoutsGuid();

            $this->setDbVersion($target);
        }
    }

    /**
     * Return DB version from options table
     * @return string SEMVER compatible
     */
    protected function getDbVersion()
    {
        return get_option(OP_SN . '_db_version', '1.0.0');
    }

    /**
     * Save DB version to options table
     * @param string $version SEMVER compatible
     * @return boolean
     */
    protected function setDbVersion($version)
    {
        return update_option(OP_SN . '_db_version', $version);
    }

    /**
     * Return layout ID if it exists or null
     * @param  string $name
     * @return string
     */
    protected function getLayoutGuidFromName($name)
    {
        // List of presets
        $templates = array_flip(array(
            'op-backdrop-box-left-1'                    => 'BACKDROP Box-Left',
            'op-backdrop-box-right-1'                   => 'BACKDROP Box-Right',
            'op-bold-template-1'                        => 'Bold Template',
            'op-book-launch-landing-1'                  => 'Book Launch Landing Page',
            'op-book-launch-thank-you-1'                => 'Book Launch Thank You Page',
            'op-book-launch-video-1'                    => 'Book Launch Video Page',
            'op-book-sales-1'                           => 'Book Sales Page',
            'op-clean-style-free-report-1'              => 'Clean Style Free Report Opt-in Page',
            'op-clean-video-landing-1'                  => 'Clean Video Landing Page',
            'op-clean-video-landing-2'                  => 'Clean Video Landing Page 2',
            'op-countdown-webinar-1'                    => 'Countdown Webinar Page',
            'op-course-sales-1'                         => 'Course Sales Page',
            'op-dark-style-ebook-landing-1'             => 'Dark Style Ebook Landing Page',
            'op-ebook-coming-soon-1'                    => 'Ebook Coming Soon Page',
            'op-ebook-optin-with-testimonial-1'         => 'Ebook Opt-In With Testimonial',
            'op-features-sales-1'                       => 'Features Sales Page',
            'op-flat-style-1'                           => 'Flat Style Sales Page',
            'op-free-guide-download-1'                  => 'Free Guide Download Page',
            'op-free-guide-landing-1'                   => 'Free Guide Landing Page',
            'op-free-guide-thank-you-1'                 => 'Free Guide Thank You',
            'op-grey-optin-1'                           => 'Grey Optin',
            'op-help-faq-1'                             => 'Help & Faq Page',
            'op-homepage-atm-1'                         => 'Homepage ATM Page',
            'op-im-classic-style-1'                     => 'IM Classic Style 1',
            'op-im-classic-style-2'                     => 'IM Classic Style 2',
            'op-im-classic-style-3'                     => 'IM Classic Style 3',
            'op-im-classic-style-4'                     => 'IM Classic Style 4',
            'op-im-classic-style-5'                     => 'IM Classic Style 5',
            'op-landing-with-content-1'                 => 'Landing Page with Content',
            'op-landing-with-video-1'                   => 'Landing page with Video',
            'op-landing-with-video-2'                   => 'Landing Page with Video 2',
            'op-limited-time-sales-1'                   => 'Limited Time Sales Page',
            'op-long-form-landing-1'                    => 'Long Form Landing Page',
            'op-membership-content-classroom-style-1'   => 'Membership Content Classroom Style',
            'op-membership-home-classroom-style-1'      => 'Membership Home Classroom Style',
            'op-membership-home-clean-style-1'          => 'Membership Home Page Clean Style',
            'op-membership-lesson-1'                    => 'Membership Lesson Page',
            'op-membership-lesson-clean-style-1'        => 'Membership Lesson Page Clean Style',
            'op-modern-style-download-1'                => 'Modern Style Download 1',
            'op-modern-style-download-2'                => 'Modern Style Download 2',
            'op-overlay-optin-lander-1'                 => 'Overlay Optin Lander',
            'op-sales-with-lightbox-video-1'            => 'Sales Page with Lightbox Video',
            'op-simple-landing-1'                       => 'Simple Landing Page',
            'op-simple-video-landing-1'                 => 'Simple Video Landing Page',
            'op-simple-video-sales-1'                   => 'Simple Video Sales Page',
            'op-special-event-webinar-1'                => 'Special Event Webinar Page',
            'op-video-content-sales-1'                  => 'Video Content Sales Page',
            'op-webinar-registration-1'                 => 'Clean Style Webinar Registration',
            'op-webinar-registration-2'                 => 'Webinar Registration 1-Host Style 2',
            'op-webinar-registration-3'                 => 'Webinar Registration 1-Host Style 3',
            'op-webinar-registration-4'                 => 'Webinar Registration 2-Host Style 4',
            'op-webinar-registration-5'                 => 'Webinar Registration 2-Host Style 5',
            'op-webinar-countdown-thank-you-1'          => 'Webinar Countdown Thank You'
        ));

        if (isset($templates[$name])) {
            return $templates[$name];
        }

        return null;
    }

    /**
     * Update predefined layouts guid from hardcoded IDs array
     * @return void
     */
    protected function updatePredefinedLayoutsGuid()
    {
        global $wpdb;

        $results = $wpdb->get_results("SELECT id, name FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE guid IS NULL", OBJECT);

        if ($results) {
            foreach ($results as $row) {
                $guid = $this->getLayoutGuidFromName($row->name);
                if ($guid !== null) {
                    $wpdb->update(
                        $wpdb->prefix . 'optimizepress_predefined_layouts', // Table name
                        array('guid' => $guid), // Data to update
                        array('id' => $row->id), // Where clause
                        array('%s'), // Data format - string
                        array('%d') // Where clause conditionals format - integer
                    );
                }
            }
        }
    }
}

new OptimizePress_Upgrade();