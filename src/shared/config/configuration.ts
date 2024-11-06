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
  mysqldb: {
    readHost: process.env.MSQL_DB_READ_HOST,
    writeHost: process.env.MSQL_DB_WRITE_HOST,
    port: process.env.MSQL_DB_PORT
      ? parseInt(process.env.MSQL_DB_PORT, 10)
      : undefined,
    name: process.env.MSQL_DB_NAME,
    user: process.env.MSQL_DB_USER,
    pass: process.env.MSQL_DB_PASS,
  },
  s3: {
    imageUrl: process.env.AWS_IMAGE_PROXY_URL,
    url: process.env.AWS_S3_URL,
  },
  aws: {
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3Url: process.env.AWS_S3_URL,
  },
  rollbar: {
    rollbarEnvironment: process.env.APP_ENV,
    rollbarAccessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  email: {
    from: process.env.ADMIN_FROM_EMAIL,
    noReply: process.env.NO_REPLY_EMAIL,
    bcc: process.env.BCC_EMAIL,
  },
  gip: {
    tenantId: process.env.GIP_TENANT_ID,
  },
});
