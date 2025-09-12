import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=movie_credits`
        );
        const data = await res.json();
        setActor(data);
        setMovies(data.movie_credits.cast || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActor();
  }, [id]);

  if (!actor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
            alt={actor.name}
            className="rounded-2xl shadow-md w-full object-cover"
          />
        </div>

        <div className="md:w-3/4 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{actor.name}</h1>
          <p className="text-gray-700">{actor.biography || "Biography not available."}</p>

          <p><strong>Born:</strong> {actor.birthday}</p>
          {actor.deathday && <p><strong>Died:</strong> {actor.deathday}</p>}
          <p><strong>Place of Birth:</strong> {actor.place_of_birth}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Movies</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-1">
            {movies
              .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""))
              .slice(0, 20)
              .map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="flex-none w-24 text-center"
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-lg mb-1 w-full h-28 object-cover"
                    />
                  ) : (
                    <div className="h-28 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  <p className="font-medium text-xs">{movie.title}</p>
                  <p className="text-gray-500 text-[10px]">{movie.character || ""}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
