// import React, { useEffect, useState, useContext } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../App.jsx";

// export default function MovieDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isLoggedIn, token } = useContext(ThemeContext);

//   const [movie, setMovie] = useState(null);
//   const [cast, setCast] = useState([]);
//   const [crew, setCrew] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [error, setError] = useState(null);

//   const [reviewText, setReviewText] = useState("");
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchMovie = async () => {
//   try {
//     const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=credits`;
//     console.log("Fetching movie from:", url);

//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status}`);
//     const data = await res.json();
//     setMovie(data);
//     setCast(data.credits?.cast || []);
//     setCrew(data.credits?.crew || []);
//   } catch (err) {
//     console.error("fetchMovie error:", err);
//     setError(err.message);
//   }
// };


//     const fetchReviews = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch reviews");
//         const data = await res.json();
//         setReviews(data);
//         if (isLoggedIn && token) {
//           const userReview = data.find(r => r.user?._id === getUserIdFromToken());
//           if (userReview) setSubmitted(true);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchMovie();
//     fetchReviews();
//   }, [id, isLoggedIn]);

//   const getUserIdFromToken = () => {
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.id;
//     } catch {
//       return null;
//     }
//   };

//   // inside handleSubmitReview
// const handleSubmitReview = async () => {
//   if (!isLoggedIn) return alert("Please log in to submit a review.");
//   if (!rating || !reviewText) return alert("Please provide rating and review");
//   try {
//     const res = await fetch("http://localhost:5000/api/reviews", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       // ✅ FIX: backend expects `reviewText`
//       // body: JSON.stringify({ movieId: id, rating, reviewText }),
//       body: JSON.stringify({ movieId: id, rating, review: reviewText }),
//     });
//     if (!res.ok) {
//       const err = await res.json();
//       return alert(err.message || "Failed to submit review");
//     }
//     const newReview = await res.json();
//     setReviews([newReview, ...reviews]);
//     setSubmitted(true);
//     setRating(0);
//     setHoverRating(0);
//     setReviewText("");
//   } catch (err) {
//     console.error(err);
//     alert("Error submitting review");
//   }
// };


//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
//   if (!movie) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 text-black p-6">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
//         <div className="md:w-1/4 flex-shrink-0">
//           <img
//             src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
//             alt={movie.title}
//             className="rounded-2xl shadow-md w-full object-cover"
//           />
//         </div>

//         <div className="md:w-3/4 flex flex-col gap-4">
//           <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
//           <p>{movie.overview}</p>

//           <div className="flex flex-wrap gap-4 text-gray-600">
//             <span>
//               <strong>Release:</strong> {movie.release_date}
//             </span>
//             <span>
//               <strong>Runtime:</strong> {movie.runtime} mins
//             </span>
//             <span>
//               <strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(", ")}
//             </span>
//           </div>

//           <h2 className="text-2xl font-semibold mt-6 mb-2">Cast</h2>
//           <div className="flex gap-4 overflow-x-auto px-2 scrollbar-hide">
//             {cast.slice(0, 10).map((c) => (
//               <Link key={c.cast_id || c.credit_id} to={`/actor/${c.id}`} className="flex-none w-20 text-center">
//                 {c.profile_path ? (
//                   <img
//                     src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
//                     alt={c.name}
//                     className="rounded-lg mb-1 w-full h-24 object-cover"
//                   />
//                 ) : (
//                   <div className="h-24 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
//                     <span className="text-gray-500 text-xs">No Image</span>
//                   </div>
//                 )}
//                 <p className="font-medium text-xs">{c.name}</p>
//                 <p className="text-gray-500 text-[10px]">{c.character}</p>
//               </Link>
//             ))}
//           </div>

//           <h2 className="text-2xl font-semibold mt-6 mb-2">Crew</h2>
//           <div className="flex gap-4 overflow-x-auto px-2 scrollbar-hide">
//             {crew
//               .filter((c, index, self) => index === self.findIndex((t) => t.id === c.id))
//               .slice(0, 10)
//               .map((c) => (
//                 <Link key={c.id} to={`/actor/${c.id}`} className="flex-none w-20 text-center">
//                   {c.profile_path ? (
//                     <img
//                       src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
//                       alt={c.name}
//                       className="rounded-lg mb-1 w-full h-24 object-cover"
//                     />
//                   ) : (
//                     <div className="h-24 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
//                       <span className="text-gray-500 text-xs">No Image</span>
//                     </div>
//                   )}
//                   <p className="font-medium text-xs">{c.name}</p>
//                   <p className="text-gray-500 text-[10px]">{c.job}</p>
//                 </Link>
//               ))}
//           </div>

//           <h2 className="text-2xl font-semibold mt-6 mb-2">Submit Your Review</h2>
//           {submitted && <p className="text-green-600 mb-2">You have successfully reviewed this movie.</p>}
//           {!submitted && (
//             <div className="flex flex-col gap-2 max-w-md mb-6">
//               <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() => setRating(star)}
//                     onMouseEnter={() => setHoverRating(star)}
//                     onMouseLeave={() => setHoverRating(0)}
//                     className={`text-2xl ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-400"}`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
//               <textarea
//                 value={reviewText}
//                 onChange={(e) => setReviewText(e.target.value)}
//                 placeholder="Write your review..."
//                 className="bg-gray-100 rounded-lg p-2 text-black resize-none"
//               ></textarea>
//               <button
//                 onClick={handleSubmitReview}
//                 className="bg-yellow-500 text-black font-semibold rounded-lg py-2 px-4 hover:bg-yellow-400 transition"
//               >
//                 Submit Review
//               </button>
//             </div>
//           )}

//           <h2 className="text-2xl font-semibold mt-6 mb-2">Reviews</h2>
//           <div className="flex flex-col gap-4 max-w-2xl">
//             {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
//             {reviews.map((r) => (
//               <div key={r._id} className="p-4 rounded-xl border border-gray-300">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Link to={`/profile/${r.user._id}`} className="font-medium text-blue-600">
//                     {r.user.username}
//                   </Link>
//                   <span className="text-gray-400 text-sm">
//                     {new Date(r.createdAt).toLocaleDateString()}
//                   </span>
//                   <div className="ml-auto flex gap-1">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <span key={star} className={`text-sm ${star <= r.rating ? "text-yellow-400" : "text-gray-400"}`}>
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 {/* <p className="text-gray-700 text-sm">{r.reviewText}</p> */}
//                 <p className="text-gray-700 text-sm">{r.review}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }































// import React, { useEffect, useState, useContext } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../App.jsx";

// export default function MovieDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isLoggedIn, token } = useContext(ThemeContext);

//   const [movie, setMovie] = useState(null);
//   const [cast, setCast] = useState([]);
//   const [crew, setCrew] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [error, setError] = useState(null);

//   const [reviewText, setReviewText] = useState("");
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [submitted, setSubmitted] = useState(false);

//   // Fetch movie & reviews
//   useEffect(() => {
//     const fetchMovie = async () => {
//       try {
//         const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=credits`;
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status}`);
//         const data = await res.json();
//         setMovie(data);
//         setCast(data.credits?.cast || []);
//         setCrew(data.credits?.crew || []);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch reviews");
//         const data = await res.json();
//         setReviews(data);

//         if (isLoggedIn && token) {
//           const userReview = data.find(r => r.user?._id === getUserIdFromToken());
//           if (userReview) setSubmitted(true);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchMovie();
//     fetchReviews();
//   }, [id, isLoggedIn, token]);

//   const getUserIdFromToken = () => {
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.id;
//     } catch {
//       return null;
//     }
//   };

//   // Submit review
//   const handleSubmitReview = async () => {
//     if (!isLoggedIn) return alert("Please log in to submit a review.");
//     if (!rating || !reviewText) return alert("Please provide rating and review");

//     try {
//       const res = await fetch("http://localhost:5000/api/reviews", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ movieId: id, rating, review: reviewText }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         return alert(err.message || "Failed to submit review");
//       }

//       const newReview = await res.json();
//       setReviews([newReview, ...reviews]);
//       setSubmitted(true);
//       setRating(0);
//       setHoverRating(0);
//       setReviewText("");
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting review");
//     }
//   };

//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
//   if (!movie) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 text-black p-6">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
//         {/* Poster */}
//         <div className="md:w-1/4 flex-shrink-0">
//           <img
//             src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
//             alt={movie.title}
//             className="rounded-2xl shadow-md w-full object-cover"
//           />
//         </div>

//         {/* Movie Info */}
//         <div className="md:w-3/4 flex flex-col gap-4">
//           <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
//           <p>{movie.overview}</p>
//           <div className="flex flex-wrap gap-4 text-gray-600">
//             <span><strong>Release:</strong> {movie.release_date}</span>
//             <span><strong>Runtime:</strong> {movie.runtime} mins</span>
//             <span><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</span>
//           </div>

//           {/* Cast */}
//           <h2 className="text-2xl font-semibold mt-6 mb-2">Cast</h2>
//           <div className="flex gap-4 overflow-x-auto px-2 scrollbar-hide">
//             {cast.slice(0, 10).map(c => (
//               <Link key={c.cast_id || c.credit_id} to={`/actor/${c.id}`} className="flex-none w-20 text-center">
//                 {c.profile_path ? (
//                   <img
//                     src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
//                     alt={c.name}
//                     className="rounded-lg mb-1 w-full h-24 object-cover"
//                   />
//                 ) : (
//                   <div className="h-24 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
//                     <span className="text-gray-500 text-xs">No Image</span>
//                   </div>
//                 )}
//                 <p className="font-medium text-xs">{c.name}</p>
//                 <p className="text-gray-500 text-[10px]">{c.character}</p>
//               </Link>
//             ))}
//           </div>

//           {/* Crew */}
//           <h2 className="text-2xl font-semibold mt-6 mb-2">Crew</h2>
//           <div className="flex gap-4 overflow-x-auto px-2 scrollbar-hide">
//             {crew.filter((c, i, arr) => i === arr.findIndex(t => t.id === c.id)).slice(0, 10).map(c => (
//               <Link key={c.id} to={`/actor/${c.id}`} className="flex-none w-20 text-center">
//                 {c.profile_path ? (
//                   <img
//                     src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
//                     alt={c.name}
//                     className="rounded-lg mb-1 w-full h-24 object-cover"
//                   />
//                 ) : (
//                   <div className="h-24 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
//                     <span className="text-gray-500 text-xs">No Image</span>
//                   </div>
//                 )}
//                 <p className="font-medium text-xs">{c.name}</p>
//                 <p className="text-gray-500 text-[10px]">{c.job}</p>
//               </Link>
//             ))}
//           </div>

//           {/* Submit Review */}
//           <h2 className="text-2xl font-semibold mt-6 mb-2">Submit Your Review</h2>
//           {submitted && <p className="text-green-600 mb-2">You have successfully reviewed this movie.</p>}
//           {!submitted && (
//             <div className="flex flex-col gap-2 max-w-md mb-6">
//               <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map(star => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() => setRating(star)}
//                     onMouseEnter={() => setHoverRating(star)}
//                     onMouseLeave={() => setHoverRating(0)}
//                     className={`text-2xl ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-400"}`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
//               <textarea
//                 value={reviewText}
//                 onChange={e => setReviewText(e.target.value)}
//                 placeholder="Write your review..."
//                 className="bg-gray-100 rounded-lg p-2 text-black resize-none"
//               />
//               <button
//                 onClick={handleSubmitReview}
//                 className="bg-yellow-500 text-black font-semibold rounded-lg py-2 px-4 hover:bg-yellow-400 transition"
//               >
//                 Submit Review
//               </button>
//             </div>
//           )}

//           {/* Reviews List */}
//           <h2 className="text-2xl font-semibold mt-6 mb-2">Reviews</h2>
//           <div className="flex flex-col gap-4 max-w-2xl">
//             {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
//             {reviews.map(r => (
//               <div key={r._id} className="p-4 rounded-xl border border-gray-300">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Link to={`/profile/${r.user._id}`} className="font-medium text-blue-600">
//                     {r.user.username}
//                   </Link>
//                   <span className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
//                   <div className="ml-auto flex gap-1">
//                     {[1, 2, 3, 4, 5].map(star => (
//                       <span key={star} className={`text-sm ${star <= r.rating ? "text-yellow-400" : "text-gray-400"}`}>★</span>
//                     ))}
//                   </div>
//                 </div>
//                 <p className="text-gray-700 text-sm">{r.review}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App.jsx";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, token } = useContext(ThemeContext);

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Decode JWT to get user ID
  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  // Fetch movie and reviews
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=credits`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status}`);
        const data = await res.json();
        setMovie(data);
        setCast(data.credits?.cast || []);
        setCrew(data.credits?.crew || []);
      } catch (err) {
        console.error("fetchMovie error:", err);
        setError(err.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);

        // ✅ Check if the current user has already submitted a review
        if (isLoggedIn && token) {
          const userId = getUserIdFromToken();
          const hasReviewed = data.some((r) => r.user._id === userId);
          setSubmitted(hasReviewed);
        } else {
          setSubmitted(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovie();
    fetchReviews();
  }, [id, isLoggedIn, token]);

  // Submit a new review
  const handleSubmitReview = async () => {
    if (!isLoggedIn) return alert("Please log in to submit a review.");
    if (!rating || !reviewText) return alert("Please provide rating and review");

    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: id, rating, review: reviewText }), // must match backend
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Failed to submit review");
      }

      const newReview = await res.json();
      setReviews([newReview, ...reviews]); // Add new review to top
      setSubmitted(true);
      setRating(0);
      setHoverRating(0);
      setReviewText("");
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }
  };

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!movie) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="rounded-2xl shadow-md w-full object-cover"
          />
        </div>

        <div className="md:w-3/4 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
          <p>{movie.overview}</p>

          <div className="flex flex-wrap gap-4 text-gray-600">
            <span><strong>Release:</strong> {movie.release_date}</span>
            <span><strong>Runtime:</strong> {movie.runtime} mins</span>
            <span><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</span>
          </div>

          {/* Cast */}
          <h2 className="text-2xl font-semibold mt-6 mb-2">Cast</h2>
          <div className="flex gap-4 overflow-x-auto px-2 scrollbar-hide">
            {cast.slice(0, 10).map(c => (
              <Link key={c.cast_id || c.credit_id} to={`/actor/${c.id}`} className="flex-none w-20 text-center">
                {c.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                    alt={c.name}
                    className="rounded-lg mb-1 w-full h-24 object-cover"
                  />
                ) : (
                  <div className="h-24 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
                <p className="font-medium text-xs">{c.name}</p>
                <p className="text-gray-500 text-[10px]">{c.character}</p>
              </Link>
            ))}
          </div>

          {/* Crew */}
          <h2 className="text-2xl font-semibold mt-6 mb-2">Crew</h2>
          <div className="flex gap-4 overflow-x-auto px-2 scrollbar-hide">
            {crew
              .filter((c, index, self) => index === self.findIndex(t => t.id === c.id))
              .slice(0, 10)
              .map(c => (
                <Link key={c.id} to={`/actor/${c.id}`} className="flex-none w-20 text-center">
                  {c.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                      alt={c.name}
                      className="rounded-lg mb-1 w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="h-24 flex items-center justify-center rounded-lg mb-1 bg-gray-200">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  <p className="font-medium text-xs">{c.name}</p>
                  <p className="text-gray-500 text-[10px]">{c.job}</p>
                </Link>
              ))}
          </div>

          {/* Submit Review */}
          <h2 className="text-2xl font-semibold mt-6 mb-2">Submit Your Review</h2>
          {submitted && <p className="text-green-600 mb-2">You have successfully reviewed this movie.</p>}
          {!submitted && isLoggedIn && (
            <div className="flex flex-col gap-2 max-w-md mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-2xl ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-400"}`}
                  >★</button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="bg-gray-100 rounded-lg p-2 text-black resize-none"
              />
              <button
                onClick={handleSubmitReview}
                className="bg-yellow-500 text-black font-semibold rounded-lg py-2 px-4 hover:bg-yellow-400 transition"
              >Submit Review</button>
            </div>
          )}
          {!isLoggedIn && !submitted && (
            <p className="text-gray-600"> <Link to="/login" className="text-blue-600 underline">Log in</Link> to submit a review.</p>
          )}

          {/* Reviews List */}
          <h2 className="text-2xl font-semibold mt-6 mb-2">Reviews</h2>
          <div className="flex flex-col gap-4 max-w-2xl">
            {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
            {reviews.map((r) => (
  <div key={r._id} className="p-4 rounded-xl border border-gray-300">
    <div className="flex items-center gap-2 mb-2">
      <Link
        to={`/profile/${r.user.username}`}
        className="font-medium text-blue-600"
      >
        {r.user.username}
      </Link>
      <span className="text-gray-400 text-sm">
        {new Date(r.createdAt).toLocaleDateString()}
      </span>
      <div className="ml-auto flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= r.rating ? "text-yellow-400" : "text-gray-400"}`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
    <p className="text-gray-700 text-sm">{r.reviewText}</p>
  </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
