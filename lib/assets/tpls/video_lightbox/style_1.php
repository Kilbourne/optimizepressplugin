<div class="video-lightbox-link video-lightbox-style-1 <?php echo $video_type; ?>" style="width:<?php echo $placeholder_width; ?>px; <?php echo $align; ?>">
        <div class="frame-style-inner">
            <a href="<?php echo $url; ?>" title="<?php echo __('Click to play', 'optimizepress'); ?>" rel="prettyPhoto" data-width="<?php echo $width; ?>" data-height="<?php echo $height; ?>" data-video="<?php echo $videoUrl; ?>" data-video1="<?php echo $videoUrl1; ?>" data-video2="<?php echo $videoUrl2; ?>" data-autobuffer="<?php echo $auto_buffer; ?>" data-hide-controls="<?php echo $hide_controls; ?>" data-autoplay="<?php echo $auto_play; ?>">
                    <div class="play-icon"></div>
                    <img alt="" src="<?php echo $placeholder; ?>" width="<?php echo $placeholder_width; ?>" height="<?php echo $placeholder_height; ?>" style="width:<?php echo $placeholder_width; ?>px; height: <?php echo $placeholder_height; ?>px;" />
            </a>
        </div>
        <?php echo (empty($inlinecontent) ? '' : $inlinecontent); ?>
</div>