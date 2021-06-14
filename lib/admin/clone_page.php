<?php

/**
 * Tool for cloning OP page
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Admin_ClonePage
{
    /**
     * @var OptimizePress_Admin_ClonePage
     */
    protected static $instance;

    /**
     * Private constructor
     */
    private function __construct()
    {}

    /**
     * Singleton pattern
     * @return OptimizePress_Admin_ClonePage
     */
    public static function getInstance()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Clones provided page ID
     * @param  int $pageId
     * @return int
     */
    public function clonePage($pageId)
    {
        $oldPost = get_post($pageId);

        if (null === $oldPost) {
            return 0;
        }

        if ('revision' === $oldPost->post_type) {
            return 0;
        }

        $currentUser = wp_get_current_user();

        $newPost = array(
            'menu_order'        => $oldPost->menu_order,
            'comment_status'    => $oldPost->comment_status,
            'ping_status'       => $oldPost->ping_status,
            'post_author'       => $currentUser->ID,
            'post_content'      => $oldPost->post_content,
            'post_excerpt'      => $oldPost->post_excerpt,
            'post_mime_type'    => $oldPost->post_mime_type,
            'post_parent'       => $oldPost->post_parent,
            'post_password'     => $oldPost->post_password,
            'post_status'       => $oldPost->post_status,
            'post_title'        => '(dup) ' . $oldPost->post_title,
            'post_type'         => $oldPost->post_type,
            'post_date'         => $oldPost->post_date,
            'post_date_gmt'     => get_gmt_from_date($oldPost->post_date),
        );

        $newId = wp_insert_post($newPost);

        /*
         * Generating unique slug
         */
        if ($newPost['post_status'] == 'publish' || $newPost['post_status'] == 'future') {

            $postName = wp_unique_post_slug($oldPost->post_name, $newId, $newPost['post_status'], $oldPost->post_type, $newPost['post_parent']);

            $newPost = array();
            $newPost['ID'] = $newId;
            $newPost['post_name'] = $postName;

            wp_update_post($newPost);
        }

        $this->cloneMeta($pageId, $newId);
        $this->cloneOpData($pageId, $newId);

        return $newId;
    }

    /**
     * Copies post meta data
     * @param  int $oldId
     * @param  int $newId
     * @return boolean
     */
    protected function cloneMeta($oldId, $newId)
    {
        $metaKeys = get_post_custom_keys($oldId);

        if (empty($metaKeys)) {
            return false;
        }

        foreach ($metaKeys as $metaKey) {

            $metaValues = get_post_custom_values($metaKey, $oldId);

            $op3 = function_exists('is_op3_page') && is_op3_page($oldId);

            foreach ($metaValues as $metaValue) {
                // if OP3 page
                if ($op3) {
                    update_post_meta($newId, $metaKey, addslashes($metaValue));
                    continue;
                }

                $metaValue = maybe_unserialize($metaValue);
                update_post_meta($newId, $metaKey, $metaValue);
            }
        }

        return true;
    }

    /**
     * Clones custom OP data
     * @param  int $oldId
     * @param  int $newId
     * @return boolean
     */
    public function cloneOpData($oldId, $newId)
    {
        global $wpdb;

        /*
         * Cloning 'post_layouts'
         */
        $layouts = $wpdb->get_results($wpdb->prepare(
            "SELECT type, layout FROM `{$wpdb->prefix}optimizepress_post_layouts` WHERE `post_id` = %d AND status = 'publish' ORDER BY modified DESC",
            $oldId
        ), ARRAY_A);

        if (count($layouts) > 0) {
            // Some pages managed to have same types multi-published. We sorted by date and copy only last one. Fix for #101497
            $processedTypes = array();
            foreach ($layouts as $layout) {
                // If we already did the "type" we skip.
                if (in_array($layout['type'], $processedTypes)) {
                    continue;
                } else {
                    $processedTypes[] = $layout['type'];
                }
                $layout['post_id'] = $newId;
                $wpdb->insert($wpdb->prefix . 'optimizepress_post_layouts', $layout);
            }
        }

        /*
         * Cloning 'launchfunnels_pages'
         */
        $funnels = $wpdb->get_results($wpdb->prepare(
            "SELECT funnel_id, step FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` WHERE `page_id` = %d",
            $oldId
        ), ARRAY_A);

        if (count($funnels) > 0) {
            foreach ($funnels as $funnel) {
                $funnel['page_id'] = $newId;
                $wpdb->insert($wpdb->prefix . 'optimizepress_launchfunnels_pages', $funnel);
            }
        }

        return true;
    }
}