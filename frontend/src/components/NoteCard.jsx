import { PenSquareIcon, Trash2Icon, PinIcon } from "lucide-react";
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

    const handlePin = async (e, id) => {
        e.preventDefault();

        try {
            const response = await api.patch(`/notes/${id}/pin`);
            setNotes((prev) => 
                prev.map((note) => 
                    note._id === id ? response.data : note
                ).sort((a, b) => {
                    // Sort pinned notes first, then by creation date
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
            );
            toast.success(response.data.pinned ? "Note pinned!" : "Note unpinned!");
        } catch (error) {
            console.log("Error in handlePin", error);
            toast.error("Failed to pin/unpin note.");
        }
    };

    return (
    <Link to={`/notes/${note._id}`}
    className={`card bg-black hover:shadow-lg transition-all duration-200 border-2 border-b-8 border-solid ${
        note.pinned ? 'border-yellow-400 ring-2 ring-yellow-400/50' : 'border-[#66ff66]'
    }`}>
        <div className="card-body">
            <div className="flex justify-between items-start">
                <h3 className="card-title text-slate-200 flex-1">{note.title}</h3>
                {note.pinned && (
                    <PinIcon className="size-4 text-yellow-400 ml-2 flex-shrink-0" />
                )}
            </div>
            <p className="text-base-content/70 line-clamp-3 text-slate-200">{note.content}</p>
            <div className="card-actions justify-between items-center mt-4">
                <span className="text-sm text-base-content/60 text-green-700">{formatDate(new Date(note.createdAt))}</span>
                <div className="flex items-center gap-1">
                    <PenSquareIcon className="size-4" />
                    <button 
                        className={`btn btn-ghost btn-xs ${note.pinned ? 'text-yellow-400' : 'text-gray-400'}`} 
                        onClick={(e)=>handlePin(e,note._id)}
                        title={note.pinned ? "Unpin note" : "Pin note"}
                    >
                        <PinIcon className="size-4" />
                    </button>
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