import pg from 'pg'

const db =new pg.Pool({
    connectionString: "postgresql://postgres:pass@localhost:5432/ex-drive"
});

export const query = (text, params)=>{
    return db.query(text,params)
};