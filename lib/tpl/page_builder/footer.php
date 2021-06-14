
        </div>
        </div> <!-- end .op-pb-main-content -->


	</div>
</div>
<div class="op-bsw-main-content op-pb-footer">
			<div class="op-pb-fixed-width">
	            <fieldset class="form-actions cf">
	                <div class="form-actions-content">
	                    <input type="hidden" name="<?php echo OP_SN ?>_page_builder" value="save" />
	                    <?php wp_nonce_field( 'op_page_builder', '_wpnonce', false ) ?>
	                    <input type="submit" class="op-pb-button green" value="<?php _e($setup_wizard_submit_text, 'optimizepress') ?>" />
	                    <div class="op-loader"></div>
	                </div>
	            </fieldset>
            </div>
        </div>
</form>
<script type="text/javascript" src="<?php echo is_ssl() ? 'https' : 'http'; ?>://www.google.com/jsapi"></script>
<script type="text/javascript">
google.load('webfont','1');
</script>
<?php echo op_tpl('admin_footer') ?>