import express from 'express';
import connection from './config/connect.js';
import dotenv from 'dotenv';
import userRouter from './routes/user.js';
import gameRouter from './routes/games.js';
import operatorRouter from './routes/operator.js';
import scoreRouter from './routes/highScore.js';
import { checkAuth } from './middlewares/auth.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';

// console.log(router)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


connection(process.env.MONGODB_URI);


// Middleware
app.use(express.json());
// app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const allowed = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://liveteamgames.netlify.app',
    'https://live-team-games.vercel.app'
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowed.includes(origin)) {
                callback(null, true);
            } else {
                console.log('Blocked by CORS:', origin);
                callback(null, false); // instead of throwing an error
            }
        },
        credentials: true,
    })
);

// Routes
app.use('/user', checkAuth, userRouter);
app.use('/games', checkAuth, gameRouter);
app.use('/operator', checkAuth, operatorRouter);
app.use('/highscore', checkAuth, scoreRouter);
// setRoutes(app); 

app.get('/', checkAuth, (req, res) => {
    console.log(`User in home route: ${req.user}`);
    if (req.user) {
        console.log("User is authenticated");
        res.status(200).json({ redirect: "/dashboard" });
    }
    else
        res.status(200).json({ redirect: "/login" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});