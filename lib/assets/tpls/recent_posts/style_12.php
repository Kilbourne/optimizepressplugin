<?php
include ('style.inc.php');


$html = '';

$html .= '<div id = "' . $data["id"] . '" class="recent-posts recent-posts-style-' . $data["style"] . '">
            <div class="title" >
                <p>' . $data['title'] . '</p>
            </div>
            <ul class="posts">';
                foreach ($data['recent_posts'] as $recent) {
                    $img_src = wp_get_attachment_image_src(get_post_thumbnail_id($recent['ID']), 'single-post-thumbnail');
                    if (empty($img_src)) $img_src[0] = OP_ASSETS_URL . 'images/recent_posts/default.jpg';

                    $categories = '';
                    foreach ($recent['categories'] as $category) {
                        $categories .= '<li><a href="' . $category->url . '">' . $category->name . '</a></li>';
                    }

                    $html .= '<li class="' . $data["rows"] . '">
                                <div class="frame">
                                    <div class="content">
                                        <div class="up-post-section">
                                             <div class="post-image-frame">
                                                <a href="' . get_permalink($recent["ID"]) . '">
                                                    <div class="post-image" style="background-image: url(' . $img_src[0] . ')"></div>
                                                </a>
                                             </div>
                                             <a href="' . get_permalink($recent["ID"]) . '">
                                                <p class="post-title">' . substr($recent['post_title'], 0, 60) . '</p>
                                             </a>';
                                             if ($data['text_excerpt']) {
                                                 $content = strip_shortcodes(wp_strip_all_tags($recent['post_content']));
                                                 $html .= '<p class="post-description">' . substr($content, 0, 100) . '</p>';
                                             }
                               $html .= '</div>
                                    </div>';
                                    if($data["hide_author"] !== 'Y') {
                                        $html .= '<div class="down-post-section">
                                            <div class="line"></div>
                                               <div class="meta-post-section">
                                                   <div class="left">
                                                        <div class="author-image" style="background-image: url(' . $recent['avatar'] . ')"></div>
                                                   </div>
                                                   <div class="right">
                                                        <a href="' . $recent['author_url'] . '" class="author-fullname">' . $recent['full_name'] . '</a>
                                                        <ul class="category">' . $categories . '</ul>
                                                   </div>
                                               </div>
                                        </div>  
                                    </div>';
                                    }
                                $html .= '</li>';
                }
$html .= '</ul></div>';
$html .= '<script>
                                    (function($) {
                                        var element = $("#' . $data["id"] . ' .posts li");    
                                        var elementClass = element.eq(0).attr("class");
                                        var postImage = $("#' . $data["id"] . ' .post-image");
                                        switch (elementClass){
                                            case "one":
                                                postImage.css("height", "300px");
                                                break;
                                            case "two":
                                                postImage.css("height", "300px");
                                                break;
                                            case "three":
                                                postImage.css("height", "250px");
                                                break;
                                            case "four":
                                                postImage.css("height", "200px"); 
                                                break;
                                        }
                                        if ("Y" != "' . $data["text_excerpt"] . '") {
                                           $("#' . $data["id"] . ' .post-title").css("margin", "15px");
                                        }
                                    }(opjq));
                                </script>';

echo $html;