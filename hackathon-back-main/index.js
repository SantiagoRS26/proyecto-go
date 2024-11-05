const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const sessionRoutes = require('./routes/sessionRoutes');
const reportRoutes = require('./routes/reports/reportRoutes')
const userGeofencesRoutes = require('./routes/usersGeofences/userGeofencesRoutes');
const notifyRoutes = require('./routes/notifications/notificationsRoutes');
const trafficRestrictionRoutes = require('./routes/traffic-restrictions/trafficRoutes');
const interestZoneRoutes = require('./routes/interestZone/interestZoneRoutes');
const newsRoutes = require('./routes/generalImportantNews/newsRouter');
const chatbotRoutes = require('./routes/chatbot/chatbotRoutes');
const dotenv = require('dotenv');
const cors =  require('cors')


dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use(sessionRoutes);
app.use(reportRoutes);
app.use(userGeofencesRoutes)
app.use(notifyRoutes);
app.use(trafficRestrictionRoutes);
app.use(interestZoneRoutes);
app.use(newsRoutes);
app.use(chatbotRoutes);
app.get("/", (req, res)=>{
    res.send("Welcome to the API");
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
