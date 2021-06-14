<?php include('style.inc.php'); ?>

<blockquote id="<?php echo $id; ?>" class="testimonial testimonial-image-style-5 testimonial-style-serif cf">
    <?php if ($image != ''): ?>
        <?php $img_size = op_get_image_html_attribute($image); ?>
        <img src="<?php echo $image ?>" alt="<?php echo $name; ?>" <?php echo $img_size; ?> />
    <?php endif; ?>
    <?php echo $content ?>
    <cite><strong><?php echo $name ?></strong><?php if ($company != '') echo ', '; ?>
        <?php if (trim($href) != ''): ?>
            <a href="<?php echo $href ?>" target="_blank"><?php echo $company ?></a>
        <?php else: ?>
            <span class="op-testimonial-company"><?php echo $company ?></span>
        <?php endif; ?>
    </cite>
</blockquote>