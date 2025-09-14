// import React, { useState, createContext } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/SignUp.jsx";
// import MovieDetails from "./pages/MovieDetails.jsx";
// import ActorDetails from "./pages/ActorDetails.jsx";
// import Search from "./pages/Search.jsx";
// import Profile from "./pages/Profile.jsx";
// import UserProfile from "./pages/UserProfile.jsx";

// export const ThemeContext = createContext();

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     !!localStorage.getItem("token")
//   );
//   const token = localStorage.getItem("token");

//   return (
//     <ThemeContext.Provider value={{ isLoggedIn, setIsLoggedIn, token }}>
//       <BrowserRouter>
//         <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
//           <Header />
//           <main className="flex-1 flex justify-center items-start pt-24">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/movies/:id" element={<MovieDetails />} />
//               <Route path="/actors/:id" element={<ActorDetails />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/search" element={<Search />} />
//               <Route path="/profile" element={<Profile />} /> 
//               <Route path="/user/:username" element={<UserProfile />} />
              
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </BrowserRouter>
//     </ThemeContext.Provider>
//   );
// }

// export default App;


// import React, { useState, createContext } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/SignUp";
// import Profile from "./pages/Profile";
// import MovieDetails from "./pages/MovieDetails";
// import Search from "./pages/Search";
// import ActorDetails from "./pages/ActorDetails";

// export const ThemeContext = createContext();

// export default function App() {
//   const storedToken = localStorage.getItem("token");
//   const [token, setToken] = useState(storedToken);
//   const [isLoggedIn, setIsLoggedIn] = useState(Boolean(storedToken));

//   const setAppToken = (t) => {
//     if (t) localStorage.setItem("token", t);
//     else localStorage.removeItem("token");
//     setToken(t);
//     setIsLoggedIn(Boolean(t));
//   };

//   return (
//     <ThemeContext.Provider value={{ token, setToken: setAppToken, isLoggedIn, setIsLoggedIn }}>
//       <BrowserRouter>
//         <div className="flex flex-col min-h-screen">
//           <Header />
//           <main className="flex-1 container mx-auto px-4 py-6">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/profile" element={<Profile />} />
//               <Route path="/movies/:id" element={<MovieDetails />} />
//               <Route path="/search" element={<Search />} />
//               <Route path="/actors/:id" element={<ActorDetails />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </BrowserRouter>
//     </ThemeContext.Provider>
//   );
// }



import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import ActorDetails from "./pages/ActorDetails";
import UserProfile from "./pages/UserProfile.jsx";

// Context
export const ThemeContext = createContext();
export default function App() {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(storedToken));

  const setAppToken = (t) => {
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    setToken(t);
    setIsLoggedIn(Boolean(t));
  };

  return (
    <ThemeContext.Provider value={{ token, setToken: setAppToken, isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/actor/:id" element={<ActorDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/user/:username" element={<UserProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
