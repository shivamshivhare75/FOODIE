import React from "react";
const serviceList = [
  {
    id: 1,
    title: "CATERING",
    des: "Delight your guests with our flavors and presentation",
    img: "/images/home/services/icon1.png",
  },
  {
    id: 2,
    title: "FAST DELIVERY",
    des: "We deliver your order promptly to your door",
    img: "/images/home/services/icon2.png",
  },
  {
    id: 3,
    title: "ONLINE ORDERING",
    des: "Explore menu & order with ease using our Online Ordering",
    img: "/images/home/services/icon3.png",
  },
  {
    id: 4,
    title: "GIFT CARDS",
    des: "Give the gift of exceptional dining with Foodi Gift Cards",
    img: "/images/home/services/icon4.png",
  },
];
const OurServices = () => {
  return (
    <div className="section-container my-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <div className="text-left md:w-full">
            <p className="subtitle">Our Story & Services</p>
            <h2 className="title">Our Culinary Journey And Services</h2>
            <p className="my-5 text-secondary leading-[30px]">
              Rooted in passion, we curate unforgettable dining experiences and
              offer exceptional services, blending culinary artistry with warm
              hospitality.
            </p>
            <button className="btn bg-green text-white px-8 py-3 rounded-full">
              Explore
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-5 items-center">
            {serviceList.map((service) => (
              <div
                key={service.id}
                className="shadow-lg rounded-3xl py-5 px-4 text-center space-y-2 text-green cursor-pointer hover:scale-105  transition-all duration-200  border"
              >
                <img src={service.img} alt="" className="mx-auto " />
                <h5 className="pt-3 font-semibold">{service.title}</h5>
                <p className="text-[#90BD95]">{service.des}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
