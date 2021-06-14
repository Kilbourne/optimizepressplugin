			</div>

			<?php if(!(isset($hide_submit) && $hide_submit === true)): ?>
			<fieldset class="form-actions cf">
				<div class="form-actions-content">
	           			<input type="hidden" name="<?php echo OP_SN ?>_setup_wizard" value="save" />
	                				<?php wp_nonce_field( 'op_save_wizard', '_wpnonce', false ) ?>
					<?php
						if ($cur_step==5){
							?>
							<input type="submit" class="op-pb-button green" value="<?php _e('Continue to Blog Settings', 'optimizepress') ?>" />
							<?php
						} else {
							?>
							<a href="<?php echo admin_url() ?>" class="op-pb-button" style="display:inline-block; float:left; color: #fff!important; text-decoration: none; padding-top: 15px; height: 33px;"><?php _e('Cancel', 'optimizepress'); ?></a>
							<input type="submit" class="op-pb-button green" value="<?php _e($setup_wizard_submit_text, 'optimizepress') ?>" />
							<?php
						}
					?>
				</div>
			</fieldset>
	       		<?php endif ?>

		</div>
	</div>
</form>
<script type="text/javascript" src="<?php echo is_ssl() ? 'https' : 'http'; ?>://www.google.com/jsapi"></script>
<script type="text/javascript">
google.load('webfont','1');
</script>