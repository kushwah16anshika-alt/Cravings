// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { IoSearch, IoStar } from "react-icons/io5";
// import { MdRestaurant, MdLocalDining, MdFastfood, MdCake, MdLunchDining } from "react-icons/md";
// import CarouselComponent from "../components/CarouselComponent";
// import { useAuth } from "../context/AuthContext";
// import api from "../config/api.config";

// const categories = [
//   { id: "all", label: "All", icon: MdRestaurant },
//   { id: "veg", label: "Vegetarian", icon: MdLocalDining },
//   { id: "nonveg", label: "Non Veg", icon: MdFastfood },
//   { id: "dessert", label: "Desserts", icon: MdCake },
//   { id: "others", label: "Others", icon: MdLunchDining },
// ];

// const categoryMap = {
//   veg: "veg",
//   nonveg: "non",
//   dessert: "dessert",
//   others: "other",
// };

// const stats = [
//   { value: "2.5M+", title: "Successful Deliveries", desc: "Food delivered with care" },
//   { value: "500K+", title: "Happy Customers", desc: "People enjoying Cravings" },
//   { value: "5K+", title: "Partner Restaurants", desc: "Restaurants growing with us" },
//   { value: "1K+", title: "Delivery Partners", desc: "Fast and safe delivery" },
// ];

// const reviews = [
//   { name: "Arun J.", text: "Food arrived hot and fresh. Amazing delivery experience!", initials: "AJ" },
//   { name: "Sneha P.", text: "Easy ordering process with amazing restaurant choices.", initials: "SP" },
//   { name: "Raj Kumar", text: "Cravings made food ordering simple and enjoyable.", initials: "RK" },
// ];

// export default function Home() {

//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [searchParams, setSearchParams] = useSearchParams();

//   const searchQuery = searchParams.get("search") || "";
//   const selectedCategory = searchParams.get("category") || "all";

//   const [restaurants, setRestaurants] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const updateSearch = value => {
//     setSearchParams(prev => {
//       value ? prev.set("search", value) : prev.delete("search");
//       return prev;
//     });
//   };

//   const updateCategory = value => {
//     setSearchParams(prev => {
//       value !== "all" ? prev.set("category", value) : prev.delete("category");
//       return prev;
//     });
//   };

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/api/public/restaurants");
//         const data = res.data?.data || [];

//         const formatted = data.map(r => ({
//           id: r._id,
//           name: r.restaurantName || "Unknown Restaurant",
//           description: r.description || `${r.cuisineType || "Food"} restaurant`,
//           rating: r.rating || 4.5,
//           image: r.images?.[0]?.URL || "https://placehold.co/600x400?text=Restaurant",
//           cuisines: Array.isArray(r.cuisineType) ? r.cuisineType : r.cuisineType ? r.cuisineType.split(",").map(i => i.trim()) : [],
//           city: r.city || "",
//           address: r.address || "",
//         }));

//         setRestaurants(formatted);
//         setFilteredRestaurants(formatted);
//       }
//       catch (err) {
//         console.log(err);
//         setRestaurants([]);
//         setFilteredRestaurants([]);
//       }
//       finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   useEffect(() => {
//     let result = [...restaurants];

//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();

//       result = result.filter(r =>
//         r.name.toLowerCase().includes(q) ||
//         r.city.toLowerCase().includes(q) ||
//         r.cuisines.join(" ").toLowerCase().includes(q)
//       );
//     }

//     if (selectedCategory !== "all") {
//       result = result.filter(r =>
//         r.cuisines.join(" ").toLowerCase().includes(categoryMap[selectedCategory])
//       );
//     }

//     setFilteredRestaurants(result);

//   }, [restaurants, searchQuery, selectedCategory]);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">

//       <section className="relative min-h-[85vh] overflow-hidden">

//         <div className="absolute inset-0">
//           <CarouselComponent />
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
//         </div>

//         <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-36">

//           <div className="max-w-3xl">

//             <h1 className="text-5xl md:text-7xl font-black leading-tight">
//               Delicious Food
//               <br />
//               Delivered
//               <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
//                 Fast
//               </span>
//             </h1>

//             <p className="mt-6 max-w-xl text-lg text-slate-300">
//               Discover your favourite restaurants, order amazing meals and enjoy fast delivery with Cravings.
//             </p>

//             {!user && (
//               <div className="mt-8 flex gap-4">

//                 <button
//                   onClick={() => navigate("/register/customer")}
//                   className="rounded-full bg-orange-500 px-8 py-3 font-bold hover:bg-orange-600 transition">
//                   Get Started
//                 </button>

//                 <button
//                   onClick={() => navigate("/order-now")}
//                   className="rounded-full border border-slate-600 bg-slate-900/50 px-8 py-3 font-semibold text-white transition-all duration-300 hover:border-orange-400 hover:bg-orange-500">
//                   Order Now
//                 </button>

//               </div>
//             )}

//           </div>

//         </div>

//       </section>

//       <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-6">

//         <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">

//           <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
//             <IoSearch size={24} className="text-orange-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={e => updateSearch(e.target.value)}
//               placeholder="Search restaurants or dishes..."
//               className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
//             />
//           </div>

//           <div className="mt-5 flex gap-3 overflow-x-auto pb-2">

//             {categories.map(c => {
//               const Icon = c.icon;
//               return (
//                 <button
//                   key={c.id}
//                   onClick={() => updateCategory(c.id)}
//                   className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 font-semibold transition ${selectedCategory === c.id
//                       ? "bg-orange-500 text-white"
//                       : "bg-slate-800 text-slate-300 hover:bg-slate-700"
//                     }`}
//                 >
//                   <Icon size={20} />
//                   {c.label}
//                 </button>
//               );
//             })}

//           </div>

//         </div>

//       </section>
//       <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-20">

//         <div className="mx-auto max-w-7xl px-6">

//           <div className="mb-10">
//             <h2 className="text-3xl md:text-4xl font-bold text-white">
//               {selectedCategory === "all"
//                 ? "Featured Restaurants"
//                 : `${categories.find(c => c.id === selectedCategory)?.label} Restaurants`}
//             </h2>

//             <p className="mt-2 text-slate-400">
//               {filteredRestaurants.length} restaurants available
//             </p>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-20">
//               <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
//             </div>
//           ) : filteredRestaurants.length ? (
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

//               {filteredRestaurants.map(r => (
//                 <div
//                   key={r.id}
//                   onClick={() => navigate(`/restaurant-menu/${r.id}`)}
//                   className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-2 hover:shadow-2xl"
//                 >

//                   <div className="relative h-52 overflow-hidden">

//                     <img
//                       src={r.image}
//                       alt={r.name}
//                       className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
//                     />

//                     <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-sm font-bold">
//                       <IoStar size={15} />
//                       {r.rating}
//                     </div>

//                   </div>

//                   <div className="p-6">

//                     <h3 className="text-xl font-bold text-white">
//                       {r.name}
//                     </h3>

//                     <p className="mt-2 line-clamp-2 text-sm text-slate-400">
//                       {r.description}
//                     </p>

//                     <div className="mt-4 flex flex-wrap gap-2">

//                       {r.cuisines.map((c, i) => (
//                         <span
//                           key={i}
//                           className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
//                         >
//                           {c}
//                         </span>
//                       ))}

//                     </div>

//                     <button
//                       onClick={e => {
//                         e.stopPropagation();
//                         navigate(`/restaurant-menu/${r.id}`);
//                       }}
//                       className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
//                     >
//                       Explore Menu
//                     </button>

//                   </div>

//                 </div>
//               ))}

//             </div>
//           ) : (

//             <div className="py-20 text-center">

//               <h3 className="text-2xl font-bold text-white">
//                 No Restaurants Found
//               </h3>

//               <p className="mt-2 text-slate-400">
//                 Try changing your search or category.
//               </p>

//               <button
//                 onClick={() => {
//                   updateSearch("");
//                   updateCategory("all");
//                 }}
//                 className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold hover:bg-orange-600"
//               >
//                 Clear Filters
//               </button>

//             </div>

//           )}

//         </div>

//       </section>
//       {/* Statistics */}
//       <section className="bg-slate-900 py-16">
//         <div className="mx-auto max-w-7xl px-6">

//           <div className="mb-12 text-center">
//             <h2 className="text-3xl md:text-4xl font-bold text-white">
//               Cravings By Numbers
//             </h2>
//             <p className="mt-3 text-slate-400">
//               Trusted by thousands of food lovers
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//             {stats.map(item => (
//               <div
//                 key={item.title}
//                 className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center transition hover:-translate-y-2"
//               >
//                 <h3 className="text-4xl font-black text-orange-400">
//                   {item.value}
//                 </h3>

//                 <h4 className="mt-4 text-lg font-bold text-white">
//                   {item.title}
//                 </h4>

//                 <p className="mt-2 text-sm text-slate-400">
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>

//         </div>
//       </section>

//       {/* Reviews */}
//       <section className="bg-slate-950 py-16">

//         <div className="mx-auto max-w-7xl px-6">

//           <div className="mb-12 text-center">
//             <h2 className="text-3xl md:text-4xl font-bold text-white">
//               What Customers Say
//             </h2>

//             <p className="mt-3 text-slate-400">
//               Real experiences from food lovers
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

//             {reviews.map(r => (
//               <div
//                 key={r.name}
//                 className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
//               >

//                 <div className="mb-4 flex gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <IoStar
//                       key={i}
//                       className="text-yellow-400"
//                     />
//                   ))}
//                 </div>

//                 <p className="text-slate-300">
//                   "{r.text}"
//                 </p>

//                 <div className="mt-6 flex items-center gap-3">

//                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 font-bold">
//                     {r.initials}
//                   </div>

//                   <h4 className="font-semibold text-white">
//                     {r.name}
//                   </h4>

//                 </div>

//               </div>
//             ))}

//           </div>

//         </div>

//       </section>

//       {/* Partner CTA */}
//       <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16">

//         <div className="mx-auto max-w-5xl px-6 text-center">

//           <h2 className="text-3xl md:text-5xl font-black text-white">
//             Become A Restaurant Partner
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl text-white/90">
//             Grow your food business with Cravings and reach more customers.
//           </p>

//           <button
//             onClick={() => navigate("/register")}
//             className="mt-8 rounded-full bg-white px-8 py-3 font-bold text-orange-600 transition hover:bg-slate-100"
//           >
//             Partner With Us
//           </button>

//         </div>

//       </section>

//     </div>
//   );
// }


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

          // Handle image from new schema and old schema
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

            numReviews:
              restaurant.numReviews || 0,

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

        return cuisines.includes(
          selectedCuisine
        );
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

  return (
    <div className="min-h-screen">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative text-(--color-primary-content) py-16 md:py-40 overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <CarouselComponent />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10"></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">

            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-5">
              <MdRestaurant className="text-(--color-warning)" />

              <span className="text-sm font-semibold">
                Welcome to Cravings
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Your Favorite Food,
              <br />

              <span className="text-(--color-warning)">
                Delivered Fast
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Order delicious meals from your favorite
              restaurants and get them delivered
              straight to your doorstep.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">

              {!user && (
                <button
                  onClick={() =>
                    navigate("/register/customer")
                  }
                  className="bg-(--color-primary) text-(--color-primary-content) px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                >
                  Sign Up
                </button>
              )}

              <button
                onClick={() =>
                  navigate("/order-now")
                }
                className="bg-(--color-base-100) text-(--color-base-content) px-8 py-3 rounded-lg font-semibold hover:bg-(--color-base-200) transition shadow-lg"
              >
                Order Now
              </button>
            </div>
          </div>

          {/* =================================================
              SEARCH BAR
          ================================================== */}
          <div className="flex items-center bg-(--color-base-100) rounded-xl px-4 py-3 max-w-4xl mx-auto shadow-xl">
            <IoSearch
              className="text-(--color-base-content) text-xl mr-3 shrink-0"
            />

            <input
              type="text"
              placeholder="Search restaurants, cuisines or dishes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="bg-transparent w-full outline-none text-(--color-base-content) placeholder:text-(--color-secondary)"
            />

            {searchQuery && (
              <button
                onClick={() =>
                  setSearchQuery("")
                }
                className="text-(--color-secondary) hover:text-(--color-primary) text-sm font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY SECTION
      ====================================================== */}
      <section className="bg-(--color-base-100) border-b border-(--color-base-300)">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="flex gap-3 overflow-x-auto pb-1">
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
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-semibold transition ${
                    selectedCategory === category.id
                      ? "bg-(--color-primary) text-(--color-primary-content) shadow-md"
                      : "bg-(--color-base-200) text-(--color-base-content) hover:bg-(--color-base-300)"
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
          RESTAURANTS SECTION
      ====================================================== */}
      <section className="py-8 md:py-12 bg-linear-to-b from-(--color-primary) to-(--color-primary-content)">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-(--color-primary-content) mb-2">
              {selectedCategory === "all"
                ? "Featured Restaurants"
                : `${
                    categories.find(
                      (category) =>
                        category.id ===
                        selectedCategory
                    )?.label
                  } Options`}
            </h2>

            <p className="text-(--color-primary-content)/70">
              {filteredRestaurants.length} restaurant
              {filteredRestaurants.length !== 1
                ? "s"
                : ""}{" "}
              available
            </p>
          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading ? (
            <div className="text-center py-16">

              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-(--color-primary) border-t-transparent"></div>

              <p className="mt-4 text-(--color-primary-content)">
                Loading restaurants...
              </p>
            </div>

          ) : filteredRestaurants.length > 0 ? (

            /* =================================================
               RESTAURANT GRID
            ================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredRestaurants.map(
                (restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() =>
                      navigate(
                        `/restaurant-menu/${restaurant.id}`
                      )
                    }
                    className="flex flex-col bg-(--color-base-100) rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >

                    {/* Restaurant Image */}
                    <div className="relative h-48 overflow-hidden bg-(--color-base-200)">

                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400?text=Restaurant";
                        }}
                      />

                      {/* Rating */}
                      <div className="absolute top-3 right-3 bg-(--color-primary) text-(--color-primary-content) px-3 py-1 rounded-full flex items-center gap-1 font-semibold text-sm shadow">

                        <IoStar size={16} />

                        {restaurant.rating > 0
                          ? Number(
                              restaurant.rating
                            ).toFixed(1)
                          : "New"}
                      </div>

                      {/* Open / Closed */}
                      <div
                        className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
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

                    {/* =================================================
                        RESTAURANT INFO
                    ================================================== */}
                    <div className="flex flex-col flex-1 p-4">

                      {/* Name */}
                      <h3 className="font-bold text-(--color-content) text-lg mb-1 truncate">
                        {restaurant.name}
                      </h3>

                      {/* Description */}
                      <p className="text-(--color-base-content) text-sm mb-3 line-clamp-2">
                        {restaurant.description}
                      </p>

                      {/* =================================================
                          LOCATION
                      ================================================== */}
                      {(restaurant.city ||
                        restaurant.address) && (
                        <p className="text-xs text-(--color-secondary) mb-3">
                          📍{" "}
                          {restaurant.city ||
                            restaurant.address}
                        </p>
                      )}

                      {/* =================================================
                          CUISINES
                      ================================================== */}
                      {restaurant.cuisines
                        ?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">

                          {restaurant.cuisines
                            .slice(0, 4)
                            .map(
                              (
                                cuisine,
                                index
                              ) => (
                                <span
                                  key={index}
                                  className="text-xs bg-(--color-base-300) text-(--color-base-content) px-2 py-1 rounded capitalize"
                                >
                                  {cuisine}
                                </span>
                              )
                            )}

                          {restaurant.cuisines
                            .length > 4 && (
                            <span className="text-xs bg-(--color-base-300) text-(--color-base-content) px-2 py-1 rounded">
                              +
                              {restaurant
                                .cuisines
                                .length -
                                4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* =================================================
                          SERVING HOURS
                      ================================================== */}
                      {restaurant
                        .servingHours
                        ?.openingTime && (
                        <p className="text-xs text-(--color-secondary) mb-3">
                          🕐{" "}
                          {
                            restaurant
                              .servingHours
                              .openingTime
                          }
                          {" – "}
                          {
                            restaurant
                              .servingHours
                              .closingTime
                          }
                        </p>
                      )}

                      {/* =================================================
                          EXPLORE MENU
                      ================================================== */}
                      <div className="mt-auto pt-3 border-t border-(--color-base-200)">

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(
                              `/restaurant-menu/${restaurant.id}`
                            );
                          }}
                          className="w-full bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                        >
                          Explore Menu
                        </button>

                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

          ) : (

            /* =================================================
               NO RESTAURANTS
            ================================================== */
            <div className="text-center py-16">

              <MdRestaurant
                size={70}
                className="mx-auto text-(--color-primary-content)/50 mb-4"
              />

              <p className="text-(--color-primary-content) text-lg font-semibold">
                No restaurants found matching
                your criteria.
              </p>

              <p className="text-(--color-primary-content)/70 mt-2">
                Try changing your search or
                category.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 bg-(--color-primary) text-(--color-primary-content) px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          STATISTICS SECTION
      ====================================================== */}
      <section className="bg-(--color-base-100) py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-(--color-content) mb-4">
              Cravings by the Numbers
            </h2>

            <p className="text-lg text-(--color-base-content)">
              See why millions trust us for their
              daily food delivery needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Deliveries */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">

              <div className="text-4xl md:text-5xl font-bold text-(--color-primary) mb-2">
                2.5M+
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Successful Deliveries
              </h3>

              <p className="text-(--color-base-content)">
                Orders delivered with care and
                precision
              </p>
            </div>

            {/* Customers */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">

              <div className="text-4xl md:text-5xl font-bold text-(--color-accent) mb-2">
                500K+
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Happy Customers
              </h3>

              <p className="text-(--color-base-content)">
                Satisfied users enjoying
                delicious food
              </p>
            </div>

            {/* Restaurants */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">

              <div className="text-4xl md:text-5xl font-bold text-(--color-primary) mb-2">
                5K+
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Partner Restaurants
              </h3>

              <p className="text-(--color-base-content)">
                Restaurants serving amazing
                cuisine
              </p>
            </div>

            {/* Delivery Partners */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center">

              <div className="text-4xl md:text-5xl font-bold text-(--color-accent) mb-2">
                1K+
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Active Delivery Partners
              </h3>

              <p className="text-(--color-base-content)">
                Riders ensuring quick and safe
                delivery
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CUSTOMER REVIEWS
      ====================================================== */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-(--color-content) mb-4">
              What Our Customers Say
            </h2>

            <p className="text-lg text-(--color-base-content)">
              Real feedback from real food lovers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Review 1 */}
            <div className="bg-(--color-base-100) rounded-lg p-8 shadow-md hover:shadow-lg transition">

              <div className="flex items-center gap-2 mb-4">

                {[...Array(5)].map(
                  (_, index) => (
                    <IoStar
                      key={index}
                      size={20}
                      className="text-yellow-400"
                    />
                  )
                )}
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Amazing Service!
              </h3>

              <p className="text-(--color-base-content) mb-4">
                "The food arrived hot and fresh.
                The delivery was incredibly fast.
                Highly impressed with Cravings'
                service!"
              </p>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-(--color-primary) flex items-center justify-center text-white font-bold">
                  AJ
                </div>

                <div>
                  <p className="font-semibold text-(--color-content)">
                    Arun J.
                  </p>

                  <p className="text-sm text-(--color-base-content)">
                    Verified Buyer
                  </p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-(--color-base-100) rounded-lg p-8 shadow-md hover:shadow-lg transition">

              <div className="flex items-center gap-2 mb-4">

                {[...Array(5)].map(
                  (_, index) => (
                    <IoStar
                      key={index}
                      size={20}
                      className="text-yellow-400"
                    />
                  )
                )}
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Best App Ever!
              </h3>

              <p className="text-(--color-base-content) mb-4">
                "Easy to use interface, wide
                variety of restaurants, and quick
                delivery. I order from Cravings
                every week!"
              </p>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-(--color-accent) flex items-center justify-center text-white font-bold">
                  SP
                </div>

                <div>
                  <p className="font-semibold text-(--color-content)">
                    Sneha P.
                  </p>

                  <p className="text-sm text-(--color-base-content)">
                    Verified Buyer
                  </p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-(--color-base-100) rounded-lg p-8 shadow-md hover:shadow-lg transition">

              <div className="flex items-center gap-2 mb-4">

                {[...Array(5)].map(
                  (_, index) => (
                    <IoStar
                      key={index}
                      size={20}
                      className="text-yellow-400"
                    />
                  )
                )}
              </div>

              <h3 className="text-lg font-semibold text-(--color-content) mb-2">
                Excellent Choices
              </h3>

              <p className="text-(--color-base-content) mb-4">
                "Love the variety of restaurants
                available. Found my new favorite
                spot through Cravings. Definitely
                worth it!"
              </p>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-(--color-primary) flex items-center justify-center text-white font-bold">
                  RK
                </div>

                <div>
                  <p className="font-semibold text-(--color-content)">
                    Raj Kumar
                  </p>

                  <p className="text-sm text-(--color-base-content)">
                    Verified Buyer
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PARTNER CTA
      ====================================================== */}
      <section className="bg-(--color-primary) text-(--color-primary-content) py-12 md:py-16">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become a Restaurant Partner
          </h2>

          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Grow your business with Cravings.
            Join thousands of restaurants already
            delivering with us.
          </p>

          <button
            onClick={() =>
              navigate("/register")
            }
            className="bg-(--color-base-100) text-(--color-primary) px-8 py-3 rounded-lg font-semibold hover:bg-(--color-base-200) transition"
          >
            Partner With Us
          </button>

        </div>
      </section>
    </div>
  );
};

export default Home;