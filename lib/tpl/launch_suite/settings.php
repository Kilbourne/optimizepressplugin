<?php
    foreach($settings_sections as $name => $section):
    $help = $content = '';
    $on_off = $no_content = false;
    $options = array();
    if(is_array($section)){
        if(isset($section['template'])){
            if(is_array($section['template'])){
                $content = op_tpl($section['template']['tpl'],array(),$section['template']['path']);
            } else {
                $content = op_tpl($section['template']);
            }
        } else {
            $content = op_tpl('launch_suite/settings/'.$name);
        }
        $title = op_get_var($section,'title');
    } else {
        $title = $section;
        $content = op_tpl('launch_suite/settings/'.$name);
    }
    if(empty($content)){
        $no_content = true;
    }
    $on_off = op_get_var($section,'on_off',true);
    $class = $name;
    if(op_has_group_error('launch_suite_settings_'.$name)){
        $class .= ' has-error';
        op_section_error($section_type);
    }
    ?>
    <div class="op-bsw-grey-panel section-<?php echo $class.($no_content?' op-bsw-grey-panel-no-content' : '') ?>">
        <div class="op-bsw-grey-panel-header cf">
            <h3><?php echo $no_content ? $title : '<a href="#">'.$title.'</a>' ?></h3>
            <?php $help_vid = op_help_vid(array('launch_suite','settings',$name),true); ?>
            <div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
                <div class="show-hide-panel"><?php echo !$no_content ? '<a href="#"></a>' : '' ?></div>
                <?php
                if($on_off){
                    $enabled = op_launch_on_off_switch($name);
                }
                echo $help_vid;
                ?>
            </div>
        </div>
        <?php if(!$no_content): ?>
            <?php if(!empty($help)): ?>
            <div class="section-help"><?php echo $help ?></div>
            <?php
            endif;
            echo $content;
            ?>
        <?php endif ?>
    </div>
    <?php endforeach; ?>