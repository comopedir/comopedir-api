import tinify from 'tinify';
import { v4 as uuidV4 } from 'uuid';

tinify.key = process.env.TINIFY_KEY;

const Tinify = {
  fromUrl: async (url) => {
    try {
      const source = await tinify.fromUrl(url);

      return source;
    } catch (err) {
      return err;
    }
  },
  toS3: async (source) => {
    try {

      const result = await source.result();
      const mediaType = await result.mediaType();
      const size = await result.size();
      const width = await result.width();
      const height = await result.height();

      const imageId = uuidV4();
      const filename = `${imageId}.${Tinify.imageExtension(mediaType)}`;

      const path = `${process.env.S3_BUCKET_NAME}/images/${filename}`
      const url = `https://s3-sa-east-1.amazonaws.com/${path}`;

      await source.store({
        service: "s3",
        aws_access_key_id: process.env.S3_AWS_ACCESS_KEY_ID,
        aws_secret_access_key: process.env.S3_AWS_SECRET_ACCESS_KEY_ID,
        region: "sa-east-1",
        headers: {
          "Cache-Control": "public, max-age=31536000"
        },
        path
      });

      return {
        filename,
        mediaType,
        size,
        path,
        url,
        imageId,
        width,
        height,
      }

    } catch (err) {
      return err;
    }
  },
  imageExtension: mediaType => {
    switch (mediaType) {
      case 'image/bmp':
        return 'bmp';
      case 'image/gif':
        return 'gif';
      case 'image/jpeg':
        return 'jpg';
      case 'image/jpg':
        return 'jpg';
      case 'image/png':
        return "png";
      case 'image/svg+xml':
        return 'svg';
      case 'image/tiff':
        return 'tif';
      case 'image/webp':
        return 'webp';
      default:
        return 'jpg'; 
    }
  },
};
export default Tinify;