// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { ThemeContext } from "../App.jsx";

// export default function SignUp() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { setIsLoggedIn } = useContext(ThemeContext);

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         setIsLoggedIn(true);
//         navigate("/"); 
//       } else {
//         setError(data.message || "Signup failed");
//       }
//     } catch (err) {
//       setError("Server error. Make sure the backend is running!");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-white p-4">
//       <form
//         onSubmit={handleSignup}
//         className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">
//           Sign Up
//         </h2>

//         {error && (
//           <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
//         )}

//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//           required
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
//         >
//           Sign Up
//         </button>

//         <p className="text-center mt-4 text-gray-600">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-pink-600 font-semibold hover:underline"
//           >
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }



import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(ThemeContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setErr(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setErr("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input className="border p-2 rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-green-600 text-white py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
