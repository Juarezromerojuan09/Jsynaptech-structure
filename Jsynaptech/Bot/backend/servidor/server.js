import httpServer from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
})();