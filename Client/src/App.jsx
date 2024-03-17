import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./PageComponent/LoginPage";
import CreateUser from "./PageComponent/CreateUser";
import MainPage from "./PageComponent/MainPage";
import AdminCreateUserPage from "./PageComponent/AdminCreateUserPage";
import UsersPage from "./PageComponent/UsersPage";
import EditUserPage from "./PageComponent/EditUserPage";
import MoviesPage from "./PageComponent/MoviesPage";
import SubscriptionsPage from "./PageComponent/SubscriptionsPage";
import EditMemberPage from "./PageComponent/EditMemberPage";
import AddMemberPage from "./PageComponent/AddMemberPage";
import AddMoviePage from "./PageComponent/AddMoviePage";
import EditMoviePage from "./PageComponent/EditMoviePage";
import Layout from "./Components/Layout";
import "./CSS/App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* For pages like LoginPage that might not use the common layout */}
        <Route path="/" element={<LoginPage />} />

        {/* Wrap other pages within Layout for shared UI elements */}
        <Route
          path="/mainPage"
          element={
            <Layout>
              <MainPage />
            </Layout>
          }
        />
        <Route
          path="/createUser"
          element={
            <Layout>
              <CreateUser />
            </Layout>
          }
        />
        <Route
          path="/AdminCreateUserPage"
          element={
            <Layout>
              <AdminCreateUserPage />
            </Layout>
          }
        />
        <Route
          path="/userPage"
          element={
            <Layout>
              <UsersPage />
            </Layout>
          }
        />
        <Route
          path="/EditUserPage/:_id"
          element={
            <Layout>
              <EditUserPage />
            </Layout>
          }
        />
        <Route
          path="/MoviesPage"
          element={
            <Layout>
              <MoviesPage />
            </Layout>
          }
        />
        <Route
          path="/AddMoviePage"
          element={
            <Layout>
              <AddMoviePage />
            </Layout>
          }
        />
        <Route
          path="/EditMoviePage/:movieId"
          element={
            <Layout>
              <EditMoviePage />
            </Layout>
          }
        />
        <Route
          path="/SubscriptionsPage"
          element={
            <Layout>
              <SubscriptionsPage />
            </Layout>
          }
        />
        <Route
          path="/EditMemberPage/:_id"
          element={
            <Layout>
              <EditMemberPage />
            </Layout>
          }
        />
        <Route
          path="/AddMemberPage"
          element={
            <Layout>
              <AddMemberPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
