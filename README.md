# gae-uploader-comp
Angular Component to upload files to Google Cloud Storage

In your Angular main module you have to create a global variable called SETTINGS:

Example:

var app = angular.module('OneCampus', ['gae-uploader-comp']);

var SETTINGS = {
    UPLOADER: {
        'REQUEST_URL': 'the url where you can submit de file given by blobstore.create_upload_url',
        'ACTION_URL': '',
        'BUCKET': 'qa',
        'FOLDER': 'user/pictures'
    }
};

app.value('SETTINGS', SETTINGS);

Note:

REQUEST_URL has a format like "http://localhost:8080/_ah/upload/ahdkZXZ-bGl1LXBhc3Nwb3J0LWFwaS1xYXIiCxIVX19CbG9iVXBsb2FkU2Vzc2lvbl9fGICAgICA1KEJDA"

BUCKET and FOLDER variables: It must be configured in your backend. this params are sent createUploadUrl angular service is executed.

var uploaderCreateUrlService = __Uploader.createUploadUrl({
    'bucket': SETTINGS.UPLOADER.BUCKET,
    'folder': SETTINGS.UPLOADER.FOLDER
});


To see a backend code example you can  visit https://cloud.google.com/appengine/docs/python/tools/webapp/blobstorehandlers

The component works with Angular ~1.3.0 and use formData to send the images by ajax request.
