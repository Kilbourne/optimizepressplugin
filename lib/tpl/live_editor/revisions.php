<div id="op-revisions-dialog" class="op-revisions-dialog">
    <h1><?php _e('Page Revisions', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
        <div class="dialog-content typography">
        <?php
            global $wpdb;
            global $revisions_page_id;

            // if (!$revisions_page_id) {
            //     $revisions_page_id = OP_PAGEBUILDER_ID;
            // }

            $table = $wpdb->prefix.'optimizepress_post_layouts';
            $revisions = op_get_page_revisions($revisions_page_id);
        ?>

        <?php if (!empty($revisions)) : ?>
            <div class="op-warning-message">
                <strong><?php _e('Please note:', 'optimizepress'); ?></strong> <?php _e('The OptimizePress Revisions system will autosave pages every 5 minutes and store 10 page revisions.  Revisions of only your main page content is saved, for other settings including Typography, Layout and Page settings the most recent version will always be used.', 'optimizepress'); ?>
            </div>
            <ul class='op-revisions-list'>
            <?php foreach ($revisions as $revision) : ?>
                <li class="op-revisions-list-item">
                    <?php
                        $link = get_permalink($revisions_page_id);
                        if (strpos($link, '?') !== false) {
                            $postLink = $link . '&amp;op-no-admin-bar=1';
                            $previewLink = $link . '&amp;op_revision_id='.$revision->id.'&amp;op-no-admin-bar=1';
                        } else {
                            $postLink = $link . '?op-no-admin-bar=1';
                            $previewLink = $link . '?op_revision_id='.$revision->id.'&amp;op-no-admin-bar=1';
                        }
                    ?>
                    <label class="op-revisions-list-label">
                        <input type="radio" class="op-revisions-radio" name="op-revisions-radio" value="<?php echo $previewLink; ?>">
                        <?php echo __('Revision from ', 'optimizepress') . date('d.m.Y H:i:s', strtotime($revision->modified)) ?> -
                    </label>
                    <a style="color:inherit; text-decoration: underline;" class="op-revision-restore" href="#1" data-revisionid="<?php echo $revision->id; ?>" data-postid="<?php echo $revisions_page_id ?>"><?php _e('Restore', 'optimizepress'); ?></a>
                </li>
            <?php endforeach; ?>
            </ul>
            <div class="op-revisions-diff">
                <table class="op-diff">
                    <thead>
                        <tr>
                            <th class="op-diff-th"><?php _e('Current state', 'optimizepress'); ?></th>
                            <th>&nbsp;</th>
                            <th class="op-diff-th">
                                <?php _e('Revision', 'optimizepress'); ?>
                                <a target="_blank" id="op-open-revision-new-tab" class="op-open-revision-new-tab">(<?php _e('Open in New Tab', 'optimizepress'); ?>)</a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="op-diff-td"><iframe class="op-revisions-iframe" id="op-current-iframe" data-src="<?php echo $postLink; ?>"></iframe></td>
                            <td>&nbsp;</td>
                            <td class="op-diff-td"><iframe class="op-revisions-iframe" id="op-revisions-iframe" src=""></iframe></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p><?php _e('No revisions found for this page.'); ?></p>
        <?php endif; ?>
        </div>
    </div>
</div>