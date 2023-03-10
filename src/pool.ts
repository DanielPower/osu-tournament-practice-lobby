import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", (err) => console.error(err));

export default pool;
