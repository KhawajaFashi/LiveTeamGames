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
import team from './models/teams.js';

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

app.get('/api/stats', async (req, res) => {
    try {
        const { from, to, game } = req.query;

        console.log('Stats query params:', req.query, from, to, game);

        const filter = {};
        if (game) filter.gameName = game;

        if (from || to) {
            filter.StartedAt = {};
            if (from) {
                const d = new Date(from);
                if (!isNaN(d.getTime())) filter.StartedAt.$gte = d;
            }
            if (to) {
                const d2 = new Date(to);
                if (!isNaN(d2.getTime())) filter.StartedAt.$lte = d2;
            }
        }

        // fetch minimal fields
        const teams = await team.find(filter).select('gameName status StartedAt').lean();

        if (!teams || !teams.length) {
            return res.status(200).json({ success: true, items: [] });
        }

        // aggregate by gameName + date (YYYY-MM-DD)
        const map = new Map();
        for (const t of teams) {
            const started = t.StartedAt ? new Date(t.StartedAt) : null;
            const date = started ? started.toISOString().slice(0, 10) : 'unknown';
            const key = `${t.gameName}__${date}`;
            const existing = map.get(key) || {
                game: t.gameName,
                date,
                won: 0,
                lost: 0,
                left: 0,
                total: 0
            };
            existing.total += 1;
            const status = String(t.status).toUpperCase();
            if (status === 'WON') existing.won += 1;
            else if (status === 'LOST') existing.lost += 1;
            else if (status === 'LEFT') existing.left += 1;
            map.set(key, existing);
        }

        const items = Array.from(map.values());
        console.log(items);
        return res.status(200).json({ success: true, items });
    } catch (err) {
        console.error('Error in /api/stats', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err?.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});