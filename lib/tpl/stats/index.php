<?php echo $this->load_tpl('header', array('title' => __('Experiments', 'optimizepress'))); ?>
<form action="<?php menu_page_url(OP_SN . '-stats'); ?>" method="post" enctype="multipart/form-data" class="op-bsw-settings op-stats-screen">
    <div class="op-bsw-main-content cf">

    <?php
        if ($notification !== null) {
            op_notify($notification);
        }

        if ($error !== null) {
            op_show_error($error);
        }
    ?>

    </div> <!-- end .op-bsw-main-content -->

    <div class="op-bsw-grey-panel-fixed">
        <?php echo $content ?>
    </div>

</form>
<?php echo $this->load_tpl('footer'); ?>
