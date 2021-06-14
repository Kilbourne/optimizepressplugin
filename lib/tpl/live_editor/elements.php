<div id="op-le-row-insert-element">
    <h1><?php _e('Add new element', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
        <?php
        $content = '[tabs][tab title="Tab Title"]

    Tab Content 1

    [/tab] [tab title="Tab Title"]

    Tab Content 2

    [/tab] [/tabs]';
    op_tiny_mce($content,'insert_element_shortcode');
        /*if(function_exists('wp_editor')){
            wp_editor($content,'insertelementshortcode');
        } else {*/
            //echo '
        //<textarea id="insert_element_shortcode" cols="50" rows="10">'.$content.'</textarea>';
        //}
        ?>
    </div>
    <div class="op-insert-button cf">
        <a href="#insert" id="op-le-element-insert" class="editor-button"><?php _e('Insert into page', 'optimizepress') ?></a>
    </div>
</div>