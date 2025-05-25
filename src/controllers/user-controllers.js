import { HttpError } from "../middlewares/error-handler.js";
import { CreatedSessionToken } from "../models/token-model.js";
import { CreateOAuthUser } from "../models/user-model.js";
import { CreateJwtToken } from "../utils/create-jwt-token.js";
import { logger } from "../utils/logger.js";

export const OAuthCallBackController = async(req,res)=>{
    const code = req.query.code;
    if(!code)  throw new HttpError(400, 'no code provided');
    try {
        const get_token = await fetch('https://oauth2.googleapis.com/token',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                      code,
      client_id: process.env.client_id,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.redirect_uri,
      grant_type: 'authorization_code',
            })
        }).then((res)=>{
            return res.json()
        });
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
            headers: {
                'Authorization': 'Bearer '+get_token.access_token
            }
        }).then((res)=>res.json());
        const {user} = await CreateOAuthUser(userInfo)
        if(!user) {
            console.log(user)
            //TODO redirect with error 
        return    res.status(400).json({
                message: 'user not created'
            });
        }
        const token = await CreatedSessionToken(user.id, req.ip);
        const jwt_token = CreateJwtToken({user_id:user.id, token:token.id});
    //     //TODO ATTACH to headers and redirect 
    //     res.cookie('token', jwt_token,{
    //          httpOnly: true,       // client-side JS can't touch it
    // secure: false,        // set to true if you're using HTTPS
    // sameSite: 'lax',      // CSRF protection
    // maxAge:60* 24 * 60 * 60 * 1000 // 60 day
    //     });
    //    res.redirect('http://localhost:3000/dashboard');
      return res.json({
        token: jwt_token
       })

    } catch (error) {
        logger.error('oauth google error', error);
        throw new HttpError(500, error.message||'Internal server error');
    }
};