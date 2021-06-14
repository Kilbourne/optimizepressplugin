<form id="le-colours-dialog">
	<h1><?php _e('Colour Scheme Settings', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
    	<div class="op-actual-lightbox-content">
            <div class="settings-container">
            	<?php $le = new OptimizePress_LiveEditor(); $sections = $le->getSections(true);?>
                <?php
                	op_tpl_assign('nav_menus', wp_get_nav_menus());
					$img = op_img('',true);
					$tabs = array();
					$tab_content = array();
					if (is_array($sections) || is_object($sections)){
						foreach($sections as $name => $section){
							$tabs[$name] = array(
								'title' => $section['title']
							);
							$tab_content[$name] = op_tpl('live_editor/helper',array(
								'section_type'=>$name,
								'sections'=>($name=='functionality' ? $GLOBALS['functionality_sections'] : $section['object']),
								'title' => $section['title'],
								'description' => $section['description'],
							));
							if(op_has_section_error($name)){
								$tabs[$name]['li_class'] = 'has-error';
							}
						}
					}
					$data = array(
						'tabs' => $tabs,
						'tab_content' => $tab_content,
						'module_name' => 'live_editor',
						'error' => '',
						'notification' => '',
					);
					echo op_tpl('live_editor/headers_layout', $data);
                ?>
            </div>
        </div>
    </div>
    <div class="op-insert-button cf">
    	<button type="submit" class="editor-button"><span><?php _e('Update', 'optimizepress') ?></span></button>
    </div>
</form>