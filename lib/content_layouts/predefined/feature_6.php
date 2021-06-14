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
        'row_style' => 'background:#f0f0f0;padding-bottom:30px;',
        'row_data_style' => 'eyJiYWNrZ3JvdW5kQ29sb3JTdGFydCI6IiNmMGYwZjAiLCJwYWRkaW5nQm90dG9tIjoiMzAifQ==',
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
                'object' => '[headline style="1" align="center"]Module 1: This Would Be Your Module or Category Name[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_size="20" font_style="normal" align="center"]Add a short description of this module here[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
      1 => 
      array (
        'row_class' => 'row four-columns cf ui-sortable',
        'row_style' => '',
        'row_data_style' => '',
        'children' => 
        array (
          0 => 
          array (
            'col_class' => 'three-fourths column cols',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[membership_page_listings style="2" show_children="Y" columns="1" product="5171" opm="1"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
          1 => 
          array (
            'col_class' => 'one-fourth column cols narrow',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[membership_sidebar style="8"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[membership_sidebar style="9" show_children="Y" title="Nav Title"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              2 => 
              array (
                'type' => 'element',
                'object' => '[divider style="0"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              3 => 
              array (
                'type' => 'element',
                'object' => '[text_block style="style_1.png" align="left" width="220"]
Upcoming Training

You might like to highlight some of your upcoming training here or place other information. You can literally place anything you want into this area with our element browser and LiveEditor system[/text_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              4 => 
              array (
                'type' => 'element',
                'object' => '[membership_sidebar style="9"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
    );