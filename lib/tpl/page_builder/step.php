<!--<h1><?php echo $title ?></h1>-->
<p class="op-description"><?php echo $description ?></p>
   	<?php foreach($sections as $name => $section): 
   	if ($name == 'feature_area') continue;
	$help = $cur_action = $cur_module = ''; $module_type = 'blog';
	$on_off = $no_content = false;
	$options = array();
	if(is_array($section)){
		if(isset($section['action'])){
			$cur_action = $section['action'];
		}
		if(isset($section['help'])){
			$help = $section['help'];
		}
		$on_off = op_get_var($section,'on_off',true);
		$no_content = op_get_var($section,'no_content',false);
		if(isset($section['module'])){
			$cur_module = $section['module'];
			$options = op_get_var($section,'options',$options);
			if(isset($section['module_type'])){
				$module_type = $section['module_type'];
			}
		}
	} else {
		$cur_action = $section;
	}
	if($cur_action == '' && $cur_module == ''){
		$no_content = true;
	}
	$class = $name;
	if(op_has_group_error($section_type.'_'.$name)){
		$class .= ' has-error';
		op_section_error($section_type);
	}
	?>
	<div class="op-bsw-grey-panel section-<?php echo $class.($no_content?' op-bsw-grey-panel-no-content' : '') ?>">
		<div class="op-bsw-grey-panel-header cf">
			<h3><?php echo $no_content ? $section['title'] : '<a href="#">'.$section['title'].'</a>' ?></h3>
			<?php $help_vid = op_help_vid(array('page',$section_type,$name),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><?php echo !$no_content ? '<a href="#"></a>' : '' ?></div>
                <?php
                if($on_off){
                    $enabled = op_page_on_off_switch($name);
                }
				echo $help_vid;
				?>
			</div>
		</div>
        <?php if(!$no_content): ?>
			<?php if(!empty($help)): ?>
            <div class="section-help"><?php echo $help ?></div>
            <?php 
			endif;
            if(!empty($cur_action))
                call_user_func($cur_action);
            if(!empty($cur_module)){
                op_mod($cur_module,$module_type)->display_settings($name,$options);
			}
			?>
        <?php endif ?>
    </div>
    <?php endforeach; ?>