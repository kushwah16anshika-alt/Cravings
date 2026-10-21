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

        // Server returns { data: { restaurantId: { ... }, menuItems: [ ... ] } }
        // In Axios, response.data holds the server body: { data: { ... } }
        // We safely handle response.data.data, response.data, and any variations
        const resBody = response?.data;
        const payload = resBody?.data || resBody || {};

        const restaurant =
          payload.restaurantId ||
          payload.restaurant ||
          resBody?.restaurantId ||
          resBody?.restaurant ||
          (payload._id ? payload : null);

        const menuItems = Array.isArray(payload.menuItems)
          ? payload.menuItems
          : Array.isArray(resBody?.menuItems)
          ? resBody.menuItems
          : Array.isArray(payload.menu)
          ? payload.menu
          : [];

        setDetails({
          restaurant,
          restaurantId: restaurant, // preserve compatibility
          menuItems,
        });
      } catch (error) {
        console.error("Failed to load restaurant details:", error);
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

  const restaurant = details?.restaurant || details?.restaurantId;

  if (!details || !restaurant) {
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

  return (
    <div className="min-h-screen bg-(--color-base-200) pb-24 relative">
      <RestaurantHero
        restaurant={restaurant}
        onBack={() => navigate(-1)}
      />

      <RestaurantInfoStrip restaurant={restaurant} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 md:gap-8 items-start">
        {/* Left Sidebar (on mobile rendered below the menu for immediate food ordering) */}
        <div className="space-y-6 order-2 lg:order-1">
          <RestaurantAbout description={restaurant.description} />
          <RestaurantGallery images={restaurant.restaurantImage} />
          <RestaurantContact restaurant={restaurant} />
          <RestaurantSocialLinks socialMediaLinks={restaurant.socialMediaLinks} />
        </div>

        {/* Right: Menu */}
        <div className="order-1 lg:order-2">
          <RestaurantMenu
            menuItems={details.menuItems || []}
            restaurantId={restaurant._id || restaurantId}
            restaurantName={restaurant.restaurantName}
          />
        </div>
      </div>

      {/* Cart Bottom Bar */}
      {cart && totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-40 flex justify-center px-3 sm:px-4">
          <div className="bg-(--color-primary) text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl w-full max-w-2xl flex justify-between items-center shadow-2xl shadow-(--color-primary)/40 animate-float gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className="bg-white/20 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
              <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                ₹{totalPrice}
              </span>
            </div>

            <button
              className="bg-white text-(--color-primary) px-3.5 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 active:scale-95 transition shadow-sm whitespace-nowrap flex-shrink-0"
              onClick={() => navigate("/cart")}
            >
              <span className="hidden sm:inline">View Cart & Checkout →</span>
              <span className="sm:hidden">Checkout →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsPage;