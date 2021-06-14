var op_asset_settings = (function($){
	return {
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: 'previews',
					addClass: 'op-disable-selected',
					events: {
						change: function(value){
							OP_AB.trigger_insert();
							return false;
						}
					}
				},
				omgpageId: {
					type: 'hidden',
					default_value: opPageId
				}
			}
		},
		insert_steps: {1:true}
	}
}(opjq));