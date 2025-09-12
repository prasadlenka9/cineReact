import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../App";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMG_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const { isLoggedIn } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const recentRes = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_KEY}&with_original_language=te&region=IN&sort_by=release_date.desc&release_date.lte=${today}`
        );
        const recentData = await recentRes.json();
        setRecent(recentData.results || []);

        const upcomingRes = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_KEY}&with_original_language=te&region=IN&sort_by=release_date.asc&release_date.gte=${today}`
        );
        const upcomingData = await upcomingRes.json();
        setUpcoming(upcomingData.results || []);

        if (isLoggedIn) {
          const token = localStorage.getItem("token");
          const favRes = await fetch("http://localhost:5000/api/users/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const favData = await favRes.json();
          setFavorites(Array.isArray(favData) ? favData : []);
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleFavorite = async (movie) => {
    if (!isLoggedIn) return alert("Please login first");

    const token = localStorage.getItem("token");
    const isFav =
      Array.isArray(favorites) && favorites.some((fav) => fav.id === movie.id);

    try {
      const url = isFav
        ? "http://localhost:5000/api/users/favorites/remove"
        : "http://localhost:5000/api/users/favorites";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          isFav
            ? { id: movie.id }
            : {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
              }
        ),
      });

      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const MovieRow = ({ title, movies }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-burgundy-600 border-b-2 border-gray-300 pb-2">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {movies.map((movie) => {
          const isFav =
            Array.isArray(favorites) &&
            favorites.some((fav) => fav.id === movie.id);

          return (
            <div
              key={movie.id}
              className="relative flex-none w-32 sm:w-40 bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <Link to={`/movies/${movie.id}`}>
                {movie.poster_path ? (
                  <img
                    src={`${IMG_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-300 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </Link>

              <div className="p-2">
                <h3 className="font-semibold text-black text-sm truncate">
                  {movie.title}
                </h3>
                <p className="text-gray-600 text-xs">
                  {movie.release_date
                    ? movie.release_date.split("-")[0]
                    : "N/A"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center my-6 text-burgundy-600">
        Welcome to CineSanchika
      </h2>

      <MovieRow title="Recently Released" movies={recent} />
      <MovieRow title="Upcoming Releases" movies={upcoming} />
    </div>
  );
}
