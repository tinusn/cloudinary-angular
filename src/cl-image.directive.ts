namespace cloudinary {
	/* @ngInject */
	function clImage(Cloudinary: Cloudinary) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<img ng-transclude/>',
			scope: {},
			priority: 99,
			controller: function($scope) {
				this.addTransformation = function(ts) {
					$scope.transformations = $scope.transformations || [];
					$scope.transformations.push(ts);
				}
			},
			link: function(scope, element, attrs) {
				var attributes: any = {};
				angular.forEach(attrs, function(value, name) {
					attributes[cloudinaryAttr(name)] = value;
				});

				if (scope.transformations) {
					attributes.transformation = scope.transformations;
				}

				var deregisterObserver = attrs.$observe('publicId', function(publicId) {
					if (!publicId) return;
					var url = cloudinary_url(publicId, attributes, Cloudinary.config);
					element.attr('src', url);
					//deregisterObserver();
				});

				if (attrs.htmlWidth) {
					element.attr("width", attrs.htmlWidth);
				} else {
					element.removeAttr("width");
				}
				if (attrs.htmlHeight) {
					element.attr("height", attrs.htmlHeight);
				} else {
					element.removeAttr("height");
				}
			}
		};
	}
	angular
		.module('cloudinary')
		.directive('clImage', clImage);
}