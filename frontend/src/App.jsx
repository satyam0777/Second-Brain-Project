


import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import AddNote from "./pages/AddNote";
import AddBookmark from "./pages/AddBookmark";
import SearchPage from "./pages/SearchPage";
import Analytics from "./pages/Analytics";
import NoteDetail from "./pages/NoteDetail";
import About from "./pages/About";
// import AddBookmark from "./pages/AddBookmark";
import AllBookmarks from "./pages/AllBookmarks";
import SingleBookmark from "./pages/SingleBookmark";

import BookmarkDetails from "./pages/BookmarkDetails";
import Comments from "./pages/Comments";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-note" element={<AddNote />} />
      <Route path="/add-bookmark" element={<AddBookmark />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/analytics" element={<Analytics />} />
      {/* <Route path="/notes/:id" element={<NoteDetail />} /> */}
      <Route path="/notes/:id" element={<NoteDetail />} />
       <Route path="/about" element={<About />} /> 
        <Route path="/bookmarks" element={<AllBookmarks />} />
    <Route path="/bookmarks/add" element={<AddBookmark />} />
    <Route path="/bookmarks/:id" element={<SingleBookmark />} />
    <Route path="/bookmarks/:id" element={<BookmarkDetails />} />
    <Route path="/comments" element={<Comments />} />
    <Route path="/favorites" element={<Favorites />} />


    </Routes>
  );
}

export default App;

