<form action="<?php echo ($cur_step==5 ? menu_page_url(OP_SN.'-theme-settings',false) : menu_page_url(OP_SN.'-setup-wizard',false).'&amp;step='.$cur_step)?>" method="post" enctype="multipart/form-data" class="op-bsw-setup">
<div class="op-bsw-wizard">
    <div class="op-bsw-content cf">
        <div class="op-bsw-header cf">
            <div class="op-logo"><img src="<?php op_img() ?>logo-blogsetup.png" class="animated flipInY" alt="OptimizePress" width="221" height="50" /></div>
            <ul>
                <li><a href="<?php echo OP_SUPPORT_LINK; ?>" target="_blank"><img src="<?php echo OP_IMG ?>live_editor/le_help_bg.png" onmouseover="this.src='<?php echo OP_IMG ?>live_editor/le_help_icon.png'" onmouseout="this.src='<?php echo OP_IMG ?>live_editor/le_help_bg.png'" alt="<?php _e('Help', 'optimizepress') ?>" class="tooltip animated pulse" title="<?php _e('Help', 'optimizepress') ?>" /></a></li>
            </ul>
        </div> <!-- end .op-bsw-header -->

        <div class="op-bsw-steps">
            <div class="op-bsw-steps-content">
                <ul class="steps-breadcrumb cf">
                            <?php
                $steps = array('Theme', 'Brand', 'Layout', 'Modules', 'Finished');
                foreach($steps as $step => $text){
                    $num = $step+1;
                    echo '
                    <li class="step-'.$num.($num == $cur_step ? ' selected' : '').'"><div class="op-bsw-circle">';
                    if($num == 5){
                        echo '<img src="'.OP_IMG.($cur_step==5 ? 'checkmark-green.png' : 'checkmark-alt.png').'" alt="Finished" width="20" height="18" />';
                    } else {
                        echo '<h1>'.$num.'</h1>';
                    }
                    echo '</div><span>'.__($text, 'optimizepress').'</span></li>';
                }
                ?>
                </ul>
            </div>
        </div>

        <div class="op-bsw-main-content">
                    <?php
            if(isset($notification))
                op_notify($notification);
            if(isset($error))
                op_show_error($error);
            ?>