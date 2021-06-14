<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = 'Theme 1';
$config['screenshot'] = 'LP_1A.jpg';
$config['screenshot_thumbnail'] = 'LP_1A-thumb.jpg';
$config['description'] = 'This is a description field';
$config['header_width'] = 960;

$config['layouts'] = array (
      0 => 
      array (
        'row_class' => 'row one-column cf ui-sortable section',
        'row_style' => 'background-image: linear-gradient(rgb(38, 151, 218) 0%, rgb(32, 130, 188) 100%); padding-top: 20px; padding-bottom: 10px; border-top-width: 0px; border-bottom-width: 0px; background-position: initial initial; background-repeat: initial initial;',
        'row_data_style' => 'eyJiYWNrZ3JvdW5kQ29sb3JTdGFydCI6IiMyNjk3ZGEiLCJiYWNrZ3JvdW5kQ29sb3JFbmQiOiIjMjA4MmJjIiwicGFkZGluZ1RvcCI6IjIwIiwicGFkZGluZ0JvdHRvbSI6IjEwIn0=',
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
                'object' => '[headline style="1" font_size="28" font_style="bold" font_color="#ffffff" align="center"]This Is A Colored Section Title To Break Up Your Page[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
    );