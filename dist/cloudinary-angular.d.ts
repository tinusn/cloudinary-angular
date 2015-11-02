declare namespace cloudinary {
    interface Service {
        configure: Function;
        url: Function;
        video_url: Function;
        video_thumbnail_url: Function;
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
