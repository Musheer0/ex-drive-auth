import dotenv from 'dotenv'
dotenv.config()
const params = new URLSearchParams({
  client_id: process.env.client_id,
  redirect_uri: process.env.redirect_uri,
  response_type: 'code',
  scope: 'openid email profile ',
  access_type: 'offline',
  prompt: 'consent',
});

export const google_oauth_uri =`${process.env.GOOGLE_OAUTH_URL}?${params.toString()}`;
