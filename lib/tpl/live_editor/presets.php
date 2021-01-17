<form id="le-presets-dialog">
    <h1><?php _e('Presets', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
        <div class="op-actual-lightbox-content cf op-type-switcher-container">
            <select name="preset_type" id="preset_type" class="op-type-switcher">
                <option value="new"><?php _e('Create New', 'optimizepress') ?></option>
                <option value="overwrite"><?php _e('Overwrite', 'optimizepress') ?></option>
            </select>
            <p class="op-micro-copy"><?php _e('Please note this will also save the current page.', 'optimizepress') ?></p>
            <div class="op-type op-type-new">
                <label for="preset_new"><?php _e('Title:', 'optimizepress') ?></label>
                <input type="text" name="preset_new" value="" id="preset_new" />
            </div>
            <div class="op-type op-type-overwrite">
                <?php echo $preset_select; ?>
            </div>
        </div>
    </div>
    <div class="op-insert-button cf">
        <button type="submit" class="editor-button"><span><?php _e('Save', 'optimizepress') ?></span></button>
    </div>
</form>