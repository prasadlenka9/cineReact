import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App.jsx";
import logo from "../assets/logo.jpg";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w92";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (query.length < 2) return setSuggestions([]);

    const fetchSuggestions = async () => {
      try {
        const movieRes = await fetch(
          `${import.meta.env.VITE_TMDB_BASE_URL}/search/movie?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&query=${encodeURIComponent(query)}&language=en-US&page=1`
        );
        const movieData = await movieRes.json();

        const peopleRes = await fetch(
          `${import.meta.env.VITE_TMDB_BASE_URL}/search/person?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&query=${encodeURIComponent(query)}&language=en-US&page=1`
        );
        const peopleData = await peopleRes.json();

        const userRes = await fetch(
          `http://localhost:5000/api/search/users?q=${encodeURIComponent(query)}`
        );
        const userData = await userRes.json();

        const results = [
          ...(movieData.results || []).map((m) => ({ ...m, type: "movie" })),
          ...(peopleData.results || []).map((p) => ({ ...p, type: "person" })),
          ...(userData || []).map((u) => ({ ...u, type: "user" })),
        ];

        setSuggestions(results.slice(0, 8));
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSuggestions();
  }, [query]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50">
        <nav className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800">CineSanchika</span>
          </div>

          <div className="relative w-64">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search movies, actors, users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </form>
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border mt-1 rounded shadow-lg max-h-64 overflow-y-auto z-50">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      if (item.type === "movie") {
                        navigate(`/movies/${item.id}`);
                      } else if (item.type === "person") {
                        navigate(`/actors/${item.id}`);
                      } else if (item.type === "user") {
                        navigate(`/users/${item._id}`);
                      }
                      setQuery("");
                      setSuggestions([]);
                    }}
                  >
                    {item.type === "movie" && item.poster_path ? (
                      <img
                        src={`${IMG_BASE_URL}${item.poster_path}`}
                        className="w-8 h-12 rounded"
                      />
                    ) : item.type === "person" && item.profile_path ? (
                      <img
                        src={`${IMG_BASE_URL}${item.profile_path}`}
                        className="w-8 h-12 rounded"
                      />
                    ) : item.type === "user" && item.profilePic ? (
                      <img
                        src={item.profilePic}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-12 bg-gray-300 rounded flex items-center justify-center text-xs">
                        No Img
                      </div>
                    )}

                    <span className="text-sm text-gray-700">
                      {item.type === "movie"
                        ? item.title
                        : item.type === "person"
                        ? item.name
                        : item.username}
                      <span className="ml-2 text-xs text-gray-500">
                        ({item.type})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link className="text-gray-700 hover:text-blue-600" to="/">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link className="text-gray-700 hover:text-blue-600" to="/profile">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="text-gray-700 hover:text-blue-600" to="/login">
                  Login
                </Link>
                <Link className="text-gray-700 hover:text-blue-600" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <div className="pt-20" />
    </>
  );
}


// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../App";
// import logo from "../assets/logo.jpg"; // place logo there

// const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL;
// const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
// const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// export default function Header() {
//   const { isLoggedIn, setIsLoggedIn } = useContext(ThemeContext);
//   const navigate = useNavigate();
//   const [q, setQ] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [debounceTimer, setDebounceTimer] = useState(null);

//   useEffect(() => {
//     if (!q || q.length < 2) { setSuggestions([]); return; }
//     if (debounceTimer) clearTimeout(debounceTimer);
//     setDebounceTimer(setTimeout(async () => {
//       try {
//         const res = await fetch(`${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&page=1`);
//         const data = await res.json();
//         setSuggestions(data.results?.slice(0, 6) || []);
//       } catch (err) {
//         console.error("Suggestion error", err);
//       }
//     }, 300));
//   }, [q]);

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const goToMovie = (id) => {
//     navigate(`/movies/${id}`);
//     setQ("");
//     setSuggestions([]);
//   };

//   return (
//     <header className="bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-40">
//       <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
//         <div className="flex-1"></div>

//         <div className="flex items-center gap-3 justify-center flex-1 cursor-pointer" onClick={() => navigate("/")}>
//           <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
//           <span className="text-xl font-bold text-black">CineSanchika</span>
//         </div>

//         <div className="flex-1 flex justify-end items-center gap-4">
//           <div className="relative w-64">
//             <input
//               className="w-full border rounded px-3 py-1 text-sm"
//               placeholder="Search movies..."
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               onKeyDown={(e) => { if (e.key === "Enter") navigate(`/search?query=${encodeURIComponent(q)}`); }}
//             />
//             {suggestions.length > 0 && (
//               <ul className="absolute right-0 left-0 bg-white shadow rounded mt-1 max-h-56 overflow-y-auto z-50">
//                 {suggestions.map(s => (
//                   <li key={s.id} className="flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => goToMovie(s.id)}>
//                     {s.poster_path ? <img src={`${IMG_BASE}${s.poster_path}`} className="w-10 h-14 object-cover rounded" /> : <div className="w-10 h-14 bg-gray-200 rounded" />}
//                     <div className="text-sm">
//                       <div className="font-medium text-black">{s.title}</div>
//                       <div className="text-xs text-gray-600">{s.release_date ? s.release_date.split("-")[0] : ""}</div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <Link className="text-sm text-black hover:underline" to="/">Home</Link>
//           {isLoggedIn ? (
//             <>
//               <Link className="text-sm text-black hover:underline" to="/profile">Profile</Link>
//               <button onClick={handleLogout} className="text-sm px-3 py-1 bg-red-500 text-white rounded">Logout</button>
//             </>
//           ) : (
//             <>
//               <Link className="text-sm text-black hover:underline" to="/login">Login</Link>
//               <Link className="text-sm text-black hover:underline" to="/signup">Signup</Link>
//             </>
//           )}
//         </div>
//       </div>

//       <div style={{ height: 64 }} /> {/* spacer so page content not hidden under fixed header */}
//     </header>
//   );
// }
