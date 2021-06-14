<?php 
$button = $signup_form_object->get_option($section_name,'button');
echo _op_assets('style_selector',array('group'=>'core','tag'=>'button','folder'=>'previews','fieldid'=>$id.'button_type'),$fieldname.'[button][type]',op_get_var($button,'type')); 
?>
<div class="button-option-style button-option-style-1">
    <label class="form-title"><?php _e('Colour', 'optimizepress') ?></label>
    <select name="<?php echo $fieldname ?>[button][color_1]" id="<?php echo $id ?>button_color_1">
    <?php
    $options = array('blue'=>__('Blue', 'optimizepress'),'green'=>__('Green', 'optimizepress'),'light-green'=>__('Light Green', 'optimizepress'),'orange'=>__('Orange', 'optimizepress'),'red'=>__('Red', 'optimizepress'),'silver'=>__('Silver', 'optimizepress'),'teal'=>__('Teal', 'optimizepress'));
    $selected = op_get_var($button,'color_1','blue');
    foreach($options as $opt => $text){
        echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
    }
    ?>
    </select>
</div>
<div class="button-option-style button-option-style-2">
    <label class="form-title"><?php _e('Background Image', 'optimizepress') ?></label>
    <select name="<?php echo $fieldname ?>[button][bg_color_2]" id="<?php echo $id ?>button_bg_color_2">
    <?php
    $options = array(''=>__('Yellow', 'optimizepress'),'silver'=>__('Silver', 'optimizepress'));
    $selected = op_get_var($button,'bg_color_2');
    foreach($options as $opt => $text){
        echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
    }
    ?>
    </select>
</div>
<div class="button-option-style button-option-style-5">
    <label class="form-title"><?php _e('Background Colour', 'optimizepress') ?></label>
    <select name="<?php echo $fieldname ?>[button][bg_color_5]" id="<?php echo $id ?>button_bg_color_5">
    <?php
    $options = array('green'=>__('Green', 'optimizepress'),'orange'=>__('Orange', 'optimizepress'));
    $selected = op_get_var($button,'bg_color_5','green');
    foreach($options as $opt => $text){
        echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
    }
    ?>
    </select>
</div>
<div class="button-option-style button-option-style-4">
    <label class="form-title"><?php _e('Background Image', 'optimizepress') ?></label>
    <?php echo _op_assets('style_selector',array('group'=>'core','tag'=>'button','folder'=>'bg_img_4/previews','fieldid'=>$id.'button_bg_img_4'),$fieldname.'[button][bg_img_4]',op_get_var($button,'bg_img_4')); ?>
</div>
<div class="button-option-style button-option-style-cart">
    <label class="form-title"><?php _e('Background Image', 'optimizepress') ?></label>
    <?php echo _op_assets('image_selector',array('group'=>'core','tag'=>'button','folder'=>'cart/previews','fieldid'=>$id.'button_bg_img_cart'),$fieldname.'[button][bg_img_cart]',op_get_var($button,'bg_img_cart')); ?>
</div>
<div class="button-option-style button-option-style-3">
    <label class="form-title"><?php _e('Background Colour', 'optimizepress') ?></label>
    <select name="<?php echo $fieldname ?>[button][border_3]" id="<?php echo $id ?>button_border_3">
    <?php
    $options = array(''=>__('Normal', 'optimizepress'),'rounded'=>__('Rounded', 'optimizepress'));
    $selected = op_get_var($button,'border_3');
    foreach($options as $opt => $text){
        echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
    }
    ?>
    </select>
    <label class="form-title"><?php _e('Size', 'optimizepress') ?></label>
    <select name="<?php echo $fieldname ?>[button][size_3]" id="<?php echo $id ?>button_size_3">
    <?php
    $options = array('small'=>__('Small', 'optimizepress'),'medium'=>__('Medium', 'optimizepress'),'large'=>__('Large', 'optimizepress'));
    $selected = op_get_var($button,'size_3','small');
    foreach($options as $opt => $text){
        echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
    }
    ?>
    </select>
    <label class="form-title"><?php _e('Colour', 'optimizepress') ?></label>
    <select name="<?php echo $fieldname ?>[button][color_3]" id="<?php echo $id ?>button_color_3">
    <?php
    $options = array('black' => __('Black', 'optimizepress'),'blue'=>__('Blue', 'optimizepress'),'brightgreen'=>__('Bright Green', 'optimizepress'),'darkblue'=>__('Dark Blue', 'optimizepress'),'darkgrey'=>__('Dark Grey', 'optimizepress'),'darkorange'=>__('Dark Orange', 'optimizepress'),'green'=>__('Green', 'optimizepress'),'lightblue'=>__('Light Blue', 'optimizepress'),'lightgreen'=>__('Light Green', 'optimizepress'),'lightorange'=>__('Light Orange', 'optimizepress'),'lightred'=>__('Light Red', 'optimizepress'),'lightviolet'=>__('Light Violet', 'optimizepress'),'orange'=>__('Orange', 'optimizepress'),'pink'=>__('Pink', 'optimizepress'),'red'=>__('Red', 'optimizepress'),'silver'=>__('Silver', 'optimizepress'),'teal'=>__('Teal', 'optimizepress'),'violet'=>__('Violet', 'optimizepress'),'yellow'=>__('Yellow', 'optimizepress'));
    $selected = op_get_var($button,'color_3');
    foreach($options as $opt => $text){
        echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
    }
    ?>
    </select>
</div>
<div class="button-option-style button-option-style-1 button-option-style-3">
    <label class="form-title"><?php _e('Text', 'optimizepress') ?></label>
    <input type="text" name="<?php echo $fieldname ?>[button][content]" id="<?php echo $id ?>button_content" value="<?php op_attr(op_get_var($button,'content'),true) ?>" />
</div>
<div class="button-option-style button-option-style-2">
    <label class="form-title"><?php _e('Text', 'optimizepress') ?></label>
    <?php echo _op_assets('image_selector',array('group'=>'core','tag'=>'button','folder'=>'button-text-blue','fieldid'=>$id.'button_text_2'),$fieldname.'[button][text_2]',op_get_var($button,'text_2')); ?>
</div>
<div class="button-option-style button-option-style-4">
    <div class="op-type-switcher-container">
        <label class="form-title"><?php _e('Text', 'optimizepress') ?></label>
        <select name="<?php echo $fieldname ?>[button][text_4]" id="<?php echo $id ?>button_text_4" class="op-type-switcher">
        <?php
        $options = array('light' => __('Light', 'optimizepress'),'dark'=>__('Dark', 'optimizepress'));
        $selected = op_get_var($button,'text_4','light');
        foreach($options as $opt => $text){
            echo '<option value="'.$opt.'"'.($selected==$opt?' selected="selected"':'').'>'.$text.'</option>';
        }
        ?>
        </select>
        <div class="op-type op-type-light<?php echo $selected == 'light' ? '' : ' op-disabled-type' ?>">
            <label class="form-title"><?php _e('Text', 'optimizepress') ?></label>
            <?php echo _op_assets('image_selector',array('group'=>'core','tag'=>'button','folder'=>'button-4-text/light','fieldid'=>$id.'button_text_4_light'),$fieldname.'[button][text_4_light]',op_get_var($button,'text_4_light')); ?>
        </div>
        <div class="op-type op-type-dark<?php echo $selected == 'dark' ? '' : ' op-disabled-type' ?>">
            <label class="form-title"><?php _e('Text', 'optimizepress') ?></label>
            <?php echo _op_assets('image_selector',array('group'=>'core','tag'=>'button','folder'=>'button-4-text/dark','fieldid'=>$id.'button_text_4_dark'),$fieldname.'[button][text_4_dark]',op_get_var($button,'text_4_dark')); ?>
        </div>
    </div>
</div>
<div class="button-option-style button-option-style-5">
    <label class="form-title"><?php _e('Text', 'optimizepress') ?></label>
    <?php echo _op_assets('image_selector',array('group'=>'core','tag'=>'button','folder'=>'button5','fieldid'=>$id.'button_text_5'),$fieldname.'[button][text_5]',op_get_var($button,'text_5')); ?>
</div>