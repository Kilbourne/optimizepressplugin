<?php include 'style.inc.php'; ?>

<div id="<?php echo $id; ?>" class="optin-box optin-box-1"<?php echo $style_str; ?>>
    <?php
        $headline = op_get_var($content,'headline','','<h2>%1$s</h2>');
        echo !empty($headline) ? $headline : '';
    ?>
    <div class="optin-box-content">
        <?php
            $paragraph = op_get_var($content,'paragraph','');
            echo !empty($paragraph) ? $paragraph : '';
        ?>
        <?php echo $form_open.$hidden_str ?>
            <?php op_get_var_e($fields,'email_field'); ?>
            <?php echo $submit_button ?>
            <?php do_action('op_after_optin_submit_button'); ?>
        </form>
        <?php op_get_var_e($content,'privacy','','<p class="privacy"><img src="'.OP_ASSETS_URL.'images/optin_box/privacy.png" alt="privacy" width="16" height="15" /> %1$s</p>') ?>
    </div>
</div>
