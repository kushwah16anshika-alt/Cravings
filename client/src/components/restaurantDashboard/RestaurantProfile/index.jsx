import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdRestaurantMenu, MdAddCircleOutline } from "react-icons/md";

import api from "../../../config/ApiConfig";

import RestaurantInformation from "./RestaurantInformation";
import RestaurantPhotos from "./RestaurantPhotos";
import FinancialDetails from "./FinancialDetails";
import RestaurantDocuments from "./RestaurantDocuments";
import ContactAndHours from "./ContactAndHours";
import CreateRestaurantProfile from "./CreateRestaurantProfile";

const RestaurantProfileContainer = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileExist, setProfileExist] = useState(false);
  const [createProfile, setCreateProfile] = useState(false);

  const [activeTab, setActiveTab] = useState("basic");

  const getRestaurantProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/restaurant/get-profile");

      if (res.data?.data) {
        setRestaurant(res.data.data);
        setProfileExist(true);
      } else {
        setRestaurant(null);
        setProfileExist(false);
      }
    } catch (error) {
      console.log("Restaurant Profile Error:", error);

      setProfileExist(false);
    } finally {
      setLoading(false);
    }
  };

  const updateRestaurantStatus = async () => {
    try {
      const res = await api.patch("/restaurant/toggle-status");

      if (res.data?.data) {
        setRestaurant(res.data.data);

        toast.success(res.data.message || "Status Updated");
      }
    } catch (error) {
      console.log("Status Update Error:", error);

      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    getRestaurantProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 font-semibold">
        Loading Restaurant Profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {profileExist ? (
        <>
          {/* Header */}

          <div
            className="
              flex justify-between items-center
              bg-white p-5 rounded-xl
              shadow-sm border
            "
          >
            <div>
              <h2
                className="
                  text-xl font-bold text-gray-800
                "
              >
                {restaurant?.restaurantName || "Restaurant Profile"}
              </h2>

              <p
                className="
                  text-sm text-gray-500
                "
              >
                Manage restaurant information
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`
                  font-semibold
                  ${restaurant?.isOpen ? "text-green-600" : "text-red-500"}
                `}
              >
                {restaurant?.isOpen ? "Currently Open" : "Currently Closed"}
              </span>

              <label
                className="
                  relative inline-flex cursor-pointer
                "
              >
                <input
                  type="checkbox"
                  checked={restaurant?.isOpen || false}
                  onChange={updateRestaurantStatus}
                  className="sr-only peer"
                />

                <div
                  className="
                    w-11 h-6
                    bg-gray-200
                    rounded-full
                    peer
                    peer-checked:bg-green-500
                    after:absolute
                    after:top-[2px]
                    after:left-[2px]
                    after:h-5
                    after:w-5
                    after:bg-white
                    after:border
                    after:rounded-full
                    after:transition-all
                    peer-checked:after:translate-x-full
                  "
                ></div>
              </label>
            </div>
          </div>

          {/* Tabs */}

          <div
            className="
              flex gap-5
              border-b
              overflow-x-auto
            "
          >
            {[
              {
                id: "basic",
                name: "Basic Details",
              },
              {
                id: "photos",
                name: "Photos",
              },
              {
                id: "documents",
                name: "Documents",
              },
              {
                id: "financial",
                name: "Financial",
              },
              {
                id: "contact",
                name: "Contact & Hours",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                      pb-2 font-semibold
                      border-b-2
                      ${
                        activeTab === tab.id
                          ? "border-(--color-primary) text-(--color-primary)"
                          : "border-transparent text-gray-500"
                      }
                    `}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Components */}

          {activeTab === "basic" && (
            <RestaurantInformation
              initialData={restaurant}
              onSuccess={getRestaurantProfile}
              isProfileCreated={profileExist}
            />
          )}

          {activeTab === "photos" && (
            <RestaurantPhotos
              initialData={restaurant}
              onSuccess={getRestaurantProfile}
            />
          )}

          {activeTab === "documents" && (
            <RestaurantDocuments
              initialData={restaurant}
              onSuccess={getRestaurantProfile}
            />
          )}

          {activeTab === "financial" && (
            <FinancialDetails
              initialData={restaurant}
              onSuccess={getRestaurantProfile}
            />
          )}

          {activeTab === "contact" && (
            <ContactAndHours
              initialData={restaurant}
              onSuccess={getRestaurantProfile}
            />
          )}
        </>
      ) : createProfile ? (
        <CreateRestaurantProfile
          onSuccess={getRestaurantProfile}
          onCancel={() => setCreateProfile(false)}
        />
      ) : (
        <div
          className="
            flex flex-col
            items-center
            justify-center
            py-20
            bg-white
            rounded-3xl
            shadow-xl
            text-center
          "
        >
          <div
            className="
              w-24 h-24
              bg-orange-50
              rounded-full
              flex items-center justify-center
              mb-6
            "
          >
            <MdRestaurantMenu
              className="
                text-5xl
                text-(--color-primary)
                "
            />
          </div>

          <h2
            className="
              text-3xl font-bold
              text-gray-800
            "
          >
            Welcome to Cravings!
          </h2>

          <p
            className="
              text-gray-500
              max-w-lg
              my-4
            "
          >
            Create your restaurant profile and start accepting orders.
          </p>

          <button
            onClick={() => setCreateProfile(true)}
            className="
                flex items-center gap-3
                bg-(--color-primary)
                text-(--color-primary-content)
                px-8 py-4
                rounded-2xl
                font-bold
              "
          >
            <MdAddCircleOutline className="text-2xl" />
            Add Restaurant
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfileContainer;
