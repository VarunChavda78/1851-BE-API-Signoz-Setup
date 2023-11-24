export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  s3: {
    imageUrl: process.env.AWS_IMAGE_PROXY_URL,
  },
  aws: {
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  franchise: {
    url: process.env.FRANCHISE_1851_URL,
  },
  youtube: {
    baseUrl: process.env.YOUTUBE_PLACEHOLDER_BASE_URL,
    apiUrl: process.env.YOUTUBE_PLAYLIST_API_URL,
    playlistId: process.env.YOUTUBE_PLAYLIST_ID,
    apiKey: process.env.YOUTUBE_API_KEY,
  },
  vimeo: {
    baseUrl: process.env.VIMEO_PLACEHOLDER_BASE_URL,
  },
});
