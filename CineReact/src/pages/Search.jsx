import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w200"; 
export default function Search() {
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [users, setUsers] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        const movieRes = await fetch(
          `${import.meta.env.VITE_TMDB_BASE_URL}/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${query}`
        );
        const movieData = await movieRes.json();
        setMovies(movieData.results || []);

        const actorRes = await fetch(
          `${import.meta.env.VITE_TMDB_BASE_URL}/search/person?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${query}`
        );
        const actorData = await actorRes.json();
        setActors(actorData.results || []);

        const usersRes = await fetch(
          `http://localhost:5000/api/users/search?query=${encodeURIComponent(query)}`
        );
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    };

    fetchData();
  }, [query]);

  const HorizontalSection = ({ title, items, type }) => {
    if (!items || !items.length) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black mb-2">{title}</h2>
        <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {items.map((item) => {
            if (type === "movie") {
              return (
                <Link
                  to={`/movies/${item.id}`}
                  key={item.id}
                  className="flex-none w-32 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {item.poster_path ? (
                    <img
                      src={`${IMG_BASE_URL}${item.poster_path}`}
                      alt={item.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-300 flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                  <div className="p-2">
                    <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      {item.release_date ? item.release_date.split("-")[0] : "N/A"}
                    </p>
                  </div>
                </Link>
              );
            }

            if (type === "actor") {
              return (
                <Link
                  to={`/actor/${item.id}`}
                  key={item.id}
                  className="flex-none w-28 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {item.profile_path ? (
                    <img
                      src={`${IMG_BASE_URL}${item.profile_path}`}
                      alt={item.name}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-300 flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                  <div className="p-2">
                    <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                  </div>
                </Link>
              );
            }

            if (type === "user") {
  return (
    <Link
      to={`/user/${item.username}`}
      key={item._id}
      className="flex-none w-32 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center p-2"
    >
      <h3 className="text-sm font-semibold truncate">{item.username}</h3>
      <p className="text-xs text-gray-500">{item.email}</p>
    </Link>
  );
}


            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Search Results for "<span className="text-blue-600">{query}</span>"
      </h1>

      <HorizontalSection title="Movies" items={movies} type="movie" />
      <HorizontalSection title="Actors" items={actors} type="actor" />
      <HorizontalSection title="Users" items={users} type="user" />

      {!movies.length && !actors.length && !users.length && (
        <p>No results found.</p>
      )}
    </div>
  );
}
