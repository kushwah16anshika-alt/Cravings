// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { IoSearch, IoStar } from "react-icons/io5";
// import {
//   MdRestaurant,
//   MdLocalDining,
//   MdFastfood,
//   MdCake,
//   MdLunchDining,
// } from "react-icons/md";

// import CarouselComponent from "../components/CarouselComponent";
// import { useAuth } from "../context/AuthContext";
// import api from "../config/api.config.js";

// const Home = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [searchParams, setSearchParams] = useSearchParams();

//   const searchQuery = searchParams.get("search") || "";
//   const selectedCategory = searchParams.get("category") || "all";

//   const [restaurants, setRestaurants] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const categories = [
//     {
//       id: "all",
//       label: "All",
//       icon: MdRestaurant,
//     },
//     {
//       id: "veg",
//       label: "Vegetarian",
//       icon: MdLocalDining,
//     },
//     {
//       id: "nonveg",
//       label: "Non Veg",
//       icon: MdFastfood,
//     },
//     {
//       id: "dessert",
//       label: "Desserts",
//       icon: MdCake,
//     },
//     {
//       id: "others",
//       label: "Others",
//       icon: MdLunchDining,
//     },
//   ];

//   const updateSearch = (value) => {
//     setSearchParams((prev) => {
//       if (value) {
//         prev.set("search", value);
//       } else {
//         prev.delete("search");
//       }

//       return prev;
//     });
//   };

//   const updateCategory = (value) => {
//     setSearchParams((prev) => {
//       if (value !== "all") {
//         prev.set("category", value);
//       } else {
//         prev.delete("category");
//       }

//       return prev;
//     });
//   };

//   // Fetch Restaurants

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         setLoading(true);

//         const response = await api.get("/api/public/restaurants");

//         const data = response.data?.data || [];

//         const formattedData = data.map((restaurant) => ({
//           id: restaurant._id,

//           name: restaurant.restaurantName || "Unknown Restaurant",

//           description:
//             restaurant.description ||
//             `${restaurant.cuisineType || "Food"} restaurant`,

//           rating: restaurant.rating || 4.5,

//           image:
//             restaurant.images?.[0]?.URL ||
//             "https://placehold.co/600x400?text=Restaurant",

//           cuisines: Array.isArray(restaurant.cuisineType)
//             ? restaurant.cuisineType
//             : restaurant.cuisineType
//               ? restaurant.cuisineType.split(",").map((item) => item.trim())
//               : [],

//           city: restaurant.city || "",

//           address: restaurant.address || "",
//         }));

//         setRestaurants(formattedData);
//         setFilteredRestaurants(formattedData);
//       } catch (error) {
//         console.log("Restaurant Fetch Error:", error);

//         setRestaurants([]);
//         setFilteredRestaurants([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   // Search + Category Filter

//   useEffect(() => {
//     let result = [...restaurants];

//     if (searchQuery) {
//       result = result.filter((restaurant) => {
//         const cuisineText = restaurant.cuisines.join(" ").toLowerCase();

//         return (
//           restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           cuisineText.includes(searchQuery.toLowerCase()) ||
//           restaurant.city.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       });
//     }

//     if (selectedCategory !== "all") {
//       const categoryMap = {
//         veg: "veg",

//         nonveg: "non",

//         dessert: "dessert",

//         others: "other",
//       };

//       result = result.filter((restaurant) => {
//         const cuisine = restaurant.cuisines.join(" ").toLowerCase();

//         return cuisine.includes(categoryMap[selectedCategory]);
//       });
//     }

//     setFilteredRestaurants(result);
//   }, [searchQuery, selectedCategory, restaurants]);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* HERO SECTION */}

//       <section className="relative min-h-[85vh] overflow-hidden">
//         <div className="absolute inset-0">
//           <CarouselComponent />

//           <div
//             className="
//             absolute inset-0
//             bg-gradient-to-r
//             from-slate-950
//             via-slate-950/80
//             to-transparent
//           "
//           />

//           <div
//             className="
//             absolute inset-0
//             bg-gradient-to-t
//             from-slate-950
//             via-transparent
//             to-transparent
//           "
//           />
//         </div>

//         <div
//           className="
//           relative z-10
//           max-w-7xl
//           mx-auto
//           px-6
//           py-24
//           lg:py-36
//         "
//         >
//           <div className="max-w-3xl">
//             <h1
//               className="
//               text-5xl
//               md:text-7xl
//               font-black
//               leading-tight
//             "
//             >
//               Delicious Food
//               <br />
//               Delivered
//               <span
//                 className="
//                 bg-gradient-to-r
//                 from-orange-400
//                 via-yellow-400
//                 to-red-400
//                 bg-clip-text
//                 text-transparent
//               "
//               >
//                 Fast
//               </span>
//             </h1>

//             <p
//               className="
//               mt-6
//               text-lg
//               text-slate-300
//               max-w-xl
//             "
//             >
//               Discover your favourite restaurants, order amazing meals and enjoy
//               fast delivery with Cravings.
//             </p>

//             {!user && (
//               <div
//                 className="
//                 flex
//                 gap-4
//                 mt-8
//               "
//               >
//                 <button
//                   onClick={() => navigate("/register/customer")}
//                   className="
//                     px-8
//                     py-3
//                     rounded-full
//                     bg-orange-500
//                     font-bold
//                     hover:bg-orange-600
//                     transition
//                   "
//                 >
//                   Get Started
//                 </button>

//                 <button
//                   onClick={() => navigate("/order-now")}
//                   className="
//                     px-8
//                     py-3
//                     rounded-full
//                     border
//                     border-slate-600
//                     bg-slate-900/50
//                     font-semibold
//                   "
//                 >
//                   Order Now
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Search + Category Section */}
//       <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-6">
//         <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
//           {/* Search */}
//           <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
//             <IoSearch className="text-orange-400" size={24} />

//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => updateSearch(e.target.value)}
//               placeholder="Search restaurants or dishes..."
//               className="
//                 w-full
//                 bg-transparent
//                 outline-none
//                 text-white
//                 placeholder:text-slate-400
//               "
//             />
//           </div>

//           {/* Categories */}
//           <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
//             {categories.map((category) => {
//               const Icon = category.icon;

//               return (
//                 <button
//                   key={category.id}
//                   onClick={() => updateCategory(category.id)}
//                   className={`
//                     flex items-center gap-2
//                     whitespace-nowrap
//                     rounded-full
//                     px-5 py-3
//                     font-semibold
//                     transition

//                     ${selectedCategory === category.id
//                       ? "bg-orange-500 text-white"
//                       : "bg-slate-800 text-slate-300 hover:bg-slate-700"
//                     }
//                   `}
//                 >
//                   <Icon size={20} />
//                   {category.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Restaurant Section */}
//       <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-20">
//         <div className="mx-auto max-w-7xl px-6">
//           {/* Heading */}
//           <div className="mb-10">
//             <h2
//               className="
//               text-3xl
//               md:text-4xl
//               font-bold
//               text-white
//             "
//             >
//               {selectedCategory === "all"
//                 ? "Featured Restaurants"
//                 : `${categories.find((item) => item.id === selectedCategory)
//                   ?.label
//                 } Restaurants`}
//             </h2>

//             <p className="mt-2 text-slate-400">
//               {filteredRestaurants.length} restaurants available
//             </p>
//           </div>

//           {/* Loading */}
//           {loading ? (
//             <div className="flex justify-center py-20">
//               <div
//                 className="
//                 h-12
//                 w-12
//                 animate-spin
//                 rounded-full
//                 border-4
//                 border-orange-500
//                 border-t-transparent
//               "
//               />
//             </div>
//           ) : filteredRestaurants.length > 0 ? (
//             /* Restaurant Cards */

//             <div
//               className="
//               grid
//               grid-cols-1
//               gap-8
//               md:grid-cols-2
//               lg:grid-cols-3
//             "
//             >
//               {filteredRestaurants.map((restaurant) => (
//                 <div
//                   key={restaurant.id}
//                   onClick={() => navigate(`/restaurant-menu/${restaurant.id}`)}
//                   className="
//                     group
//                     cursor-pointer
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-slate-800
//                     bg-slate-900
//                     transition
//                     hover:-translate-y-2
//                     hover:shadow-2xl
//                   "
//                 >
//                   {/* Image */}

//                   <div
//                     className="
//                     relative
//                     h-52
//                     overflow-hidden
//                   "
//                   >
//                     <img
//                       src={restaurant.image}
//                       alt={restaurant.name}
//                       className="
//                         h-full
//                         w-full
//                         object-cover
//                         transition
//                         duration-500
//                         group-hover:scale-110
//                       "
//                     />

//                     <div
//                       className="
//                       absolute
//                       right-4
//                       top-4
//                       flex
//                       items-center
//                       gap-1
//                       rounded-full
//                       bg-orange-500
//                       px-3
//                       py-1
//                       text-sm
//                       font-bold
//                     "
//                     >
//                       <IoStar size={16} />

//                       {restaurant.rating}
//                     </div>
//                   </div>

//                   {/* Details */}

//                   <div className="p-6">
//                     <h3
//                       className="
//                       text-xl
//                       font-bold
//                       text-white
//                     "
//                     >
//                       {restaurant.name}
//                     </h3>

//                     <p
//                       className="
//                       mt-2
//                       line-clamp-2
//                       text-sm
//                       text-slate-400
//                     "
//                     >
//                       {restaurant.description}
//                     </p>

//                     {/* Cuisine Tags */}

//                     <div
//                       className="
//                       mt-4
//                       flex
//                       flex-wrap
//                       gap-2
//                     "
//                     >
//                       {restaurant.cuisines.map((cuisine, index) => (
//                         <span
//                           key={index}
//                           className="
//                               rounded-full
//                               bg-slate-800
//                               px-3
//                               py-1
//                               text-xs
//                               text-slate-300
//                             "
//                         >
//                           {cuisine}
//                         </span>
//                       ))}
//                     </div>

//                     {/* Button */}

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();

//                         navigate(`/restaurant-menu/${restaurant.id}`);
//                       }}
//                       className="
//                         mt-6
//                         w-full
//                         rounded-xl
//                         bg-orange-500
//                         py-3
//                         font-bold
//                         text-white
//                         transition
//                         hover:bg-orange-600
//                       "
//                     >
//                       Explore Menu
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div
//               className="
//               py-20
//               text-center
//             "
//             >
//               <h3
//                 className="
//                 text-2xl
//                 font-bold
//                 text-white
//               "
//               >
//                 No Restaurants Found
//               </h3>

//               <button
//                 onClick={() => {
//                   updateSearch("");

//                   updateCategory("all");
//                 }}
//                 className="
//                   mt-5
//                   rounded-xl
//                   bg-orange-500
//                   px-6
//                   py-3
//                   font-bold
//                 "
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//       {/* Statistics Section */}

//       <section className="bg-slate-900 py-16">
//         <div className="mx-auto max-w-7xl px-6">
//           <div className="mb-12 text-center">
//             <h2
//               className="
//               text-3xl
//               md:text-4xl
//               font-bold
//               text-white
//             "
//             >
//               Cravings By Numbers
//             </h2>

//             <p
//               className="
//               mt-3
//               text-slate-400
//             "
//             >
//               Trusted by thousands of food lovers
//             </p>
//           </div>

//           <div
//             className="
//             grid
//             grid-cols-1
//             gap-6
//             md:grid-cols-2
//             lg:grid-cols-4
//           "
//           >
//             {[
//               {
//                 value: "2.5M+",
//                 title: "Successful Deliveries",
//                 desc: "Food delivered with care",
//               },
//               {
//                 value: "500K+",
//                 title: "Happy Customers",
//                 desc: "People enjoying Cravings",
//               },
//               {
//                 value: "5K+",
//                 title: "Partner Restaurants",
//                 desc: "Restaurants growing with us",
//               },
//               {
//                 value: "1K+",
//                 title: "Delivery Partners",
//                 desc: "Fast and safe delivery",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="
//                   rounded-2xl
//                   border
//                   border-slate-800
//                   bg-slate-950
//                   p-8
//                   text-center
//                   transition
//                   hover:-translate-y-2
//                 "
//               >
//                 <h3
//                   className="
//                   text-4xl
//                   font-black
//                   text-orange-400
//                 "
//                 >
//                   {item.value}
//                 </h3>

//                 <h4
//                   className="
//                   mt-4
//                   text-lg
//                   font-bold
//                   text-white
//                 "
//                 >
//                   {item.title}
//                 </h4>

//                 <p
//                   className="
//                   mt-2
//                   text-sm
//                   text-slate-400
//                 "
//                 >
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Reviews Section */}

//       <section className="bg-slate-950 py-16">
//         <div className="mx-auto max-w-7xl px-6">
//           <div
//             className="
//             mb-12
//             text-center
//           "
//           >
//             <h2
//               className="
//               text-3xl
//               md:text-4xl
//               font-bold
//               text-white
//             "
//             >
//               What Customers Say
//             </h2>

//             <p
//               className="
//               mt-3
//               text-slate-400
//             "
//             >
//               Real experiences from food lovers
//             </p>
//           </div>

//           <div
//             className="
//             grid
//             grid-cols-1
//             gap-8
//             md:grid-cols-3
//           "
//           >
//             {[
//               {
//                 name: "Arun J.",
//                 text: "Food arrived hot and fresh. Amazing delivery experience!",
//                 initials: "AJ",
//               },
//               {
//                 name: "Sneha P.",
//                 text: "Easy ordering process with amazing restaurant choices.",
//                 initials: "SP",
//               },
//               {
//                 name: "Raj Kumar",
//                 text: "Cravings made food ordering simple and enjoyable.",
//                 initials: "RK",
//               },
//             ].map((review) => (
//               <div
//                 key={review.name}
//                 className="
//                   rounded-2xl
//                   border
//                   border-slate-800
//                   bg-slate-900
//                   p-8
//                 "
//               >
//                 <div
//                   className="
//                   mb-4
//                   flex
//                   gap-1
//                 "
//                 >
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <IoStar key={star} className="text-yellow-400" />
//                   ))}
//                 </div>

//                 <p
//                   className="
//                   text-slate-300
//                 "
//                 >
//                   "{review.text}"
//                 </p>

//                 <div
//                   className="
//                   mt-6
//                   flex
//                   items-center
//                   gap-3
//                 "
//                 >
//                   <div
//                     className="
//                     flex
//                     h-12
//                     w-12
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-orange-500
//                     font-bold
//                   "
//                   >
//                     {review.initials}
//                   </div>

//                   <h4
//                     className="
//                     font-semibold
//                     text-white
//                   "
//                   >
//                     {review.name}
//                   </h4>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Partner CTA */}

//       <section
//         className="
//         bg-gradient-to-r
//         from-orange-500
//         to-red-500
//         py-16
//       "
//       >
//         <div
//           className="
//           mx-auto
//           max-w-5xl
//           px-6
//           text-center
//         "
//         >
//           <h2
//             className="
//             text-3xl
//             md:text-5xl
//             font-black
//             text-white
//           "
//           >
//             Become A Restaurant Partner
//           </h2>

//           <p
//             className="
//             mx-auto
//             mt-4
//             max-w-2xl
//             text-white/90
//           "
//           >
//             Grow your food business with Cravings and reach more customers.
//           </p>

//           <button
//             onClick={() => navigate("/register")}
//             className="
//               mt-8
//               rounded-full
//               bg-white
//               px-8
//               py-3
//               font-bold
//               text-orange-600
//               transition
//               hover:bg-slate-100
//             "
//           >
//             Partner With Us
//           </button>
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
import api from "../config/api.config.js";

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
    { id: "all", label: "All", icon: MdRestaurant },
    { id: "veg", label: "Vegetarian", icon: MdLocalDining },
    { id: "nonveg", label: "Non-Veg", icon: MdFastfood },
    { id: "dessert", label: "Desserts", icon: MdCake },
    { id: "others", label: "Others", icon: MdLunchDining },
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

        const response = await api.get("/api/public/restaurants");

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-40 text-(--color-primary-content)">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <CarouselComponent />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Delicious Food
              <br />
              <span className="text-(--color-primary)">
                Delivered Fast
              </span>
            </h1>

            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Discover your favourite restaurants, order amazing meals and enjoy
              fast delivery with Cravings.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {!user && (
                <button
                  onClick={() => navigate("/register/customer")}
                  className="bg-(--color-primary) text-(--color-primary-content) px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Get Started
                </button>
              )}

              <button
                onClick={() => navigate("/order-now")}
                className="bg-(--color-base-100) text-(--color-base-content) px-8 py-3 rounded-lg font-semibold hover:bg-(--color-base-200) transition"
              >
                Order Now
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-(--color-base-100) rounded-xl px-4 py-3 flex items-center max-w-4xl mx-auto shadow-lg">
            <IoSearch
              size={22}
              className="mr-3 text-(--color-base-content)"
            />

            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-(--color-content)"
            />
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-6 md:py-10 bg-linear-to-b from-(--color-primary) to-(--color-primary-content)">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => updateCategory(category.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-full font-semibold transition ${
                    selectedCategory === category.id
                      ? "bg-(--color-base-100) text-(--color-primary)"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-(--color-primary-content)">
              {selectedCategory === "all"
                ? "Featured Restaurants"
                : `${
                    categories.find((item) => item.id === selectedCategory)
                      ?.label
                  } Restaurants`}
            </h2>

            <p className="mt-2 text-(--color-primary-content)/70">
              {filteredRestaurants.length} restaurant
              {filteredRestaurants.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-(--color-primary)" />
              <p className="mt-4 text-(--color-primary-content)">
                Loading restaurants...
              </p>
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant-menu/${restaurant.id}`)}
                  className="group flex flex-col overflow-hidden rounded-xl bg-(--color-base-100) shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                >
                  {/* Restaurant Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-(--color-primary) px-3 py-1 text-sm font-semibold text-(--color-primary-content)">
                      <IoStar size={15} />
                      {restaurant.rating}
                    </div>
                  </div>

                  {/* Restaurant Details */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-xl font-bold text-(--color-content)">
                      {restaurant.name}
                    </h3>

                    <p className="mt-2 text-sm text-(--color-base-content) line-clamp-2">
                      {restaurant.description}
                    </p>

                    {/* Cuisine Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {restaurant.cuisines.map((cuisine, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-(--color-base-300) px-3 py-1 text-xs capitalize text-(--color-base-content)"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/restaurant-menu/${restaurant.id}`);
                        }}
                        className="w-full rounded-lg bg-(--color-primary) py-3 font-semibold text-(--color-primary-content) transition hover:opacity-90"
                      >
                        Explore Menu
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-2xl font-bold text-(--color-primary-content)">
                No Restaurants Found
              </h3>

              <p className="mt-3 text-(--color-primary-content)/70">
                Try changing your search or category.
              </p>

              <button
                onClick={() => {
                  updateSearch("");
                  updateCategory("all");
                }}
                className="mt-6 rounded-lg bg-(--color-base-100) px-6 py-3 font-semibold text-(--color-primary)"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-(--color-base-100) py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-(--color-content)">
              Cravings By Numbers
            </h2>

            <p className="mt-3 text-(--color-base-content)">
              Trusted by thousands of food lovers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                value: "2.5M+",
                title: "Successful Deliveries",
                desc: "Orders delivered with care",
              },
              {
                value: "500K+",
                title: "Happy Customers",
                desc: "Food lovers across India",
              },
              {
                value: "5K+",
                title: "Partner Restaurants",
                desc: "Serving delicious meals",
              },
              {
                value: "1K+",
                title: "Delivery Partners",
                desc: "Fast & reliable delivery",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-8 text-center shadow-md transition hover:shadow-xl"
              >
                <div className="text-4xl font-black text-(--color-primary)">
                  {item.value}
                </div>

                <h3 className="mt-4 text-lg font-bold text-(--color-content)">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-(--color-base-content)">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
            {/* Customer Reviews */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-(--color-content)">
              What Customers Say
            </h2>

            <p className="mt-3 text-(--color-base-content)">
              Real experiences from food lovers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Arun J.",
                initials: "AJ",
                title: "Amazing Service!",
                text: "The food arrived hot and fresh. Delivery was fast and the ordering experience was smooth.",
              },
              {
                name: "Sneha P.",
                initials: "SP",
                title: "Loved It!",
                text: "Huge restaurant selection and an easy-to-use app. I order from Cravings almost every week.",
              },
              {
                name: "Raj Kumar",
                initials: "RK",
                title: "Highly Recommended",
                text: "Found my favourite restaurant through Cravings. Great food and quick delivery every time.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="rounded-xl bg-(--color-base-100) p-8 shadow-md transition hover:shadow-xl"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IoStar
                      key={star}
                      className="text-yellow-400"
                      size={18}
                    />
                  ))}
                </div>

                <h3 className="mb-2 text-lg font-bold text-(--color-content)">
                  {review.title}
                </h3>

                <p className="text-(--color-base-content)">
                  "{review.text}"
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-primary) font-bold text-(--color-primary-content)">
                    {review.initials}
                  </div>

                  <div>
                    <h4 className="font-semibold text-(--color-content)">
                      {review.name}
                    </h4>

                    <p className="text-sm text-(--color-base-content)">
                      Verified Customer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-(--color-primary) py-16 text-(--color-primary-content)">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-black md:text-5xl">
            Become A Restaurant Partner
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Grow your food business with Cravings and reach thousands of hungry
            customers every day.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-8 rounded-lg bg-(--color-base-100) px-8 py-3 font-bold text-(--color-primary) transition hover:bg-(--color-base-200)"
          >
            Partner With Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;