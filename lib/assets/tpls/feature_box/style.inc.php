<?php
    //Generate the block styling string
    $block_style = (!empty_allow_zero($top_margin) ? 'margin-top: '.$top_margin.'px;' : '').
        (!empty_allow_zero($bottom_margin) ? 'margin-bottom: '.$bottom_margin.'px;' : '').
        (!empty_allow_zero($width) ? 'width: '.$width.'px;' : '');
        
    //Add style attribute to block styling string if its not empty
    $block_style = (!empty($block_style) ? ' style=\''.$block_style.'\'' : '');
    
    //Generate the content styling string
    $content_style = (!empty_allow_zero($top_padding) ? 'padding-top: '.$top_padding.'px;' : '').
        (!empty_allow_zero($right_padding) ? 'padding-right: '.$right_padding.'px;' : '').
        (!empty_allow_zero($bottom_padding) ? 'padding-bottom: '.$bottom_padding.'px;' : '').
        (!empty_allow_zero($left_padding) ? 'padding-left: '.$left_padding.'px;' : '');
        
    //Add style attribute to content styling string if its not empty
    $content_style = (!empty($content_style) ? ' style=\''.$content_style.'\'' : '');
?>