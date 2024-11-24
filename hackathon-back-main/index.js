const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const sessionRoutes = require('./routes/sessionRoutes');
const reportRoutes = require('./routes/reports/reportRoutes');
const userGeofencesRoutes = require('./routes/usersGeofences/userGeofencesRoutes');
const notifyRoutes = require('./routes/notifications/notificationsRoutes');
const trafficRestrictionRoutes = require('./routes/traffic-restrictions/trafficRoutes');
const interestZoneRoutes = require('./routes/interestZone/interestZoneRoutes');
const newsRoutes = require('./routes/generalImportantNews/newsRouter');
const chatbotRoutes = require('./routes/chatbot/chatbotRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const allowedOrigins = [
    'https://proyecto-go-jubc-mx40m5kc3-santiagors26s-projects.vercel.app', // Dominio del frontend
    'http://localhost:3000', // Dominio para desarrollo local
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Manejar solicitudes preflight
app.options('*', cors());

// Conexión a la base de datos
connectDB();

// Rutas
app.use(sessionRoutes);
app.use(reportRoutes);
app.use(userGeofencesRoutes);
app.use(notifyRoutes);
app.use(trafficRestrictionRoutes);
app.use(interestZoneRoutes);
app.use(newsRoutes);
app.use(chatbotRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Server running on ${port}, http://localhost:${port}`)
);
