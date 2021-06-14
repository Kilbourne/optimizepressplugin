<?php
global $post;
$class = (defined('OP_LIVEEDITOR') ? ' op-live-editor' : '');
?><!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6 lf-4a<?php echo $class ?>" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7 lf-4a<?php echo $class ?>" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8 lf-4a<?php echo $class ?>" <?php language_attributes(); ?>> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html class="lf-4a<?php echo $class; ?>" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
<link rel="profile" href="http://gmpg.org/xfn/11" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

<?php
    op_set_seo_title();
?>
<?php
if ( is_singular() && get_option( 'thread_comments' ) )
    wp_enqueue_script('comment-reply', false, array(OP_SN.'-noconflict-js'), OP_VERSION);
wp_head();
?>
</head>
<body <?php body_class(); ?>>
<?php op_in_body(); ?>
    <div class="container">
        <?php
        op_page_header();
        $GLOBALS['op_feature_area']->load_feature();
        op_page_feature_title();
        ?>
        <div class="main-content">
            <?php
            if($GLOBALS['op_feature_enabled'] === true){
                $img = op_page_img('launch-funnel/',true,'global');
                echo '<img src="'.$img.'left-corner.png" class="left-corner" alt="left-corner" width="13" height="13" /><img src="'.$img.'right-corner.png" class="right-corner" alt="right-corner" width="13" height="13" />';
            }
            ?>
            <div class="row main-content-area cf">
                <?php echo $GLOBALS['op_content_layout']; ?>
            </div>
        </div>
        <?php op_page_footer(); ?>
    </div>
<?php op_footer() ?>
</body>
</html>