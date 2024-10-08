import React, { useContext } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast"; // Import react-hot-toast
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Signup = () => {
  const { createUser, signUpWithGmail, updateUserProfile } =
    useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { email, password, name, photoUrl } = data;
    createUser(email, password)
      .then((result) => {
        const user = result.user;
        updateUserProfile(name, photoUrl).then(() => {
          const userInfor = { name, email };
          axiosPublic.post("/users", userInfor).then(() => {
            toast.success("Signup successful");
            setTimeout(() => {
              navigate(from, { replace: true });
            }, 1000); // Delay for 1 second to let the toast message be visible
          });
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: user.displayName,
          email: user.email,
        };
        axiosPublic.post("/users", userInfor).then(() => {
          toast.success("Signup successful");
          setTimeout(() => {
            navigate("/");
          }, 1000); // Delay for 1 second to let the toast message be visible
        });
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-10 relative">
      <Toaster /> {/* Toast Container for notifications */}
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Please Create An Account!</h3>

          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input input-bordered"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
            <label className="label">
              <a className="label-text-alt link link-hover mt-2">
                Forgot password?
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-1">
            <input
              type="submit"
              className="btn bg-green text-white"
              value="Sign up"
            />
          </div>

          {/* Close Button */}
          <div
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
          >
            ✕
          </div>

          <div className="text-center my-1">
            Have an account?
            <Link to="/login">
              <button className="ml-2 underline">Login here</button>
            </Link>
          </div>
        </form>
        <div className="text-center space-x-3">
          <button
            onClick={handleRegister}
            className="btn btn-circle hover:bg-green hover:text-white"
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
  );
};

export default Signup;
