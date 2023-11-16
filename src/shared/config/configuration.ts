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
  },
});
