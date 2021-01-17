<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = __('Template Style 1 - Full-Width', 'optimizepress');
$config['screenshot'] = 'styles/ms-1b.jpg';
$config['screenshot_thumbnail'] = 'styles/ms-1a.jpg';
$config['description'] = __('This borderless template is perfect for clean designs with lots of white space', 'optimizepress');
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