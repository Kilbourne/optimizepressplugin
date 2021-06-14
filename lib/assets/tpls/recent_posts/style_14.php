<?php
include ('style.inc.php');

$html = '';

$html .= '<div id = "' . $data["id"] . '" class="recent-posts recent-posts-style-' . $data["style"] . '">
                            <div class="title" >
                                <p>' . $data['title'] . '</p>
                            </div>
                            <ul class="posts">';
foreach ($data['recent_posts'] as $recent) {
    $img_src = wp_get_attachment_image_src(get_post_thumbnail_id($recent['ID']),
        'single-post-thumbnail');
    if (empty($img_src)) {
        $img_src[0] = OP_ASSETS_URL . 'images/recent_posts/default.jpg';
    }
    $html .= '<li class="' . $data["rows"] . '">
                              <div class="frame">
                                <div class="content">
                                    <a class="img-link" href="' . get_permalink($recent["ID"]) . '">
                                        <div class="left" style="background-image: url(' . $img_src[0] . ')"></div>
                                    </a>
                                    <div class="right">
                                        <a href="' . get_permalink($recent["ID"]) . '">
                                            <p class="title">' . substr($recent['post_title'], 0, 60) . '</p>
                                        </a>';

    if ($data['text_excerpt']) {
        $content = strip_shortcodes(wp_strip_all_tags($recent['post_content']));
        $html .= '<p class="description">' . substr($content, 0, 100) . '</p>';
    }

    $html .= '</div></a></div><div class="line"></div></li>';
}

$html .= '</ul></div>';

echo $html;
    
