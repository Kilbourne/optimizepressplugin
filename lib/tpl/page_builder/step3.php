<?php echo $this->load_tpl('page_builder/header');
if ($page_type != 'membership') : 
	if(($theme_dir = op_page_option('theme','dir')) === false && count($themes) > 0){
		$theme_dir = $themes[0]['dir'];
	}
	
	if ($page_type == 'membership') : ?>
		<h2><?php _e('Create new course, portal or membership site', 'optimizepress'); ?></h2>
		<br />
		<div class="page-options">
			<label class="form-title bold-title" for="op_product_name"><?php _e('Product Name', 'optimizepress') ?></label>
			<input type="text" name="op[product][name]" value="" />
		</div>
	<?php endif; ?>
	<h2><?php _e('Select a Template'.($page_type=='landing'?' Type':''), OP_SN) ?></h2>
	<?php op_help_vid(array('pages','theme')) ?>
	<div class="clear"></div>
	<p><?php _e('Choose a template below for your overall page style. Remember you can use the LiveEditor later to customize all your on-page content.', 'optimizepress') ?></p>
	<?php
	$sel_text = __('Selected', 'optimizepress');
	$prev_text = __('Preview', 'optimizepress');
	$previews = array();
	$img = op_img('',true);
	foreach($themes as $theme){
		$field_id = 'op_theme_'.$theme['dir'];
		$selected = ($theme_dir == $theme['dir']);
		$li_class = $input_attr = '';
		if($selected){
			$li_class = ' img-radio-selected';
			$input_attr = ' checked="checked"';
		}
		$previews[] = array(
			'image' => op_page_url($theme['screenshot_thumbnail'],$theme['dir']),
			'width' => 196,
			'height' => 196,
			'tooltip_title' => $theme['name'],
			'tooltip_description' => $theme['description'],
			'input' => '<input type="radio" name="theme_id" id="'.$field_id.'" value="'.$theme['dir'].'"'.$input_attr.' />',
			'preview_content' => '<a href="'.op_page_url($theme['screenshot'],$theme['dir']).'" class="fancybox"><img src="'.$img.'pagebuilder-preview.png" alt="Preview" width="70" height="70" border="0" /> '.$theme['name'].'</a>',
			'li_class' => $li_class
		);
	}
	echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'theme-select'));
	if($page_type == 'landing'): ?>
	<div id="op_landing_options">
		<h2><?php _e('Select a Template Style', 'optimizepress') ?></h2>
	    <p><?php _e('Choose which template you wish to start editing within the LiveEditor.', 'optimizepress') ?></p>
	<?php
	$feature = op_page_option('feature_area','type');
	//dirty hack
	switch($feature) {
		case 1:
			$feature = 'A';
		break;
		case 2:
			$feature = 'B';
		break;
		case 3:
			$feature = 'C';
		break;
		case 4:
			$feature = 'D';
		break;
		case 5:
			$feature = 'E';
		break;
		case 6:
			$feature = 'F';
		break;
		case 7:
			$feature = 'G';
		break;
		case 8:
			$feature = 'H';
		break;
		case 9:
			$feature = 'I';
		break;
		case 10:
			$feature = 'J';
		break;
		default:
			$feature = 'A';
		break;
	}
	foreach($landing_themes as $key => $features): ?>
		<div id="op_landing_themes_<?php echo $key ?>" class="theme-style-selection<?php echo ($key>1 ? ' op-hidden' : '')?>">
	    	<?php
			$current = op_get_current_item($features,$feature);
			$previews = array();
			foreach($features as $theme_key => $preview){
				$li_class = $input_attr = '';
				if($theme_key == $current){
					$li_class = ' img-radio-selected';
					$input_attr = ' checked="checked"';
				}
				$preview['input'] = '<input type="radio" name="op[feature_area]['.$key.']" value="'.$theme_key.'"'.$input_attr.' />';
				$preview['li_class'] = $li_class;
				$previews[] = $preview;
			}
			echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>''));
			?>
	    </div>
	<?php endforeach ?>
	</div>
	<?php endif; ?>
<?php endif; ?>
<?php // MEMBERSHIP PAGES!!! ?>
<?php if($page_type == 'membership'): 
if(($theme_dir = op_page_option('theme','dir')) === false && count($themes) > 0){
		$theme_dir = $themes[0]['dir'];
	}
	$post = get_post(OP_PAGEBUILDER_ID);
	?>
	<div style="margin-bottom: 20px;">
	<p><?php _e('Here you can create new products, categories, subcategories and content. To edit them, you must use Live editor for that particular page!', 'optimizepress');?></p>
	<a id="opNewProduct" class="op_membership_button" href="#"><?php _e('Create new course, product or membership portal', 'optimizepress'); ?></a>
	<?php if (OptimizePress_PageBuilder::productExist()) :?>
		<a id="opNewModule" class="op_membership_button" href="#"><?php _e('Add new modules or content to existing product or membership site', 'optimizepress'); ?></a>
	<?php endif; ?>
	</div>
	<div class="page-options" id="productName">
		<h2><?php _e('Create new course, portal or membership site', 'optimizepress'); ?></h2>
		<br />
		<label class="form-title bold-title" for="op_product_name"><?php _e('Product Name', 'optimizepress') ?></label>
		<input type="text" name="op[product][name]" id="op_productName" value="<?php echo $post->post_title; ?>" />
	</div>
	<div id="templates">
	<h2><?php _e('Select a Template'.($page_type=='landing'?' Type':''), OP_SN) ?></h2>
	<?php op_help_vid(array('pages','theme')) ?>
	<div class="clear"></div>
	<p><?php _e('Choose a template below for your overall page style. Remember you can use the LiveEditor later to customize all your on-page content.', 'optimizepress') ?></p>
	<?php
	$sel_text = __('Selected', 'optimizepress');
	$prev_text = __('Preview', 'optimizepress');
	$previews = array();
	$img = op_img('',true);
	foreach($themes as $theme){
		$field_id = 'op_theme_'.$theme['dir'];
		$selected = ($theme_dir == $theme['dir']);
		$li_class = $input_attr = '';
		if($selected){
			$li_class = ' img-radio-selected';
			$input_attr = ' checked="checked"';
		}
		$previews[] = array(
			'image' => op_page_url($theme['screenshot_thumbnail'],$theme['dir']),
			'width' => 196,
			'height' => 196,
			'tooltip_title' => $theme['name'],
			'tooltip_description' => $theme['description'],
			'input' => '<input type="radio" name="theme_id" id="'.$field_id.'" value="'.$theme['dir'].'"'.$input_attr.' />',
			'preview_content' => '<a href="'.op_page_url($theme['screenshot'],$theme['dir']).'" class="fancybox"><img src="'.$img.'pagebuilder-preview.png" alt="Preview" width="70" height="70" border="0" /> '.$theme['name'].'</a>',
			'li_class' => $li_class
		);
	}
	echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'theme-select')); ?>
	</div>
	<?php /*
	<div id="layoutSelector">
		<h2><?php _e('Select Dashboard Content Type', 'optimizepress') ?></h2>
		<p><?php _e('Please note that when you first create a product page, no content will show. It will show after you add modules and content to your product', 'optimizepress') ?></p>
		<div id="preset-option">
		<?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$preset_options,'classextra'=>'preset-type-select')); ?>
		</div>
	</div>
	*/ ?>
	<input type="hidden" name="op[theme]" id="opThemeDir" value="" />
	<div id="pageType">
		<h2><?php _e('Select product', 'optimizepress') ?></h2>
		<p><?php _e('Select product for the content you are creating to be assigned to', 'optimizepress') ?></p>
		<select name="op[pageType][product]" id="op_product_id">
			<?php echo $product_select; ?>
		</select>
		<h2><?php _e('Select a page type', 'optimizepress');?></h2>
		<p></p>
		<select id="pageTypeChange" name="op[pageType][type]">
			<option value="">---</option>
			<option value="category"><?php _e('Category/Module', 'optimizepress');?></option>
			<option value="subcategory"><?php _e('Subcategory/Submodule', 'optimizepress');?></option>
			<option value="content"><?php _e('Content/Post/Lesson', 'optimizepress');?></option>
		</select>
	</div>
	<div id="category">
		<h2><?php _e('Category naming', 'optimizepress') ?></h2>
		<p><?php _e('Enter the title for the category', 'optimizepress') ?></p>
		<input id="opCategoryName" type="text" name="op[category][name]" value="<?php echo $post->post_title; ?>" />
		<h2><?php _e('Category description', 'optimizepress') ?></h2>
		<p><?php _e('Enter the description for the category', 'optimizepress') ?></p>
		<textarea name="op[category][description]" ></textarea>
		<?php /*
		<h2><?php _e('Select category content type', 'optimizepress') ?></h2>
		<p><?php _e('This is how it will be presented', 'optimizepress') ?></p>
		<div id="preset-option">
		<?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$preset_options,'classextra'=>'preset-type-select')); ?>
		</div>
		*/ ?>
	</div>
	<div id="subcategory">
		<h2><?php _e('Select category', 'optimizepress') ?></h2>
		<p><?php _e('Select category to nest this subcategory under', 'optimizepress') ?></p>
		<select name="op[subcategory][category]" id="op_category_id">
			<?php echo $category_select; ?>
		</select>
		<h2><?php _e('Subcategory naming', 'optimizepress') ?></h2>
		<p><?php _e('Enter the title for the subcategory', 'optimizepress') ?></p>
		<input id="opSubCategoryName" type="text" name="op[subcategory][name]" value="<?php echo $post->post_title; ?>" />
		<h2><?php _e('Subcategory description', 'optimizepress') ?></h2>
		<p><?php _e('Enter the description for the subcategory', 'optimizepress') ?></p>
		<textarea name="op[subcategory][description]" ></textarea>
		<?php  /*
		<h2><?php _e('Select subcategory content type', 'optimizepress') ?></h2>
		<p><?php _e('This is how it will be presented', 'optimizepress') ?></p>
		<div id="preset-option">
		<?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$preset_options,'classextra'=>'preset-type-select')); ?>
		</div>
		*/ ?>
	</div>
	<div id="content">
		<div style="float:left; width: 50%;">
		<h2><?php _e('Select category', 'optimizepress') ?></h2>
		<p><?php _e('Select category to nest this content under', 'optimizepress') ?></p>
		<select name="op[content][category]" id="op_category_id1">
			<?php echo $category_select; ?>
		</select>
		</div>
		<div style="float:right;width:50%;">
		<h2><?php _e('Select subcategory', 'optimizepress') ?></h2>
		<p><?php _e('Select subcategory to nest this content under', 'optimizepress') ?></p>
		<select name="op[content][subcategory]" id="op_subcategory_id">
			<?php echo $subcategory_select; ?>
		</select>
		</div>
		<div style="clear:both;"></div>
		<h2><?php _e('Content naming', 'optimizepress') ?></h2>
		<p><?php _e('Enter the title for the content', 'optimizepress') ?></p>
		<input  id="opContentName" type="text" name="op[content][name]" value="<?php echo $post->post_title; ?>" />
		<h2><?php _e('Content description', 'optimizepress') ?></h2>
		<p><?php _e('Enter the description for the content', 'optimizepress') ?></p>
		<textarea name="op[content][description]" ></textarea>
		<?php  /* 
		<h2><?php _e('Select content content type', 'optimizepress') ?></h2>
		<p><?php _e('This is how it will be presented', 'optimizepress') ?></p>
		<div id="preset-option">
		<?php array_pop($preset_options); ?>
		<?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$preset_options,'classextra'=>'preset-type-select')); ?>
		</div>
		*/ ?>
	</div> 
<?php endif;
echo $this->load_tpl('page_builder/footer'); ?>