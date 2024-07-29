import React, { useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  FaArchive,
  FaClipboardList,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import useAuth from "../../../hooks/useAuth";
import useOrders from "../../../hooks/useOrder";
import useMenu from "../../../hooks/useMenu";
import useUsers from "../../../hooks/useUsers";

// Register required components
ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const [orders] = useOrders();
  const [menu] = useMenu();
  const [users] = useUsers();

  // Calculate total revenue
  let revenue = orders.reduce((total, item) => total + item.price, 0);

  // Map menu item IDs to categories
  const menuItemToCategory = useMemo(() => {
    const mapping = {};
    menu.forEach((item) => {
      mapping[item._id] = item.category;
    });
    return mapping;
  }, [menu]);

  // Extract categories from orders
  const categories = [
    ...new Set(
      orders.flatMap((order) =>
        order.menuItems.map((id) => menuItemToCategory[id])
      )
    ),
  ];

  // Generate sales data for Line chart
  const salesData = {
    labels: categories,
    datasets: [
      {
        label: "Revenue",
        data: categories.map((category) =>
          orders
            .filter((order) =>
              order.menuItems.some((id) => menuItemToCategory[id] === category)
            )
            .reduce((total, item) => total + item.price, 0)
        ),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  // Generate data for Pie chart
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categories.map(
          (category) =>
            orders.filter((order) =>
              order.menuItems.some((id) => menuItemToCategory[id] === category)
            ).length
        ),
        backgroundColor: categories.map(
          (_, index) => `hsl(${index * (360 / categories.length)}, 70%, 50%)`
        ),
      },
    ],
  };

  return (
    <div className="w-full px-4 mx-auto max-w-7xl">
      <h2 className="text-2xl font-semibold my-4">
        Hi, <span className="text-green">{user.displayName.toUpperCase()}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border-2 p-4 flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Revenue</h3>
          <p className="text-2xl text-center flex items-center gap-2">
            ${revenue.toFixed(2)} <FaDollarSign />
          </p>
        </div>
        <div className="border-2 p-4 flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Users</h3>
          <p className="text-2xl text-center flex items-center gap-2">
            {users.length} <FaUsers />
          </p>
        </div>
        <div className="border-2 p-4 flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Menu Items</h3>
          <p className="text-2xl text-center flex items-center gap-2">
            {menu.length} <FaClipboardList />
          </p>
        </div>
        <div className="border-2 p-4 flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center">Orders</h3>
          <p className="text-2xl text-center flex items-center gap-2">
            {orders.length} <FaArchive />
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Sales Data</h3>
        <div style={{ height: "400px" }}>
          {" "}
          {/* Adjust height as needed */}
          <Line data={salesData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Sales Distribution</h3>
        <div style={{ height: "400px" }}>
          {" "}
          {/* Adjust height as needed */}
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
