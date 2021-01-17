<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = __('Template Style 2 - Flat Border', 'optimizepress');
$config['screenshot'] = 'styles/ms-2b.jpg';
$config['screenshot_thumbnail'] = 'styles/ms-2a.jpg';
$config['description'] = __('This fixed width template is perfect for pages using a header image', 'optimizepress');
$config['header_width'] = 1060;

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