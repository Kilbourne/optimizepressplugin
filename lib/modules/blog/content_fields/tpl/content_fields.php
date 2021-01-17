<?php
$wysiwyg = function_exists('wp_editor');
foreach($content_fields as $name => $field): ?>
<div class="content-field content-field-<?php echo $field['type'] ?>">
    <label for="<?php echo $id.$name ?>" class="form-title"><?php echo $field['name'] ?></label>
    <?php
    if(!empty($field['help']))
        echo '<p class="op-micro-copy">'.__($field['help'], 'optimizepress').'</p>';
    if(isset($field['font_html'])){
        $name .= '][value';
    }
    switch($field['type']){
        case 'textarea':
            echo '<textarea name="'.$fieldname.'['.$name.']" id="'.$id.$name.'">'.$field['value'].'</textarea>';
            break;
        case 'image':
            op_upload_field($fieldname.'['.$name.']',$field['value']);
            break;
        case 'wysiwyg':
            // op_tiny_mce($field['value'], $id.$name, array('textarea_name'=>$fieldname.'['.$name.']'));
            // adding normal wp_editor
            $editor_settings = array(
                'textarea_name' => $fieldname.'['.$name.']',
            );
            //wp_editor($field['value'], $id.$name, $editor_settings);
            op_tiny_mce($field['value'], $id.$name, $editor_settings);
            break;
        default:
            echo '<input type="text" name="'.$fieldname.'['.$name.']" id="'.$id.$name.'" value="'.$field['value'].'" />';
            break;
    }
    op_get_var_e($field,'font_html');
    ?>
</div>
<?php
endforeach ?>