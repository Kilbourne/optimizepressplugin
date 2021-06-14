<?php include('style.inc.php'); ?>

<blockquote id="<?php echo $id; ?>" class="testimonial testimonial-style-4 testimonial-style-serif">
    <div class="testimonial-content">
        <img width="26" height="17" alt="" class="quote-tip" src="<?php echo OP_ASSETS_URL ?>images/testimonials/quote-tip.png">
        <?php echo $content ?>
    </div>
    <cite><span>- <?php echo $name ?><?php if ($company != '') echo ', '; ?>
        <?php if (trim($href) != ''): ?>
            <a href="<?php echo $href ?>" target="_blank"><?php echo $company ?></a>
        <?php else: ?>
            <span class="op-testimonial-company"><?php echo $company ?></span>
        <?php endif; ?>
    </span></cite>
</blockquote>