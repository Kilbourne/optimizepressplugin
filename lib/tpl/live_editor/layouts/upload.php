<?php echo op_tpl('admin_header'); ?>
<?php $presetSetClass = (isset($presets) && $presets != "") ? ' one-half' : ''; ?>
<div class="<?php echo $presetSetClass; ?>">
    <label><?php _e('Upload a content template in .zip format', 'optimizepress') ?></label>
        <?php
            if (isset($error)) {
                echo '<p class="error">'.$error.'</p>';
            }
        ?>
        <p class="install-help"><?php _e('If you have a content template in a .zip format, you may install it by uploading it here. You can find more templates in our exclusive <a target="_blank" href="http://marketplace.optimizepress.com">Marketplace</a>', 'optimizepress') ?></p>
        <?php
        $info_box = $_GET['info_box'] == 'yes' || $_GET['info_box'] == '1' ? 'yes' : 'false';

        $info_box_clean = 'false';
        if ( isset($_GET['info_box_clean']) ){
            $info_box_clean = $_GET['info_box_clean'] == 'yes' || $_GET['info_box_clean'] == '1' ? 'yes' : 'false';
        }
        ?>

        <form id="op_content_layout_upload_form" method="post" enctype="multipart/form-data" action="<?php echo menu_page_url(OP_SN.'-page-builder',false) ?>&amp;section=content_upload&amp;info_box=<?php echo $info_box; ?>&amp;info_box_clean=<?php echo $info_box_clean; ?>">
            <?php wp_nonce_field( 'op_content_layout_upload' ); ?>
            <label class="screen-reader-text" for="pluginzip"><?php _e('Content template zip file', 'optimizepress'); ?></label>
            <input type="file" id="pluginzip" name="pluginzip[]" multiple="multiple" />
            <input type="submit" class="button op-btn-rounded" value="<?php _e('Install Now', 'optimizepress') ?>" />
        </form>
    </div>

    <?php if(isset($presets) && $presets != ""): ?>
    <div id="preset-option-preset" class="preset-option <?php echo $presetSetClass; ?>">
        <div id="op_content_layout_upload_form" method="post" enctype="multipart/form-data" action="<?php echo menu_page_url(OP_SN.'-page-builder',false) ?>&amp;section=content_upload&amp;info_box=<?php echo $info_box; ?>&amp;info_box_clean=<?php echo $info_box_clean; ?>">
            <label><?php _e('Select a page preset', 'optimizepress') ?></label>
            <p class="install-help"><?php _e('If you have previously created a page and saved the LiveEditor settings as a preset you can load that preset here.', 'optimizepress') ?> </p>
            <?php echo $presets; ?>
            <input type="submit" class="button op-btn-rounded op-create-from-preset" value="<?php _e('Create page from preset', 'optimizepress') ?>" />
        </div>
    </div>
    <?php endif;

    $html = '';
    if (isset($content)) {
        foreach ($content as $value) {
            $class = $value['success'] == $value['html'] ? 'Success' : 'Error';
            $html .= '<div class="op-notify ' . strtolower($class) . '">';
                $html .= '<img alt="' . $class . '" src="' . OP_IMG . 'notify-' . strtolower($class) . '.png">';
                $html .= '<span>';
                    $html .= '<strong>' . htmlspecialchars($value['package']) . '</strong> ';
                    $html .= $value['html'];
                $html .= '</span>';
                $html .= '<div class="op-notify-close"></div>';
            $html .= '</div>';
        }
    }
?>
<script>
    opjq(document).ready(function($) {

        $('#op_content_layout_upload_form').on('submit', function () {
            if (window.parent) {
                window.parent.OptimizePress.refresh_content_layouts = true;
            }
            $.fancybox.showLoading();
        });

        $('#pluginzip').closest('form').opForm();
        if (window.parent && window.parent.document.defaultView && window.parent.document.defaultView.op_refresh_content_layouts &
            window.parent.OptimizePress.refresh_content_layouts) {
            window.parent.document.defaultView.op_refresh_content_layouts();
        }
        var notify = '<?php echo addslashes($html); ?>';
        if (notify) {
            $(window.parent.document.body).find('#upload_new_layout_container').before(notify);
        }

    });

    opjq(window).on('load', function () {
        opjq('.upload-layout-loading').hide();
    });
</script>
<?php
    if (isset($scripts)) {
        foreach ($scripts as $value) {
            echo $value;
        }
    }
?>

<?php echo op_tpl('admin_footer') ?>