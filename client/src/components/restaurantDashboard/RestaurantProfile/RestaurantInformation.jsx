// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../../config/api.config.js";
// import runningLoader from "../../../assets/runningLoader.gif";

// const RestaurantInformation = ({
//   initialData,
//   onSuccess,
//   isProfileCreated,
// }) => {
//   const [isEditing, setIsEditing] = useState(!isProfileCreated);
//   const [isLoading, setIsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     restaurantName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     country: "",
//     description: "",
//     restaurantType: "both",
//     cuisineTypes: "",
//     lat: "",
//     lon: "",
//   });

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         restaurantName: initialData.restaurantName || "",
//         address: initialData.address || "",
//         city: initialData.city || "",
//         state: initialData.state || "",
//         pinCode: initialData.pinCode || "",
//         country: initialData.country || "",
//         description: initialData.description || "",
//         restaurantType: initialData.restaurantType || "both",
//         cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
//         lat: initialData.geoLocation?.lat || "",
//         lon: initialData.geoLocation?.lon || "",
//       });
//       setIsEditing(false);
//     } else {
//       setIsEditing(true);
//     }
//   }, [initialData, isProfileCreated]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCancel = () => {
//     if (initialData) {
//       setFormData({
//         restaurantName: initialData.restaurantName || "",
//         address: initialData.address || "",
//         city: initialData.city || "",
//         state: initialData.state || "",
//         pinCode: initialData.pinCode || "",
//         country: initialData.country || "",
//         description: initialData.description || "",
//         restaurantType: initialData.restaurantType || "both",
//         cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
//         lat: initialData.geoLocation?.lat || "",
//         lon: initialData.geoLocation?.lon || "",
//       });
//       setIsEditing(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);
//       const payload = new FormData();
//       payload.append("restaurantName", formData.restaurantName);
//       payload.append("address", formData.address);
//       payload.append("city", formData.city);
//       payload.append("state", formData.state);
//       payload.append("pinCode", formData.pinCode);
//       payload.append("country", formData.country);
//       payload.append("description", formData.description);
//       payload.append("restaurantType", formData.restaurantType);

//       formData.cuisineTypes
//         .split(",")
//         .map((c) => c.trim())
//         .filter((c) => c)
//         .forEach((c) => {
//           payload.append("cuisineTypes", c);
//         });

//       payload.append("geoLocation.lat", formData.lat);
//       payload.append("geoLocation.lon", formData.lon);

//       const response = await api.post("/restaurant/update-profile", payload, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success(response.data.message || "Details updated successfully!");
//       setIsEditing(false);
//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to update details");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-(--color-base-100) p-6 rounded-2xl shadow-md border border-(--color-base-300)"
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-xl font-bold border-b-2 border-(--color-primary) pb-2">
//           Basic Details & Location
//         </h3>
//         {!isEditing && isProfileCreated && (
//           <button
//             type="button"
//             onClick={() => setIsEditing(true)}
//             className="bg-(--color-primary) text-(--color-primary-content) px-5 py-2 rounded-lg font-bold"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>

//       <fieldset disabled={!isEditing}>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="md:col-span-2">
//             <label className="text-sm font-medium">Restaurant Name</label>
//             <input
//               type="text"
//               name="restaurantName"
//               value={formData.restaurantName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Restaurant Type</label>
//             <select
//               name="restaurantType"
//               value={formData.restaurantType}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             >
//               <option value="veg">Veg</option>
//               <option value="non-veg">Non Veg</option>
//               <option value="jain">Jain</option>
//               <option value="vegan">Vegan</option>
//               <option value="both">Both</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Cuisine</label>
//             <input
//               type="text"
//               name="cuisineTypes"
//               value={formData.cuisineTypes}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>

//           <div className="col-span-full">
//             <label className="text-sm font-medium">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>

//           <div className="col-span-full">
//             <label className="text-sm font-medium">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>

//           {["city", "state", "pinCode", "country"].map((field) => (
//             <div key={field}>
//               <label className="text-sm font-medium">{field}</label>
//               <input
//                 type="text"
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//             </div>
//           ))}

//           <div>
//             <label className="text-sm font-medium">Latitude</label>
//             <input
//               type="text"
//               name="lat"
//               value={formData.lat}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Longitude</label>
//             <input
//               type="text"
//               name="lon"
//               value={formData.lon}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded"
//             />
//           </div>
//         </div>
//       </fieldset>

//       {isEditing && (
//         <div className="flex justify-end gap-3 mt-6">
//           {isProfileCreated && (
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-200 px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded flex items-center gap-2"
//           >
//             {isLoading && <img src={runningLoader} className="w-5 h-5" />}
//             {isProfileCreated ? "Save Changes" : "Create Profile"}
//           </button>
//         </div>
//       )}
//     </form>
//   );
// };

// export default RestaurantInformation;



import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/api.config.js";
import runningLoader from "../../../assets/runningLoader.gif";

const RestaurantInformation = ({
  initialData,
  onSuccess,
  isProfileCreated,
}) => {
  const [isEditing, setIsEditing] = useState(!isProfileCreated);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    description: "",
    restaurantType: "both",
    cuisineTypes: "",
    lat: "",
    lon: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        restaurantName: initialData.restaurantName || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pinCode: initialData.pinCode || "",
        country: initialData.country || "",
        description: initialData.description || "",
        restaurantType: initialData.restaurantType || "both",
        cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
        lat: initialData.geoLocation?.lat || "",
        lon: initialData.geoLocation?.lon || "",
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [initialData, isProfileCreated]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    if (!initialData) return;

    setFormData({
      restaurantName: initialData.restaurantName || "",
      address: initialData.address || "",
      city: initialData.city || "",
      state: initialData.state || "",
      pinCode: initialData.pinCode || "",
      country: initialData.country || "",
      description: initialData.description || "",
      restaurantType: initialData.restaurantType || "both",
      cuisineTypes: initialData.cuisineTypes?.join(", ") || "",
      lat: initialData.geoLocation?.lat || "",
      lon: initialData.geoLocation?.lon || "",
    });

    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = new FormData();

      payload.append("restaurantName", formData.restaurantName);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pinCode", formData.pinCode);
      payload.append("country", formData.country);
      payload.append("description", formData.description);
      payload.append("restaurantType", formData.restaurantType);

      formData.cuisineTypes
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => payload.append("cuisineTypes", c));

      payload.append("geoLocation.lat", formData.lat);
      payload.append("geoLocation.lon", formData.lon);

      const response = await api.post(
        "/restaurant/update-profile",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        response.data.message || "Restaurant updated successfully!"
      );

      setIsEditing(false);

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
  <form
    onSubmit={handleSubmit}
    className="min-h-full bg-gradient-to-br from-orange-50 via-white to-red-50 p-6 rounded-3xl shadow-2xl border border-orange-100"
  >

    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

      <div>
        <h2 className="text-3xl font-extrabold text-orange-600">
          🍽 Restaurant Information
        </h2>

        <p className="text-gray-500 mt-2">
          Manage your restaurant profile, cuisine and location details.
        </p>
      </div>


      {!isEditing && isProfileCreated && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="
          px-6 py-3 rounded-xl
          bg-gradient-to-r from-orange-500 to-red-500
          text-white font-bold
          shadow-lg
          hover:scale-105
          transition
          "
        >
          ✏️ Edit Profile
        </button>
      )}

    </div>


    <fieldset disabled={!isEditing}>


      {/* Restaurant Details Card */}

      <div className="
      bg-white 
      rounded-3xl 
      shadow-lg 
      p-6 
      border 
      border-orange-100
      "
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="
          w-12 h-12 
          rounded-full 
          bg-orange-100 
          flex items-center 
          justify-center
          text-2xl
          ">
            🍴
          </div>


          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Restaurant Details
            </h3>

            <p className="text-sm text-gray-500">
              Basic information about your restaurant
            </p>
          </div>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


          {/* Restaurant Name */}

          <div className="md:col-span-2">

            <label className="block mb-2 font-semibold text-gray-700">
              🍽 Restaurant Name
            </label>

            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Enter restaurant name"
              className="
              w-full
              rounded-xl
              border border-orange-200
              px-4 py-3
              bg-orange-50
              focus:bg-white
              focus:ring-2
              focus:ring-orange-400
              outline-none
              transition
              "
            />

          </div>



          {/* Restaurant Type */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              🥗 Restaurant Type
            </label>


            <select
              name="restaurantType"
              value={formData.restaurantType}
              onChange={handleChange}
              className="
              w-full
              rounded-xl
              border border-orange-200
              px-4 py-3
              bg-orange-50
              focus:bg-white
              focus:ring-2
              focus:ring-orange-400
              outline-none
              "
            >

              <option value="veg">
                🟢 Veg
              </option>

              <option value="non-veg">
                🔴 Non Veg
              </option>

              <option value="jain">
                🟡 Jain
              </option>

              <option value="vegan">
                🌱 Vegan
              </option>

              <option value="both">
                🍽 Both
              </option>

            </select>

          </div>



          {/* Cuisine */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              🍕 Cuisine
            </label>


            <input
              type="text"
              name="cuisineTypes"
              value={formData.cuisineTypes}
              onChange={handleChange}
              placeholder="Indian, Chinese, Fast Food"
              className="
              w-full
              rounded-xl
              border border-orange-200
              px-4 py-3
              bg-orange-50
              focus:bg-white
              focus:ring-2
              focus:ring-orange-400
              outline-none
              transition
              "
            />

          </div>




          {/* Description */}

          <div className="col-span-full">

            <label className="block mb-2 font-semibold text-gray-700">
              📝 Restaurant Description
            </label>


            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Tell customers about your restaurant..."
              className="
              w-full
              rounded-xl
              border border-orange-200
              px-4 py-3
              bg-orange-50
              focus:bg-white
              focus:ring-2
              focus:ring-orange-400
              outline-none
              resize-none
              transition
              "
            />

          </div>


        </div>

      </div>
            {/* Address Details Card */}

      <div
        className="
        mt-6
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        border
        border-red-100
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <div
            className="
            w-12 h-12
            rounded-full
            bg-red-100
            flex
            items-center
            justify-center
            text-2xl
            "
          >
            📍
          </div>


          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Address Details
            </h3>

            <p className="text-sm text-gray-500">
              Restaurant serving location information
            </p>
          </div>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


          {/* Address */}

          <div className="col-span-full">

            <label className="block mb-2 font-semibold text-gray-700">
              🏠 Full Address
            </label>


            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter restaurant address"
              className="
              w-full
              rounded-xl
              border border-red-200
              px-4 py-3
              bg-red-50
              focus:bg-white
              focus:ring-2
              focus:ring-red-400
              outline-none
              transition
              "
            />

          </div>



          {/* City */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              🏙 City
            </label>


            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Bhopal"
              className="
              w-full
              rounded-xl
              border border-red-200
              px-4 py-3
              bg-red-50
              focus:bg-white
              focus:ring-2
              focus:ring-red-400
              outline-none
              transition
              "
            />

          </div>



          {/* State */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              🌎 State
            </label>


            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Madhya Pradesh"
              className="
              w-full
              rounded-xl
              border border-red-200
              px-4 py-3
              bg-red-50
              focus:bg-white
              focus:ring-2
              focus:ring-red-400
              outline-none
              transition
              "
            />

          </div>




          {/* Pin Code */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              📮 Pin Code
            </label>


            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="462001"
              className="
              w-full
              rounded-xl
              border border-red-200
              px-4 py-3
              bg-red-50
              focus:bg-white
              focus:ring-2
              focus:ring-red-400
              outline-none
              transition
              "
            />

          </div>




          {/* Country */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              🇮🇳 Country
            </label>


            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="India"
              className="
              w-full
              rounded-xl
              border border-red-200
              px-4 py-3
              bg-red-50
              focus:bg-white
              focus:ring-2
              focus:ring-red-400
              outline-none
              transition
              "
            />

          </div>


        </div>


      </div>
            {/* Geo Location Card */}

      <div
        className="
        mt-6
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        border
        border-green-100
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <div
            className="
            w-12 h-12
            rounded-full
            bg-green-100
            flex
            items-center
            justify-center
            text-2xl
            "
          >
            🌐
          </div>


          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Geo Location
            </h3>

            <p className="text-sm text-gray-500">
              Add exact restaurant coordinates
            </p>
          </div>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


          {/* Latitude */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              📍 Latitude
            </label>


            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="23.2599"
              className="
              w-full
              rounded-xl
              border border-green-200
              px-4 py-3
              bg-green-50
              focus:bg-white
              focus:ring-2
              focus:ring-green-400
              outline-none
              transition
              "
            />

          </div>




          {/* Longitude */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              🌎 Longitude
            </label>


            <input
              type="text"
              name="lon"
              value={formData.lon}
              onChange={handleChange}
              placeholder="77.4126"
              className="
              w-full
              rounded-xl
              border border-green-200
              px-4 py-3
              bg-green-50
              focus:bg-white
              focus:ring-2
              focus:ring-green-400
              outline-none
              transition
              "
            />

          </div>


        </div>


      </div>


    </fieldset>



    {/* Action Buttons */}

    {isEditing && (

      <div
        className="
        flex
        justify-end
        gap-4
        mt-8
        "
      >


        {isProfileCreated && (

          <button
            type="button"
            onClick={handleCancel}
            className="
            px-6
            py-3
            rounded-xl
            bg-gray-200
            text-gray-700
            font-semibold
            hover:bg-gray-300
            transition
            "
          >
            ❌ Cancel
          </button>

        )}




        <button
          type="submit"
          disabled={isLoading}
          className="
          px-7
          py-3
          rounded-xl
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          text-white
          font-bold
          shadow-lg
          hover:scale-105
          transition
          flex
          items-center
          gap-3
          disabled:opacity-60
          "
        >

          {isLoading && (
            <img
              src={runningLoader}
              className="w-5 h-5"
              alt="loading"
            />
          )}


          {isProfileCreated
            ? "💾 Save Changes"
            : "🚀 Create Profile"}

        </button>


      </div>

    )}


  </form>
);

};

export default RestaurantInformation;