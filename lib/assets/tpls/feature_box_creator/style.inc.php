<?php
    //Generate the parent container styles
    $block_styles = (!empty_allow_zero($top_margin) ? ' margin-top: '.$top_margin.'px;' : '').
        (!empty_allow_zero($bottom_margin) ? ' margin-bottom: '.$bottom_margin.'px;' : '').
        (!empty_allow_zero($alignment) && $alignment!='center' ? ' float: '.$alignment.';' : '').
        (!empty_allow_zero($border_color) || !empty_allow_zero($border_weight) || !empty_allow_zero($border_radius) ? ' border: 1px #000 solid;' : '').
        (!empty_allow_zero($border_color) ? ' border-color: '.$border_color.';' : '').
        (!empty_allow_zero($border_weight) ? ' border-width: '.$border_weight.'px;' : '').
        (!empty_allow_zero($border_style) ? ' border-style: '.$border_style.';' : '').
        (!empty_allow_zero($border_radius) ? ' border-radius: '.$border_radius.'px; -moz-border-radius: '.$border_radius.'px; -webkit-border-radius: '.$border_radius.'px;' : '').
        (!empty_allow_zero($width) ? ' width: '.$width.'px;' : '').
        (!empty_allow_zero($bg_color) ? ' background-color: '.$bg_color.';' : '').
        (!empty_allow_zero($bg_color_end) ? ' background: '.$bg_color_end.';background: -moz-linear-gradient(top, '.$bg_color.' 0%, '.$bg_color_end.' 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,'.$bg_color.'), color-stop(100%,'.$bg_color_end.'));background: -webkit-linear-gradient(top, '.$bg_color.' 0%,'.$bg_color_end.' 100%);background: -o-linear-gradient(top, '.$bg_color.' 0%,'.$bg_color_end.' 100%);background: -ms-linear-gradient(top, '.$bg_color.' 0%,'.$bg_color_end.' 100%);background: linear-gradient(top, '.$color_1.' 0%,'.$color_2.' 100%));filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\''.$bg_color.'\', endColorstr=\''.$bg_color_end.'\',GradientType=0 );' : '');
        
    //Add style attribute around styles if styles exist
    $block_styles = (!empty_allow_zero($block_styles) ? ' style="'.$block_styles.'"' : '');
    
    //Generate the content styles
    $content_styles = (!empty_allow_zero($top_padding) ? ' padding-top: '.$top_padding.'px;' : '').
        (!empty_allow_zero($right_padding) ? ' padding-right: '.$right_padding.'px;' : '').
        (!empty_allow_zero($bottom_padding) ? ' padding-bottom: '.$bottom_padding.'px;' : '').
        (!empty_allow_zero($left_padding) ? ' padding-left: '.$left_padding.'px;' : '').
        (!empty_allow_zero($font) ? $font : '');
        
    //Add style attribute around content styles if styles exist
    $content_styles = (!empty_allow_zero($content_styles) ? ' style="'.$content_styles.'"' : '');
?>