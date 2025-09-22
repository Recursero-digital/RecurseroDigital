import express, { Application, Request, Response } from "express";
import loginRoutes from '../delivery/routes/loginRoutes';

const app: Application = express();
const PORT = 4000;

app.use(express.json());
app.use("/", loginRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Servidor Express funcionando correctamente");
});

export default app;
