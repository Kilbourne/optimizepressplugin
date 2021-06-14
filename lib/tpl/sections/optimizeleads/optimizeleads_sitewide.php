<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar op-opleads-sitewide-section cf">

<?php
$opleads_api_key = op_default_attr('optimizeleads_api_key');

$errorClass = '';
$error = op_get_option('optimizeleads_api_key_error');

if ($error) {
    $error_message = $error;
    $errorClass = 'optimizeleads-api-key-error';
} elseif (!empty($api_key_error)) {
    $error_message = op_default_attr('optimizeleads_api_key_error');
    $errorClass = 'optimizeleads-api-key-error';
} elseif (empty($opleads_api_key)) {
    $errorClass = 'optimizeleads-api-key-error';
    $error_message = __('Please enter your OptimizeLeads API key into <em>OptimizeLeads API Key</em> section.', 'optimizepress');
}
?>

<?php if ($errorClass === ''): ?>

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
                    $opl_post_id = get_option('opl_post_id');
                ?>
                <label><input type="checkbox" name="op[sections][optimizeleads_sitewide_filter][all_pages]" value="all_pages" id="optimizeleads_sitewide_filter_all_pages" <?php echo $all_pages; ?> /> <?php _e('All Pages'); ?></label>

                <div class="form-required opl-select-exclude" <?php if(empty($all_pages)) echo 'style="display: none;"'; ?> >


                <label>
                    <?php _e('Exclude Pages'); ?>
                </label>
                <label>

                                <?php
                                    $args = array();
                                      if ( $pages = get_pages( $args )) {
                                        echo '<select id="exclude_pages_select" name="op[sections][optimizeleads_sitewide_filter][exclude_pages]" onchange="opl_append_item(this);" value="exclude_pages">';

                                        echo '<option value="0">Select pages to exclude</option>';
                                        foreach ( $pages as $page ) {
                                          echo '<option value="'.$page->ID.'">'.$page->post_title.'</option>';
                                        }
                                        echo '</select>';
                                      }
                                ?>


                </label>






                                <?php
                                echo '<label id="opl_posts" class="postselect-items">';
                                if (!empty($opl_post_id)) {
                                    foreach ($opl_post_id as $post_id) {
                                        $title = get_the_title($post_id);
                                        echo '<div id="opl_post_ids_group_' . $post_id . '" class="opl-postselect-item">';
                                        echo '  <input type="hidden" name="opl_post_id[]" value="' . $post_id . '">' . $title . '</input>';
                                        echo '  <a href="#" value="' . $post_id . '" class="opl_remove_exclude_item">x</a>';
                                        echo '</div>';
                                    }
                                }
                                echo '</label>';
                                ?>

                        </div>




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

<?php else: ?>

    <div class="optimizeleads-sitewide-container optimizeleads-sitewide-container--empty">
        <span class="error"><?php echo $error_message; ?></span>
    </div>

<?php endif; ?>

</div>

<script type="text/javascript">
    jQuery('#optimizeleads_sitewide_filter_all_pages').change(function(){
        if(this.checked)
            jQuery('.opl-select-exclude').fadeIn('slow');
        else
            jQuery('.opl-select-exclude').fadeOut('slow');

    });

function opl_append_item(sel)
{
    if(sel.value != 0) {
        var id = (sel.value);
        var name = (jQuery("#exclude_pages_select :selected").text());
        if ( !jQuery( "#opl_post_ids_group_"+id ).length ) {
            var markup =  '<div id="opl_post_ids_group_'+id+'" class="opl-postselect-item">';
            markup += '  <input type="hidden" name="opl_post_id[]" value="'+id+'">'+name+'</input>';
            markup += '  <a href="#" value="'+id+'" class="opl_remove_exclude_item">x</a>';
            markup += '</div>';

            jQuery( "#opl_posts" ).append( markup );

            jQuery( ".opl_remove_exclude_item" ).click(function() {
                e.preventDefault();
                var remove_id = jQuery(this).attr("value");
                jQuery("#opl_post_ids_group_" + remove_id).remove();
            });
        }
    }
}

jQuery( ".opl_remove_exclude_item" ).click(function(e) {
    e.preventDefault();
    var remove_id = jQuery(this).attr("value");
    jQuery("#opl_post_ids_group_" + remove_id).remove();
});
</script>
