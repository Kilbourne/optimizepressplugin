var op_asset_settings = (function($){
	return {
		attributes: {
			step_1: {
				style: {
					type: 'image-selector',
					folder: '',
					addClass: 'op-disable-selected',
					events: {
						change: function(value){
							OP_AB.trigger_insert();
							return false;
						}
					}
				}
			}
		}
	}
}(opjq));