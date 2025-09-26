import express, { Application, Request, Response } from "express";
import cors from "cors";
import loginRoutes from '../delivery/routes/loginRoutes';
import logoutRoutes from '../delivery/routes/logoutRoutes';

const app: Application = express();
const PORT = 4000;

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Permitir peticiones desde el frontend
  credentials: true, // Permitir cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/", loginRoutes);
app.use("/", logoutRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Servidor Express funcionando correctamente");
});

export default app;
