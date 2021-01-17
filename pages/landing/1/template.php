<?php
$class = (defined('OP_LIVEEDITOR') ? ' op-live-editor' : '');
$type = op_page_option('feature_area','type');
if($type == 'H' || $type == 'I'){
    $class .= ' fixed-width-page';
}
?><!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6<?php echo $class ?>" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7<?php echo $class ?>" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8<?php echo $class ?>" <?php language_attributes(); ?>> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html<?php echo $class=='' ? '' : ' class="'.$class.'"' ?> <?php language_attributes(); ?>> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
<link rel="profile" href="http://gmpg.org/xfn/11" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<?php
    op_set_seo_title();
?>
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<?php
if ( is_singular() && get_option( 'thread_comments' ) ) {
    wp_enqueue_script('comment-reply', false, array(OP_SCRIPT_BASE), OP_VERSION);
}
wp_head();
?>
</head>
<body <?php body_class(); ?>>
<?php op_in_body(); ?>
    <div class="container main-content">
        <?php
        op_page_header();
        $GLOBALS['op_feature_area']->load_feature();
        echo $GLOBALS['op_content_layout'];
        op_page_footer();
        ?>
    </div>
<?php op_footer() ?>
</body>
</html>