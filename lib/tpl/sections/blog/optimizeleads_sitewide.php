<?php $opleads_api_key = op_default_attr('optimizeleads_api_key'); ?>

<?php if (!empty($opleads_api_key)): ?>

    <div class="optimizeleads-sitewide-container">
        <label for="optimizeleads_sitewide_uid" class="form-title"><?php _e('OptimizeLeads Site-Wide Configuration', 'optimizepress') ?></label>

        <img class="waiting optimizeleads-sitewide-loader" id="optimizeleads-sitewide-loader" src="<?php echo esc_url( admin_url( 'images/wpspin_light.gif' ) ); ?>" alt="" />

        <div class="optimizeleads-sitewide-options hidden" id="optimizeleads-sitewide-options">
            <p class="op-micro-copy">
                <?php _e('Please select a box you want to use throught your pages.', 'optimizepress') ?><br />
                <select name="op[sections][optimizeleads_sitewide_uid]" id="optimizeleads_sitewide_uid" data-current-value="<?php echo op_default_attr('optimizeleads_sitewide_uid'); ?>">
                    <option value="none">None</option>
                </select>

            </p>
            <div class="op-warning-message status-warning"><?php _e("This list shows only boxes that are automatically triggered. Boxes triggered on link click won't be shown here."); ?></div>

            <p class="op-micro-copy">
                <?php _e("Show selected box on:", 'optimizepress') ?><br />

                <?php
                    $all_pages_filter = op_default_attr('optimizeleads_sitewide_filter', 'all_pages');
                    $all_pages = !empty($all_pages_filter) ? 'checked="checked"' : '';
                ?>
                <label><input type="checkbox" name="op[sections][optimizeleads_sitewide_filter][all_pages]" value="all_pages" <?php echo $all_pages; ?> /> <?php _e('All Pages'); ?></label>


                <?php
                    $blog_posts_filter = op_default_attr('optimizeleads_sitewide_filter', 'blog_posts');
                    $blog_posts = !empty($blog_posts_filter) ? 'checked="checked"' : '';
                ?>
                <label><input type="checkbox" name="op[sections][optimizeleads_sitewide_filter][blog_posts]" value="blog_posts" <?php echo $blog_posts; ?> /> <?php _e('All Blog Posts'); ?></label>

                <?php
                    $le_pages_filter = op_default_attr('optimizeleads_sitewide_filter', 'live_editor_pages');
                    $le_pages = !empty($le_pages_filter) ? 'checked="checked"' : '';
                ?>
                <label><input type="checkbox" name="op[sections][optimizeleads_sitewide_filter][live_editor_pages]" value="live_editor_pages" <?php echo $le_pages; ?> /> <?php _e('All LiveEditor Pages'); ?></label>


                <?php
                    $home_filter = op_default_attr('optimizeleads_sitewide_filter', 'home');
                    $home = !empty($home_filter) ? 'checked="checked"' : '';
                ?>
                <label><input type="checkbox" name="op[sections][optimizeleads_sitewide_filter][home]" value="home" <?php echo $home; ?> /> <?php _e('Home Page'); ?></label>
                </p>

                <p class="op-micro-copy">
                <?php
                    _e("Show selected box on posts with following categories:", 'optimizepress');
                    $categories = get_categories();
                    $cat_html = '';
                    foreach ($categories as $category) {
                        $category_checked_filter = op_default_attr('optimizeleads_sitewide_filter_category', $category->cat_ID);
                        $category_checked = !empty($category_checked_filter) ? 'checked="checked"' : '';
                        echo '<label><input type="checkbox" name="op[sections][optimizeleads_sitewide_filter_category][' . $category->cat_ID . ']" value="' . $category->cat_ID . '" ' . $category_checked . ' /> ' . $category->cat_name . '</label>';
                    }
                ?>
            </p>
        </div>
        <div class="clear"></div>
    </div>

<?php endif; ?>