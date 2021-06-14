<div id="op_template_sections_container">
<?php
    $template_section_id = '';
    $op_template_sections = $data['op_template_sections'];
    // Hardcoded order of sections.
    $content_layouts_ordered = array();
    $content_layouts_ordered[0] = ''; // optin
    $content_layouts_ordered[1] = ''; // thank you
    $content_layouts_ordered[2] = ''; // sales
    $content_layouts_ordered[3] = ''; // webinar
    $content_layouts_ordered[4] = ''; // membership
    $i = 0;
    foreach($data['content_layouts'] as $content_layout) {
        if ($content_layout['name'] == 'Opt-In Pages') {
            $content_layouts_ordered[0] = $content_layout;
        } elseif ($content_layout['name'] == 'Thank You Pages') {
            $content_layouts_ordered[1] = $content_layout;
        } elseif ($content_layout['name'] == 'Sales Pages') {
            $content_layouts_ordered[2] = $content_layout;
        } elseif ($content_layout['name'] == 'Webinar Pages') {
            $content_layouts_ordered[3] = $content_layout;
        } elseif ($content_layout['name'] == 'Membership Pages') {
            $content_layouts_ordered[4] = $content_layout;
        } else {
            // make sure the key is high enough to not get overwritten by above ones
            $content_layouts_ordered[$i + 20] = $content_layout;
        }
        $i++;
    }
    // sorting by keys
    ksort($content_layouts_ordered);

    // foreach($data['content_layouts'] as $content_layout) {
    foreach($content_layouts_ordered as $content_layout) {
        foreach($data['op_template_sections'] as $op_template_section_title => $op_template_section_id) {
            if (isset($content_layout['name']) && strpos(strtolower($content_layout['name']), $op_template_section_title) !== false) {
                // $skip = false;
                $template_section_id = $op_template_section_id;
                // break;
            }
        }

        if (!empty($content_layout['templates'])) { ?>
        <div id="<?php echo $template_section_id; ?>" class="op-template-section">
            <?php
                if ($content_layout['name'] == 'Opt-In Pages') {
                    $content_layout['name'] = __('Opt-in / Landing Pages','optimizepress');
                } else if($content_layout['name'] == "Thank You Pages"){
                    $content_layout['name'] = __('Thank You Pages','optimizepress');
                } else if($content_layout['name'] == "Sales Pages"){
                    $content_layout['name'] = __('Sales Pages','optimizepress');
                } else if($content_layout['name'] == "Webinar Pages"){
                    $content_layout['name'] = __('Webinar Pages','optimizepress');
                } else if($content_layout['name'] == "Membership Pages"){
                    $content_layout['name'] = __('Membership Pages','optimizepress');
                } else if($content_layout['name'] == "Home Pages"){
                    $content_layout['name'] = __('Home Pages','optimizepress');
                } else if($content_layout['name'] == "Launch Pages"){
                    $content_layout['name'] = __('Launch Pages','optimizepress');
                } else if($content_layout['name'] == "Other Pages"){
                    $content_layout['name'] = __('Other Pages','optimizepress');
                } else if($content_layout['name'] == "Blank Page"){
                    $content_layout['name'] = __('Blank Page','optimizepress');
                }
            ?>
            <h2 class="op-template-section-title op-template-section-title-block"><?php echo $content_layout['name']; ?></h2>
            <!-- <a class="op-template-section-btn" href="#">View Tutorial</a> -->
            <!-- <p class="op-template-section-description">Create a blank page using one of our template frameworks</p> -->
            <div class="op-template-section-template-container">
                <?php foreach($content_layout['templates'] as $template) { ?>

                    <?php
                    if (isset($template['settings']['preview_url']) && $template['settings']['preview_url'] !== '') {
                        $preview_url = $template['settings']['preview_url'];
                    } else {
                        $preview_url = '';
                    }
                    ?>

                    <div class="op-template-section-template">

                        <div class="op-template-section-template-img-container" style="background-image:url('<?php echo $template['image'] ?>');">
                            <div class="op-template-section-template-img-btn-container">
                                <a class="op-template-section-template-img-btn" data-template-id="<?php echo $template['content_layout_id']; ?>"><?php echo __('Use This Template','optimizepress'); ?></a><br />
                                <a class="op-template-section-template-img-btn-alt" data-preview-url="<?php echo $preview_url; ?>" data-template-id="<?php echo $template['content_layout_id']; ?>"><?php echo __('or Preview this template','optimizepress'); ?></a>
                            </div>
                            <div class="op-template-section-template-img-overlay"></div>
                        </div>

                        <div class="op-template-section-template-header">
                            <h3 class="op-template-section-template-title"><?php echo $template['tooltip_title']; ?></h3>
                            <span class="op-template-section-template-type"><?php echo substr($content_layout['name'], 0, strlen($content_layout['name']) - 1); ?></span>
                        </div>

                        <div class="op-template-section-template-description">
                            <?php echo $template['tooltip_description']; ?>
                        </div>

                    </div>
                <?php } ?>
            </div>
        </div>
    <?php } ?>
<?php } ?>

    <div id="<?php echo $op_template_sections['blank']; ?>" class="op-template-section op-template-section-blank-page">
        <h2 class="op-template-section-title"><?php echo __('Blank Page','optimizepress'); ?></h2>
        <!--<a class="op-template-section-btn" href="#"><?php echo __('View Tutorial','optimizepress'); ?></a>-->
        <p class="op-template-section-description"><?php echo __('Create a blank page using one of our template frameworks','optimizepress'); ?></p>

        <div class="op-template-section-template-container">
            <?php $op_theme_id = 1; ?>
            <?php foreach($data['blank_templates'] as $op_template) { ?>

                <div class="op-template-section-template">
                    <div class="op-template-section-template-img-container op-template-section-blank-template" style="background-image:url('<?php echo $op_template['screenshot_thumbnail']; ?>');">
                        <div class="op-template-section-template-img-btn-container">
                            <a class="op-template-section-template-img-btn" data-template-id="0" data-theme-id="<?php echo $op_theme_id; ?>"><?php echo __('Use This Template','optimizepress'); ?></a><br />
                            <a class="op-template-section-template-img-btn-alt" data-preview-url="<?php echo $op_template['screenshot']; ?>" data-template-id="0" data-is-image="true"><?php echo __('or Preview this template','optimizepress'); ?></a>
                        </div>
                        <div class="op-template-section-template-img-overlay"></div>
                    </div>
                    <div class="op-template-section-template-header">
                        <h3 class="op-template-section-template-title"><?php echo $op_template['name']; ?></h3>
                    </div>
                    <div class="op-template-section-template-description">
                        <p><?php echo $op_template['description']; ?></p>
                    </div>
                </div>
                <?php $op_theme_id += 1; ?>

            <?php } ?>
        </div>
    </div>
</div>