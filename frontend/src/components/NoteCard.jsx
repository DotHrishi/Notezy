import { PenSquareIcon, Trash2Icon } from "lucide-react";
import {Link} from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard=({note, setNotes}) => {

    const handleDelete = async (e,id) => {
        e.preventDefault();

        if(!window.confirm("Delete this note?")) return;

        try {
            await api.delete(`/notes/${id}`);
            setNotes((prev)=>prev.filter((note)=>note._id!==id));
            toast.success("Note deleted successfully!");
        } catch (error) {
            console.log("Error in handleDelete", error);
            toast.error("Filed to delete note.");
        }
    };

    return (
    <Link to={`/notes/${note._id}`}
    className="card bg-black hover:shadow-lg transition-all duration-200 border-2 border-b-8 border-solid border-[#5c53bf]">
        <div className="card-body">
            <h3 className="card-title text-slate-200">{note.title}</h3>
            <p className="text-base-content/70 line-clamp-3 text-slate-200">{note.content}</p>
            <div className="card-actions justify-between items-center mt-4">
                <span className="text-sm text-base-content/60 text-green-700">{formatDate(new Date(note.createdAt))}</span>
                <div className="flex items-center gap-1">
                    <PenSquareIcon className="size-4" />
                    <button className="btn btn-ghost btn-xs text-error" onClick={(e)=>handleDelete(e,note._id)}>
                        <Trash2Icon className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    </Link>
    );
};

export default NoteCard;