'use strict';

angular.module('myApp', [
	'cloudinary',
]);

function configure(CloudinaryProvider) {
	CloudinaryProvider.configure({
		cloud_name: 'dklsomzcw', // your Cloud name
		api_key: '134557926481144' // your API Key
	});
}

angular
    .module('myApp')
    .config(['CloudinaryProvider', configure]);


function SampleController($scope, Cloudinary) {
	$scope.url = Cloudinary.url('sample', { format: 'jpg', 'height': 30, 'width': 30 });
	$scope.video_url = Cloudinary.video_url('SampleVideo', { format: 'mp4' });
	$scope.video_thumbnail_url = Cloudinary.video_thumbnail_url('SampleVideo');
}

angular
    .module('myApp')
    .controller('SampleController', ['$scope', 'Cloudinary', SampleController]);


