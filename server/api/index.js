const path = require("path"); // to serve static files in production
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// where the requests handlers are listed
const blogRoutes = require("./routes/blogRouter.js");
const userRoutes = require("./routes/userRouter.js");
const contactRoutes = require("./routes/contactRouter.js");
const authRoutes = require("./routes/authRouter.js");
const newsRoutes = require("./routes/newsRouter.js");
const zoneRoutes = require("./routes/zoneRouter.js");

app.use(express.json()); // To parse JSON bodies so i can access the properties object with body.name for example
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies, like form submissions
app.use(cors()); // This line allows all origins by default, usefull for Recat which might use a different port
app.use(morgan("dev")); // logging middleware, prints out the request method and URL in the console in real time
app.use(cookieParser());

app.use("/api/blogs", blogRoutes); // This sets the base path for all blog routes
app.use("/api/users", userRoutes); // This sets the base path for all user routes
app.use("/api/contact", contactRoutes); // This sets the base path for all user routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/zones", zoneRoutes); // This sets the base path for all zone routes

// Start the weekly newsletter service only in production
if (process.env.NODE_ENV === "production") {
    const weeklyNewsletter = require("./services/weeklyNewsletter");
    weeklyNewsletter.start();
} else {
    console.log("🧪 Development/Test mode: Newsletter service disabled");
}

// Enable CORS for all routes

// Optional: restrict to specific origin
//  app.use(cors({ origin: 'http://localhost:3000'
//      methods: ['GET', 'POST', 'PUT', 'DELETE'],
//      credentials: true
//  }));

// Serve static files from the Vite dist folder
if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "../../client/dist");
    app.use(express.static(clientBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(clientBuildPath, "index.html"));
    });
}

module.exports = app;
