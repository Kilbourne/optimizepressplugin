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
                'object' => '[images style="0" image="'.OP_LIB_URL.'/content_layouts/predefined/images/Smart-Idea.png" custom_width="Y" width="630" custom_width_val="100" align="center" top_margin="0" full_width="Y"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" align="center"]Your Membership Course or Product Name Here[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              2 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_size="20" font_style="normal" align="center"]Add a brief summary of your product or course here[/headline]',
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
                'object' => '[text_block style="style_1.png" align="left" width="220"]
Welcome

Welcome to the "How To Create Your Own Ebook" Course. My name is James Dyson and I will be taking you through this course over the next 6 weeks[/text_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[divider style="0"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              2 => 
              array (
                'type' => 'element',
                'object' => '[text_block style="style_1.png" align="left" width="220"]
Upcoming Training

You might like to highlight some of your upcoming training here or place other information. You can literally place anything you want into this area with our element browser and LiveEditor system[/text_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
    );