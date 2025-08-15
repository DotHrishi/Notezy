export default function Login() {
  const backendUrl =
    import.meta.env.MODE === "production"
      ? "https://notezy-lk94.onrender.com"
      : "http://localhost:5001"; // match your .env PORT

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <img src="./public/logo-notezy.png" alt="Notezy Logo"/>
      <h1 className="text-3xl font-bold mb-6 text-[#66ff66]">
        Welcome to <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Notezy</span> – Your thoughts, organized and elevated!
      </h1>
      <p className="mb-8 text-center max-w-xl mx-auto text-white text-2xl">
        Log in to capture, organize, and even let AI help you make sense of your
        thoughts. Every note, idea, and plan – secured, synced, and just a click
        away.
      </p>
      <a
        href={`${backendUrl}/auth/google`}
        target="_self"
        rel="noopener noreferrer"
      >
        <button class="relative inline-block px-8 py-3 rounded-full font-bold text-lg tracking-wide text-[#66ff66] bg-[#66ff66] overflow-hidden group">
          <span class="relative z-10 transition-colors duration-700 group-hover:text-black">
            Login with Google
          </span>
          <span class="absolute top-0 left-0 w-[120%] h-full bg-white -left-[10%] skew-x-[30deg] transition-transform duration-400 ease-[cubic-bezier(0.3,1,0.8,1)] group-hover:translate-x-full"></span>
        </button>
      </a>
    </div>
  );
}
