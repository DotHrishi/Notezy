import express from "express";
import {getNoteById,deleteNote,updateNote,createNote,getAllNotes,togglePinNote} from "../controllers/notesControllers.js"
import requireAuth from "../middleware/auth.js";

const router=express.Router();
router.use(requireAuth);
router.get("/",getAllNotes);
router.get("/:id",getNoteById);
router.post("/",createNote);
router.put("/:id",updateNote);
router.patch("/:id/pin",togglePinNote);
router.delete("/:id",deleteNote);

export default router;