<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
    <p class="op-warning-message op-warning-message--spaced">
        <?php
        echo __('<strong>Important:</strong> We strongly recommend using our new OverlayPop Feature for triggering an OverlayOptimizer element on the exit of your page.  Using a hard exit redirect is often against the terms of many advertising networks (e.g. Facebook) and can lead to your account being banned if you drive traffic to pages which include this feature.', 'optimizepress');
        ?>
    </p>
    <p class="op-micro-copy"><?php _e('Use this option if you want anyone trying to exit your page via the browser close buttons to be shown a message and redirected to a URL of your choosing', 'optimizepress') ?></p>
    <label for="<?php echo $fieldid ?>url" class="form-title"><?php _e('Redirect to URL') ?></label>
    <p class="op-micro-copy"><?php _e('Enter the URL that your users browser should be redirected to on exit.') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[url]" id="<?php echo $fieldid ?>url" value="<?php op_page_attr_e($section_name,'url') ?>" />

    <label for="<?php echo $fieldid ?>message" class="form-title"><?php _e('Redirect Browser Message', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter the message to be shown to the user in a browser pop when the user tries to exit. This would normally be a message advising if they want to close their browser or be redirected', 'optimizepress') ?></p>
    <textarea id="<?php echo $fieldid ?>message" name="<?php echo $fieldname ?>[message]"><?php echo str_replace('\&quot;', '&quot;', (op_page_attr($section_name,'message'))); ?></textarea>
</div>