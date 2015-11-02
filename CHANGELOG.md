# 1.0.0
Breaking changes:
* Renamed **Cloudinary.public_url** to **url**
* cl-background-image now takes the public_id directly and not through a *public_id* attribute.
* cl-background-image now has **background-position: cover** as well, to reflect that this is used to get a cover image
* (Typescript only) Renamed: cloudinary.IProvider to cloudinary.Service

New:
* Added the missing directives from the official library: **cl-src, cl-srcset and cl-href**
* Added a video directive **cl-video** and corresponding **cl-video-transformation**
* Added services for video and video thumbnail
* Added a sample to demonstrate every functionality in this module

Changed:
* Reformatted the code to be get easier minification

# 0.0.3
Readme fix and added a service to get the public url

# 0.0.2
Added to [npm](https://www.npmjs.com/package/cloudinary-angular)

# 0.0.1
Initial version