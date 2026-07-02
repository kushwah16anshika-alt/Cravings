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
  }, [heroImages.length]);

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
      description: "Discover popular restaurants and comfort food near you.",
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
    { value: "20K+", label: "orders daily" },
    { value: "300+", label: "restaurants" },
    { value: "4.9/5", label: "customer love" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">

      {/* Hero Section */}
      <div className="relative min-h-[90vh] overflow-hidden">

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

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32 grid items-center gap-12 lg:grid-cols-12">

          <div className="lg:col-span-7 space-y-8">

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl xl:text-7xl leading-tight">
              Delicious meals
              <br />
              delivered{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                to your door
              </span>
              <br />
              in minutes.
            </h1>

            <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
              From your favorite local spots to indulgent comfort food,
              Cravings brings the best flavors to your city.
            </p>

            <div className="flex gap-4">
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-white"
              >
                Order Now →
              </Link>

              <Link
                to="/register"
                className="rounded-full border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold"
              >
                Become a Partner
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">

          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-slate-400">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default Home;