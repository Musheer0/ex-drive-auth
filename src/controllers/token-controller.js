import { DeleteToken, GetUserInfoFromToken, RefreshToken } from "../models/token-model.js";
import { CreateJwtToken, DecodeJwtToken } from "../utils/create-jwt-token.js";
export const VerifiyTokenController = async(req,res)=>{
    const token = req.cookies.token||req.headers['authorization'].slice(7);

        const  jwt_session = await DecodeJwtToken(token);
        if(!jwt_session) return res.status(400).json({
            message: 'invalid token'
        })
        const user =await GetUserInfoFromToken(jwt_session.token, jwt_session.user_id);
        if(!user){
            return res.status(400).json({
            message: 'invalid token'
        })
        }
        res.json({
            data: user
        });
};
export const RefreshTokenController =  async(req,res)=>{
    const token = req.cookies.token||req.headers['authorization'].slice(7);
    const  jwt_session = await DecodeJwtToken(token);
        if(!jwt_session) return res.status(400).json({
            message: 'invalid token'
        })
        const updated_token = await RefreshToken(jwt_session.token, jwt_session.user_id);
        if(updated_token){
            const jwt_token = CreateJwtToken({token:updated_token.id, user_id:updated_token.user_id});
                    res.cookie('token', jwt_token,{
             httpOnly: true,       // client-side JS can't touch it
    secure: false,        // set to true if you're using HTTPS
    sameSite: 'lax',      // CSRF protection
    maxAge:60* 24 * 60 * 60 * 1000 // 60 day
        });
        return res.json({
            message: 'token updated',
            data: jwt_token
        })
        }
         return res.status(400).json({
            message: 'token not found'
        })
};
export const DeleteTokenController = async(req,res)=>{
        const token = req.cookies.token||req.headers['authorization'].slice(7);
            const  jwt_session = await DecodeJwtToken(token);
        if(!jwt_session) return res.status(400).json({
            message: 'invalid token'
        });
        const delete_token = await DeleteToken(jwt_session.token, jwt_session.user_id);
        if(delete_token.logout){
             res.clearCookie('token', {
    path: '/', // match the path it was set with
    httpOnly: true, // same config as when it was set
    // secure: true, // only if it was set with secure: true
    sameSite: 'lax',      // CSRF protection
  });

             return res.status(200).json({
            logout:true
        });
        }
        else{
             return res.status(400).json({
            message: 'invalid token'
        });
        }
};