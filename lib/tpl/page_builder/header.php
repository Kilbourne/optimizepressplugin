<?php echo op_tpl('admin_header'); ?>
<form action="<?php echo menu_page_url(OP_SN.'-page-builder',false).(isset($pagebuilder_postid)?'&amp;page_id='.$pagebuilder_postid:'').'&amp;step='.$cur_step ?>" method="post" enctype="multipart/form-data" class="form-step-<?php echo $cur_step ?>">
<div class="op-bsw-wizard">
    <div class="op-bsw-content cf">
        <div class="op-pb-header cf">
            <div class="op-pb-fixed-width">
                    <h1 class="op-logo"><img src="<?php echo OP_IMG ?>logo-pagebuilder.png" alt="OptimizePress" class="animated flipInY" width="245" height="50"></h1>
                    <div class="op-pb-steps">
                            <ul class="steps-breadcrumb cf">
                            <?php
                            $cur_step_array = array();
                            $steps = array(
                                array(
                                    'step_text' => __('Create Page', 'optimizepress'),
                                    'step_desc' => __('Create your new page and choose a page name', 'optimizepress'),
                                ),
                                array(
                                    'step_text' => __('Page Type', 'optimizepress'),
                                    'step_desc' => __('Choose a page type for your page', 'optimizepress'),
                                ),
                                array(
                                    'step_text' => __('Template', 'optimizepress'),
                                    'step_desc' => __('Choose a template for your page', 'optimizepress'),
                                ),
                                array(
                                    'step_text' => __('Settings', 'optimizepress'),
                                    'step_desc' => __('Customize the settings for your chosen template', 'optimizepress'),
                                ),
                                array(
                                    'step_text' => '',
                                    'step desc' => '',
                                )
                            );
                            foreach($steps as $step => $text){
                                $num = $step+1;
                                if ($num == 3 && (isset($page_type) && $page_type == 'membership')) {
                                    $text['step_text'] = __('Membership', 'optimizepress');
                                    $text['step_desc'] = __('Choose your membership options', 'optimizepress');
                                }
                                $selected = false;
                                if($num == $cur_step){
                                    $selected = true;
                                    $cur_step_array = $text;
                                }
                                echo '
                                <li class="step-'.$num.($selected ? ' selected' : '').'">';
                                if($num == 5){
                                    echo '<div class="op-pb-circle"><img src="'.OP_IMG.'pagebuilder-liveeditor.png" alt="Live Editor" width="20" height="20" /></div>';
                                } else {
                                    echo '<div class="op-pb-circle"><h1>'.$num.'</h1></div>';
                                }

                                if($num == 5){
                                    echo '';
                                } else {
                                    echo '<span>' . $text['step_text'] . '</span></li>';
                                }
                            }
                            ?>
                            </ul>
                        </div> <!-- end .op-pb-steps -->
                    </div>
                </div> <!-- end .op-pb-header -->


                <div class="op-pb-header-title">
                    <div class="op-pb-fixed-width">
                        <div class="op-warning-message op-warning-message--large status-error">
                            Please use our <a href="<?php menu_page_url(OP_SN); ?>" target="_parent">Create New Page</a> interface for faster page building. The PageBuilder will be deprecated in future versions.
                        </div>
                        <h1><?php echo $cur_step_array['step_desc'] ?></h1>
                    </div>
                </div>
                <?php
                if(isset($notification) && $notification !== false)
                    op_notify($notification);
                if(isset($error) && $error !== false)
                    op_show_error($error);
                ?>
        <div class="op-bsw-main-content op-pb-main-content op-pb-fixed-width">
        <div class="op-bsw-grey-panel op-bsw-grey-panel-fixed">

