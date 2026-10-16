import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./dashbord/Layout";
import FaceRecognition from "./dashbord/notes/FaceRecognition";
import NoteDetails from "./dashbord/notes/NoteDetails";
import NotesConatiner from "./dashbord/notes/NotesConatiner";
import HomePage from "./dashbord/home/Page";
import FolderPage from "./dashbord/folders/Page";
import FolderDetails from "./dashbord/folders/FolderDetails";
import ActivityPage from "./dashbord/activity log/Page";
import TrashPage from "./dashbord/trash/Page";
import SearchPage from "./dashbord/search/Page";
import { getUser } from "./lib/auth";
import { warmFaceModelsInBackground } from "./lib/faceModels";
import type { ReactNode } from "react";

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!getUser()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export default function App() {
  // Warm the face-api.js weights while the user is idle so that opening a
  // private item does not stall on a ~6.7 MB download.
  useEffect(() => warmFaceModelsInBackground(), []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="notes" element={<NotesConatiner />} />
          <Route path="notes/:id" element={<NoteDetails />} />
          <Route path="folders" element={<FolderPage />} />
          <Route path="folders/:id" element={<FolderDetails />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="facesave" element={<FaceRecognition mode="save" />} />
        </Route>

        <Route
          path="/faceverify/notes/:id"
          element={
            <RequireAuth>
              <FaceRecognition mode="verify" type="notes" />
            </RequireAuth>
          }
        />
        <Route
          path="/faceverify/folder/:id"
          element={
            <RequireAuth>
              <FaceRecognition mode="verify" type="folders" />
            </RequireAuth>
          }
        />
        <Route
          path="/faceverify/delete/:kind/:id"
          element={
            <RequireAuth>
              <FaceRecognition mode="delete" />
            </RequireAuth>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}