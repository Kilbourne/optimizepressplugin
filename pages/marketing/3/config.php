<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = __('Template Style 3 - Rounded Content', 'optimizepress');
$config['screenshot'] = 'styles/ms-3b.jpg';
$config['screenshot_thumbnail'] = 'styles/ms-3a.jpg';
$config['description'] = __('This template includes a content area with rounded corners to draw the eye into the page', 'optimizepress');
$config['header_width'] = 1020;

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