<div class="op-bsw-settings">

    <?php echo $this->load_tpl('header', array('title' => 'Create New Page')) ?>

    <?php wp_nonce_field( 'op_liveeditor', 'op_le_wpnonce', false ) ?>

    <div class="op-bsw-main-content">

        <?php /*
        <div class="op-info-box">

            <div class="op-info-box-split-container">
                <div class="op-info-box-split">
                    <h1 class="op-info-box-headline"><?php echo __('Welcome to OptimizePress'); ?></h1>
                    <p class="op-info-box-paragraph"><?php echo __('Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.'); ?></p>
                </div>

                <div class="op-info-box-split">
                    <img src="<?php echo OP_IMG; ?>getting-started-video-placeholder.jpg" alt="Getting Started Video" />
                </div>

            </div>

            <ul class="op-info-box-list-inline">
                <li>
                    <?php echo __('Get Training:'); ?>
                    <strong><a href="http://www.optimizehub.com/members-home/basics-training/" target="_blank"><?php echo __('Members Tutorials'); ?></a></strong>
                </li>
                <li>
                    <?php echo __('Troubleshooting:'); ?>
                    <strong><a href="http://help.optimizepress.com/"><?php echo __('Help Center'); ?></a></strong>
                </li>
                <li>
                    <?php echo __('or'); ?>
                    <strong><a href="#"><?php echo __('Contact Us'); ?></a></strong>
                </li>
            </ul>

        </div>
        */ ?>

        <?php
            $op_template_sections = $data['op_template_sections'];
        ?>

        <div class="op-info-box">
            <p>
                <strong><?php _e('New to OptimizePress?','optimizepress');?></strong> <a class="op-info-box-getting-started-link" id="js-op-info-box-getting-started-link"><?php _e('Click here to watch our Getting Started video','optimizepress');?></a>
            </p>
            <div class="op-video-container">
                <div class="op-getting-started-video">
                    <iframe class="op-getting-started-iframe" src="https://player.vimeo.com/video/125436273?color=ffffff&title=0&byline=0&portrait=0" width="850" height="478" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                </div>
            </div>
        </div>

        <div class="op-info-box-panel">
            <ul class="op-info-box-list-icons">
                <li><a href="#<?php echo $op_template_sections['blank']; ?>" class="op-icon op-icon-blank-page"><?php echo __('Blank Pages','optimizepress'); ?></a></li>
                <li><a href="#<?php echo $op_template_sections['landing']; ?>" class="op-icon op-icon-landing-page"><?php echo __('Opt-in / Landing Pages','optimizepress'); ?></a></li>
                <li><a href="#<?php echo $op_template_sections['sales']; ?>" class="op-icon op-icon-sales-page"><?php echo __('Sales Pages','optimizepress'); ?></a></li>
                <li><a href="#<?php echo $op_template_sections['membership']; ?>" class="op-icon op-icon-membership-page"><?php echo __('Membership Pages','optimizepress'); ?></a></li>
                <li><a href="#<?php echo $op_template_sections['webinar']; ?>" class="op-icon op-icon-webinar-page"><?php echo __('Webinar Pages','optimizepress'); ?></a></li>
                <li><a href="#<?php echo $op_template_sections['launch']; ?>" class="op-icon op-icon-launch-funnel"><?php echo __('Launch Funnel Pages','optimizepress'); ?></a></li>
            </ul>
        </div>

        <div class="op-info-box">
            <div class="op-hiddens" id="upload_new_layout_container">
                <iframe class="op-iframe-full" src="<?php menu_page_url(OP_SN.'-page-builder') ?>&amp;section=content_upload&amp;info_box=yes" width="700" height="160"></iframe>
            </div>
        </div>

        <?php echo op_tpl('create_new_page/content_templates', $data); ?>

        <a class="op-back-to-top" id="op-js-back-to-top" href="#">Back to Top</a>

    </div> <!-- end .op-bsw-main-content -->

    <div class="op-bsw-grey-panel-fixed">
        <?php if (isset($content)){ echo $content; } ?>
    </div>

</div>

<div id="op-content-preview-container">

    <form id="op_asset_browser_container" class="op-create-page" action="<?php menu_page_url(OP_SN. '-page-builder', true); ?>&amp;step=1" method="post" enctype="multipart/form-data" class="form-step-1">

        <div class="asset-title cf"><span class="title-text">Enter Page Name</span></div>

        <div class="op-content-preview">
            <h2><?php _e('Name Your Page', 'optimizepress') ?></h2>
            <p><?php _e('Enter the title for your page here - this will be used in the Wordpress interface', 'optimizepress') ?></p>
            <input type="text" name="op[page][name]" id="op_page_name" value="<?php if ( isset($page_title) ){ echo op_attr($page_title); } ?>" />
            <h2><?php _e('Page URL/Permalink', 'optimizepress') ?></h2>
            <p><?php printf(__('Customize your page permalink below. Please ensure your permalinks are set to %1$s in your %2$s.', 'optimizepress'),'/%postname%/','<a href="options-permalink.php" target="_blank">'.__('Wordpress Permalinks Settings', 'optimizepress').'</a>') ?>
            <?php
            if($error = $this->error('page_name')){
                echo '<br><br><span class="error">'.$error.'</span>';
            } elseif( isset($permalinks_disabled) ){
                echo '<br><br><span class="error">'.__('You must enable permalinks in order for this to work.', 'optimizepress').'</span>';
            }
            ?></p>
            <input type="text" name="op[page][slug]" id="op_page_slug" value="<?php if ( isset($page_name) ){ echo op_attr($page_name); } ?>" />
            <div id="op_ajax_checker">
                <a href="#check" class="op-check-availability check-availability"><?php _e('Check availability', 'optimizepress') ?></a>
                <a href="#cancel" class="op-hidden check-availability-cancel op-check-availability-cancel"><?php _e('Cancel', 'optimizepress') ?></a>
                <img class="op-bsw-waiting op-msg-loading op-hidden" src="images/wpspin_light.gif" alt="" />
                <!--<span class="success op-hidden"><?php _e('Valid Page URL', 'optimizepress') ?></span>
                <span class="error op-hidden"><?php _e('Page URL already in use', 'optimizepress') ?></span>-->
            </div>
            <div class="op-msgs">
                <div class="op-msg op-msg-success op-hidden">&#x2713;&nbsp; <?php _e('Available', 'optimizepress'); ?></div>
                <div class="op-msg op-msg-error op-hidden">&#x2717;&nbsp; <?php _e('Unavailable', 'optimizepress'); ?></div>
            </div>

            <div class="cf"></div>
            <script>
                if (typeof OptimizePress === 'object') {
                    OptimizePress.create_new_page = {};
                    OptimizePress.create_new_page.slug_message = "<?php echo __('Please provide a valid URL slug which is not in use.', 'optimizepress'); ?>";
                    OptimizePress.create_new_page.name_message = "<?php echo __('Please provide a name for your page.', 'optimizepress'); ?>";
                }
            </script>
        </div>

        <input type="hidden" id="content_layout_id" name="op[page][content_layout]" value="">
        <input type="hidden" name="optimizepress_page_builder" value="save">
        <input type="hidden" name="op[page][preset_option]" id="op_page_preset_option" value="blank">
        <input type="hidden" name="op[page][return_page_id]" value="true">

        <?php wp_nonce_field( 'op_page_builder', '_wpnonce', false ); ?>

        <div class="op-insert-buttons cf">
            <input class="op-bsw-green-button op-create-page-btn" id="op-create-page-btn" type="submit" value="Create Page" />
            <div class="op-loader"></div>
        </div>

    </form>

</div>

<?php echo $this->load_tpl('footer') ?>