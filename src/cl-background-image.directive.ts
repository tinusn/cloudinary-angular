namespace cloudinary {
	/* @ngInject */
	function clBackgroundImage(Cloudinary: Cloudinary, $log) {
		return {
			restrict: 'A',
			scope: {},
			priority: 99,
			link: function(scope, element, attrs) {
				var deregisterObserver = attrs.$observe('publicId', function(publicId) {
					if (!publicId) return;
					var attributes: any = {};
					
					angular.forEach(attrs, function(value, name) {
						attributes[cloudinaryAttr(name)] = value;
					});

					var url = cloudinary_url(publicId, attributes, Cloudinary.config);
					
					angular.element(element)[0].style['background-image'] = `url('${url}')`;
					angular.element(element)[0].style['background-color'] = 'transparent';
					angular.element(element)[0].style['background-repeat'] = 'no-repeat';
					angular.element(element)[0].style['background-position'] = 'center';
					//deregisterObserver();
				});
			}
		};
	}
	angular
		.module('cloudinary')
		.directive('clBackgroundImage', clBackgroundImage);
}