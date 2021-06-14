<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = 'Theme 1';
$config['screenshot'] = 'LP_1A.jpg';
$config['screenshot_thumbnail'] = 'LP_1A-thumb.jpg';
$config['description'] = 'This is a description field';
$config['header_width'] = 960;

$config['layouts'] =  array (
      0 => 
      array (
        'row_class' => 'row two-columns cf ui-sortable',
        'row_style' => 'background-image: none; border-top-width: 0px; border-bottom-width: 0px; border-style: solid; background-position: initial initial; background-repeat: no-repeat no-repeat;',
        'row_data_style' => 'e30=',
        'children' => 
        array (
          0 => 
          array (
            'col_class' => 'one-half column cols',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_size="20" font_color="#383838" align="left"]Discover the secrets to using responsive design to increase conversions and boost your profits[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[text_block style="style_1.png" align="left" width="460"]Aliquam erat volutpat. Suspendisse vulputate ligula id nisl placerat et elementum risus scelerisque. Phasellus consectetur tempor lectus eget consequat. Integer egestas varius odio, quis bibendum risus placerat iaculis.[/text_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
          1 => 
          array (
            'col_class' => 'one-half column cols',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[bullet_block style="size-16" small_icon="1.png" width="" alignment="center"]

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Aenean eget purus egestas, vulputate erat imperdiet.
    Sed iaculis sem eu facilisis malesuada.
    Ut a ligula vitae ante vulputate consectetur quis eu urna.

[/bullet_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
    );