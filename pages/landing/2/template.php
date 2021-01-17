<?php

global $post;

$class = (defined('OP_LIVEEDITOR') ? ' op-live-editor' : '');

$feature = op_page_option('feature_area','type');

$box_width = op_page_option('size_color', 'box_width');
$box_color_start = op_page_option('size_color', 'box_color_start');
$box_color_end = op_page_option('size_color', 'box_color_end');
$box_style = 'width:' . $box_width . 'px;' . op_generate_css_background($box_color_start, $box_color_end);

$style = '';
if($landing = op_page_option('landing_bg','image')){
    $style = ' style="background-image:url(\''.$landing.'\');"';
}
?><!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6 featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7 featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8 featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html class="featured-panel-style-2<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
<link rel="profile" href="http://gmpg.org/xfn/11" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

<?php
    op_set_seo_title();
?>
<?php
//wp_enqueue_script(OP_SN.'-backstretch', false, array(OP_SN.'-noconflict-js'), OP_VERSION);
wp_head();
?>
</head>
<body <?php body_class(); ?>>
<?php op_in_body(); ?>
    <div class="floating-featured-panel floating-featured-panel-fluid main-content" style="<?php echo $box_style; ?>">
    <?php
        echo $GLOBALS['op_content_layout'];
        op_page_footer();
    ?>
    </div>
    <!-- <script type="text/javascript">
    (function($){
        $.backstretch($('html').css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, ""));
    })(opjq);
    </script> -->
<?php op_footer() ?>
</body>
</html>