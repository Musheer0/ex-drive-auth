import { query } from "../db/db.js";
import { logger } from "../utils/logger.js";
import { ValidateCredentialsData, ValidateOAuthData } from "../validators/user-validator.js"
export const GetUserByFieldName = async(field, data)=>{
    const select_query = `
    SELECT * FROM users WHERE ${field}=$1
    `
    const result =await query(select_query,[data]);
    return result.rows[0]
}

export const CreateOAuthUser = async(data)=>{
 const {error} = ValidateOAuthData(data);
 if(error) return {
    user: null
 };
 const existing_user = await GetUserByFieldName('email',data.email);
 if(existing_user){
    logger.info('Exisiting user login')
    return {
        user: existing_user,
        message:'existing user'
    }
 }
 const insert_query = `
 INSERT INTO users (name,email,image,oauth_openid,oauth_is_verified,is_verified_datetime)
 VALUES($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)
 RETURNING name, email,id,image,is_verified_datetime
 `
 const result = await query(insert_query, [data.name, data.email,data.picture,data.id,data.verified_email||true]);
console.log(result.rows)
 return {
    user :result.rows[0]
 }
};
// export const CreateCredentialsUser = async(data)=>{
//     const {error} = ValidateCredentialsData(data);
//     if(error) return {
//         error,
//         user:null
//     }
//     const Exisiting_user = await GetUserByFieldName('email',data.email);
//     if(Exisiting_user){
//         return{
//             error: 'user already exisits',
//             user:null
//         }
//     };
//     const secret = 'Diddy'
//     const hashed_password =await argon2.hash(data.password,{
//         secret: Buffer.from(secret)
//     });
//     const insert_query = `
//     INSERT INTO users (name,email,password)
//     VALUES($1,$2,$3)
//     RETURING id, name,email
//     `
//     const result = await  query(insert_query,[data.name,data.email, hashed_password]);
//     return{
//         error:null,
//         user: result.rows[0]
//     }

// }
