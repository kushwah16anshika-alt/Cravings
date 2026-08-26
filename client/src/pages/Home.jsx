
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch, IoStar } from "react-icons/io5";
import {
  MdRestaurant,
  MdLocalDining,
  MdFastfood,
  MdCake,
  MdLunchDining,
} from "react-icons/md";

import CarouselComponent from "../components/CarouselComponent";
import { useAuth } from "../context/AuthContext";
import api from "../config/api.config";

const categories = [
  {
    id: "all",
    label: "All",
    icon: MdRestaurant,
  },
  {
    id: "veg",
    label: "Vegetarian",
    icon: MdLocalDining,
  },
  {
    id: "nonveg",
    label: "Non-Veg",
    icon: MdFastfood,
  },
  {
    id: "dessert",
    label: "Desserts",
    icon: MdCake,
  },
  {
    id: "others",
    label: "Others",
    icon: MdLunchDining,
  },
];

const categoryMap = {
  veg: "veg",
  nonveg: "non",
  dessert: "dessert",
  others: "other",
};

const stats = [
  {
    value: "2.5M+",
    title: "Successful Deliveries",
    desc: "Food delivered with care",
  },
  {
    value: "500K+",
    title: "Happy Customers",
    desc: "People enjoying Cravings",
  },
  {
    value: "5K+",
    title: "Partner Restaurants",
    desc: "Restaurants growing with us",
  },
  {
    value: "1K+",
    title: "Delivery Partners",
    desc: "Fast and safe delivery",
  },
];

const reviews = [
  {
    name: "Arun J.",
    title: "Amazing Service!",
    text: "The food arrived hot and fresh. The delivery was incredibly fast. Highly impressed with Cravings!",
    initials: "AJ",
  },
  {
    name: "Sneha P.",
    title: "Best App Ever!",
    text: "Easy to use interface, wide variety of restaurants, and quick delivery. I order from Cravings every week!",
    initials: "SP",
  },
  {
    name: "Raj Kumar",
    title: "Excellent Choices",
    text: "Love the variety of restaurants available. Found my new favorite spot through Cravings. Definitely worth it!",
    initials: "RK",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD RESTAURANTS
  // =========================================================
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);

        const response = await api.get("/public/restaurants");

        const data = response.data?.data || [];

        const formattedRestaurants = data.map((restaurant) => {
          // Handle cuisineType
          let cuisines = [];

          if (Array.isArray(restaurant.cuisineType)) {
            cuisines = restaurant.cuisineType;
          } else if (typeof restaurant.cuisineType === "string") {
            cuisines = restaurant.cuisineType
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
          }

          // Handle images
          const image =
            restaurant?.coverImage?.url ||
            restaurant?.images?.[0]?.URL ||
            restaurant?.images?.[0]?.url ||
            "https://placehold.co/600x400?text=Restaurant";

          return {
            id: restaurant._id,

            name:
              restaurant.restaurantName ||
              "Unknown Restaurant",

            description:
              restaurant.description ||
              `${
                cuisines.length > 0
                  ? cuisines.join(", ")
                  : "Food"
              } restaurant`,

            rating:
              Number(
                restaurant.averageRating ??
                  restaurant.rating ??
                  0
              ) || 0,

            numReviews: restaurant.numReviews || 0,

            image,

            cuisines,

            city: restaurant.city || "",

            address: restaurant.address || "",

            isOpen: restaurant.isOpen ?? false,

            restaurantType:
              restaurant.restaurantType || "",

            servingHours:
              restaurant.servingHours || null,

            geolocation:
              restaurant.geolocation || null,
          };
        });

        setRestaurants(formattedRestaurants);
        setFilteredRestaurants(formattedRestaurants);
      } catch (error) {
        console.error(
          "Error loading restaurants:",
          error
        );

        setRestaurants([]);
        setFilteredRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  // =========================================================
  // SEARCH + CATEGORY FILTER
  // =========================================================
  useEffect(() => {
    let filtered = [...restaurants];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery
        .trim()
        .toLowerCase();

      filtered = filtered.filter((restaurant) => {
        const restaurantName =
          restaurant.name?.toLowerCase() || "";

        const description =
          restaurant.description?.toLowerCase() || "";

        const city =
          restaurant.city?.toLowerCase() || "";

        const address =
          restaurant.address?.toLowerCase() || "";

        const cuisines =
          restaurant.cuisines
            ?.join(" ")
            .toLowerCase() || "";

        return (
          restaurantName.includes(query) ||
          description.includes(query) ||
          city.includes(query) ||
          address.includes(query) ||
          cuisines.includes(query)
        );
      });
    }

    // Category
    if (selectedCategory !== "all") {
      const selectedCuisine =
        categoryMap[selectedCategory];

      filtered = filtered.filter((restaurant) => {
        const cuisines =
          restaurant.cuisines
            ?.join(" ")
            .toLowerCase() || "";

        return cuisines.includes(selectedCuisine);
      });
    }

    setFilteredRestaurants(filtered);
  }, [
    searchQuery,
    selectedCategory,
    restaurants,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // =========================================================
  // OPEN RESTAURANT
  // =========================================================
  const openRestaurant = (id) => {
    navigate(`/restaurant-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative min-h-[85vh] overflow-hidden">

        {/* Carousel */}
        <div className="absolute inset-0">
          <CarouselComponent />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-36">

          <div className="max-w-3xl">

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-md">
              <MdRestaurant className="text-orange-400" />

              <span className="text-sm font-semibold">
                Welcome to Cravings
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-black leading-tight md:text-7xl">

              Delicious Food
              <br />

              Delivered{" "}

              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                Fast
              </span>

            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Discover your favourite restaurants,
              order amazing meals and enjoy fast
              delivery with Cravings.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              {!user && (
                <button
                  onClick={() =>
                    navigate("/register/customer")
                  }
                  className="rounded-full bg-orange-500 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600"
                >
                  Get Started
                </button>
              )}

              <button
                onClick={() =>
                  navigate("/order-now")
                }
                className="rounded-full border border-slate-600 bg-slate-900/60 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:border-orange-400 hover:bg-orange-500"
              >
                Order Now
              </button>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          SEARCH + CATEGORY
      ====================================================== */}
      <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md">

          {/* Search */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">

            <IoSearch
              size={24}
              className="shrink-0 text-orange-400"
            />

            <input
              type="text"
              placeholder="Search restaurants, cuisines or dishes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
            />

            {searchQuery && (
              <button
                onClick={() =>
                  setSearchQuery("")
                }
                className="text-sm font-semibold text-slate-400 transition hover:text-orange-400"
              >
                Clear
              </button>
            )}

          </div>

          {/* Categories */}
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      category.id
                    )
                  }
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 font-semibold transition ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Icon size={20} />

                  {category.label}
                </button>
              );
            })}

          </div>
        </div>
      </section>


      {/* =====================================================
          RESTAURANTS
      ====================================================== */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-20">

        <div className="mx-auto max-w-7xl px-6">

          {/* Header */}
          <div className="mb-10">

            <h2 className="text-3xl font-bold text-white md:text-4xl">

              {selectedCategory === "all"
                ? "Featured Restaurants"
                : `${
                    categories.find(
                      (category) =>
                        category.id ===
                        selectedCategory
                    )?.label
                  } Restaurants`}

            </h2>

            <p className="mt-2 text-slate-400">
              {filteredRestaurants.length}{" "}
              restaurant
              {filteredRestaurants.length !== 1
                ? "s"
                : ""}{" "}
              available
            </p>

          </div>


          {/* Loading */}
          {loading ? (

            <div className="flex justify-center py-20">

              <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

            </div>

          ) : filteredRestaurants.length > 0 ? (

            /* Restaurant Grid */
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

              {filteredRestaurants.map(
                (restaurant) => (

                  <div
                    key={restaurant.id}
                    onClick={() =>
                      openRestaurant(
                        restaurant.id
                      )
                    }
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-slate-700 hover:shadow-2xl"
                  >

                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-slate-800">

                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400?text=Restaurant";
                        }}
                      />

                      {/* Rating */}
                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-sm font-bold text-white shadow-lg">

                        <IoStar size={15} />

                        {restaurant.rating > 0
                          ? Number(
                              restaurant.rating
                            ).toFixed(1)
                          : "New"}

                      </div>

                      {/* Open / Closed */}
                      <div
                        className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${
                          restaurant.isOpen
                            ? "bg-green-500 text-white"
                            : "bg-black/70 text-white"
                        }`}
                      >
                        {restaurant.isOpen
                          ? "● Open Now"
                          : "● Closed"}
                      </div>

                    </div>


                    {/* Restaurant Info */}
                    <div className="p-6">

                      <h3 className="truncate text-xl font-bold text-white">
                        {restaurant.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                        {restaurant.description}
                      </p>


                      {/* Location */}
                      {(restaurant.city ||
                        restaurant.address) && (
                        <p className="mt-3 text-xs text-slate-500">
                          📍{" "}
                          {restaurant.city ||
                            restaurant.address}
                        </p>
                      )}


                      {/* Cuisines */}
                      {restaurant.cuisines?.length >
                        0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {restaurant.cuisines
                            .slice(0, 4)
                            .map(
                              (
                                cuisine,
                                index
                              ) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300"
                                >
                                  {cuisine}
                                </span>
                              )
                            )}

                          {restaurant.cuisines
                            .length > 4 && (
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                              +
                              {restaurant.cuisines
                                .length -
                                4}
                            </span>
                          )}

                        </div>
                      )}


                      {/* Serving Hours */}
                      {restaurant.servingHours
                        ?.openingTime && (
                        <p className="mt-4 text-xs text-slate-500">
                          🕐{" "}
                          {
                            restaurant
                              .servingHours
                              .openingTime
                          }{" "}
                          –{" "}
                          {
                            restaurant
                              .servingHours
                              .closingTime
                          }
                        </p>
                      )}


                      {/* Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          openRestaurant(
                            restaurant.id
                          );
                        }}
                        className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
                      >
                        Explore Menu
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          ) : (

            /* No Restaurants */
            <div className="py-20 text-center">

              <MdRestaurant
                size={70}
                className="mx-auto mb-4 text-slate-700"
              />

              <h3 className="text-2xl font-bold text-white">
                No Restaurants Found
              </h3>

              <p className="mt-2 text-slate-400">
                Try changing your search or
                category.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>
      </section>


      {/* =====================================================
          STATISTICS
      ====================================================== */}
      <section className="bg-slate-900 py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Cravings By Numbers
            </h2>

            <p className="mt-3 text-slate-400">
              Trusted by thousands of food lovers
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            {stats.map((item) => (

              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-orange-500/40"
              >

                <h3 className="text-4xl font-black text-orange-400">
                  {item.value}
                </h3>

                <h4 className="mt-4 text-lg font-bold text-white">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm text-slate-400">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          REVIEWS
      ====================================================== */}
      <section className="bg-slate-950 py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <h2 className="text-3xl font-bold text-white md:text-4xl">
              What Customers Say
            </h2>

            <p className="mt-3 text-slate-400">
              Real experiences from food lovers
            </p>

          </div>


          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

            {reviews.map((review) => (

              <div
                key={review.name}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg transition hover:-translate-y-1 hover:border-slate-700"
              >

                {/* Stars */}
                <div className="mb-5 flex gap-1">

                  {[...Array(5)].map(
                    (_, index) => (
                      <IoStar
                        key={index}
                        size={18}
                        className="text-yellow-400"
                      />
                    )
                  )}

                </div>

                <h3 className="mb-2 text-lg font-bold text-white">
                  {review.title}
                </h3>

                <p className="text-slate-300">
                  "{review.text}"
                </p>


                <div className="mt-6 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                    {review.initials}
                  </div>

                  <div>

                    <h4 className="font-semibold text-white">
                      {review.name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      Verified Buyer
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          PARTNER CTA
      ====================================================== */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-3xl font-black text-white md:text-5xl">
            Become A Restaurant Partner
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Grow your food business with Cravings
            and reach more customers.
          </p>

          <button
            onClick={() =>
              navigate("/register")
            }
            className="mt-8 rounded-full bg-white px-8 py-3 font-bold text-orange-600 transition hover:bg-slate-100"
          >
            Partner With Us
          </button>

        </div>
      </section>

    </div>
  );
};

export default Home;