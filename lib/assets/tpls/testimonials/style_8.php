<?php include('style.inc.php'); ?>

<blockquote id="<?php echo $id; ?>" class="testimonial testimonial-style-1">
    <?php echo $content ?>
    <cite><?php echo $name ?><?php if ($company != '') echo ', '; ?>
        <?php if (trim($href) != ''): ?>
            <a href="<?php echo $href ?>" target="_blank"><?php echo $company ?></a>
        <?php else: ?>
            <span class="op-testimonial-company"><?php echo $company ?></span>
        <?php endif; ?>
    </cite>
</blockquote>