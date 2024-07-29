import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddMenu = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("recipe", data.recipe);

    try {
      // First, upload the image
      const imageUploadRes = await axiosSecure.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (imageUploadRes.data.success) {
        const imageUrl = imageUploadRes.data.filePath;
        // Now, save the menu item with the image URL
        const menuItem = {
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          recipe: data.recipe,
          image: imageUrl,
        };

        const postMenuItemRes = await axiosSecure.post("/menu", menuItem);
        if (postMenuItemRes.status === 200) {
          reset();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your Item Is Inserted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading image or saving menu item:", error);
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Upload A New <span className="text-green">Menu Item</span>
      </h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Recipe Name"
              className="input input-bordered w-full "
            />
          </div>
          <div className="flex items-center gap-4 my-4">
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered"
                defaultValue="default"
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                {...register("price", { required: true })}
                type="number"
                placeholder="Price"
                className="input input-bordered w-full "
              />
            </div>
          </div>
          <div className="form-control my-0">
            <label className="label">
              <span className="label-text">Recipe Details*</span>
            </label>
            <textarea
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the world about your recipe"
            ></textarea>
          </div>
          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input  w-full max-w-xs"
            />
          </div>
          <button className="btn bg-green text-white px-6">
            Add Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
