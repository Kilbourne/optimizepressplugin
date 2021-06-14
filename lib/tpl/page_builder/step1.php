<?php echo $this->load_tpl('page_builder/header');?>

<h2><?php _e('Name Your Page', 'optimizepress') ?></h2>
<p><?php _e('Enter the title for your page here - this will be used in the Wordpress interface', 'optimizepress') ?></p>
<input type="text" name="op[page][name]" id="op_page_name" value="<?php echo op_attr($page_title) ?>" />

<h2><?php _e('Page URL/Permalink', 'optimizepress') ?></h2>
<p><?php printf(__('Customize your page permalink below. Please ensure your permalinks are set to %1$s in your %2$s.', 'optimizepress'),'/%postname%/','<a href="options-permalink.php" target="_blank">'.__('Wordpress Permalinks Settings', 'optimizepress').'</a>') ?>
<?php
if($error = $this->error('page_name')){
    echo '<br><br><span class="error">'.$error.'</span>';
} elseif($permalinks_disabled){
    echo '<br><br><span class="error">'.__('You must enable permalinks in order for this to work.', 'optimizepress').'</span>';
}
?></p>

<input type="text" name="op[page][slug]" id="op_page_slug" value="<?php echo op_attr($page_name) ?>" />
<div id="op_ajax_checker">
    <a href="#check" class="check-availability"><?php _e('Check availability', 'optimizepress') ?></a>
    <a href="#cancel" class="op-hidden check-availability-cancel"><?php _e('Cancel', 'optimizepress') ?></a>
    <img class="op-bsw-waiting" src="images/wpspin_light.gif" alt="" style="position: relative; top: -5px;" />
    <!--<span class="success op-hidden"><?php _e('Valid Page URL', 'optimizepress') ?></span>
    <span class="error op-hidden"><?php _e('Page URL already in use', 'optimizepress') ?></span>-->
    <span class="success op-hidden" style="position: relative; top: -10px; margin-left: 5px; color: green; font-weight: bold;">&#x2713;&nbsp; <?php _e('Available', 'optimizepress'); ?></span>
    <span class="error op-hidden" style="position: relative; top: -10px; margin-left: 5px; color: red; font-weight: bold;">&#x2717;&nbsp; <?php _e('Unavailable', 'optimizepress'); ?></span>
</div>

<div class="cf"></div>

<h2><?php _e('Upload a Page Thumbnail (optional)', 'optimizepress') ?></h2>
<p><?php _e('Upload a thumbnail for your page (Thumbnails should be 300x170 pixels)', 'optimizepress') ?></p>
<?php if (!isset($page_thumbnail_preset)) $page_thumbnail_preset = ''; ?>
<?php if (!isset($page_thumbnail)) $page_thumbnail = ''; ?>
<?php op_thumb_gallery('op[page][thumbnail_preset]', $page_thumbnail_preset, 'page_thumbs') ?>
<?php op_upload_field('op[page][thumbnail]',$page_thumbnail) ?>

<h2><?php _e('Select Page Presets', 'optimizepress') ?></h2>
<p><?php _e('Use the options below to create a blank page or use one of your pre-defined presets or content templates', 'optimizepress') ?></p>
<div id="preset-option">
<?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$preset_options,'classextra'=>'preset-type-select')); ?>
</div>
<?php if(isset($presets)): ?>
<div id="preset-option-preset" class="preset-option op-hidden">
    <h2><?php _e('Select a page preset', 'optimizepress') ?></h2>
    <p><?php _e('If you have previously created a page and saved the PageBuilder settings as a preset you can load that preset here.', 'optimizepress') ?></p>
    <?php op_show_warning(__('Using a saved Preset will load a complete set of options for your Page including all PageBuilder settings, and override any current settings for your page. When you click next on this page you will be loaded straight into the LiveEditor to edit your page', 'optimizepress'),true) ?>
    <?php echo $presets ?>
</div>
<?php endif; ?>
<div id="preset-option-content_layout" class="preset-option op-hidden">
    <h2><?php _e('Select a Pre-Made Content Template', 'optimizepress') ?></h2>
    <p><?php _e('Select the layout you want from below and when your page is loaded in the LiveEditor the layout and content will be ready for you to customize.', 'optimizepress') ?></p>
    <?php op_show_warning(__('Please note you will still need to add your header in the PageBuilder process and you are free to tweak any of the settings (we do not recommend changing the template settings unless you&rsquo;re familiar with these options)', 'optimizepress'),true) ?>
    <div class="op-hidden" id="upload_new_layout_container">
        <a href="#load" id="view_layouts"><?php _e('View Uploaded Templates', 'optimizepress') ?></a>
        <div class="op-info-box">
            <iframe src="<?php menu_page_url(OP_SN.'-page-builder', true) ?>&amp;section=content_upload&amp;info_box=yes" width="700" height="170"></iframe>
        </div>
    </div>
    <div id="content_layout_container">
        <a href="#upload" id="upload_new_layout"><?php _e('Upload Content Template', 'optimizepress') ?></a>
        <div id="content_layout_container_list">
        <?php
        if(isset($content_layouts)):
        echo $content_layouts;
        endif;
        ?>
        </div>
        <?php echo (defined('OP_PAGEBUILDER_ID')?op_tpl('live_editor/layouts/keep_options'):'') ?>
    </div>
</div>
<?php echo $this->load_tpl('page_builder/footer'); ?>
