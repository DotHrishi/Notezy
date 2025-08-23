import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes.", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else if (error.response?.status !== 401) {
          toast.error("Failed to load notes.");
        }
      } finally {
        setLoading(false);
      }
    };

    // In development, always fetch notes. In production, only if user is authenticated
    const isDevelopment = import.meta.env.DEV;
    if (user || isDevelopment) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}
      <div className="flex-1 max-w-7xl mx-auto p-4 mt-6 mb-8 w-full">
        <div className="divider divider-success text-3xl text-black font-medium">
          {user ? `${user.name}'s Notes 📝` : "Notes 📝"}
        </div>

        {loading && (
          <div className="text-center text-primary py-10">Loading Notes...</div>
        )}

        {notes.length === 0 && !loading && !isRateLimited && (
          <div className="text-center py-10">
            <NotesNotFound />
            {import.meta.env.DEV && (
              <button
                className="btn btn-primary mt-4"
                onClick={async () => {
                  try {
                    await api.get("/seed-dev-notes");
                    // Refresh notes after seeding
                    const res = await api.get("/notes");
                    setNotes(res.data);
                    toast.success("Sample notes created!");
                  } catch (error) {
                    console.error("Error seeding notes:", error);
                    toast.error("Failed to create sample notes");
                  }
                }}
              >
                Create Sample Notes for Development
              </button>
            )}
          </div>
        )}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
