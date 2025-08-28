const config = require("./config");
const pool = require("./api/db/dbconn");
const app = require("./api/index.js");

// connect to PostgreSQL
pool.connect()
    .then((client) => {
        client.release(); // release the connection back to the pool
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    }) // start listening for requests only after the connection is established
    .catch((err) => {
        console.error("Failed to connect to PostgreSQL");
        process.exit(1);
    });
