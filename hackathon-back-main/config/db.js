const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true, 
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1); // Salir si la conexión falla
  }
};

module.exports = connectDB;
