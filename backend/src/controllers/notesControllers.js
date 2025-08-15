import Note from "../models/Note.js";

export async function getAllNotes(req,res){
    try {
        const notes=await Note.find({user:req.user.id}).sort({pinned: -1, createdAt: -1}).populate("user","name email"); //pinned first, then newest
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller.", error);
        res.status(500).json({message:"Internal server error!"});
    }
};

export async function getNoteById(req,res){
    try {
        const note= await Note.findOne({_id:req.params.id, user:req.user.id}).populate("user","name email");

        if(!note){
            return res.status(404).json({messege: "Note not found!"});
        }else{
            res.json(note);
        }
    } catch (error) {
        console.error("Error in  controller.", error);
        res.status(500).json({message:"Internal server error!"});
    }
}

export async function createNote(req,res){
    try {
        const {title, content}=req.body;
        const note = new Note({title, content, user:req.user.id});

        const savedNote=await note.save();
        await savedNote.populate("user","name email");
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller.",error);
        res.status(500).json({message:"Internal server error!"});
    }    
};

export async function updateNote(req,res){
    try {
        const {title,content,pinned}=req.body;
        const updateFields = {title,content};
        if (pinned !== undefined) {
            updateFields.pinned = pinned;
        }
        
        const updateNote = await Note.findOneAndUpdate(
            {_id:req.params.id,user:req.user.id},
            updateFields,
            {new:true},
        );

        if(!updateNote){
            return res.status(404).json({message:"Note not found!"});
        }

        res.status(200).json(updateNote);
    } catch (error) {
        console.error("Error in updateNote controller.",error);
        res.status(500).json({message:"Internal server error!"});
    }
};

export async function togglePinNote(req,res){
    try {
        const note = await Note.findOne({_id:req.params.id, user:req.user.id});
        
        if(!note){
            return res.status(404).json({message: "Note not found!"});
        }

        note.pinned = !note.pinned;
        const updatedNote = await note.save();
        await updatedNote.populate("user","name email");
        
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in togglePinNote controller.",error);
        res.status(500).json({message:"Internal server error!"});
    }
};

export async function deleteNote(req,res){
    try {
        const deleteNote= await Note.findOneAndDelete(
            {
                _id:req.params.id,
                user:req.user.id
            }
        );

        if(!deleteNote){
            return res.status(404).json({message: "Note not found!"});
        }else{
            res.status(200).json("Note deleted successfully!");
        }
    } catch (error) {
        console.error("Error in deleteNote controller.",error);
        res.status(500).json({message:"Internal server error!"});
    }
};