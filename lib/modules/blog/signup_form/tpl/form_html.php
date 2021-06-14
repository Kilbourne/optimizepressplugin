<?php
    $integrationType = op_get_var($fields, 'integration_type', 'custom');
    /*
     * On some occasions $integrationType was returning as an empty string ("");
     */
    if (empty($integrationType)) {
        $integrationType = 'custom';
    }

    $signup_form_additional_class = '';
    if ($integrationType === 'email') {
        $signup_form_additional_class = ' op-signup_form-form_html_email';
    }

    $providers = op_assets_provider_list();
    if (false === isset($providers[$integrationType])) {
        $integrationType = 'custom';
    }
?>
<div class="op-signup_form-form_html<?php echo $signup_form_additional_class; ?>">
    <p class="integration_type">
        <label for="<?php echo $id ?>integration_type"><?php _e('Integration Type', 'optimizepress') ?>:</label>
        <select id="<?php echo $id ?>integration_type" name="<?php echo $fieldname; ?>[form_html][integration_type]" class="integration_type_select">
            <option value="email" <?php selected('email', $integrationType); ?>><?php _e('Email Data', 'optimizepress'); ?></option>
            <option value="custom" <?php selected('custom', $integrationType); ?>><?php _e('Custom Form', 'optimizepress'); ?></option>
            <?php if (count($providers) > 0): foreach ($providers as $key => $value): ?>
            <option value="<?php echo $key; ?>" <?php selected($key, $integrationType); ?>><?php echo $value; ?></option>
            <?php
                endforeach; endif;
            ?>
        </select>
    </p>
    <p class="provider_list">
        <label for="<?php echo $id ?>list"><?php _e('Provider List', 'optimizepress') ?>:</label>
        <?php $list = op_get_var($fields, 'list', null); ?>
        <select id="<?php echo $id ?>list" name="<?php echo $fieldname ?>[form_html][list]" class="provider_list_select" data-default="<?php echo rawurldecode($list); ?>">
            <?php
                if (false === in_array($integrationType, array('email', 'custom')) && count($lists = op_assets_provider_items($integrationType)) > 0): foreach ($lists['lists'] as $key => $item):
            ?>
            <option value="<?php echo $key; ?>" <?php selected($key, $list);?>><?php echo $item['name']; ?></option>
            <?php
                endforeach; endif;
            ?>
        </select>
    </p>
    <div class="field-note provider_list_note">
        <p><?php _e('Note: Lists can take up to 1 minute to be retrieved from your provider', 'optimizepress'); ?></p>
    </div>
    <p class="provider_autoresponder_name">
        <label for="<?php echo $id ?>autoresponder_name"><?php _e('Autoresponder Name', OP_SN) ?>:</label>
        <input size="60" type="text" id="<?php echo $id ?>autoresponder_name" name="<?php echo $fieldname ?>[form_html][autoresponder_name]" value="<?php echo $fields['autoresponder_name'] ?>" />
    </p>
    <div class="cf field-double-optin">
        <input type="checkbox" name="<?php echo $fieldname ?>[form_html][double_optin]" id="<?php echo $id ?>double_optin" value="Y"<?php echo ($fields['double_optin'] == 'Y' ? ' checked="checked"' : '') ?> class="double_optin" />
        <label for="<?php echo $id ?>double_optin"><?php _e('Double Optin', 'optimizepress') ?></label>
    </div>

    <div class="field-signup-form-id cf">
        <label for="<?php echo $id ?>signup_form_id"><?php _e('Signup ID', 'optimizepress') ?>:</label>
        <input type="text" id="<?php echo $id ?>signup_form_id" name="<?php echo $fieldname ?>[form_html][signup_form_id]" value="<?php echo $fields['signup_form_id'] ?>" />
    </div>

    <p class="thank_you_page">
        <label for="<?php echo $id ?>thank_you_page"><?php _e('Thank You Page URL', 'optimizepress') ?>:</label>
        <input size="60" type="text" id="<?php echo $id ?>thank_you_page" name="<?php echo $fieldname ?>[form_html][thank_you_page]" value="<?php echo $fields['thank_you_page'] ?>" />
    </p>
    <p class="already_subscribed_url">
        <label for="<?php echo $id ?>already_subscribed_url"><?php _e('User Already Subscribed Page URL', 'optimizepress') ?>:</label>
        <input size="60" type="text" id="<?php echo $id ?>already_subscribed_url" name="<?php echo $fieldname ?>[form_html][already_subscribed_url]" value="<?php echo $fields['already_subscribed_url'] ?>" />
    </p>
    <p class="action_page">
        <input type="hidden" id="<?php echo $id ?>action_page" name="<?php echo $fieldname ?>[form_html][action_page]" value="<?php echo $fields['action_page'] ?>" />
    </p>
    <p class="email_data_field cf">
        <label for="<?php echo $id ?>email_address"><?php _e('Email Address', 'optimizepress') ?>:</label>
        <input size="60" type="text" id="<?php echo $id ?>email_address" name="<?php echo $fieldname ?>[form_html][email_address]" value="<?php echo $fields['email_address'] ?>" />
    </p>
    <p class="email_data_field cf">
        <label for="<?php echo $id ?>redirect_url"><?php _e('Redirect URL', 'optimizepress') ?>:</label>
        <input size="60" type="text" id="<?php echo $id ?>redirect_url" name="<?php echo $fieldname ?>[form_html][redirect_url]" value="<?php echo $fields['redirect_url'] ?>" />
    </p>
    <p class="msg form_html_field cf"><?php _e('Enter your html opt-in code below and we\'ll hook up your form to the template:', 'optimizepress') ?></p>
    <p class="form_html_field cf"><textarea cols="60" rows="10" id="<?php echo $id ?>formhtml" name="<?php echo $fieldname ?>[form_html][html]" class="form_html"><?php echo stripslashes($fields['html']); ?></textarea></p>
    <?php if(!$disable_name_options): ?>
    <p class="cf">
        <input type="checkbox" name="<?php echo $fieldname ?>[form_html][disable_name]" id="<?php echo $id ?>disable_name" value="Y"<?php echo ($fields['disable_name'] == 'Y' ? ' checked="checked"' : '') ?> class="disable_name" />
        <label for="<?php echo $id ?>disable_name"><?php _e('Disable name box?', 'optimizepress') ?></label>
    </p>
    <?php
    $name_disabled = ($fields['disable_name'] == 'Y' ? ' hidden-el' : '');
    ?>
    <p class="form_html_field form_html_field_with_order name_html_field cf<?php echo $name_disabled ?>">
        <label for="<?php echo $id ?>name_box"><?php _e('Name', 'optimizepress') ?>:</label>
        <select id="<?php echo $id ?>name_box" name="<?php echo $fieldname ?>[form_html][name_box]" class="name_select name_input field_select"></select>
        <input type="hidden" id="<?php echo $id ?>name_box_selected" value="<?php echo $fields['name_box'] ?>" class="name_input name_box_selected" />
    </p>
    <p class="name_html_field form_html_field_order cf<?php echo $name_disabled; ?>">
        <label for="<?php echo $id ?>name_order"><?php _e('Name field order', 'optimizepress') ?>:</label>
        <input type="text" id="<?php echo $id; ?>name_order" name="<?php echo $fieldname; ?>[form_html][name_order]" class="name_order" value="<?php echo $fields['name_order']; ?>" />
    </p>
    <p class="name_html_field form_html_field_required cf<?php echo $name_disabled; ?>">
        <label for="<?php echo $id ?>name_required"><?php _e('Name required', 'optimizepress') ?>:</label>
        <input type="checkbox" id="<?php echo $id; ?>name_required" name="<?php echo $fieldname; ?>[form_html][name_required]" class="name_required" value="Y" <?php checked($fields['name_required'], 'Y'); ?> />
    </p>
    <?php endif ?>
    <p class="form_html_field form_html_field_with_order email_html_field cf">
        <label for="<?php echo $id ?>email_box"><?php _e('Email', 'optimizepress') ?>:</label>
        <select id="<?php echo $id ?>email_box" name="<?php echo $fieldname ?>[form_html][email_box]" class="email_select email_input field_select"></select>
        <input type="hidden" id="<?php echo $id ?>email_box_selected" value="<?php echo $fields['email_box'] ?>" class="email_input email_box_selected" />
    </p>
    <p class="cf form_html_field_order">
        <label for="<?php echo $id ?>email_order"><?php _e('Email field order', 'optimizepress') ?>:</label>
        <input type="text" id="<?php echo $id; ?>email_order" name="<?php echo $fieldname; ?>[form_html][email_order]" value="<?php echo $fields['email_order']; ?>" />
    </p>
    <div class="form_html_field form_html_info_field cf">
        <p><?php _e('We automatically integrate with the email field from your Email Marketing Service. If you have created a web form for integration, please ensure it includes an email field.', 'optimizepress'); ?></p>
    </div>
    <p class="form_html_field cf">
        <label for="<?php echo $id ?>method"><?php _e('Method', 'optimizepress') ?>:</label>
        <select id="<?php echo $id ?>method" name="<?php echo $fieldname ?>[form_html][method]" class="method_select">
            <option value="post">POST</option>
            <option value="get">GET</option>
        </select>
    </p>
    <p class="form_html_field cf">
        <label for="<?php echo $id ?>action"><?php _e('Form URL', 'optimizepress') ?>:</label>
        <input size="60" type="text" id="<?php echo $id ?>action" name="<?php echo $fieldname ?>[form_html][action]" value="<?php echo $fields['action'] ?>" class="form_action" />
    </p>
    <div class="form_html_field cf extra_fields">
        <label><?php _e('Extra Fields', 'optimizepress') ?></label><br />
        <div class="op-multirow-container cf">
        <?php if(is_array($fields['extra_fields']) && isset($fields['extra_fields']['field_name'])):
        $field_names = $fields['extra_fields']['field_name'];
        for($i=0,$il=count($field_names);$i<$il;$i++):
            $field_id = $id.'form_html_'.$i.'_'; ?>
            <div class="op-multirow cf">
                <div>
                    <label for="<?php echo $field_id ?>field_name"><?php _e('Field Name', 'optimizepress') ?></label>
                    <select name="<?php echo $fieldname ?>[form_html][extra_fields][field_name][]" id="<?php echo $field_id ?>field_name">
                        <option value="op_add_new_field"><?php _e('Add New Field', 'optimizepress') ?></option>
                        <option value="">-----------------</option>
                        <?php if (!empty($list) && !in_array($integrationType, array('custom', 'email'))) : ?>
                        <?php
                            if (false === isset($lists['lists'][$list]['fields'])) {
                                $lists['lists'][$list] = op_assets_provider_item_fields($integrationType, $list);
                            }
                            if (count($lists['lists'][$list]['fields']) > 0) : foreach ($lists['lists'][$list]['fields'] as $key => $value):
                        ?>
                        <option value="<?php echo $key; ?>"><?php echo $value; ?></option>
                        <?php endforeach; endif; ?>
                        <?php endif; ?>
                    </select>
                    <input type="hidden" name="selected_value" value="<?php echo op_attr($field_names[$i]) ?>" />
                </div>
                <div>
                    <input type="text" name="<?php echo $fieldname ?>[form_html][extra_fields][title][]" id="<?php echo $field_id ?>title" value="<?php echo op_attr($fields['extra_fields']['title'][$i]) ?>" />
                </div>
                <div class="form_html_field_with_order form_html_field_text">
                    <label for="<?php echo $field_id ?>text"><?php _e('Text', 'optimizepress') ?></label>
                    <?php if (isset($fields['extra_fields']['hidden'][$i]) && $fields['extra_fields']['hidden'][$i] === 'Y') : ?>
                    <input type="text" name="<?php echo $fieldname ?>[form_html][extra_fields][text][]" id="<?php echo $field_id ?>text" value="<?php echo esc_attr(stripslashes($fields['extra_fields']['text'][$i])); ?>" />
                    <?php else : ?>
                    <input type="text" name="<?php echo $fieldname ?>[form_html][extra_fields][text][]" id="<?php echo $field_id ?>text" value="<?php echo op_attr($fields['extra_fields']['text'][$i]); ?>" />
                    <?php endif; ?>
                </div>
                <div class="form_html_field_order">
                    <label for="<?php echo $field_id ?>order"><?php _e('Order', 'optimizepress') ?></label>
                    <input type="text" name="<?php echo $fieldname ?>[form_html][extra_fields][order][]" id="<?php echo $field_id ?>order" value="<?php echo op_attr($fields['extra_fields']['order'][$i]) ?>" />
                </div>
                <div class="form_html_field_required">
                    <label for="<?php echo $field_id ?>required"><?php _e('Required', 'optimizepress') ?></label>
                    <input type="checkbox" name="<?php echo $fieldname ?>[form_html][extra_fields][required][]" id="<?php echo $field_id ?>required" value="Y" <?php checked((isset($fields['extra_fields']['required'][$i]) ? op_attr($fields['extra_fields']['required'][$i]) : 'N'), 'Y'); ?> />
                </div>
                <div class="form_html_field_hidden">
                    <label for="<?php echo $field_id ?>hidden"><?php _e('Hidden', 'optimizepress') ?></label>
                    <input type="checkbox" name="<?php echo $fieldname ?>[form_html][extra_fields][hidden][]" id="<?php echo $field_id ?>hidden" value="Y" <?php checked((isset($fields['extra_fields']['hidden'][$i]) ? op_attr($fields['extra_fields']['hidden'][$i]) : 'N'), 'Y'); ?> />
                </div>
                <div class="op-multirow-controls">
                    <a href="#remove"><img alt="<?php _e('Remove', 'optimizepress') ?>" src="<?php echo OP_IMG ?>remove-row.png" /></a>
                </div>
            </div>
        <?php endfor; endif ?>
        </div>
        <a class="add-new-row" href="#"><?php _e('Add New', 'optimizepress') ?></a>
    </div>
    <div class="email_data_field cf email_data_extra_fields">
        <label><strong><?php _e('Extra Fields', 'optimizepress') ?></strong></label><br />
        <div class="op-multirow-container cf">
        <?php if(is_array($fields['email_extra_fields'])): $i = 0; foreach($fields['email_extra_fields'] as $item): ?>
            <div class="op-multirow cf">
                <div class="form_html_field_with_order">
                    <label><?php _e('Text', 'optimizepress') ?></label>
                    <input type="text" name="<?php echo $fieldname; ?>[form_html][email_extra_fields][]" value="<?php echo op_attr($item) ?>" />
                </div>
                <div class="form_html_field_order">
                    <label><?php _e('Order', 'optimizepress'); ?></label>
                    <input type="text" name="<?php echo $fieldname; ?>[form_html][email_extra_fields_order][]" value="<?php echo (isset($fields['email_extra_fields_order'][$i]) ? op_attr($fields['email_extra_fields_order'][$i]) : '0'); ?>" />
                </div>
                <div class="form_html_field_required">
                    <label><?php _e('Required', 'optimizepress') ?></label>
                    <input type="checkbox" name="<?php echo $fieldname ?>[form_html][email_extra_fields_required][]" value="Y" <?php checked((isset($fields['email_extra_fields_required'][$i]) ? op_attr($fields['email_extra_fields_required'][$i]) : 'N'), 'Y'); ?> />
                </div>
                <div class="op-multirow-controls">
                    <a href="#remove"><img alt="<?php _e('Remove', 'optimizepress') ?>" src="<?php echo OP_IMG ?>remove-row.png" /></a>
                </div>
            </div>
        <?php $i += 1; endforeach; endif ?>
        </div>
        <a href="#" class="add-new-row"><?php _e('Add New', 'optimizepress') ?></a>
    </div>
    <?php if (true === op_assets_provider_enabled('gotowebinar')) : ?>
    <p class="gotowebinar_field cf">
        <label for="<?php echo $id ?>gotowebinar_enabled"><strong><?php _e('GoToWebinar:', 'optimizepress') ?></strong></label>
        <select id="<?php echo $id ?>gotowebinar_enabled" name="<?php echo $fieldname ?>[form_html][gotowebinar_enabled]" class="gotowebinar_enabled_select">
            <option value="Y"<?php selected('Y', $fields['gotowebinar_enabled']); ?>><?php _e('Integrate with GoToWebinar', 'optimizepress'); ?></option>
            <option value="N"<?php if (!isset($fields['gotowebinar_enabled']) || 'N' === $fields['gotowebinar_enabled']) : echo 'selected="selected"'; endif; ?>><?php _e("Don't integrate", "optimizepress"); ?></option>
        </select>
    </p>
    <p class="gotowebinar_list_field cf<?php if ($fields['gotowebinar_enabled']) { echo ' hidden-el'; } ?>">
        <label for="<?php echo $id ?>gotowebinar"><strong><?php _e('GoToWebinar List:', 'optimizepress') ?></strong></label>
        <select id="<?php echo $id ?>gotowebinar" name="<?php echo $fieldname ?>[form_html][gotowebinar]" class="gotowebinar_select" data-default="<?php echo rawurldecode($fields['gotowebinar']); ?>">
            <?php
                $webinars = op_assets_provider_items('gotowebinar');
                if (count($webinars['lists']) > 0) : foreach ($webinars['lists'] as $webKey => $webinar) : ?>
            ?>
            <option value="<?php echo $webKey; ?>"<?php if ($fields['gotowebinar'] === $webKey) : echo 'selected="selected"'; endif; ?>><?php echo $webinar['name']; ?></option>
            <?php
                endforeach; endif;
            ?>
        </select>
    </p>
    <?php endif; ?>

    <?php if (defined("WS_PLUGIN__OPTIMIZEMEMBER_VERSION")) : ?>
    <br />
    <div class="form_html_info_field cf">
        <p><?php _e('If you want to add a subscriber as a user inside your OptimizeMember membership, select the relevant level and any packages to apply below. Note that no payment will be taken and this user will be added directly to the level/packages you specify.', 'optimizepress'); ?></p>
        <p><?php _e('We recommend collecting name and email on your form when using this option to ensure your user is created with the correct details.', 'optimizepress'); ?></p>
    </div>
    <p class="opm_integration cf">
        <label for="<?php echo $id ?>opm_integration"><strong><?php _e('OptimizeMember Integration:', 'optimizepress') ?></strong></label>
        <select id="<?php echo $id ?>opm_integration" name="<?php echo $fieldname ?>[form_html][opm_integration]" class="opm_integration_select">
            <option value="Y"<?php if (isset($fields['opm_integration']) && 'Y' === $fields['opm_integration']) : echo 'selected="selected"'; endif; ?>><?php _e('Integrate with OptimizeMember', 'optimizepress'); ?></option>
            <option value="N"<?php if (!isset($fields['opm_integration']) || 'N' === $fields['opm_integration']) : echo 'selected="selected"'; endif; ?>><?php _e("Don't integrate", "optimizepress"); ?></option>
        </select>
    </p>
    <p class="opm_levels cf">
        <label for="<?php echo $id ?>opm_level"><strong><?php _e('Membership Level:', 'optimizepress') ?></strong></label>
        <select id="<?php echo $id ?>opm_level" name="<?php echo $fieldname ?>[form_html][opm_level]" class="opm_level_select">
            <option value="">---</option>
            <?php for ($n = 1; $n <= $GLOBALS["WS_PLUGIN__"]["optimizemember"]["c"]["levels"]; $n++) : ?>
            <option value="<?php echo(esc_attr($n)); ?>"<?php if (isset($fields['opm_level']) && $n === (int) $fields['opm_level']) : echo 'selected="selected"'; endif; ?>><?php echo ws_plugin__optimizemember_getMembershipLabel($n); ?></option>
            <?php endfor; ?>
        </select>
    </p>
    <div class="opm_packages cf">
        <label for="<?php echo $id ?>opm_packages"><strong><?php _e('Packages:', 'optimizepress') ?></strong></label>
        <p style="clear: both"><input type="checkbox" name="<?php echo $fieldname ?>[form_html][opm_packages][] ?>" value="">---</p>
        <?php if (count($GLOBALS["WS_PLUGIN__"]["optimizemember"]["o"]["ccp"]) > 0) : ?>
        <?php foreach($GLOBALS["WS_PLUGIN__"]["optimizemember"]["o"]["ccp"] as $label) : ?>
        <p><input type="checkbox" name="<?php echo $fieldname ?>[form_html][opm_packages][<?php echo $label; ?>] ?>" value="<?php echo(esc_attr($label)); ?>"<?php if (isset($fields['opm_packages']) && in_array($label, (array)$fields['opm_packages'])) : echo 'checked="checked"'; endif; ?>><?php echo $label; ?></p>
        <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <?php endif; ?>
    <input type="hidden" class="field_prefix" value="<?php echo esc_attr($fieldname) ?>[form_html]" />
    <input type="hidden" class="field_idprefix" value="<?php echo esc_attr($id) ?>form_html_" />
    <div class="hidden-div hidden-el"></div>
</div>