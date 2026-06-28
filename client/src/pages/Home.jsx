// import React from "react";
// import { Link } from "react-router-dom";

// const Home = () => {
//   const highlights = [
//     {
//       title: "Lightning-fast delivery",
//       description: "Track your food live and get it at your doorstep in minutes.",
//       iconBg: "bg-amber-100 text-amber-700",
//       icon: "⚡"
//     },
//     {
//       title: "Fresh local favorites",
//       description: "Discover popular restaurants and comfort food near you.",
//       iconBg: "bg-orange-100 text-orange-700",
//       icon: "🍲"
//     },
//     {
//       title: "Easy for partners",
//       description: "Restaurants and riders can grow with Cravings in one place.",
//       iconBg: "bg-rose-100 text-rose-700",
//       icon: "🤝"
//     },
//   ];

//   const stats = [
//     { value: "20K+", label: "orders daily" },
//     { value: "300+", label: "restaurants" },
//     { value: "4.9/5", label: "customer love" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-orange-500 selection:text-white">
//       {/* Hero Section */}
//       <div className="relative min-h-[90vh] overflow-hidden">
//         {/* Background Image Layer with Gradient Masks */}
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="/foodTable.webp" 
//             alt="Delicious spread" 
//             className="h-full w-full object-cover object-center opacity-40 scale-105 transition-transform duration-10000 ease-out"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
//         </div>

//         {/* Hero Content container */}
//         <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32 grid items-center gap-12 lg:grid-cols-12">
          
//           {/* Left Column: Copy & Actions */}
//           <div className="lg:col-span-7 space-y-8">
//             <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-orange-400 backdrop-blur-md">
//               <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
//               Cravings • Food delivery made simple
//             </div>
            
//             <h1 className="text-4xl font-black tracking-tight sm:text-6xl xl:text-7xl !leading-[1.1]">
//               Delicious meals <br />
//               delivered <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400">to your door</span> <br />
//               in minutes.
//             </h1>
            
//             <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
//               From your favorite local spots to indulgent comfort food, Cravings brings the best flavors to your city with fast delivery and effortless ordering.
//             </p>

//             <div className="flex flex-wrap gap-4 pt-2">
//               <Link
//                 to="/register"
//                 className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-white shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-orange-500/30 active:scale-[0.98]"
//               >
//                 Order Now
//                 <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-900 active:scale-[0.98]"
//               >
//                 Become a Partner
//               </Link>
//             </div>

//             {/* Stats Dashboard Row */}
//             <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-8 max-w-lg">
//               {stats.map((item) => (
//                 <div key={item.label} className="space-y-1">
//                   <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
//                     {item.value}
//                   </p>
//                   <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                     {item.label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Column: Interactive Highlight Feature Blocks */}
//           <div className="lg:col-span-5 space-y-4 lg:pl-4">
//             <div className="group relative rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/30 hover:bg-slate-900/60 shadow-2xl">
//               <div className="absolute top-4 right-4 rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">
//                 Premium Service
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-xl border border-orange-500/20">
//                   🔥
//                 </div>
//                 <div>
//                   <h4 className="text-base font-bold text-white">Fresh & Hot Guaranteed</h4>
//                   <p className="mt-1 text-sm text-slate-400 leading-relaxed">
//                     Every single meal is packed carefully inside high-tech thermal bags and delivered with absolute care.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="group relative rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/30 hover:bg-slate-900/60 shadow-2xl">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 text-xl border border-amber-500/20">
//                   📍
//                 </div>
//                 <div>
//                   <h4 className="text-base font-bold text-white">Real-Time Live Tracking</h4>
//                   <p className="mt-1 text-sm text-slate-400 leading-relaxed">
//                     Watch your courier move step-by-step on our interactive live map. Know exactly when your cravings arrive.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Features Showcase Section */}
//       <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
//         <div className="rounded-[2.5rem] border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-8 sm:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden">
//           <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
          
//           <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-slate-800 pb-8">
//             <div className="space-y-2">
//               <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
//                 Why Choose Cravings
//               </p>
//               <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
//                 A better way to order food
//               </h2>
//             </div>
//             <p className="max-w-md text-sm sm:text-base text-slate-400 leading-relaxed">
//               We engineered a smooth, frictionless ecosystem optimized perfectly for hungry customers, local restaurants, and fleet riders alike.
//             </p>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             {highlights.map((item) => (
//               <div
//                 key={item.title}
//                 className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-950/80"
//               >
//                 <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg ${item.iconBg}`}>
//                   {item.icon}
//                 </div>
//                 <h3 className="text-lg font-bold text-white transition-colors group-hover:text-orange-400">
//                   {item.title}
//                 </h3>
//                 <p className="mt-2 text-sm leading-relaxed text-slate-400">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import food1 from "../assets/images/fresh-gourmet-meal-beef-taco-salad-plate-generated-by-ai.jpg";
import food2 from "../assets/images/front-view-tasty-boiled-rice-with-dried-pepper-garlic.jpg";
import food3 from "../assets/images/vertical-shot-traditional-indian-paneer-butter-masala-cheese-cottage-curry-black-surface.jpg";
import food4 from "../assets/images/eaters-collective-12eHC6FxPyg-unsplash.jpg";


const Home = () => {
  const heroImages = [food1, food2, food3, food4];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const highlights = [
    {
      title: "Lightning-fast delivery",
      description:
        "Track your food live and get it at your doorstep in minutes.",
      iconBg: "bg-amber-100 text-amber-700",
      icon: "⚡",
    },
    {
      title: "Fresh local favorites",
      description:
        "Discover popular restaurants and comfort food near you.",
      iconBg: "bg-orange-100 text-orange-700",
      icon: "🍲",
    },
    {
      title: "Easy for partners",
      description:
        "Restaurants and riders can grow with Cravings in one place.",
      iconBg: "bg-rose-100 text-rose-700",
      icon: "🤝",
    },
  ];

  const stats = [
    {
      value: "20K+",
      label: "orders daily",
    },
    {
      value: "300+",
      label: "restaurants",
    },
    {
      value: "4.9/5",
      label: "customer love",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">

      {/* Hero Section */}
      <div className="relative min-h-[90vh] overflow-hidden">

        {/* Background Images */}
        <div className="absolute inset-0">

          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                index === currentImage ? "opacity-40" : "opacity-0"
              }`}
            />
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        </div>

        {/* Hero Content */}

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32 grid items-center gap-12 lg:grid-cols-12">

          {/* Left Side */}

          <div className="lg:col-span-7 space-y-8">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 backdrop-blur-md">

              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>

              Cravings • Food delivery made simple

            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl xl:text-7xl leading-tight">
              Delicious meals
              <br />

              delivered

              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                {" "}
                to your door
              </span>

              <br />

              in minutes.
            </h1>

            <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
              From your favorite local spots to indulgent comfort food,
              Cravings brings the best flavors to your city with fast delivery
              and effortless ordering.
            </p>

            <div className="flex flex-wrap gap-4">

              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-white hover:scale-105 transition"
              >
                Order Now →
              </Link>

              <Link
                to="/register"
                className="rounded-full border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold backdrop-blur-md hover:border-slate-500"
              >
                Become a Partner
              </Link>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-8 max-w-lg">

              {stats.map((item) => (
                <div key={item.label}>
                  <p className="text-3xl font-black">
                    {item.value}
                  </p>

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}

            </div>

            {/* Slider Dots */}

            <div className="flex gap-3 pt-4">

              {heroImages.map((_, index) => (

                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentImage === index
                      ? "w-8 h-3 bg-orange-500"
                      : "w-3 h-3 bg-white/40"
                  }`}
                />

              ))}

            </div>

          </div>

          {/* Right Side */}

          <div className="lg:col-span-5 space-y-4">

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl">

              <div className="absolute top-4 right-4 rounded-full bg-orange-500/10 px-2 py-1 text-[10px] uppercase text-orange-400">
                Premium Service
              </div>

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-xl">
                  🔥
                </div>

                <div>

                  <h4 className="font-bold text-white">
                    Fresh & Hot Guaranteed
                  </h4>

                  <p className="mt-2 text-sm text-slate-400">
                    Every meal is packed carefully and delivered hot to your
                    doorstep.
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-xl">
                  📍
                </div>

                <div>

                  <h4 className="font-bold text-white">
                    Live Order Tracking
                  </h4>

                  <p className="mt-2 text-sm text-slate-400">
                    Track your order in real time from restaurant to your home.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
            {/* Features Showcase Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-8 backdrop-blur-md sm:p-12 lg:p-16">

          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-orange-600/10 blur-[120px]" />

          <div className="mb-12 flex flex-col gap-4 border-b border-slate-800 pb-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Why Choose Cravings
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                A better way to order food
              </h2>

            </div>

            <p className="max-w-md text-base leading-relaxed text-slate-400">
              We engineered a smooth ecosystem optimized for hungry customers,
              restaurants, and delivery partners.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {highlights.map((item) => (

              <div
                key={item.title}
                className="group rounded-2xl border border-slate-800 bg-slate-950/40 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500 hover:bg-slate-900"
              >

                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl ${item.iconBg}`}
                >
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-orange-400">
                  {item.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-400">
                  {item.description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;