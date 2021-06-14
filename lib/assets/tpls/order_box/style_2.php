<div class="order-box-2"<?php echo $box_style; ?>>
    <div class="order-box-2-internal cf">
        <div class="order-box-header">
            <?php $img_size = op_get_image_html_attribute(OP_ASSETS_URL . 'images/order_box/titles_2/' . $title); ?>
            <img src="<?php echo OP_ASSETS_URL . 'images/order_box/titles_2/' . $title; ?>" alt="<?php echo $title_2_alt; ?>" <?php echo $img_size; ?> />
        </div>
        <div class="order-box-content">
        <?php echo $content ?>
        </div>
    </div>
</div>