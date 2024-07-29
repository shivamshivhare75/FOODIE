import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdateMenu = () => {
  const item = useLoaderData();
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const baseURL = "https://foodie-backend-78wt.onrender.com"; // Base URL for your backend

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("recipe", data.recipe);

      // Upload the image
      const imageUploadRes = await axiosPublic.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let imageUrl = item.image; // Default to existing image if not updated
      if (imageUploadRes.data.success) {
        const filePath = imageUploadRes.data.filePath;
        // Check if the filePath already contains the base URL
        if (
          !filePath.startsWith("http://") &&
          !filePath.startsWith("https://")
        ) {
          imageUrl = `${baseURL}${filePath}`; // Construct full URL
        } else {
          imageUrl = filePath; // Use the existing URL
        }
      }

      // Prepare menu item data for update
      const menuItem = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        recipe: data.recipe,
        image: imageUrl,
      };

      // Update menu item on the server
      const updateMenuItemRes = await axiosSecure.patch(
        `/menu/${item._id}`,
        menuItem
      );
      if (updateMenuItemRes.status === 200) {
        reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your Item Is Updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/manage-items");
      }
    } catch (error) {
      console.error("Error uploading image or updating menu item:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Update This <span className="text-green">Menu Item</span>
      </h2>
      {/* form */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              defaultValue={item.name}
              {...register("name", { required: true })}
              placeholder="Recipe Name"
              className="input input-bordered w-full "
            />
          </div>

          {/* 2nd row */}
          <div className="flex items-center gap-4 my-4">
            {/* categories */}
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered"
                defaultValue={item.category}
              >
                <option disabled value="default">
                  Select a category
                </option>
                <option value="salad">Salad</option>
                <option value="pizza">Pizza</option>
                <option value="soup">Soup</option>
                <option value="dessert">Dessert</option>
                <option value="drinks">Drinks</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            {/* prices */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                {...register("price", { required: true })}
                type="number"
                defaultValue={item.price}
                placeholder="Price"
                className="input input-bordered w-full "
              />
            </div>
          </div>
          {/* 3rd row */}
          <div className="form-control my-0">
            <label className="label">
              <span className="label-text">Recipe Details*</span>
            </label>
            <textarea
              defaultValue={item.recipe}
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the world about your recipe"
            ></textarea>
          </div>
          {/* 4th row */}
          <div className="form-control w-full my-6">
            <input
              {...register("image")}
              type="file"
              className="file-input  w-full max-w-xs"
            />
          </div>
          {/* button */}
          <button className="btn bg-green text-white px-6">
            Update Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenu;
