import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import {Redis} from 'ioredis'
import {rateLimit} from 'express-rate-limit'
import {RedisStore}from 'rate-limit-redis'
import cors from 'cors'
import helmet from 'helmet'
import cookie from 'cookie-parser'
import { logger } from './utils/logger.js';
import { ErrorHandler, HttpError } from './middlewares/error-handler.js'
import { UserRouter } from './routes/user-routes.js'
import { google_oauth_uri } from './utils/oauth_urls.js'
import { TokenRouter } from './routes/token-routes.js'
const app = express();
const redis = new Redis()
app.use((req,res,next)=>{
    logger.info(`${req.url}      --${req.method}`)
    next()
});
app.use(cookie())
app.use(helmet());

app.use(cors({
       origin:(or, cb)=>{
        if(or===process.env.FRONTEND)
        cb(null ,true)
        else
         cb(new Error("Invalid origin"), false)
       },
           methods: ['POST','GET', 'PUT','DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Bearer','Authorization'],
    exposedHeaders: ['X-user-Id'],
    preflightContinue: false,
    maxAge: '15'
}));
const rate_limiter = rateLimit({
    windowMs: 15*60,
    limit: 5,
    standardHeaders:true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args)=> redis.call(...args)
    })
});
app.use(rate_limiter)
app.use((req,res,next)=>{
    res.setHeader('X-Developer-By','musheeran165@gmail.com')
    next()
})

app.get('/',(req,res)=>{
    res.json({
                google:  google_oauth_uri
    })
});
app.use('/api/auth', UserRouter);
app.use('/api/token',TokenRouter)
app.use(ErrorHandler)
app.listen(process.env.PORT,()=>{
    logger.info(('Server running on port '+process.env.PORT))
})