Class.Mutators.Attributes = function(attributes) {
/*
	this.implement({
		$attributes: attributes,
		
		_get: function(name) {
			return this.$attributes[name];
		},
		
		_set: function(name, value) {
			
		}
	});
	*/
	
	Object.defineProperties(this.prototype, attributes);
}