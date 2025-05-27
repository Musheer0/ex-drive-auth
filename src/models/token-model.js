import { query } from "../db/db.js";


export const CreatedSessionToken = async(userId,ip )=>{
    const location = await fetch(`http://ip-api.com/json/${ip}`).then(async(res)=>{
        const response =await res.json();
        if(response.status==='success'){
            return `${response.country}-${response.city}-${response.zip}-${response.countryCode}-${response.regionName}-${response.timezone}`
        }
        return 'vpn login '
    })
    const insert_query = `
    INSERT INTO session_token (user_id,ip,location) VALUES($1,$2,$3)
    RETURNING   id
    `
    const result = await query(insert_query,[userId, ip, location]);
    return result.rows[0]
};
export const GetUserInfoFromToken = async(tokenId, userId)=>{
    const search_query = `
  SELECT users.id, users.email,users.name, users.image
FROM users
INNER JOIN session_token ON session_token.id=$1 AND session_token.user_id=$2
    `
    const result = await query(search_query,[tokenId, userId]);
    return result.rows[0]
};
export const RefreshToken = async(tokenId, userId)=>{
    const update_query = `
UPDATE session_token
SET expires_at = NOW() + INTERVAL '60 days'
WHERE id =$1
AND user_id=$2
  AND expires_at < NOW()
RETURNING id, user_id;

    `
    const result = await query(update_query,[tokenId, userId]);
    console.log(result.rows)
    return result.rows[0]
};
export const VerifiyToken = async(token)=>{
    const  jwt_session = await DecodeJwtToken(token);
    if(!jwt_session) return null;

};
export const DeleteToken = async(tokenid, userid)=>{
    const delete_query =    `
    DELETE FROM session_token WHERE id=$1 AND  user_id=$2
    `
    const result = await query(delete_query,[tokenid,userid]);
    if(result.rowCount>0){
        return {
            logout:true
        }
    }
    else{
         return {
            logout: false
         }
    }
}
