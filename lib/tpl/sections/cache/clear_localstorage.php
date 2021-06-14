<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar js-op-hide-form-actions cf">

    <p class="op-micro-copy"><?php _e('If you are experiencing issues with images and other resources after migrating the site on the same domain (to a different folder), this can be caused by OptimizePress Cache, used to store common element configuration settings into LocalStorage. Clearing OptimizePress Element Cache will fix these issues for the current browser you are using (this cache is browser and domain dependent).', 'optimizepress'); ?></p>
    <p class="op-micro-copy"><?php _e("<strong>Please note:</strong> This will clear only local cache in the browser you currently have opened. All other browser and devices will remain unaffected.", "optimizepress"); ?></p>
    <p><a id="js-op-clear-element-cache" class="op-btn">Clear Element Cache</a></p>
    <script>
        opjq(document).ready(function ($) {
            $deleteButton = $('#js-op-clear-element-cache');
            $deleteButton.on('click', function () {
                $('.js-op-clear-element-cache-message').remove();
                if (window.confirm("Are you sure you want to delete the OptimizePress Element Cache on this browser?")) {
                    OptimizePress.localStorage.clearAll();
                    OptimizePress.ajax.clearElementsCache().then(function(response) {
                        $deleteButton.after('<p class="op-msg-success js-op-clear-element-cache-message">OptimizePress Element Cache Cleared.</p>')
                    });
                }
            });
        });
    </script>
</div>