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

		cloudinary_url(public_id, options) {
			return cloudinary_url(public_id, options, this.config);
		}

		public $get(): cloudinary.IProvider {
			return {
				config: this.config,
				configure: this.configure,
				cloudinary_url: this.cloudinary_url
			}
		}
	}
	angular.module('cloudinary')
		.provider('Cloudinary', Cloudinary);
}