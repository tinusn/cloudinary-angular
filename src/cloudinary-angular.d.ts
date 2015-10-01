declare namespace cloudinary {
	interface IProvider {
		config: Config;
		configure: Function;
		cloudinary_url: Function;
	}

	interface Config {
		cloud_name: string;
		api_key: string;
		private_cdn?: string;
		secure_distribution?: string;
		cname?: string;
		cdn_subdomain?: string;
		secure_cdn_subdomain?: string;
		shorten?: boolean;
		protocol?: string;
		use_root_path?: boolean;
	}
}