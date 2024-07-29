import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const UpdateProfile = () => {
  const { updateUserProfile } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const onSubmit = async (data) => {
    try {
      const imageFile = data.image[0];
      
      // Check if the file type is PNG or JPEG
      if (!["image/png", "image/jpeg"].includes(imageFile.type)) {
        alert("Wrong file type. Please upload a PNG or JPEG file.");
        reset()
        return;
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      // Upload image to image hosting service
      const response = await axiosPublic.post(imageHostingApi, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const photoURL = response.data.data.display_url;
        const name = data.name;

        // Update user profile
        await updateUserProfile(name, photoURL);
        alert("Profile Updated")
        navigate(from, { replace: true });
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold ">Update Your Profile</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Your Name"
              className="input input-bordered"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              {...register("image", { required: "Photo is required" })}
              type="file"
              accept=".png, .jpg, .jpeg"
              className="file-input w-full max-w-xs"
            />
            {errors.image && (
              <span className="text-red-500">{errors.image.message}</span>
            )}
          </div>
          <div className="form-control mt-6">
            <button className="btn bg-green text-white">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
