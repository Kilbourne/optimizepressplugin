<?php
global $post;
$class = (defined('OP_LIVEEDITOR') ? ' op-live-editor' : '');
$feature = op_page_option('feature_area','type');
if($feature == 'B'){
    $class .= ' featured-panel-style-4-black';
}
$style = '';
if($landing = op_page_option('landing_bg','image')){
    $style = ' style="background-image:url(\''.$landing.'\');"';
}
?><!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6 featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7 featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8 featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html class="featured-panel-style-4<?php echo $class ?>" <?php language_attributes(); echo $style; ?>> <!--<![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
<link rel="profile" href="http://gmpg.org/xfn/11" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

<?php
    op_set_seo_title();
?>
<?php
// not needed
//wp_enqueue_script(OP_SN.'-backstretch', false, array(OP_SN.'-noconflict-js'), OP_VERSION);
wp_head();
?>
</head>
<body <?php body_class(); ?>>
<?php op_in_body(); ?>
    <?php $GLOBALS['op_feature_area']->load_feature(); ?>
<?php op_page_footer(); ?>
<!-- <script type="text/javascript">
(function($){
    $.backstretch($('html').css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, ""));
})(opjq);
</script> -->
<?php op_footer() ?>
</body>
</html>