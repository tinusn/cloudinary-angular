# cloudinary-angular

[Cloudinary](http://cloudinary.com/) provides a library for angular ([Cloudinary_angular](https://github.com/cloudinary/cloudinary_angular)), however that library depends on their jquery implementation ([Cloudinary_js](https://github.com/cloudinary/cloudinary_js)) as per [Issue 18](https://github.com/cloudinary/cloudinary_angular/issues/18). So to solve that I rewrote the js plugin to not use jquery.

This library provides the **cl-image** and **cl-transformation** directive as in the original library, however I have also added a **cl-background-image** directive. 

## Documentation
See the documentation for the cl-image and cl-transformation directive here: [Cloudinary_angular](https://github.com/cloudinary/cloudinary_angular)

### cl-background-image
The cl-background-image directive follows the syntax of the cl-src / cl-href / cl-srcset directives.
An example.

```html
<div class="image" cl-background-image public-id="{{ myobject.pictureId }}" format="jpg" crop="fill" gravity="center" quality="50"></div>
```

This translates to:
```html
<div class="images ng-isolate-scope" cl-background-image="" public-id="someid" format="jpg" crop="fill" gravity="center" quality="50" style="background-image: url(http://res.cloudinary.com/<cloud_name>/image/upload/c_fill,g_center,q_50/someid.jpg); background-color: transparent; background-position: 50% 50%; background-repeat: no-repeat;"></div>
```

## Installation
Download [cloudinary-angular.min.js](https://raw.githubusercontent.com/tinusn/cloudinary-angular/master/dist/cloudinary-angular.min.js) and include it on your page

```html
<script src="vendor/cloudinary-angular.min.js"></script>
```

Include it in your module declaration

```javascript
angular.module('myApp', ['cloudinary']);
```

## To build
Install nodejs and the following packages globally:
* gulp
* tsd

then run:
* npm install
* tsd reinstall --save --overwrite

Then finally, run "gulp"