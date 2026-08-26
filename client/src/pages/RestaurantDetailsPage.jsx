import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api.config";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { IoArrowBack } from "react-icons/io5";
import { TbChefHat } from "react-icons/tb";
import RestaurantHero from "../components/publicRestaurantDetails/RestaurantHero";
import RestaurantInfoStrip from "../components/publicRestaurantDetails/RestaurantInfoStrip";
import RestaurantAbout from "../components/publicRestaurantDetails/RestaurantAbout";
import RestaurantGallery from "../components/publicRestaurantDetails/RestaurantGallery";
import RestaurantContact from "../components/publicRestaurantDetails/RestaurantContact";
import RestaurantSocialLinks from "../components/publicRestaurantDetails/RestaurantSocialLinks";
import RestaurantMenu from "../components/publicRestaurantDetails/RestaurantMenu";
import { useCart } from "../context/CartContext";

const RestaurantDetailsPage = () => {
  const { cart, totalItems, totalPrice } = useCart();
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(
          `/public/restaurant-detail/${restaurantId}`
        );

        setDetails(response.data.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load restaurant details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      fetchDetails();
    }
  }, [restaurantId]);

  if (isLoading) {
    return <Loader height="80vh" width="100%" text="Fetching fresh menu & restaurant details..." />;
  }

  if (!details || !details.restaurantId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <TbChefHat className="text-6xl text-(--color-primary)" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Restaurant not found
        </h2>
        <p className="text-slate-500 text-sm max-w-sm">
          We could not find the requested restaurant profile. It might be inactive or removed.
        </p>
        <button
          onClick={() => navigate("/order-now")}
          className="flex items-center gap-2 px-6 py-2.5 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-focus) transition shadow-md"
        >
          <IoArrowBack />
          Explore Other Restaurants
        </button>
      </div>
    );
  }

  const restaurant = details.restaurantId;

  return (
    <div className="min-h-screen bg-(--color-base-200) pb-24 relative">
      <RestaurantHero
        restaurant={restaurant}
        onBack={() => navigate(-1)}
      />

      <RestaurantInfoStrip restaurant={restaurant} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
        {/* Left Sidebar */}
        <div className="space-y-6">
          <RestaurantAbout description={restaurant.description} />
          <RestaurantGallery images={restaurant.restaurantImage} />
          <RestaurantContact restaurant={restaurant} />
          <RestaurantSocialLinks socialMediaLinks={restaurant.socialMediaLinks} />
        </div>

        {/* Right: Menu */}
        <div>
          <RestaurantMenu
            menuItems={details.menuItems || []}
            restaurantId={restaurant._id}
            restaurantName={restaurant.restaurantName}
          />
        </div>
      </div>

      {/* Cart Bottom Bar */}
      {cart && totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="bg-(--color-primary) text-white px-6 py-3.5 rounded-2xl w-full max-w-2xl flex justify-between items-center shadow-2xl shadow-(--color-primary)/40 animate-float">
            <div className="flex items-center space-x-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
              <span className="font-bold text-base">
                ₹{totalPrice}
              </span>
            </div>

            <button
              className="bg-white text-(--color-primary) px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-100 active:scale-95 transition shadow-sm"
              onClick={() => navigate("/cart")}
            >
              View Cart & Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsPage;