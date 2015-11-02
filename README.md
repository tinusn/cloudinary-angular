# cloudinary-angular

A port of the offical Cloudinary library for angular ([Cloudinary_angular](https://github.com/cloudinary/cloudinary_angular)) without the dependency on jquery (see [Issue 18](https://github.com/cloudinary/cloudinary_angular/issues/18)), plus two new directives: **cl-background-image** and **cl-video** (and **cl-video-transformation**). 

## Installation
```sh
$ npm install --save cloudinary-angular
```

Include the script in your index file

```html
<script src="node_modules/dist/cloudinary-angular.min.js"></script>
```

Configure it

```javascript
angular.module('myApp', ['cloudinary']);

/* @ngInject */
function configure(CloudinaryProvider) {    
    CloudinaryProvider.configure({
        cloud_name: 'your cloud name'
        api_key: 'your api key'
    });
}

angular
    .module('myApp')
    .config(configure);
```

And now you can use it

```html
<cl-image public-id="sample" format="jpg">
	<cl-transformation height="80" width="80" crop="thumb" gravity="face" radius="max" border="2px_solid_rgb:00390b60" />
</cl-image>
```

You can also inject a service and use that to get the correct urls

```javascript
/* @ngInject */
function Somecontroller(Cloudinary) {
    var publicUrl = Cloudinary.url('sample', { format: 'jpg', height: '512', width: '1024', crop: 'limit' });
}
```

## Documentation
*(Have a look at the [sample](https://github.com/tinusn/cloudinary-angular/tree/master/sample) directory to see it in action)*

### cl-href, cl-src, cl-srcset
```html
<!-- cl-href -->
<a cl-href="sample" format="jpg" target="_blank">Sample</a>
<!-- cl-src -->
<img cl-src="sample" height="80" width="80" format="jpg">
<!-- cl-src and cl-srcset -->
<img cl-src="sample" cl-srcset="sample 1x, sample 2x" height="80" width="80" format="jpg">
```

### cl-image
Set the following attributes on the directive:
* public-id
* format

And then add [transformations](http://cloudinary.com/documentation/image_transformations#reference)  on the cl-transformation directive
```html
<cl-image public-id="sample" format="jpg">
	<cl-transformation height="80" width="80" crop="thumb" gravity="face" radius="max" border="2px_solid_rgb:00390b60" />
</cl-image>
```
It also supports the facebook, twitter and gravatar options, example:
```html
<cl-image public-id="billclinton.jpg" type="facebook"></cl-image>
```

### cl-video
This directives creates a html5 video tag either with a poster specificed by your on from the public_id
```html
<cl-video public-id="SampleVideo" preload="none" controls>
	Your browser does not support the <code>video</code> element.
	<cl-video-transformation height="300" width="300" crop="pad" background="blue" />
</cl-video>
<!-- or -->
<cl-video public-id="SampleVideo" poster="http://res.cloudinary.com/dklsomzcw/image/upload/h_300,w_300/sample.jpg" preload="none" controls>
	Your browser does not support the <code>video</code> element.
	<cl-video-transformation height="300" width="300" crop="pad" background="blue" />
</cl-video>
```

### cl-background-image
This directive makes a fullsize cover background image given a public-id.

```html
<div class="image" cl-background-image="sample" format="jpg" crop="fill" gravity="center" quality="50"></div>
```

This translates to:
```html
<div class="image" cl-background-image="sample" format="jpg" crop="fill" gravity="center" quality="50" style="background-image: url(http://res.cloudinary.com/<cloud_name>/image/upload/c_fill,g_center,q_50/sample.jpg); background-color: transparent; background-position: 50% 50%; background-repeat: no-repeat; background-size: cover"></div>
```

## Develop
Install nodejs and the following packages globally:
* gulp
* tsd

then run:
* npm install
* tsd reinstall --save --overwrite

To build run **gulp**

## License
MIT