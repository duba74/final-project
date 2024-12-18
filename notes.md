# Notes

## Image upload - For event photos and participant list page photos

-   Use Expo Camera to capture image
-   Store in phones local file system
-   Store the file name (UUID?) and/or location to WatermelonDB
    -   Maybe something about if the file has been synced successfully?
-   Create separate sync process to the normal one that checks for unsynced photos in WatermelonDB and tries to sync them to a special endpoint in the Django app
-   The Django app will take the request (just one photo at a time), try to upload it to Amazon S3 bucket, respond to client if it was successful, maybe giving back the file URL in the cloud
-   Update the synced status in the WatermelonDB table; WatermelonDB just store the file name and/or URL, and its sync status
-   [One approach with Express and Google Cloud](https://medium.com/google-cloud/upload-images-to-google-cloud-storage-with-react-native-and-expressjs-61b8874abc49)
-   [Use this approach for Django](https://docs.djangoproject.com/en/5.1/topics/http/file-uploads/)
