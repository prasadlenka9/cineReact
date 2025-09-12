// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Search, Plus } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchMovie, setSearchMovie] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [activeSlot, setActiveSlot] = useState(null);
//   const [showFollowersModal, setShowFollowersModal] = useState(false);
//   const [showFollowingModal, setShowFollowingModal] = useState(false);
//   const [followersList, setFollowersList] = useState([]);
//   const [followingList, setFollowingList] = useState([]);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const api = axios.create({
//     baseURL: "http://localhost:5000",
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//   });

//   const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   async function fetchProfile() {
//     try {
//       const res = await api.get("/api/users/me");
//       setUser(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("fetch profile error", err);
//       setLoading(false);
//     }
//   }

//   async function handlePhotoUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fd = new FormData();
//     fd.append("profilePhoto", file);

//     try {
//       const res = await api.post("/api/users/profilePhoto", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setUser(res.data);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert(err.response?.data?.message || "Upload failed");
//     }
//   }

//   async function handleMovieSearch(query) {
//     setSearchMovie(query);
//     if (!query) {
//       setSearchResults([]);
//       return;
//     }
//     try {
//       const res = await axios.get(
//         `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
//       );
//       setSearchResults(res.data.results || []);
//     } catch (err) {
//       console.error("TMDB search error", err);
//       setSearchResults([]);
//     }
//   }

//   async function addFavorite(movie, slotIndex) {
//     try {
//       const res = await api.post("/api/users/topFavorites/add", {
//         movie: {
//           id: String(movie.id),
//           title: movie.title,
//           poster: movie.poster_path
//             ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//             : "",
//         },
//       });

//       setUser((p) => ({ ...p, topFavorites: res.data }));
//       setActiveSlot(null);
//       setSearchMovie("");
//       setSearchResults([]);
//     } catch (err) {
//       console.error("add fav error", err);
//       alert(err.response?.data?.message || "Failed to add favorite");
//     }
//   }

//   async function removeFavorite(slotIndex) {
//     try {
//       const movie = user.topFavorites[slotIndex];
//       if (!movie) return;
//       const res = await api.post("/api/users/topFavorites/remove", { movieId: movie.id });
//       setUser((p) => ({ ...p, topFavorites: res.data }));
//     } catch (err) {
//       console.error("remove fav error", err);
//     }
//   }

//   function openFollowers() {
//     setFollowersList(user.followers || []);
//     setShowFollowersModal(true);
//   }
//   function openFollowing() {
//     setFollowingList(user.following || []);
//     setShowFollowingModal(true);
//   }

//   if (loading) return <div className="p-6">Loading profile...</div>;
//   if (!user) return <div className="p-6">Please log in.</div>;

//   const favoriteSlots = Array.from({ length: 3 }, (_, i) => user.topFavorites?.[i] || null);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-6">
//           <div className="relative inline-block">
//             <img
//               src={
//                 user.profilePhoto
//                   ? `http://localhost:5000/uploads/${user.profilePhoto}`
//                   : "/default-profile.png"
//               }
//               alt={user.username}
//               className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
//             />
//             <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer border">
//               <input type="file" className="hidden" onChange={handlePhotoUpload} />
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-gray-600"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M4 3a1 1 0 00-1 1v2h2V5h10v2h2V4a1 1 0 00-1-1H4z" />
//                 <path d="M3 9a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//               </svg>
//             </label>
//           </div>
//           <h2 className="text-2xl font-bold mt-3">{user.username}</h2>
//           <p className="text-sm text-gray-600">{user.email}</p>
//         </div>

//         <div className="bg-white rounded-lg p-4 mb-6 shadow">
//           <h3 className="font-semibold mb-3">Top Favorites</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             {favoriteSlots.map((m, idx) => (
//               <div key={idx} className="relative">
//                 {m ? (
//                   <div className="rounded overflow-hidden bg-gray-100">
//                     <img src={m.poster || "/default-poster.png"} alt={m.title} className="w-full h-40 object-cover" />
//                     <div className="p-2 flex items-center justify-between">
//                       <div className="text-sm font-medium">{m.title}</div>
//                       <div>
//                         <button className="text-red-500 text-sm" onClick={() => removeFavorite(idx)}>
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div
//                     className="border-2 border-dashed border-gray-300 rounded h-40 flex flex-col items-center justify-center cursor-pointer"
//                     onClick={() => setActiveSlot(idx)}
//                   >
//                     <Plus size={28} className="text-gray-400" />
//                     <div className="text-sm text-gray-600">Add favorite</div>
//                   </div>
//                 )}

//                 {activeSlot === idx && (
//                   <div className="mt-2 bg-white p-3 border rounded shadow">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Search size={16} className="text-gray-400" />
//                       <input
//                         className="flex-1 border rounded p-1 text-sm"
//                         placeholder="Search movie..."
//                         value={searchMovie}
//                         onChange={(e) => handleMovieSearch(e.target.value)}
//                       />
//                       <button className="ml-2 px-2 py-1 bg-gray-100 rounded" onClick={() => setActiveSlot(null)}>
//                         Close
//                       </button>
//                     </div>
//                     <div className="max-h-48 overflow-y-auto">
//                       {searchResults.slice(0, 6).map((res) => (
//                         <div
//                           key={res.id}
//                           className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
//                           onClick={() => addFavorite(res, idx)}
//                         >
//                           <img
//                             src={res.poster_path ? `https://image.tmdb.org/t/p/w92${res.poster_path}` : "/default-poster.png"}
//                             className="w-10 h-14 object-cover rounded"
//                           />
//                           <div className="text-sm">{res.title}</div>
//                         </div>
//                       ))}
//                       {searchResults.length === 0 && <div className="text-xs text-gray-400">No results</div>}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 mb-6 shadow grid grid-cols-2 gap-4">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <div>
//                 <div className="text-lg font-bold">{(user.followers || []).length}</div>
//                 <div className="text-xs text-gray-500">Followers</div>
//               </div>
//               <button className="text-sm text-blue-600" onClick={openFollowers}>
//                 View
//               </button>
//             </div>
//             <div className="space-y-2">
//               {(user.followers || []).slice(0, 5).map((u, i) => (
//                 <div key={i} className="flex items-center gap-2 text-sm">
//                   <Link to={`/user/${u}`} className="flex items-center gap-2 hover:underline">
//                     <img
//                       src={`/uploads/${u}.png`}
//                       alt={u}
//                       className="w-8 h-8 rounded-full object-cover bg-gray-200"
//                       onError={(e) => {
//                         e.currentTarget.src = "/default-profile.png";
//                       }}
//                     />
//                     <span>{u}</span>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <div>
//                 <div className="text-lg font-bold">{(user.following || []).length}</div>
//                 <div className="text-xs text-gray-500">Following</div>
//               </div>
//               <button className="text-sm text-blue-600" onClick={openFollowing}>
//                 View
//               </button>
//             </div>
//             <div className="space-y-2">
//               {(user.following || []).slice(0, 5).map((u, i) => (
//                 <div key={i} className="flex items-center gap-2 text-sm">
//                   <Link to={`/user/${u}`} className="flex items-center gap-2 hover:underline">
//                     <img
//                       src={`/uploads/${u}.png`}
//                       alt={u}
//                       className="w-8 h-8 rounded-full object-cover bg-gray-200"
//                       onError={(e) => {
//                         e.currentTarget.src = "/default-profile.png";
//                       }}
//                     />
//                     <span>{u}</span>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="text-right">
//           <button onClick={() => navigate("/users")} className="text-sm text-gray-600">
//             Browse all users
//           </button>
//         </div>
//       </div>

//       {showFollowersModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white max-w-md w-full rounded p-4 max-h-[80vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-3">
//               <h4 className="font-semibold">Followers</h4>
//               <button onClick={() => setShowFollowersModal(false)}>Close</button>
//             </div>
//             {(followersList || []).map((username, i) => (
//               <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
//                 <Link to={`/user/${username}`} className="flex items-center gap-3">
//                   <img
//                     src={`/uploads/${username}.png`}
//                     onError={(e) => {
//                       e.currentTarget.src = "/default-profile.png";
//                     }}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   <div>{username}</div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {showFollowingModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white max-w-md w-full rounded p-4 max-h-[80vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-3">
//               <h4 className="font-semibold">Following</h4>
//               <button onClick={() => setShowFollowingModal(false)}>Close</button>
//             </div>
//             {(followingList || []).map((username, i) => (
//               <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
//                 <Link to={`/user/${username}`} className="flex items-center gap-3">
//                   <img
//                     src={`/uploads/${username}.png`}
//                     onError={(e) => {
//                       e.currentTarget.src = "/default-profile.png";
//                     }}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   <div>{username}</div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchMovie, setSearchMovie] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!token) {
      navigate("/login"); // redirect to login if not logged in
    } else {
      fetchProfile();
    }
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/api/users/me"); // new backend route
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error("fetch profile error", err);
      setLoading(false);
    }
  }

  async function handleMovieSearch(query) {
    setSearchMovie(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
      );
      setSearchResults(res.data.results || []);
    } catch (err) {
      console.error("TMDB search error", err);
      setSearchResults([]);
    }
  }

  async function addFavorite(movie, slotIndex) {
    try {
      const res = await api.post("/api/users/topFavorites/add", {
        movie: {
          id: String(movie.id),
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
        },
      });

      setUser((p) => ({ ...p, topFavorites: res.data }));
      setActiveSlot(null);
      setSearchMovie("");
      setSearchResults([]);
    } catch (err) {
      console.error("add fav error", err);
      alert(err.response?.data?.message || "Failed to add favorite");
    }
  }

  async function removeFavorite(slotIndex) {
    try {
      const movie = user.topFavorites[slotIndex];
      if (!movie) return;
      const res = await api.post("/api/users/topFavorites/remove", { movieId: movie.id });
      setUser((p) => ({ ...p, topFavorites: res.data }));
    } catch (err) {
      console.error("remove fav error", err);
    }
  }

  function openFollowers() {
    setFollowersList(user.followers || []);
    setShowFollowersModal(true);
  }

  function openFollowing() {
    setFollowingList(user.following || []);
    setShowFollowingModal(true);
  }

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!user) return <div className="p-6">Please log in.</div>;

  const favoriteSlots = Array.from({ length: 3 }, (_, i) => user.topFavorites?.[i] || null);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {/* Top Favorites */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <h3 className="font-semibold mb-3">Top Favorites</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {favoriteSlots.map((m, idx) => (
              <div key={idx} className="relative">
                {m ? (
                  <div className="rounded overflow-hidden bg-gray-100">
                    <img src={m.poster || "/default-poster.png"} alt={m.title} className="w-full h-40 object-cover" />
                    <div className="p-2 flex items-center justify-between">
                      <div className="text-sm font-medium">{m.title}</div>
                      <div>
                        <button className="text-red-500 text-sm" onClick={() => removeFavorite(idx)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded h-40 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => setActiveSlot(idx)}
                  >
                    <Plus size={28} className="text-gray-400" />
                    <div className="text-sm text-gray-600">Add favorite</div>
                  </div>
                )}

                {activeSlot === idx && (
                  <div className="mt-2 bg-white p-3 border rounded shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <Search size={16} className="text-gray-400" />
                      <input
                        className="flex-1 border rounded p-1 text-sm"
                        placeholder="Search movie..."
                        value={searchMovie}
                        onChange={(e) => handleMovieSearch(e.target.value)}
                      />
                      <button className="ml-2 px-2 py-1 bg-gray-100 rounded" onClick={() => setActiveSlot(null)}>
                        Close
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {searchResults.slice(0, 6).map((res) => (
                        <div
                          key={res.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => addFavorite(res, idx)}
                        >
                          <img
                            src={res.poster_path ? `https://image.tmdb.org/t/p/w92${res.poster_path}` : "/default-poster.png"}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div className="text-sm">{res.title}</div>
                        </div>
                      ))}
                      {searchResults.length === 0 && <div className="text-xs text-gray-400">No results</div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Followers & Following */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-lg font-bold">{(user.followers || []).length}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <button className="text-sm text-blue-600" onClick={openFollowers}>
                View
              </button>
            </div>
            <div className="space-y-2">
              {(user.followers || []).slice(0, 5).map((u, i) => (
                <Link key={i} to={`/user/${u}`} className="block text-sm hover:underline">{u}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-lg font-bold">{(user.following || []).length}</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
              <button className="text-sm text-blue-600" onClick={openFollowing}>
                View
              </button>
            </div>
            <div className="space-y-2">
              {(user.following || []).slice(0, 5).map((u, i) => (
                <Link key={i} to={`/user/${u}`} className="block text-sm hover:underline">{u}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white max-w-md w-full rounded p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Followers</h4>
              <button onClick={() => setShowFollowersModal(false)}>Close</button>
            </div>
            {(followersList || []).map((username, i) => (
              <Link key={i} to={`/user/${username}`} className="block p-2 hover:bg-gray-50 rounded">{username}</Link>
            ))}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white max-w-md w-full rounded p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Following</h4>
              <button onClick={() => setShowFollowingModal(false)}>Close</button>
            </div>
            {(followingList || []).map((username, i) => (
              <Link key={i} to={`/user/${username}`} className="block p-2 hover:bg-gray-50 rounded">{username}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
