<?php echo $this->load_tpl('page_builder/header');?>
<h2><?php _e('Select a Page Type', 'optimizepress') ?></h2>
<?php op_help_vid(array('pages','theme_type')) ?>
<div class="clear"></div>
<p><?php _e('Choose the type of page you want to create. You can choose your template design on the next page.', 'optimizepress') ?></p>
<?php
echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$theme_types,'classextra'=>'theme-type-select'));
echo $this->load_tpl('page_builder/footer'); ?>