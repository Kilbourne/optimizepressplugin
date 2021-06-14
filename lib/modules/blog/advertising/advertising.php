<?php
class OptimizePress_Blog_Advertising_Module extends OptimizePress_Modules_Base {
	
	function display_settings($section_name,$config=array(),$return=false){
		if(($cur = $this->get_option($section_name)) === false){
			$cur = array();
		}
		$tabs = $tab_content = array();
		op_tpl_assign('section_name',$section_name);
		foreach($config as $name => $tab){
			$str = '';
			$cur_items = op_get_var($cur,$name,array());
			$section_array = array($section_name,$name);
			foreach($tab['options'] as $short_name => $options){
				$cur_item = op_get_var($cur_items,$short_name,array());
				$options = $this->_get_options($options,array($section_array,$short_name));
				$data = array('tab' => $name,
							  'title' => $options['title'],
							  'name' => $short_name,
							  'options' => $options['tab_opts']);
				if($options['tab_opts']['type'] == 'multi'){
					$items = op_get_var($cur_item,'ads_array',array());
					if(count($items) == 0){
						$items[] = array(
							'href' => '',
							'imgurl' => '',
							'upload_file' => '',
							'type' => 'file'
						);
					}
					$data['items'] = $items;
				}
				$str .= $this->load_tpl('advert_entry',$data);
			}
			$tabs[$name] = array(
				'title' => $tab['title'],
			);
			if(op_has_group_error($section_name.'_'.$name)){
				$tabs[$name]['li_class'] = 'has-error';
			}
			$tab_content[$name] = $str;
		}
		$data = array(
			'tabs' => $tabs,
			'tab_content' => $tab_content,
			'module_name' => 'advertising'
		);
		echo $this->load_tpl('generic/tabbed_module',$data,false);
	}
	
	function save_settings($section_name,$config=array(),$op){
		if(($cur = $this->get_option($section_name)) === false){
			$cur = array();
		}
		$cur['enabled'] = op_get_var($op,'enabled','N');
		foreach($config as $name => $tab){
			if(!isset($cur[$name])){
				$cur[$name] = array();
			}
			$items = op_get_var($op,$name,array());
			$cur_items = op_get_var($cur,$name,array());
			$section_array = array($section_name,$name);
			foreach($tab['options'] as $short_name => $options){
				$options = $this->_get_options($options,array($section_array,$short_name));
				$type = $options['tab_opts']['type'];
				$item = op_get_var($items,$short_name,array());
				$cur_item = op_get_var($cur_items,$short_name,array());
				$cur_item['enabled'] = op_get_var($item,'enabled','N');
				if($type == 'single'){
					$cur_item['upload_img'] = op_get_var($item,'file','');
					$cur_item['href'] = op_get_var($item,'href','');
					$cur_item['imgurl'] = op_get_var($item,'imgurl','');
				}
				if($type == 'multi'){
					$images = array();
					foreach(array('type','imgurl','href','file') as $field){
						$$field = op_get_var($item,$field,array());
					}
					for($i=0;$i<$options['tab_opts']['max'];$i++){
						if(isset($type[$i])){
							$images[] = array(
								'type' => $type[$i],
								'imgurl' => $imgurl[$i],
								'href' => $href[$i],
								'upload_img' => $file[$i]
							);
						}
					}
					$cur_item['ads_array'] = $images;
				}
				$cur_items[$short_name] = $cur_item;
			}
			$cur[$name] = $cur_items;
		}
		$this->update_option($section_name,$cur);
	}
	
	function _get_options($item,$section_name){
		$tab_opts = array(
			'size' => '468x60',
			'type' => 'single',
			'max' => 2,
			'before_ad' => '<div class="in-page-ad">',
			'after_ad' => '</div>',
		);
		if(is_array($item)){
			$title = $item['title'];
			$tab_opts = array_merge($tab_opts,$item);
		} else {
			$title = $item;
		}
		$tab_opts['size'] = apply_filters('op_mod_advertising_sizes',$tab_opts['size'],$section_name);
		return array('title' => $title, 'tab_opts' => $tab_opts);
	}
	
	function output($section_name,$config,$op,$return=false){
		if(count($section_name) < 3){
			return;
		}
		$checks = array($section_name[1],'options',$section_name[2]);
		foreach($checks as $check){
			$config = op_get_var($config,$check,array());
		}
		$config = $this->_get_options($config,$section_name);
		if(op_get_var($op,'enabled','N') == 'Y'){
			$type = $config['tab_opts']['type'];
			if($type == 'single'){
				$img = $this->_get_display_ad($op,$config);
				if($return){
					return $img;
				}
				echo $img;
			} elseif($type == 'multi'){
				$out = '';
				if(isset($op['ads_array']) && count($op['ads_array']) > 0){
					foreach($op['ads_array'] as $ad){
						$out .= $this->_get_display_ad($ad,$config,false);
					}
					if($out != ''){
						$out = $config['tab_opts']['before_ad'].$out.$config['tab_opts']['after_ad'];
					}
				}
				if($return){
					return $out;
				}
				echo $out;
			}
		}
	}
	
	function _get_display_ad($op,$config,$wrapper=true){
		$upload_img = op_get_var($op,'upload_img');
		$imgurl = op_get_var($op,'imgurl');
		if($imgurl == ''){
			$imgurl = $upload_img;
		}
		if($imgurl != ''){
			$img = '<img src="'.$imgurl.'" alt="" border="0" />';
			$url = op_get_var($op,'href');
			if($url != ''){
				$img = '<a href="'.$url.'" target="_blank">'.$img.'</a>';
			}
			$img = ($wrapper ? $config['tab_opts']['before_ad'].$img.$config['tab_opts']['after_ad'] : $img);
			return $img;
		}
		return '';
	}
	
}