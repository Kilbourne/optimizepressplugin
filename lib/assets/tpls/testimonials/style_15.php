<?php include('style.inc.php'); ?>

<blockquote id="<?php echo $id; ?>" class="testimonial-style-6">
    <div class="testimonial-style-6-container"><span><?php echo $content ?></span></div>
    <div class="tip-border"></div><div class="tip"></div>
    <?php
        if (!empty($image)) {
            $img_size = op_get_image_html_attribute($image);
            echo '<div class="testimonial-style-6-img-container"><img src="' . $image.'" alt="' . $name . '" ' . $img_size . '></div>';
        }
    ?>
    <cite><strong><?php echo $name ?></strong>
        <?php if (trim($href) != ''): ?>
            <a href="<?php echo $href ?>" target="_blank"><?php echo $company ?></a>
        <?php else: ?>
            <span class="op-testimonial-company"><?php echo $company ?></span>
        <?php endif; ?>
    </cite>
</blockquote>