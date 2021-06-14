<div class="order-box-3"<?php echo $box_style; ?>>
    <div class="order-box-3-internal cf">
        <div class="order-box-header">
            <?php $img_size = op_get_image_html_attribute(OP_ASSETS_URL . 'images/order_box/green-tick.png'); ?>
            <h2><img src="<?php echo OP_ASSETS_URL; ?>images/order_box/green-tick.png" alt="" <?php echo $img_size; ?> /> <?php echo $title; ?></h2>
        </div>
        <div class="order-box-content">
            <?php echo $content ?>
        </div>
    </div>
</div>