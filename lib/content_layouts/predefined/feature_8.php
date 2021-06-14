<?php  if ( ! defined('OP_DIR')) exit('No direct script access allowed');
$config['name'] = 'Theme 1';
$config['screenshot'] = 'LP_1A.jpg';
$config['screenshot_thumbnail'] = 'LP_1A-thumb.jpg';
$config['description'] = 'This is a description field';
$config['header_width'] = 960;

$config['layouts'] = array (
      0 => 
      array (
        'row_class' => 'row two-columns cf ui-sortable',
        'row_style' => '',
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
                'object' => '[video_player type="youtube" youtube_force_hd="none" width="440" height="248" align="center" margin_top="0" margin_bottom="20"]aHR0cDovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PUtITzRMVXBEQ1BZ[/video_player]',
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
                'object' => '[text_block style="style_1.png" align="left" bottom_margin="5" width="460"]

Enter your name and email below now for instant access...
[/text_block]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
              1 => 
              array (
                'type' => 'element',
                'object' => '[optin_box style="7" alignment="center" email_default="Enter your email address" integration_type="email" name_default="Enter your first name"][optin_box_field name="headline"][/optin_box_field][optin_box_field name="paragraph"]TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gRG9uZWMgdmVsIG51bmMgbm9uIGxhY3VzIHZlbmVuYXRpcyBjb21tb2RvLg==[/optin_box_field][optin_box_field name="privacy"]We value your privacy and would never spam you[/optin_box_field][optin_box_field name="top_color"]undefined[/optin_box_field][optin_box_button type="0" button_below="Y"]Get Instant Access![/optin_box_button] [/optin_box]',
                'element_class' => 'element-container cf',
                'element_data_style' => '',
              ),
            ),
          ),
        ),
      ),
    );