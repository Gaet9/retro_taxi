require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isLocal = process.env.DB_HOST === "localhost";

const config = {
    db:
        process.env.DATABASE_URL ?
            {
                connectionString: process.env.DATABASE_URL,
                ssl: isProduction && !isLocal ? { rejectUnauthorized: true } : false,
            }
        :   {
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: parseInt(process.env.DB_PORT, 10) || 5432,
                ssl: isProduction && !isLocal ? { rejectUnauthorized: true } : false,
            },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    apiKeys: {
        perplexity: process.env.PERPLEXITY_KEY,
        resend: process.env.RESEND_KEY,
    },
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development", // optional: track current env
};

module.exports = config;
