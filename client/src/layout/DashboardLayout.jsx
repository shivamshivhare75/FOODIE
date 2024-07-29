import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdDashboardCustomize } from "react-icons/md";
import {
  FaEdit,
  FaPlusCircle,
  FaRegUser,
  FaShoppingBag,
  FaUser,
  FaLocationArrow,
  FaQuestionCircle,
  FaShoppingCart,
} from "react-icons/fa";
import logo from "/logo.png";
import Login from "../components/Login";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import ScrollToTop from "../components/ScrollToTop";
import { AuthContext } from "../contexts/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
const sharedLinks = (
  <>
    <li className="mt-3">
      <Link to="/">
        <MdDashboard />
        Home
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaShoppingCart />
        Menu
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaLocationArrow />
        Orders Tracking
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaQuestionCircle />
        Customer Support
      </Link>
    </li>
  </>
);

const DashboardLayout = () => {
  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const { logOut } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  if (loading || isAdminLoading) {
    // Show a loading spinner or placeholder while checking the auth and admin status
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // If user is not an admin, show the back to home button
    return (
      <div className="h-screen flex justify-center items-center">
        <Link to="/">
          <button className="btn bg-green text-white">Back to Home</button>
        </Link>
      </div>
    );
  }
  const handleLogout = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
        navigate(from, { replace: true });
      })
      .catch((error) => {
        // An error happened.
      });
  };
  // Render the dashboard layout if user is an admin
  return (
    <div className="drawer sm:drawer-open">
      <ScrollToTop />
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
        {/* Page content here */}
        <div className="flex items-center justify-between mx-4">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <MdDashboardCustomize />
          </label>
          <div className="absolute top-4 right-4">
            <button
              className="btn rounded-full px-6 bg-green text-white flex items-center gap-2"
              onClick={handleLogout}
            >
              <FaRegUser />
              Logout
            </button>
          </div>
        </div>
        <div className="mt-5 md:mt-2 mx-4">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link to="/dashboard" className="flex justify-start mb-3">
              <img src={logo} alt="" className="w-20" />
              <span className="badge badge-primary">Admin</span>
            </Link>
          </li>
          <hr />
          <li className="mt-3">
            <Link to="/dashboard">
              <MdDashboard />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/bookings">
              <FaShoppingBag />
              Manage Bookings
            </Link>
          </li>
          <li>
            <Link to="/dashboard/add-menu">
              <FaPlusCircle />
              Add Menu
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-items">
              <FaEdit />
              Manage Items
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/dashboard/users">
              <FaUser />
              All Users
            </Link>
          </li>
          <hr />
          {/* shared nav links  */}
          {sharedLinks}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
