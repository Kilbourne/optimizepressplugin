<?php
include ('style.inc.php');

$html = '';

$html .= '<div id = "' . $data["id"] . '" class="recent-posts recent-posts-style-' . $data["style"] . '">
                            <div class="title" >
                                <p>' . $data['title'] . '</p>
                            </div>
                            <ul class="posts">';

foreach ($data['recent_posts'] as $recent) {
    $img_src = wp_get_attachment_image_src(get_post_thumbnail_id($recent['ID']),'single-post-thumbnail');
    if (empty($img_src)) {$img_src[0] = OP_ASSETS_URL . 'images/recent_posts/default.jpg';}

    $categories = '';
    foreach ($recent['categories'] as $category) {
        $categories .= '<li><a href="' . $category->url . '">' . $category->name . '</a></li>';
    }

    $html .= '<li class="' . $data["rows"] . '">
                                <div class="frame">
                                    <a class="left" href="' . get_permalink($recent["ID"]) . '">
                                        <div class="post-image-frame">
                                             <div class="post-image" style="background-image: url(' . $img_src[0] . ')"></div>
                                        </div>
                                    </a>
                                    <div class="right">
                                        <div class="up">
                                            <a href="' . get_permalink($recent["ID"]) . '">
                                                <p class="post-title">' . substr($recent['post_title'], 0, 60) . '</p></a>';
    if ($data['text_excerpt']) {
        $content = strip_shortcodes(wp_strip_all_tags($recent['post_content']));
        $html .= '<p class="post-description">' . substr($content, 0, 100) . '</p>';
    }
    $html .= '</div>';
    if($data["hide_author"] !== 'Y') {
            $html .= '<div class="down">
                                           <div class="line"></div>
                                           <div class="meta">
                                               <div class="down-left">
                                                    <div class="author-image" style="background-image: url(' . $recent['avatar'] . ')"></div>
                                               </div>
                                               <div class="down-right">
                                                     <a href="' . $recent['author_url'] . '" class="author-fullname">' . $recent['full_name'] . '</a>
                                                    <ul class="category">' . $categories . '</ul>
                                               </div>
                                            </div>
                                        </div>
                                    </div>';
            }
            $html .= '</div>
                                 </li>';
}
$html .= '</ul></div>';

echo $html;