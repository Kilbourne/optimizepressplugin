<?php menu_page_url(OP_SN.'-page-builder'); ?>
<form id="le-layouts-dialog">
    <h1><?php _e('Content Templates', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
        <div class="op-actual-lightbox-content cf">
            <?php
            $tabs = array(
                'module_name' => 'content_layouts',
                'tabs' => array(
                    'predefined' => array(
                        'title' => __('Predefined Templates', 'optimizepress'),
                        'li_class' => 'op-bsw-grey-panel-tabs-selected',
                    ),
                    'upload' => __('Upload Template', 'optimizepress'),
                    'export' => __('Export Template', 'optimizepress'),
                ),
                'tab_content' => array(
                    'predefined' => $content_layouts.($content_layout_category_count > 0?op_tpl('live_editor/layouts/keep_options'):''),
                    'upload' => '<div id="upload_new_layout_container"></div><iframe src="'.menu_page_url(OP_SN.'-page-builder',false).'&amp;section=content_upload&amp;info_box=yes&info_box_clean=yes" width="700" height="400"></iframe>',
                    //'upload' => op_tpl('live_editor/layouts/upload'),
                    'export' => op_tpl('live_editor/layouts/export')
                )
            );
            echo op_tpl('generic/tabbed_module',$tabs);
            ?>
        </div>
    </div>
    <div class="op-insert-button cf">
        <button type="submit" class="editor-button"><span><?php _e('Update', 'optimizepress') ?></span></button>
    </div>
</form>