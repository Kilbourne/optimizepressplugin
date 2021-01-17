<?php include ('style.inc.php'); ?>

<div id="<?php echo $id; ?>" class="feature-box-creator feature-box-creator-style-1"<?php echo $block_styles; ?>>
    <?php $epicbox_title = ' data-epicbox-title="' . __('Feature Box Creator Content', 'optimizepress') . '" '; ?>
    <div class="feature-box-content cf"<?php echo $content_styles . $epicbox_title; ?>"><?php echo $content; ?></div>
</div>