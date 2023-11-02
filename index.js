import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
const morgan = require("morgan");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const app = express();
mongoose.connect(process.env.DATABASE)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log("DB Connection err =>", err));

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(__dirname));

const routes = readdirSync('./routes');
routes.forEach((r) => {
  const routePath = `./routes/${r}`;
  const router = require(routePath).default;
  app.use('/', router);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
