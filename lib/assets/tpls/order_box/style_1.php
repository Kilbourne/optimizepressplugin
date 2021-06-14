<div class="order-box-1"<?php echo $box_style; ?>>
    <div class="order-box-header">
        <?php $img_size = op_get_image_html_attribute(OP_ASSETS_URL.'images/order_box/titles_1/' . $title); ?>
        <h2><img src="<?php echo OP_ASSETS_URL.'images/order_box/titles_1/' . $title; ?>" alt="<?php echo $title_1_alt; ?>" <?php echo $img_size; ?> /></h2>

        <?php $img_size = op_get_image_html_attribute(OP_ASSETS_URL.'images/order_box/headers_1/' . $header); ?>
        <img alt="<?php echo $header_1_alt; ?>" src="<?php echo OP_ASSETS_URL.'images/order_box/headers_1/' . $header; ?>" <?php echo $img_size; ?> />
    </div>
    <div class="order-box-content">
        <?php echo $content ?>
    </div>
</div>