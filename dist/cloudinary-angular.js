/**
 * A pure angular version of the cloudinary_angular plugin including a few new directives not found in the official library.
 *
 * Based on cloudinary_js version 1.0.25 and cloudinary_angular version 0.1.4
 */
var cloudinary;
(function (cloudinary) {
    var appModule = angular.module('cloudinary', []);
    function Cloudinary() {
        var config = {
            cloud_name: '',
            api_key: ''
        };
        var provider = {
            configure: function (newConfig) {
                config = newConfig;
            },
            $get: function () {
                return {
                    url: url,
                    video_url: video_url,
                    video_thumbnail_url: video_thumbnail_url
                };
            }
        };
        return provider;
        function url(public_id, options) {
            options = angular.extend({}, options);
            return cloudinary_url(public_id, options, config);
        }
        function video_url(public_id, options) {
            options = angular.extend({ resource_type: 'video' }, options);
            return cloudinary_url(public_id, options, config);
        }
        function video_thumbnail_url(public_id, options) {
            options = angular.extend({}, DEFAULT_POSTER_OPTIONS, options);
            return cloudinary_url(public_id, options, config);
        }
    }
    appModule.provider('Cloudinary', Cloudinary);
    function getAttributes(attrs) {
        var attributes = {};
        angular.forEach(attrs, function (value, name) {
            if (typeof name === 'string') {
                attributes[cloudinaryAttr(name)] = value;
            }
        });
        return attributes;
    }
    /* @ngInject */
    function clImage(Cloudinary) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<img ng-transclude/>',
            scope: {},
            priority: 99,
            controller: ["$scope", function ($scope) {
                this.addTransformation = function (ts) {
                    $scope.transformations = $scope.transformations || [];
                    $scope.transformations.push(ts);
                };
            }],
            link: function (scope, element, attrs) {
                var attributes = getAttributes(attrs);
                if (scope.transformations) {
                    attributes.transformation = scope.transformations;
                }
                var deregisterObserver = attrs.$observe('publicId', function (publicId) {
                    if (!publicId)
                        return;
                    element.attr('src', Cloudinary.url(publicId, attributes));
                    //deregisterObserver();
                });
                if (attrs.htmlWidth) {
                    element.attr("width", attrs.htmlWidth);
                }
                else {
                    element.removeAttr("width");
                }
                if (attrs.htmlHeight) {
                    element.attr("height", attrs.htmlHeight);
                }
                else {
                    element.removeAttr("height");
                }
            }
        };
    }
    clImage.$inject = ["Cloudinary"];
    appModule.directive('clImage', clImage);
    /* @ngInject */
    function clTransformation() {
        return {
            restrict: 'E',
            transclude: false,
            require: '^clImage',
            link: function (scope, element, attrs, clImageCtrl) {
                var attributes = getAttributes(attrs);
                clImageCtrl.addTransformation(attributes);
            }
        };
    }
    appModule.directive('clTransformation', clTransformation);
    ['Src', 'Srcset', 'Href'].forEach(function (attrName) {
        var normalized = 'cl' + attrName;
        attrName = attrName.toLowerCase();
        /* @ngInject */
        function srcSetHref($sniffer, Cloudinary) {
            return {
                priority: 99,
                link: function (scope, element, attrs) {
                    var propName = attrName, name = attrName;
                    if (attrName === 'href' &&
                        toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
                        name = 'xlinkHref';
                        attrs.$attr[name] = 'xlink:href';
                        propName = null;
                    }
                    attrs.$observe(normalized, function (publicId) {
                        if (!publicId)
                            return;
                        var attributes = getAttributes(attrs);
                        var url;
                        if (attrName === 'srcset') {
                            var srcsetUrls = publicId.split(',');
                            var cloudinaryUrls = [];
                            srcsetUrls.map(function (srcsetUrl) {
                                srcsetUrl = srcsetUrl.trim();
                                var parts = srcsetUrl.split(' ');
                                if (parts.length === 2) {
                                    cloudinaryUrls.push(Cloudinary.url(parts[0], attributes) + ' ' + parts[1]);
                                }
                                else {
                                    cloudinaryUrls.push(Cloudinary.url(srcsetUrl, attributes));
                                }
                            });
                            url = cloudinaryUrls.join(', ');
                        }
                        else {
                            url = Cloudinary.url(publicId, attributes);
                        }
                        attrs.$set(name, url);
                        // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
                        // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
                        // to set the property as well to achieve the desired effect.
                        // we use attr[attrName] value since $set can sanitize the url.
                        if ($sniffer.msie && propName)
                            element.prop(propName, attrs[name]);
                    });
                }
            };
        }
        srcSetHref.$inject = ["$sniffer", "Cloudinary"];
        appModule.directive(normalized, srcSetHref);
    });
    /* @ngInject */
    function clBackgroundImage(Cloudinary) {
        return {
            restrict: 'A',
            scope: {},
            priority: 99,
            link: function (scope, element, attrs) {
                var deregisterObserver = attrs.$observe('clBackgroundImage', function (publicId) {
                    if (!publicId)
                        return;
                    var attributes = getAttributes(attrs);
                    var url = Cloudinary.url(publicId, attributes);
                    angular.element(element)[0].style['background-image'] = "url('" + url + "')";
                    angular.element(element)[0].style['background-color'] = 'transparent';
                    angular.element(element)[0].style['background-repeat'] = 'no-repeat';
                    angular.element(element)[0].style['background-position'] = 'center';
                    angular.element(element)[0].style['background-size'] = 'cover';
                    //deregisterObserver();
                });
            }
        };
    }
    clBackgroundImage.$inject = ["Cloudinary"];
    appModule.directive('clBackgroundImage', clBackgroundImage);
    /* @ngInject */
    function clVideo(Cloudinary) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<video ng-transclude></video>',
            scope: {},
            priority: 99,
            controller: ["$scope", function ($scope) {
                this.addTransformation = function (ts) {
                    $scope.transformations = $scope.transformations || [];
                    $scope.transformations.push(ts);
                };
            }],
            link: function (scope, element, attrs) {
                var attributes = getAttributes(attrs);
                if (scope.transformations) {
                    attributes.transformation = scope.transformations;
                }
                var deregisterObserver = attrs.$observe('publicId', function (publicId) {
                    if (!publicId)
                        return;
                    if (!attributes.hasOwnProperty('poster')) {
                        element.attr('poster', Cloudinary.video_thumbnail_url(publicId, attributes));
                    }
                    attributes['format'] = 'webm';
                    var webm = angular.element("<source src=\"" + Cloudinary.video_url(publicId, attributes) + "\" type=\"video/webm\" />");
                    element.append(webm);
                    attributes['format'] = 'mp4';
                    var mp4 = angular.element("<source src=\"" + Cloudinary.video_url(publicId, attributes) + "\" type=\"video/mp4\" />");
                    element.append(mp4);
                    attributes['format'] = 'ogg';
                    var ogg = angular.element("<source src=\"" + Cloudinary.video_url(publicId, attributes) + "\" type=\"video/ogg\" />");
                    element.append(ogg);
                    //deregisterObserver();
                });
            }
        };
    }
    clVideo.$inject = ["Cloudinary"];
    appModule.directive('clVideo', clVideo);
    /**
     * http://cloudinary.com/documentation/video_manipulation_and_delivery#video_transformations_reference
     */
    /* @ngInject */
    function clVideoTransformation() {
        return {
            restrict: 'E',
            transclude: false,
            require: '^clVideo',
            link: function (scope, element, attrs, clVideoCtrl) {
                var attributes = getAttributes(attrs);
                clVideoCtrl.addTransformation(attributes);
            }
        };
    }
    appModule.directive('clVideoTransformation', clVideoTransformation);
    function cloudinaryAttr(attr) {
        if (attr.match(/cl[A-Z]/))
            attr = attr.substring(2);
        return attr.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }
    ;
    var TRANSFORMATION_PARAM_NAME_MAPPING = {
        angle: 'a',
        audio_codec: 'ac',
        audio_frequency: 'af',
        background: 'b',
        bit_rate: 'br',
        border: 'bo',
        color: 'co',
        color_space: 'cs',
        crop: 'c',
        default_image: 'd',
        delay: 'dl',
        density: 'dn',
        duration: 'du',
        dpr: 'dpr',
        effect: 'e',
        end_offset: 'eo',
        fetch_format: 'f',
        flags: 'fl',
        gravity: 'g',
        height: 'h',
        opacity: 'o',
        overlay: 'l',
        page: 'pg',
        prefix: 'p',
        quality: 'q',
        radius: 'r',
        start_offset: 'so',
        transformation: 't',
        underlay: 'u',
        video_codec: 'vc',
        video_sampling: 'vs',
        width: 'w',
        x: 'x',
        y: 'y',
        zoom: 'z'
    };
    function option_consume(options, option_name, default_value) {
        var result = options[option_name];
        delete options[option_name];
        return typeof (result) == 'undefined' ? default_value : result;
    }
    function build_array(arg) {
        if (arg === null || typeof (arg) == 'undefined') {
            return [];
        }
        else if (Array.isArray(arg)) {
            return arg;
        }
        else {
            return [arg];
        }
    }
    function extend(out) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }
        return out;
    }
    ;
    function process_base_transformations(options) {
        var transformations = build_array(options.transformation);
        var all_named = true;
        for (var i = 0; i < transformations.length; i++) {
            all_named = all_named && typeof (transformations[i]) == 'string';
        }
        if (all_named) {
            return [];
        }
        delete options.transformation;
        var base_transformations = [];
        for (var i = 0; i < transformations.length; i++) {
            var transformation = transformations[i];
            if (typeof (transformation) == 'string') {
                base_transformations.push("t_" + transformation);
            }
            else {
                base_transformations.push(generate_transformation_string(extend({}, transformation)));
            }
        }
        return base_transformations;
    }
    function process_size(options) {
        var size = option_consume(options, 'size');
        if (size) {
            var split_size = size.split("x");
            options.width = split_size[0];
            options.height = split_size[1];
        }
    }
    function process_html_dimensions(options) {
        var width = options.width, height = options.height;
        var has_layer = options.overlay || options.underlay;
        var crop = options.crop;
        var use_as_html_dimensions = !has_layer && !options.angle && crop != "fit" && crop != "limit" && crop != "lfill";
        if (use_as_html_dimensions) {
            if (width && !options.html_width && width !== "auto" && parseFloat(width) >= 1)
                options.html_width = width;
            if (height && !options.html_height && parseFloat(height) >= 1)
                options.html_height = height;
        }
        if (!crop && !has_layer) {
            delete options.width;
            delete options.height;
        }
    }
    var number_pattern = "([0-9]*)\\.([0-9]+)|([0-9]+)";
    var offset_any_pattern = "(" + number_pattern + ")([%pP])?";
    function split_range(range) {
        var splitted;
        switch (range.constructor) {
            case String:
                var offset_any_pattern_re = "(" + offset_any_pattern + ")\.\.(" + offset_any_pattern + ")";
                if (range.match(offset_any_pattern_re)) {
                    splitted = range.split("..");
                }
                break;
            case Array:
                splitted = range;
                break;
            default:
                splitted = [null, null];
        }
        return splitted;
    }
    function present(value) {
        return typeof value != 'undefined' && ("" + value).length > 0;
    }
    function join_array_function(sep) {
        return function (value) {
            return build_array(value).join(sep);
        };
    }
    function process_video_params(param) {
        switch (typeof param) {
            case "object":
                var video = "";
                if (param['codec'] !== undefined) {
                    video = param['codec'];
                    if (param['profile'] !== undefined) {
                        video += ":" + param['profile'];
                        if (param['level'] !== undefined) {
                            video += ":" + param['level'];
                        }
                    }
                }
                return video;
            case "string":
                return param;
            default:
                return null;
        }
    }
    function norm_range_value(value) {
        var offset = String(value).match(new RegExp("^" + offset_any_pattern + "$"));
        if (offset) {
            var modifier = present(offset[5]) ? 'p' : '';
            value = (offset[1] || offset[4]) + modifier;
        }
        return value;
    }
    function isObject(o) {
        return o != null && typeof o === 'object' && !Array.isArray(o);
    }
    ;
    function isObjectObject(o) {
        return isObject(o) === true
            && Object.prototype.toString.call(o) === '[object Object]';
    }
    function isPlainObject(o) {
        var ctor, prot;
        if (isObjectObject(o) === false)
            return false;
        // If has modified constructor
        ctor = o.constructor;
        if (typeof ctor !== 'function')
            return false;
        // If has modified prototype
        prot = ctor.prototype;
        if (isObjectObject(prot) === false)
            return false;
        // If constructor does not have an Object-specific method
        if (prot.hasOwnProperty('isPrototypeOf') === false) {
            return false;
        }
        // Most likely a plain Object
        return true;
    }
    ;
    var TRANSFORMATION_PARAM_VALUE_MAPPING = {
        angle: function (angle) { return build_array(angle).join("."); },
        background: function (background) { return background.replace(/^#/, 'rgb:'); },
        border: function (border) {
            if (isPlainObject(border)) {
                var border_width = "" + (border.width || 2);
                var border_color = (border.color || "black").replace(/^#/, 'rgb:');
                border = border_width + "px_solid_" + border_color;
            }
            return border;
        },
        color: function (color) { return color.replace(/^#/, 'rgb:'); },
        dpr: function (dpr) {
            dpr = dpr.toString();
            if (dpr === "auto") {
                return "1.0";
            }
            else if (dpr.match(/^\d+$/)) {
                return dpr + ".0";
            }
            else {
                return dpr;
            }
        },
        effect: join_array_function(":"),
        flags: join_array_function("."),
        transformation: join_array_function("."),
        video_codec: process_video_params,
        start_offset: norm_range_value,
        end_offset: norm_range_value,
        duration: norm_range_value
    };
    function generate_transformation_string(options) {
        var base_transformations = process_base_transformations(options);
        process_size(options);
        process_html_dimensions(options);
        if (options['offset'] !== undefined) {
            var range = split_range(options['offset']);
            delete options['offset'];
            if (range !== null) {
                options['start_offset'] = range[0];
                options['end_offset'] = range[1];
            }
        }
        var params = [];
        for (var param in TRANSFORMATION_PARAM_NAME_MAPPING) {
            var value = option_consume(options, param);
            if (!present(value))
                continue;
            if (TRANSFORMATION_PARAM_VALUE_MAPPING[param]) {
                value = TRANSFORMATION_PARAM_VALUE_MAPPING[param](value);
            }
            if (!present(value))
                continue;
            params.push(TRANSFORMATION_PARAM_NAME_MAPPING[param] + "_" + value);
        }
        params.sort();
        var raw_transformation = option_consume(options, 'raw_transformation');
        if (present(raw_transformation))
            params.push(raw_transformation);
        var transformation = params.join(",");
        if (present(transformation))
            base_transformations.push(transformation);
        return base_transformations.join("/");
    }
    function absolutize(url) {
        if (!url.match(/^https?:\//)) {
            var prefix = document.location.protocol + "//" + document.location.host;
            if (url[0] == '?') {
                prefix += document.location.pathname;
            }
            else if (url[0] != '/') {
                prefix += document.location.pathname.replace(/\/[^\/]*$/, '/');
            }
            url = prefix + url;
        }
        return url;
    }
    function finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten) {
        var resource_type_and_type = resource_type + "/" + type;
        if (url_suffix) {
            if (resource_type_and_type == "image/upload") {
                resource_type_and_type = "images";
            }
            else if (resource_type_and_type == "raw/upload") {
                resource_type_and_type = "files";
            }
            else {
                throw "URL Suffix only supported for image/upload and raw/upload";
            }
        }
        if (use_root_path) {
            if (resource_type_and_type == "image/upload" || resource_type_and_type == "images") {
                resource_type_and_type = "";
            }
            else {
                throw "Root path only supported for image/upload";
            }
        }
        if (shorten && resource_type_and_type == "image/upload") {
            resource_type_and_type = "iu";
        }
        return resource_type_and_type;
    }
    var CF_SHARED_CDN = "d3jpl91pxevbkh.cloudfront.net";
    var OLD_AKAMAI_SHARED_CDN = "cloudinary-a.akamaihd.net";
    var AKAMAI_SHARED_CDN = "res.cloudinary.com";
    var SHARED_CDN = AKAMAI_SHARED_CDN;
    var DEFAULT_POSTER_OPTIONS = { format: 'jpg', resource_type: 'video' };
    var DEFAULT_VIDEO_SOURCE_TYPES = ['webm', 'mp4', 'ogv'];
    function utf8_encode(argString) {
        // http://kevin.vanzonneveld.net
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: sowberry
        // +    tweaked by: Jack
        // +   bugfixed by: Onno Marsman
        // +   improved by: Yves Sucaet
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Ulrich
        // +   bugfixed by: Rafal Kukawski
        // +   improved by: kirilloid
        // *     example 1: utf8_encode('Kevin van Zonneveld');
        // *     returns 1: 'Kevin van Zonneveld'
        if (argString === null || typeof argString === "undefined") {
            return "";
        }
        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = '', start, end, stringl = 0;
        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;
            if (c1 < 128) {
                end++;
            }
            else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
            }
            else {
                enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }
        if (end > start) {
            utftext += string.slice(start, stringl);
        }
        return utftext;
    }
    function crc32(str) {
        // http://kevin.vanzonneveld.net
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // +   improved by: T0bsn
        // +   improved by: http://stackoverflow.com/questions/2647935/javascript-crc32-function-and-php-crc32-not-matching
        // -    depends on: utf8_encode
        // *     example 1: crc32('Kevin van Zonneveld');
        // *     returns 1: 1249991249
        str = utf8_encode(str);
        var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
        var crc = 0;
        var x = 0;
        var y = 0;
        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            y = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = "0x" + table.substr(y * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        crc = crc ^ (-1);
        //convert to unsigned 32-bit int if needed
        if (crc < 0) {
            crc += 4294967296;
        }
        return crc;
    }
    function cloudinary_url_prefix(public_id, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution, protocol) {
        if (cloud_name.match(/^\//) && !secure) {
            return "/res" + cloud_name;
        }
        var prefix = secure ? 'https://' : (window.location.protocol === 'file:' ? "file://" : 'http://');
        prefix = protocol ? protocol + '//' : prefix;
        var shared_domain = !private_cdn;
        if (secure) {
            if (!secure_distribution || secure_distribution == OLD_AKAMAI_SHARED_CDN) {
                secure_distribution = private_cdn ? cloud_name + "-res.cloudinary.com" : SHARED_CDN;
            }
            shared_domain = shared_domain || secure_distribution == SHARED_CDN;
            if (secure_cdn_subdomain == null && shared_domain) {
                secure_cdn_subdomain = cdn_subdomain;
            }
            if (secure_cdn_subdomain) {
                secure_distribution = secure_distribution.replace('res.cloudinary.com', "res-" + ((crc32(public_id) % 5) + 1) + ".cloudinary.com");
            }
            prefix += secure_distribution;
        }
        else if (cname) {
            var subdomain = cdn_subdomain ? "a" + ((crc32(public_id) % 5) + 1) + "." : "";
            prefix += subdomain + cname;
        }
        else {
            prefix += (private_cdn ? cloud_name + "-res" : "res");
            prefix += (cdn_subdomain ? "-" + ((crc32(public_id) % 5) + 1) : "");
            prefix += ".cloudinary.com";
        }
        if (shared_domain)
            prefix += "/" + cloud_name;
        return prefix;
    }
    function cloudinary_url(public_id, options, config) {
        if (!public_id)
            return public_id;
        options = options || {};
        var type = option_consume(options, 'type', 'upload');
        if (type == 'fetch') {
            options.fetch_format = options.fetch_format || option_consume(options, 'format');
        }
        var transformation = generate_transformation_string(options);
        var resource_type = option_consume(options, 'resource_type', "image");
        var version = option_consume(options, 'version');
        var format = option_consume(options, 'format');
        var cloud_name = option_consume(options, 'cloud_name', config.cloud_name);
        if (!cloud_name)
            throw "Unknown cloud_name";
        var private_cdn = option_consume(options, 'private_cdn', config.private_cdn);
        var secure_distribution = option_consume(options, 'secure_distribution', config.secure_distribution);
        var cname = option_consume(options, 'cname', config.cname);
        var cdn_subdomain = option_consume(options, 'cdn_subdomain', config.cdn_subdomain);
        var secure_cdn_subdomain = option_consume(options, 'secure_cdn_subdomain', config.secure_cdn_subdomain);
        var shorten = option_consume(options, 'shorten', config.shorten);
        var secure = option_consume(options, 'secure', window.location.protocol == 'https:');
        var protocol = option_consume(options, 'protocol', config.protocol);
        var trust_public_id = option_consume(options, 'trust_public_id');
        var url_suffix = option_consume(options, 'url_suffix');
        var use_root_path = option_consume(options, 'use_root_path', config.use_root_path);
        if (url_suffix && !private_cdn) {
            throw "URL Suffix only supported in private CDN";
        }
        if (type == 'fetch') {
            public_id = absolutize(public_id);
        }
        if (public_id.search("/") >= 0 && !public_id.match(/^v[0-9]+/) && !public_id.match(/^https?:\//) && !present(version)) {
            version = 1;
        }
        if (public_id.match(/^https?:/)) {
            if (type == "upload" || type == "asset")
                return public_id;
            public_id = encodeURIComponent(public_id).replace(/%3A/g, ":").replace(/%2F/g, "/");
        }
        else {
            // Make sure public_id is URI encoded.
            public_id = encodeURIComponent(decodeURIComponent(public_id)).replace(/%3A/g, ":").replace(/%2F/g, "/");
            if (url_suffix) {
                if (url_suffix.match(/[\.\/]/))
                    throw "url_suffix should not include . or /";
                public_id = public_id + "/" + url_suffix;
            }
            if (format) {
                if (!trust_public_id)
                    public_id = public_id.replace(/\.(jpg|png|gif|webp)$/, '');
                public_id = public_id + "." + format;
            }
        }
        var resource_type_and_type = finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten);
        var prefix = cloudinary_url_prefix(public_id, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution, protocol);
        var url = [prefix, resource_type_and_type, transformation, version ? "v" + version : "",
            public_id].join("/").replace(/([^:])\/+/g, '$1/');
        return url;
    }
    function default_stoppoints(width) {
        return 10 * Math.ceil(width / 10);
    }
})(cloudinary || (cloudinary = {}));

//# sourceMappingURL=cloudinary-angular.js.map
