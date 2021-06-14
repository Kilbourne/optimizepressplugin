
        <?php op_upload_field($fieldname.'[file]',op_default_attr($section_name,$tab,$name,'upload_img')) ?>
        <label for="<?php echo $id ?>imgurl" class="form-title"><?php _e('Hosted elsewhere? Paste the link below', 'optimizepress') ?></label>
        <input type="text" name="<?php echo $fieldname ?>[imgurl]" id="<?php echo $id ?>imgurl" value="<?php echo op_default_attr($section_name,$tab,$name,'imgurl') ?>" />
        
        <label for="<?php echo $id ?>href" class="form-title"><?php _e('Where do you wish this advertisement to link to?', 'optimizepress') ?></label>
        <input type="text" name="<?php echo $fieldname ?>[href]" id="<?php echo $id ?>href" value="<?php echo op_default_attr($section_name,$tab,$name,'href') ?>" />