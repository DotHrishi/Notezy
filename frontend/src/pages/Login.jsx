export default function Login() {
  const backendUrl =
  import.meta.env.MODE === "production"
    ? "https://notezy-lk94.onrender.com"
    : "http://localhost:5001"; // match your .env PORT

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Notezy</h1>
      <p className="mb-8 text-gray-300">Sign in to save and manage your notes</p>
      <a
        href={`${backendUrl}/auth/google`}
        target="_self" // bypass React Router
        rel="noopener noreferrer"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
      >
        Login with Google
      </a>
    </div>
  );
}
