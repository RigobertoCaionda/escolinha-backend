export default () => ({
    JWT_SECRET: process.env.JWT_SECRET,
    baseURL: process.env.baseURL,
    PORT: process.env.PORT,
    frontURL: process.env.frontURL,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  });
  