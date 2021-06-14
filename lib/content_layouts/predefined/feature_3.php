<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = 'Theme 1';
$config['screenshot'] = 'LP_1A.jpg';
$config['screenshot_thumbnail'] = 'LP_1A-thumb.jpg';
$config['description'] = 'This is a description field';
$config['header_width'] = 960;

$config['layouts'] = array (
      0 => 
      array (
        'row_class' => 'row one-column cf ui-sortable',
        'row_style' => '',
        'row_data_style' => '',
        'children' => 
        array (
          0 => 
          array (
            'col_class' => 'one-column column cols',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_size="40" font_color="#37a5d7" align="center"]Discover How You Can Build Sites Like This In Minutes...Without Code or Technical Skills[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_size="20" font_style="normal" font_color="#616161" align="center"]The Secret Software Top Online Marketers & Small Businesses Are Using To Create Pages Fast[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
	);