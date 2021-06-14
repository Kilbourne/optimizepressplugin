<?php
class OptimizePress_Blog_Fancybox_Images_Module extends OptimizePress_Modules_Base {

    function display_settings($section_name,$config=array(),$return=false){ ?>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <?php printf(__('Turning on this option will open all linked images in a Fancybox.')); ?>
        </div>
    <?php }

    function save_settings($section_name,$config=array(),$op){
        $fancybox_images = array(
            'enabled' => op_get_var($op,'enabled','N'),
        );
        $this->update_option('fancybox_images',$fancybox_images);
    }

}
