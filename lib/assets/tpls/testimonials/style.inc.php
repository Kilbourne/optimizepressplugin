<?php
    //Init the style string
    $style_str = '';
    $font_style_str = '';
    
    //Set margins
    $style_str .= (!empty_allow_zero($margin_top) ? ' margin-top: '.$margin_top.'px;' : '');
    $style_str .= (!empty_allow_zero($margin_bottom) ? ' margin-bottom: '.$margin_bottom.'px;' : '');
    
    //Add the font settings
    $font_style_str .= (!empty($font_str) ? $font_str : '');
    
    //Finish the style string
    echo (!empty($style_str) || !empty($font_style_str) ? '
        <style>
            #'.$id.'{
                '.$style_str.'
                '.$font_style_str.'
            }
    		
    		#'.$id.' div p{
                '.$style_str.'
                '.$font_style_str.'
            }
            
            #'.$id.' cite{
                '.$font_style_str.'
            }
            
            #'.$id.' cite a{
                '.$font_style_str.'
            }
        </style>
    ' : '');
?>