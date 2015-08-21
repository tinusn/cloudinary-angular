namespace cloudinary {
	/* @ngInject */
	function clTransformation() {
		return {
			restrict: 'E',
			transclude: false,
			require: '^clImage',
			link: function(scope, element, attrs, clImageCtrl) {
				var attributes = {};
				angular.forEach(attrs, function(value, name) {
					if (name[0] !== '$') {
						attributes[cloudinaryAttr(name)] = value;
					}
				});
				clImageCtrl.addTransformation(attributes);
			}
		};
	}
	angular
		.module('cloudinary')
		.directive('clTransformation', clTransformation);
}