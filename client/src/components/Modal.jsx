import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast"; // Import react-hot-toast

const Modal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { signUpWithGmail, login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  // redirecting to home or specific page
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  // login handler
  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    login(email, password)
      .then((result) => {
        toast.success("Login successful");
        setTimeout(() => {
          document.getElementById("my_modal_5").close();
          reset(); // Reset the form data
          setErrorMessage(""); // Clear the error message
          navigate(from, { replace: true });
        }, 1000); // Delay for 1 second
      })
      .catch((error) => {
        setErrorMessage("Provide a correct email and password");
      });
  };

  // google signin handler
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        axios
          .post("https://foodie-backend-78wt.onrender.com/users", userInfor)
          .then((response) => {
            toast.success("Register successful");
            setTimeout(() => {
              navigate("/");
            }, 1000); // Delay for 1 second
          });
      })
      .catch((error) => console.log(error));
  };

  // handle close
  const handleClose = () => {
    document.getElementById("my_modal_5").close();
    reset(); // Reset the form data
    setErrorMessage(""); // Clear the error message
  };

  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action mt-0 flex flex-col justify-center">
          <form
            className="card-body"
            onSubmit={handleSubmit(onSubmit)}
            method="dialog"
            style={{ padding: "1.1rem" }}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>
            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
                {...register("email")}
              />
            </div>
            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
                {...register("password")}
              />
              <label className="label mt-1">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* error text */}
            {errorMessage && (
              <p className="text-red text-xs italic">{errorMessage}</p>
            )}
            {/* login btn */}
            <div className="form-control mt-1">
              <input
                className="btn bg-green text-white"
                type="submit"
                value="Login"
              />
            </div>
            <p className="text-center my-1">
              Don’t have an account?
              <Link to="/signup" className="underline text-red ml-1">
                Signup Now
              </Link>
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <div className="text-center space-x-3 mb-5">
            <button
              className="btn btn-circle hover:bg-green hover:text-white"
              onClick={handleRegister}
            >
              <FaGoogle />
            </button>
            <button className="btn btn-circle hover:bg-green hover:text-white">
              <FaFacebookF />
            </button>
            <button className="btn btn-circle hover:bg-green hover:text-white">
              <FaGithub />
            </button>
          </div>
        </div>
      </div>
      {/* Toast Container for notifications */}
      <Toaster />
    </dialog>
  );
};

export default Modal;
