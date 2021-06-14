<?php include('style.inc.php'); ?>

<blockquote id="<?php echo $id; ?>" class="testimonial testimonial-image-style-2">
    <?php if ($image != ''): ?>
        <?php $img_size = op_get_image_html_attribute($image); ?>
        <img src="<?php echo $image; ?>" alt="<?php $name; ?>" <?php echo $img_size; ?> />
    <?php endif; ?>
    <img width="27" height="18" class="quote-tip" alt="" src="<?php echo OP_ASSETS_URL ?>images/testimonials/quote-tip-blue.png">
    <div class="testimonial-content">
        <?php echo $content ?>
        <cite><strong><?php echo $name ?></strong> <br />
            <?php if (trim($href) != ''): ?>
                <a href="<?php echo $href ?>" target="_blank"><?php echo $company ?></a>
            <?php else: ?>
                <span class="op-testimonial-company"><?php echo $company ?></span>
            <?php endif; ?>
        </cite>
    </div>
</blockquote>