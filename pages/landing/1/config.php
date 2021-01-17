<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = __('IM classics', 'optimizepress');
$config['screenshot'] = 'LP_1A.jpg';
$config['screenshot_thumbnail'] = 'LP_1A-thumb.jpg';
$config['description'] = __('Classic Internet Marketing style', 'optimizepress');
$config['header_width'] = 960;

$config['header_layout'] = array(
	'menu-positions' => array(
		'alongside' => array(
			'title' => __('Logo With Alongside Navigation', 'optimizepress'),
			'preview' => array(
				'image' => OP_IMG.'previews/navpos_alongside.png',
				'width' => 477,
				'height' => 67
			),
			'link_color' => true,
			'link_selector' => '.banner .nav > li > a',
			'dropdown_selector' => '.banner .nav a',
		),
		'below' => array(
			'title' => __('Banner/Header with navigation below', 'optimizepress'),
			'preview' => array(
				'image' => OP_IMG.'previews/navpos_below.png',
				'width' => 477,
				'height' => 89
			),
		)
	)
);

$config['disable'] = array(
	'layout' => array(
		'landing_bg' => true,
		'size_color' => true,
	)
);

$config['feature_areas'] = array(
	'A' => array(
		//'image' => $theme_url.'styles/LP_1A.jpg',
		'image' => $theme_url . 'styles/im_classic_1-e1374154841969.jpg',
		'width' => 212,
		'height' => 156,
                'tooltip_title' => __('IM Classic Style 1', 'optimizepress'),
                'tooltip_description' => __('Classic Internet Marketing style opt-in page including video and opt-in', 'optimizepress'),
	),
	'B' => array(
		'image' => $theme_url.'styles/im_classic_2.jpg',
		'width' => 212,
		'height' => 156,
                'tooltip_title' => __('IM Classic Style 2', 'optimizepress'),
                'tooltip_description' => __('Classic Internet Marketing style opt-in page with form alongside video', 'optimizepress'),
	),
	'C' => array(
		'image' => $theme_url.'styles/im_classic_3.jpg',
		'width' => 212,
		'height' => 156,
                'tooltip_title' => __('IM Classic Style 3', 'optimizepress'),
                'tooltip_description' => __('Free report opt-in page with small video and content section', 'optimizepress'),
	),
	'D' => array(
		'image' => $theme_url.'styles/im_classic_4.jpg',
		'width' => 212,
		'height' => 156,
                'tooltip_title' => __('IM Classic Style 4', 'optimizepress'),
                'tooltip_description' => __('Opt-in page with video fakeout and content area', 'optimizepress'),
	),
	'E' => array(
		'image' => $theme_url.'styles/im_classic_5.jpg',
		'width' => 212,
		'height' => 156,
                'tooltip_title' => __('IM Classic Style 5', 'optimizepress'),
                'tooltip_description' => __('High impact page with animated arrows and double opt-in forms', 'optimizepress'),
	)
);
$config['default_config'] = array(
	'typography' => array(
		'font_elements' => array(
			'landing_feature_arrows' => array(
				'font' => 'PT Sans Narrow'
			)
		)
	)
);