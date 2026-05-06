require('dotenv').config();
const express = require('express');
const cors = require('cors');

const buildingsRouter = require('./routes/buildings');
const roomsRouter = require('./routes/rooms');
const scheduleRouter = require('./routes/schedule');
const favoritesRouter = require('./routes/favorites');
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const userFavoritesRouter = require('./routes/userFavorites');
const historyRouter = require('./routes/history');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/buildings', buildingsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/user-favorites', userFavoritesRouter);
app.use('/api/history', historyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UTADmaps API a correr em http://localhost:${PORT}`);
});
