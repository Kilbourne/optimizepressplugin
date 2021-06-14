<div class="content">
	<?php op_get_var_e($content,'title','','<h2>%1$s</h2>') ?>
	<?php op_get_var_e($content,'form_header','','<p>%1$s</p>') ?>
    <div class="signup-now">
    	<a href="<?php op_get_var_e($content,'link_url') ?>" class="big-yellow-button"><?php op_get_var_e($content,'submit_button') ?></a>
        <?php op_get_var_e($content,'footer_note','','<p>%1$s</p>') ?>
    </div>
</div>