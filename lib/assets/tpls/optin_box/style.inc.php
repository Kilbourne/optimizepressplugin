<?php
    //Init the style string
    $style_str = '';
    
    //Set box width
    $style_str .= (!empty($width) ? ' width: '.$width.'px;' : '');
    
    //Set box margins
    $style_str .= (!empty($margin_top) ? ' margin-top: '.$margin_top.'px;' : '');
    $style_str .= ((!empty($margin_right) && $box_alignment!='center') ? ' margin-right: '.$margin_right.'px;' : 'margin-right: auto;');
    $style_str .= (!empty($margin_bottom) ? ' margin-bottom: '.$margin_bottom.'px;' : '');
    $style_str .= ((!empty($margin_left) && $box_alignment!='center') ? ' margin-left: '.$margin_left.'px;' : 'margin-left: auto;');
    
    //Set box alignment
    if (!empty($box_alignment)) $style_str .= ($box_alignment!='center' ? 'float: '.$box_alignment.';' : '');
    
    $style_str = (!empty($style_str) ? ' style="'.$style_str.'"' : '');
?>