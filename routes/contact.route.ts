import express from "express";
import { sendContactEmail } from "../controllers/contact.controller";

const contactRouter = express.Router();

contactRouter.post("/contact", sendContactEmail);

export default contactRouter;
