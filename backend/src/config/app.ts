import express, { Application, Request, Response } from "express";
import cors from "cors";
import loginRoutes from '../delivery/routes/loginRoutes';
import logoutRoutes from '../delivery/routes/logoutRoutes';
import studentRoutes from '../delivery/routes/studentRoutes';
import statisticsRoutes from '../delivery/routes/statisticsRoutes';

const app: Application = express();

app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin || true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use("/", loginRoutes);
app.use("/", logoutRoutes);
app.use("/", studentRoutes);
app.use("/api/statistics", statisticsRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Servidor Express funcionando correctamente");
});

export default app;
