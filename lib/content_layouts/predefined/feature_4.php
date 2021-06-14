<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = 'Theme 1';
$config['screenshot'] = 'LP_1A.jpg';
$config['screenshot_thumbnail'] = 'LP_1A-thumb.jpg';
$config['description'] = 'This is a description field';
$config['header_width'] = 960;

$config['layouts'] = array (
      0 => 
      array (
        'row_class' => 'row five-columns cf ui-sortable section',
        'row_style' => 'background:#f0f0f0;padding-bottom:20px;',
        'row_data_style' => 'eyJiYWNrZ3JvdW5kQ29sb3JTdGFydCI6IiNmMGYwZjAiLCJwYWRkaW5nQm90dG9tIjoiMjAifQ==',
        'children' => 
        array (
          0 => 
          array (
            'col_class' => 'one-fifth column cols narrow',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[images style="0" image="'.OP_LIB_URL.'/content_layouts/predefined/images/Landing-Page-Optimization.png" width="80" align="center" top_margin="0" full_width="Y"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
          1 => 
          array (
            'col_class' => 'four-fifths column cols',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_spacing="0" align="left" top_margin="10"]Lesson 1 - Optimizing Your Landing Pages[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[headline style="1" font_size="20" font_style="normal" align="left"]How to tweak your OptimizePress landing pages for maximum conversions[/headline]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
      1 => 
      array (
        'row_class' => 'row one-column cf ui-sortable section',
        'row_style' => 'padding-top:25px;padding-bottom:5px;',
        'row_data_style' => 'eyJwYWRkaW5nVG9wIjoiMjUiLCJwYWRkaW5nQm90dG9tIjoiNSJ9',
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
                'object' => '[membership_breadcrumbs style="2"]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
      2 => 
      array (
        'row_class' => 'row three-columns cf ui-sortable section',
        'row_style' => 'padding-top:0px;padding-bottom:10px;',
        'row_data_style' => 'eyJwYWRkaW5nVG9wIjoiMCIsInBhZGRpbmdCb3R0b20iOiIxMCJ9',
        'children' => 
        array (
          0 => 
          array (
            'col_class' => 'two-thirds column cols',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[video_player type="youtube" youtube_force_hd="none" width="620" height="349" align="center" margin_top="0" margin_bottom="20"]aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1zOHozVVZuM1hoYw==[/video_player]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
          1 => 
          array (
            'col_class' => 'one-third column cols narrow',
            'children' => 
            array (
              0 => 
              array (
                'type' => 'element',
                'object' => '[feature_box style="17" title="Training Information" font_size="17" font_font="Montserrat" font_style="normal" content_font_size="15" content_font_color="#454545" width="300" top_margin="0" alignment="center"][op_liveeditor_elements] [op_liveeditor_element][custom_html]Difficulty: Beginner

Video Time: 14:20

In this video you will learn how to create your ebook with the planning blueprint[/custom_html][/op_liveeditor_element] [/op_liveeditor_elements][/feature_box]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[button_1 text="View Next Video..." text_size="18" text_color="#ffffff" text_font="Source Sans Pro;google" text_bold="Y" subtext_panel="N" text_shadow_panel="N" styling_width="100" styling_height="13" styling_border_color="#000000" styling_border_radius="6" styling_border_opacity="100" styling_gradient_start_color="#53a540" drop_shadow_panel="N" inset_shadow_panel="N" align="center"/]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
      3 => 
      array (
        'row_class' => 'row one-column cf ui-sortable section',
        'row_style' => 'padding-top: 10px; background-image: none; border-top-width: 0px; border-bottom-width: 0px; background-repeat: no-repeat no-repeat;',
        'row_data_style' => 'eyJwYWRkaW5nVG9wIjoiMTAifQ==',
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
                'object' => '[text_block style="style_1.png" align="left" font_size="17" width="940"]Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.[/text_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
	);