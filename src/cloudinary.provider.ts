namespace cloudinary {
	export class Cloudinary implements angular.IServiceProvider {
		config: cloudinary.Config = {
			api_key: '',
			cloud_name: ''
		};

		/* @ngInject */
		constructor() {
		}

		configure(newConfig: cloudinary.Config) {
			this.config = newConfig;
		}

		public $get(): cloudinary.IProvider {
			return {
				config: this.config,
				configure: this.configure
			}
		}
	}
	angular.module('cloudinary')
		.provider('Cloudinary', Cloudinary);
}