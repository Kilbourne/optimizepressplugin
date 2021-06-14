<?php
echo  '<ul class="recent-posts-style-'.$style.'">';
foreach( $data['recent_posts'] as $recent ){
    $img_src = wp_get_attachment_image_src(get_post_thumbnail_id($recent['ID']), 'single-post-thumbnail');

    $img_size = ' width="' . $img_src[1] . '" height="' . $img_src[2] . '" ';
    $img_src = $img_src[0];

    echo '<li>
                <div class="thumb"><img src="' . $img_src . '" class="scale-with-grid" ' . $img_size . ' /></div>
                <div class="content">
                    <a href="'.get_permalink($recent["ID"]).'">'.$recent["post_title"].'</a>
                    <span>'.date(OP_DATE_POSTS, strtotime($recent['post_date'])).'</span>
                </div>
         </li>';
}

echo '</ul>';