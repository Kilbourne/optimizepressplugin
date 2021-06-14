	<div class="op-bsw-grey-panel section-<?php echo $name ?>">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php echo $title; ?></a></h3>
			<div class="op-bsw-panel-controls cf">
				<?php $enabled = op_on_off_switch($section_name,$tab,$name) ?>
				<div class="show-hide-panel"><a href="#"></a></div>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	        <p><?php printf(__('Ensure you upload a banner with the dimensions %s', 'optimizepress'),$options['size']) ?></p>
			<?php
            $data = array('id' => 'op_'.$section_name.'_'.$tab.'_'.$name.'_', 'fieldname' => 'op['.$section_name.']['.$tab.']['.$name.']');
            if($options['type'] == 'single'):
                echo $advertising_object->load_tpl('single',$data);
            elseif($options['type'] == 'multi'): ?>
            <div class="op-multirow">
                <ul class="op-multirow-list">
                <?php
                for($i=0,$iteml=count($items);$i<$iteml;$i++){
                    echo $advertising_object->load_tpl('multi_row',array_merge($data,array('item'=>$items[$i],'index'=>$i)));
                }
                ?>
                </ul>
                <div class="clear"></div>
                <a href="#" class="add-new-row"><?php _e('Add New', 'optimizepress') ?></a>
                <input type="hidden" name="<?php echo $data['fieldname'] ?>[max]" value="<?php echo esc_attr($options['max']) ?>" class="op-max-entries" />
            </div>
            <?php endif ?>
        </div>
    </div>