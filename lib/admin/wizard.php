<?php
class OptimizePress_SetupWizard
{
	var $cur_step;
	var $sections;
	var $error = false;
	var $notification = false;

	function __construct()
	{
		add_action('admin_menu',array($this,'admin_menu'), 50);
	}

	function get_step()
	{
		if(!isset($this->cur_step)){
			$step = intval(isset($_GET['step'])?$_GET['step']:1);
			$this->cur_step = $step > 0 ? $step : 1;
			op_tpl_assign('cur_step',$this->cur_step);
			if($this->cur_step > 0){
				$sections = array(
					1 => array('submit_button' => __('Continue to Step 2: Brand Your Blog', 'optimizepress')),
					2 => array('section' => 'brand','submit_button' => __('Continue to Step 3: Choose Layout', 'optimizepress')),
					3 => array('section' => 'layout','submit_button' => __('Continue to Step 4: Blog Modules', 'optimizepress')),
					4 => array('section' => 'modules','submit_button' => __('Continue to Step 5: Finish Setup', 'optimizepress')),
				);
				if(isset($sections[$this->cur_step])){
					$section = $sections[$this->cur_step];
					op_tpl_assign('setup_wizard_submit_text',$section['submit_button']);
					if(isset($section['section'])){
						op_tpl_assign('section_type',$section['section']);
						require_once OP_LIB.'sections/blog/'.$section['section'].'.php';
						$class = 'OptimizePress_Sections_'.ucfirst($section['section']);
						$this->sections = new $class();
					}
				}
			}
		}
		return $this->cur_step;
	}

	function admin_menu()
	{
		$page = add_submenu_page(OP_SN, __('Blog Setup', 'optimizepress'), __('Blog Setup', 'optimizepress'), 'edit_theme_options', OP_SN.'-setup-wizard', array($this,'setup_wizard'));
		add_action('load-'.$page,array($this,'save_setup_wizard'));
		add_action('admin_print_styles-'.$page, array($this,'print_scripts'));
		add_action('admin_footer-'.$page, array($this,'print_footer_scripts'));
	}

	function print_scripts()
	{
		op_print_scripts(array('wizard',$this->cur_step));
		wp_enqueue_style(OP_SN.'-admin-common', false, false, OP_VERSION);
		op_enqueue_backend_scripts();
	}

	function print_footer_scripts()
	{
		op_print_footer_scripts(array('wizard',$this->cur_step));
	}

	function setup_wizard()
	{
		if($this->error){
			op_tpl_assign('error',$this->error);
		}
		if($this->notification){
			op_tpl_assign('notification',$this->notification);
		}
		if($this->cur_step > 5){
			return op_show_error(__('You have completed the wizard.', 'optimizepress'));
		}
		$func = array($this,'step_'.$this->cur_step);
		if(!is_callable($func)){
			$func[1] = 'step';
		}
		echo call_user_func($func);
	}

	function save_setup_wizard()
	{
		$this->get_step();
		if(isset($_POST[OP_SN.'_setup_wizard']) && $this->cur_step < 5){
			if(isset($_POST['_wpnonce']) && wp_verify_nonce($_POST['_wpnonce'],'op_save_wizard')){
				$func = array($this,'save_step_'.$this->cur_step);
				if(!is_callable($func)){
					$func[1] = 'save_step';
				}
				call_user_func($func);
			} else {
				$this->error = __('Verification failed, please refresh the page and try again.', 'optimizepress');
			}
		}
		if(OP_REINIT_THEME && OP_SHOW_THEME_MSG){
			$this->notification = __('Your theme has been changed. Please review ALL settings', 'optimizepress');
		}
	}




	// Step 1 - Theme Selection
	function step_1()
	{
		if(($dirs = op_dir_list(OP_THEMES)) === false){
			return op_show_error(__('No themes were found. Please check the themes directory is present and contains themes.', 'optimizepress'));
		}
		$themes = array();
		foreach($dirs as $d){
			if(($conf = op_load_theme_config($d)) !== false){
				$themes[] = array('name' => $conf['name'],
								  'screenshot' => $conf['screenshot'],
								  'screenshot_thumbnail' => $conf['screenshot_thumbnail'],
								  'description' => $conf['description'],
								  'dir' => $d);
			}
		}
		usort($themes,'op_sort_theme_array');
		return op_tpl('wizard/step1',array('themes'=>$themes));
	}

	function save_step_1()
	{
		if(isset($_POST['theme_id'])){
			$ext = '';
			if(op_get_option('theme','dir') != $_POST['theme_id'] && (($conf = op_load_theme_config($_POST['theme_id'])) !== false)){
				$ext .= '&theme_switch='.$_POST['theme_id'];
			}
			wp_redirect(menu_page_url(OP_SN.'-setup-wizard',false).'&step=2'.$ext);
		}
	}

	function save_step_4()
	{
		$this->save_step(false);
		if(!op_has_error()){
			op_update_option('blog_enabled','Y');
			wp_redirect(menu_page_url(OP_SN.'-setup-wizard',false).'&step=5');
		}
	}

	function step_5()
	{
		return op_tpl('wizard/step5');
	}

	// Step 2, 3, 4
	function step()
	{
		return op_tpl('wizard/step',array('sections'=>$this->sections->sections()));
	}

	function save_step($redirect=true)
	{
		$op = $_POST['op'];
		$sections_op = op_get_var($op,'sections',array());
		$sections = $this->sections->sections();
		foreach($sections as $name => $section){
			if(is_array($section)){
				if(isset($section['save_action'])){
					call_user_func_array($section['save_action'],array($sections_op));
				}
				if(isset($section['module'])){
					$mod_ops = op_get_var($op,$name,array());
					$opts = op_get_var($section,'options',array());
					op_mod($section['module'])->save_settings($name,$opts,$mod_ops);
				}
			}
		}
		if(!op_has_error() && $redirect){
			wp_redirect(menu_page_url(OP_SN.'-setup-wizard',false).'&step='.++$this->cur_step);
		}
	}
}
new OptimizePress_SetupWizard();