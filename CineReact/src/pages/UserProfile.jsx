import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const token = localStorage.getItem("token");
  const api = axios.create({ baseURL: "http://localhost:5000", headers: token ? { Authorization: `Bearer ${token}` } : {} });

  useEffect(() => {
    fetchUser();
  }, [username]);

  async function fetchUser() {
    try {
      const res = await api.get(`/api/users/username/${username}`);
      setData(res.data);
      if (token) {
        const me = await api.get("/api/users/me");
        setIsFollowing(me.data.following.includes(username));
      }
    } catch (err) {
      console.error("fetch user", err);
    }
  }

  async function handleFollow() {
    try {
      await api.post(`/api/users/follow/${username}`);
      setIsFollowing(true);
      fetchUser();
    } catch (err) {
      console.error("follow err", err);
      alert(err.response?.data?.message || "Failed to follow");
    }
  }

  async function handleUnfollow() {
    try {
      await api.post(`/api/users/unfollow/${username}`);
      setIsFollowing(false);
      fetchUser();
    } catch (err) {
      console.error("unfollow err", err);
      alert(err.response?.data?.message || "Failed to unfollow");
    }
  }

  if (!data) return <div className="p-6">Loading...</div>;

  const { user, recentReviews, reviewCount } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <div className="flex items-center gap-4">
          <img src={user.profilePhoto ? `http://localhost:5000/uploads/${user.profilePhoto}` : '/default-profile.png'} className="w-24 h-24 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="mt-2 text-sm text-gray-700">Reviews: {reviewCount}</div>
          </div>
          <div className="ml-auto">
            {token ? (
              isFollowing ? (
                <button onClick={handleUnfollow} className="bg-red-500 text-white px-3 py-1 rounded">Unfollow</button>
              ) : (
                <button onClick={handleFollow} className="bg-blue-600 text-white px-3 py-1 rounded">Follow</button>
              )
            ) : (
              <div className="text-sm text-gray-500">Log in to follow</div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Top Favorites</h3>
          <div className="grid grid-cols-3 gap-3">
            {(user.topFavorites || []).slice(0,3).map((m) => (
              <div key={m.id} className="rounded overflow-hidden">
                <img src={m.poster || '/default-poster.png'} className="w-full h-36 object-cover" />
                <div className="p-2 text-sm">{m.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Recent Reviews</h3>
          <div className="space-y-3">
            {recentReviews.map(r => (
              <div key={r._id} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Movie: {r.movieId || r.movieId}</div>
                  <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="mt-2 text-sm">{r.review}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
