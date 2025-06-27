import express from "express";
import pendingsRoutes from "./routes/Pendings.routes.js";
import editablesRoutes from "./routes/editables.routes.js";
import cors from "cors";

const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://']
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

// Middleware para decodificar el parámetro 'conca' en la URL
app.use((req, res, next) => {
  if (req.params && req.params.id) {
    req.params.id = decodeURIComponent(req.params.id);
  }
  next();
});

// Rutas
app.use('/', pendingsRoutes);
app.use('/api', editablesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});