import express from "express"
import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";


dotenv.config();
const app = express()

app.use(cors({
    origin:"http://localhost:5173",
}));
app.use(express.json()); //middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use((req, res,next) =>{
    console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
    next();
});

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(5001, () => {
        console.log("Server is running on port: 5001");
    });
});




