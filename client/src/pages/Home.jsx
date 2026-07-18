// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// import food1 from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";
// import food2 from "../assets/images/front-view-tasty-boiled-rice-with-dried-pepper-garlic.jpg";
// import food3 from "../assets/images/vertical-shot-traditional-indian-paneer-butter-masala-cheese-cottage-curry-black-surface.jpg";
// import food4 from "../assets/images/eaters-collective-12eHC6FxPyg-unsplash.jpg";

// const Home = () => {
//   const heroImages = [food1, food2, food3, food4];

//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % heroImages.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [heroImages.length]);

//   const highlights = [
//     {
//       title: "Lightning-fast delivery",
//       description:
//         "Track your food live and get it at your doorstep in minutes.",
//       iconBg: "bg-amber-100 text-amber-700",
//       icon: "⚡",
//     },
//     {
//       title: "Fresh local favorites",
//       description: "Discover popular restaurants and comfort food near you.",
//       iconBg: "bg-orange-100 text-orange-700",
//       icon: "🍲",
//     },
//     {
//       title: "Easy for partners",
//       description:
//         "Restaurants and riders can grow with Cravings in one place.",
//       iconBg: "bg-rose-100 text-rose-700",
//       icon: "🤝",
//     },
//   ];

//   const stats = [
//     { value: "20K+", label: "orders daily" },
//     { value: "300+", label: "restaurants" },
//     { value: "4.9/5", label: "customer love" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-950 font-sans text-slate-100">

//       {/* Hero Section */}
//       <div className="relative min-h-[90vh] overflow-hidden">

//         <div className="absolute inset-0">
//           {heroImages.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               alt=""
//               className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
//                 index === currentImage ? "opacity-40" : "opacity-0"
//               }`}
//             />
//           ))}

//           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
//         </div>

//         <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32 grid items-center gap-12 lg:grid-cols-12">

//           <div className="lg:col-span-7 space-y-8">

//             <h1 className="text-4xl font-black tracking-tight sm:text-6xl xl:text-7xl leading-tight">
//               Delicious meals
//               <br />
//               delivered{" "}
//               <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
//                 to your door
//               </span>
//               <br />
//               in minutes.
//             </h1>

//             <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
//               From your favorite local spots to indulgent comfort food,
//               Cravings brings the best flavors to your city.
//             </p>

//             <div className="flex gap-4">
//               <Link
//                 to="/register"
//                 className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-white"
//               >
//                 Order Now →
//               </Link>

//               <Link
//                 to="/register"
//                 className="rounded-full border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold"
//               >
//                 Become a Partner
//               </Link>
//             </div>

//           </div>

//         </div>
//       </div>

//       {/* Features Section */}
//       <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
//         <div className="grid gap-6 md:grid-cols-3">

//           {highlights.map((item) => (
//             <div
//               key={item.title}
//               className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
//             >
//               <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
//                 {item.icon}
//               </div>

//               <h3 className="text-xl font-bold text-white">
//                 {item.title}
//               </h3>

//               <p className="mt-3 text-slate-400">
//                 {item.description}
//               </p>
//             </div>
//           ))}

//         </div>
//       </section>

//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import api from "../config/ApiConfig";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

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
      label: "Non Veg",
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

  const updateSearch = (value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }

      return prev;
    });
  };

  const updateCategory = (value) => {
    setSearchParams((prev) => {
      if (value !== "all") {
        prev.set("category", value);
      } else {
        prev.delete("category");
      }

      return prev;
    });
  };

  // Fetch Restaurants

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const response = await api.get("/public/restaurants");

        const data = response.data?.data || [];

        const formattedData = data.map((restaurant) => ({
          id: restaurant._id,

          name: restaurant.restaurantName || "Unknown Restaurant",

          description:
            restaurant.description ||
            `${restaurant.cuisineType || "Food"} restaurant`,

          rating: restaurant.rating || 4.5,

          image:
            restaurant.images?.[0]?.URL ||
            "https://placehold.co/600x400?text=Restaurant",

          cuisines: Array.isArray(restaurant.cuisineType)
            ? restaurant.cuisineType
            : restaurant.cuisineType
              ? restaurant.cuisineType.split(",").map((item) => item.trim())
              : [],

          city: restaurant.city || "",

          address: restaurant.address || "",
        }));

        setRestaurants(formattedData);
        setFilteredRestaurants(formattedData);
      } catch (error) {
        console.log("Restaurant Fetch Error:", error);

        setRestaurants([]);
        setFilteredRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Search + Category Filter

  useEffect(() => {
    let result = [...restaurants];

    if (searchQuery) {
      result = result.filter((restaurant) => {
        const cuisineText = restaurant.cuisines.join(" ").toLowerCase();

        return (
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cuisineText.includes(searchQuery.toLowerCase()) ||
          restaurant.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (selectedCategory !== "all") {
      const categoryMap = {
        veg: "veg",

        nonveg: "non",

        dessert: "dessert",

        others: "other",
      };

      result = result.filter((restaurant) => {
        const cuisine = restaurant.cuisines.join(" ").toLowerCase();

        return cuisine.includes(categoryMap[selectedCategory]);
      });
    }

    setFilteredRestaurants(result);
  }, [searchQuery, selectedCategory, restaurants]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HERO SECTION */}

      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <CarouselComponent />

          <div
            className="
            absolute inset-0
            bg-gradient-to-r
            from-slate-950
            via-slate-950/80
            to-transparent
          "
          />

          <div
            className="
            absolute inset-0
            bg-gradient-to-t
            from-slate-950
            via-transparent
            to-transparent
          "
          />
        </div>

        <div
          className="
          relative z-10
          max-w-7xl
          mx-auto
          px-6
          py-24
          lg:py-36
        "
        >
          <div className="max-w-3xl">
            <h1
              className="
              text-5xl
              md:text-7xl
              font-black
              leading-tight
            "
            >
              Delicious Food
              <br />
              Delivered
              <span
                className="
                bg-gradient-to-r
                from-orange-400
                via-yellow-400
                to-red-400
                bg-clip-text
                text-transparent
              "
              >
                Fast
              </span>
            </h1>

            <p
              className="
              mt-6
              text-lg
              text-slate-300
              max-w-xl
            "
            >
              Discover your favourite restaurants, order amazing meals and enjoy
              fast delivery with Cravings.
            </p>

            {!user && (
              <div
                className="
                flex
                gap-4
                mt-8
              "
              >
                <button
                  onClick={() => navigate("/register/customer")}
                  className="
                    px-8
                    py-3
                    rounded-full
                    bg-orange-500
                    font-bold
                    hover:bg-orange-600
                    transition
                  "
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate("/order-now")}
                  className="
                    px-8
                    py-3
                    rounded-full
                    border
                    border-slate-600
                    bg-slate-900/50
                    font-semibold
                  "
                >
                  Order Now
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Search + Category Section */}
      <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          {/* Search */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
            <IoSearch className="text-orange-400" size={24} />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="
                w-full
                bg-transparent
                outline-none
                text-white
                placeholder:text-slate-400
              "
            />
          </div>

          {/* Categories */}
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => updateCategory(category.id)}
                  className={`
                    flex items-center gap-2
                    whitespace-nowrap
                    rounded-full
                    px-5 py-3
                    font-semibold
                    transition

                    ${
                      selectedCategory === category.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }
                  `}
                >
                  <Icon size={20} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="mb-10">
            <h2
              className="
              text-3xl
              md:text-4xl
              font-bold
              text-white
            "
            >
              {selectedCategory === "all"
                ? "Featured Restaurants"
                : `${
                    categories.find((item) => item.id === selectedCategory)
                      ?.label
                  } Restaurants`}
            </h2>

            <p className="mt-2 text-slate-400">
              {filteredRestaurants.length} restaurants available
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div
                className="
                h-12
                w-12
                animate-spin
                rounded-full
                border-4
                border-orange-500
                border-t-transparent
              "
              />
            </div>
          ) : filteredRestaurants.length > 0 ? (
            /* Restaurant Cards */

            <div
              className="
              grid
              grid-cols-1
              gap-8
              md:grid-cols-2
              lg:grid-cols-3
            "
            >
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant-menu/${restaurant.id}`)}
                  className="
                    group
                    cursor-pointer
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    transition
                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >
                  {/* Image */}

                  <div
                    className="
                    relative
                    h-52
                    overflow-hidden
                  "
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-110
                      "
                    />

                    <div
                      className="
                      absolute
                      right-4
                      top-4
                      flex
                      items-center
                      gap-1
                      rounded-full
                      bg-orange-500
                      px-3
                      py-1
                      text-sm
                      font-bold
                    "
                    >
                      <IoStar size={16} />

                      {restaurant.rating}
                    </div>
                  </div>

                  {/* Details */}

                  <div className="p-6">
                    <h3
                      className="
                      text-xl
                      font-bold
                      text-white
                    "
                    >
                      {restaurant.name}
                    </h3>

                    <p
                      className="
                      mt-2
                      line-clamp-2
                      text-sm
                      text-slate-400
                    "
                    >
                      {restaurant.description}
                    </p>

                    {/* Cuisine Tags */}

                    <div
                      className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                    >
                      {restaurant.cuisines.map((cuisine, index) => (
                        <span
                          key={index}
                          className="
                              rounded-full
                              bg-slate-800
                              px-3
                              py-1
                              text-xs
                              text-slate-300
                            "
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>

                    {/* Button */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        navigate(`/restaurant-menu/${restaurant.id}`);
                      }}
                      className="
                        mt-6
                        w-full
                        rounded-xl
                        bg-orange-500
                        py-3
                        font-bold
                        text-white
                        transition
                        hover:bg-orange-600
                      "
                    >
                      Explore Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
              py-20
              text-center
            "
            >
              <h3
                className="
                text-2xl
                font-bold
                text-white
              "
              >
                No Restaurants Found
              </h3>

              <button
                onClick={() => {
                  updateSearch("");

                  updateCategory("all");
                }}
                className="
                  mt-5
                  rounded-xl
                  bg-orange-500
                  px-6
                  py-3
                  font-bold
                "
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Statistics Section */}

      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2
              className="
              text-3xl
              md:text-4xl
              font-bold
              text-white
            "
            >
              Cravings By Numbers
            </h2>

            <p
              className="
              mt-3
              text-slate-400
            "
            >
              Trusted by thousands of food lovers
            </p>
          </div>

          <div
            className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:grid-cols-4
          "
          >
            {[
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
            ].map((item) => (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950
                  p-8
                  text-center
                  transition
                  hover:-translate-y-2
                "
              >
                <h3
                  className="
                  text-4xl
                  font-black
                  text-orange-400
                "
                >
                  {item.value}
                </h3>

                <h4
                  className="
                  mt-4
                  text-lg
                  font-bold
                  text-white
                "
                >
                  {item.title}
                </h4>

                <p
                  className="
                  mt-2
                  text-sm
                  text-slate-400
                "
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}

      <section className="bg-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div
            className="
            mb-12
            text-center
          "
          >
            <h2
              className="
              text-3xl
              md:text-4xl
              font-bold
              text-white
            "
            >
              What Customers Say
            </h2>

            <p
              className="
              mt-3
              text-slate-400
            "
            >
              Real experiences from food lovers
            </p>
          </div>

          <div
            className="
            grid
            grid-cols-1
            gap-8
            md:grid-cols-3
          "
          >
            {[
              {
                name: "Arun J.",
                text: "Food arrived hot and fresh. Amazing delivery experience!",
                initials: "AJ",
              },
              {
                name: "Sneha P.",
                text: "Easy ordering process with amazing restaurant choices.",
                initials: "SP",
              },
              {
                name: "Raj Kumar",
                text: "Cravings made food ordering simple and enjoyable.",
                initials: "RK",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-8
                "
              >
                <div
                  className="
                  mb-4
                  flex
                  gap-1
                "
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IoStar key={star} className="text-yellow-400" />
                  ))}
                </div>

                <p
                  className="
                  text-slate-300
                "
                >
                  "{review.text}"
                </p>

                <div
                  className="
                  mt-6
                  flex
                  items-center
                  gap-3
                "
                >
                  <div
                    className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-orange-500
                    font-bold
                  "
                  >
                    {review.initials}
                  </div>

                  <h4
                    className="
                    font-semibold
                    text-white
                  "
                  >
                    {review.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}

      <section
        className="
        bg-gradient-to-r
        from-orange-500
        to-red-500
        py-16
      "
      >
        <div
          className="
          mx-auto
          max-w-5xl
          px-6
          text-center
        "
        >
          <h2
            className="
            text-3xl
            md:text-5xl
            font-black
            text-white
          "
          >
            Become A Restaurant Partner
          </h2>

          <p
            className="
            mx-auto
            mt-4
            max-w-2xl
            text-white/90
          "
          >
            Grow your food business with Cravings and reach more customers.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="
              mt-8
              rounded-full
              bg-white
              px-8
              py-3
              font-bold
              text-orange-600
              transition
              hover:bg-slate-100
            "
          >
            Partner With Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
