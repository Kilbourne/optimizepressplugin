var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-login-form.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-login-form.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: 'previews',
					addClass: 'op-disable-selected'
				}
			},
			step_2: {
				public_title: {
					title: 'public_title',
					addClass: 'op-membership-login-label'
				},
				public_title_description: {
					text: OP_AB.translate('when_not_logged_in'),
					type: 'paragraph',
					addClass: 'op-membership-login-description'
				},
				redirection_after_login: {
					title: 'redirection_after_login',
					type: 'select',
					values: {'': OP_AB.translate('login_welcome_page'), '%%previous%%': OP_AB.translate('previous_page'), '%%home%%': OP_AB.translate('home_page')},
					default_value: '',
					addClass: 'op-membership-login-select'
				},
				signup_now: {
					title: 'signup_now',
					default_value: '%%automatic%%',
					addClass: 'op-membership-login-label'
				},
				signup_now_description: {
					type: 'paragraph',
					text: OP_AB.translate('enter_url_or_use_automatic'),
					addClass: 'op-membership-login-description'
				},
				additional_code_1: {
					type: 'textarea',
					title: 'additional_xhtml_php_code'
				},
				separator: {
					type: 'custom_html',
					html: '<hr />'
				},
				profile_title: {
					title: 'profile_title',
					addClass: 'op-membership-login-label'
				},
				profile_title_description: {
					text: OP_AB.translate('when_logged_in'),
					type: 'paragraph',
					addClass: 'op-membership-login-description'
				},
				display_gravatar: {
					title: 'display_gravatar_image',
					type: 'select',
					values: {'1': OP_AB.translate('yes_display_gravatar'), '0': OP_AB.translate('no_do_not_display')},
					default_value: '1',
					addClass: 'op-membership-login-select'
				},
				link_to_gravatar: {
					title: 'link_to_gravatar',
					type: 'select',
					values: {'1': OP_AB.translate('yes_apply_link'), '0': OP_AB.translate('no_do_not_apply')},
					default_value: '1',
					addClass: 'op-membership-login-select'
				},
				display_user_name: {
					title: 'display_user_name',
					type: 'select',
					values: {'1': OP_AB.translate('yes_display_user_name'), '0': OP_AB.translate('no_do_not_display')},
					default_value: '1',
					addClass: 'op-membership-login-select'
				},
				my_account: {
					title: 'my_account',
					default_value: '%%automatic%%',
					addClass: 'op-membership-login-label'
				},
				my_account_description: {
					type: 'paragraph',
					text: OP_AB.translate('enter_url_or_use_automatic'),
					addClass: 'op-membership-login-description'
				},
				edit_profile: {
					title: 'edit_profile',
					default_value: '%%automatic%%',
					addClass: 'op-membership-login-label'
				},
				edit_profile_description: {
					type: 'paragraph',
					text: OP_AB.translate('enter_url_or_use_automatic'),
					addClass: 'op-membership-login-description'
				},
				redirection_after_logout: {
					title: 'redirection_after_logout',
					type: 'select',
					values: {'%%home%%': OP_AB.translate('home_page'), '%%previous%%': OP_AB.translate('previous_page'), '': OP_AB.translate('login_screen')},
					default_value: '%%home%%',
					addClass: 'op-membership-login-select'
				},
				additional_code_2: {
					type: 'textarea',
					title: 'additional_xhtml_php_code'
				}
			}
		},
		insert_steps: {2:true}
	};
}(opjq));