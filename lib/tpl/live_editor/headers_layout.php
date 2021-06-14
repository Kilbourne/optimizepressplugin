<div class="op-bsw-grey-panel-fixed">
<?php
$classextra = '';
$classname = '';
if(is_array($module_name)){
    foreach($module_name as $module){
        $classname .= 'module-'.$module.' ';
    }
    $classname = ' '.rtrim($classname,' ');
} else {
    $classname = ' module-'.$module_name;
}
if(count($tabs) > 1): ?>
<div class="op-bsw-grey-panel-content<?php echo $classname ?>">
    <div class="op-bsw-grey-panel">
        <ul class="op-bsw-grey-panel-tabs">
        <?php
        foreach($tabs as $name => $opts):
            $li_class = $a_class = $prefix = '';
            if(is_array($opts)){
                $title = $opts['title'];
                $li_class = isset($opts['li_class']) ? ' class="'.$opts['li_class'].'"':'';
                $a_class = isset($opts['a_class']) ? ' class="'.$opts['a_class'].'"':'';
                $prefix = isset($opts['prefix']) ? $opts['prefix'] : '';
            } else {
                $title = $opts;
            }
            echo '
            <li'.$li_class.'><a href="#'.$name.'"'.$a_class.'>'.$prefix.$title.'</a></li>';
        endforeach;
        ?>
        </ul>
    </div>
<?php else:
$classextra = ' op-bsw-grey-panel-tab-content-selected'; ?>
<div class="op-bsw-grey-panel-content cf op-bsw-grey-panel-no-sidebar<?php echo $classname ?>">
<?php endif; ?>
    <div class="op-bsw-grey-panel-tab-content-container cf">
    <?php foreach($tab_content as $name => $content): ?>
        <div class="op-bsw-grey-panel-tab-content tab-<?php echo $name.$classextra ?>">
           <?php echo $content; ?>
        </div>
    <?php endforeach ?>
    </div>
    <div class="clear"></div>
</div>
</div>