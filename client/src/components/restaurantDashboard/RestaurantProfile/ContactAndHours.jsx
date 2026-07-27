import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../config/api.config.js";
import runningLoader from "../../../assets/runningLoader.gif";

const ContactAndHours = ({ initialData, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    contactEmail: initialData?.contactDetails?.email || "",
    contactPhone: initialData?.contactDetails?.phone || "",
    openingTime: initialData?.servingHours?.openingTime || "",
    closingTime: initialData?.servingHours?.closingTime || "",
    facebookUrl:
      initialData?.socialMediaLinks?.find(
        (item) => item.platform === "facebook"
      )?.url || "",
    instagramUrl:
      initialData?.socialMediaLinks?.find(
        (item) => item.platform === "instagram"
      )?.url || "",
    twitterUrl:
      initialData?.socialMediaLinks?.find(
        (item) => item.platform === "twitter"
      )?.url || "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleCancel = () => {
    setFormData({
      contactEmail: initialData?.contactDetails?.email || "",
      contactPhone: initialData?.contactDetails?.phone || "",
      openingTime: initialData?.servingHours?.openingTime || "",
      closingTime: initialData?.servingHours?.closingTime || "",
      facebookUrl:
        initialData?.socialMediaLinks?.find(
          (item) => item.platform === "facebook"
        )?.url || "",
      instagramUrl:
        initialData?.socialMediaLinks?.find(
          (item) => item.platform === "instagram"
        )?.url || "",
      twitterUrl:
        initialData?.socialMediaLinks?.find(
          (item) => item.platform === "twitter"
        )?.url || "",
    });

    setIsEditing(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = new FormData();


      payload.append(
        "contactDetails.email",
        formData.contactEmail
      );

      payload.append(
        "contactDetails.phone",
        formData.contactPhone
      );


      payload.append(
        "servingHours.openingTime",
        formData.openingTime
      );

      payload.append(
        "servingHours.closingTime",
        formData.closingTime
      );


      const socialMediaLinks = [];


      if (formData.facebookUrl) {
        socialMediaLinks.push({
          platform: "facebook",
          url: formData.facebookUrl,
        });
      }


      if (formData.instagramUrl) {
        socialMediaLinks.push({
          platform: "instagram",
          url: formData.instagramUrl,
        });
      }


      if (formData.twitterUrl) {
        socialMediaLinks.push({
          platform: "twitter",
          url: formData.twitterUrl,
        });
      }


      payload.append(
        "socialMediaLinks",
        JSON.stringify(socialMediaLinks)
      );


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
        response.data.message ||
          "Contact updated successfully!"
      );


      setIsEditing(false);


      if (onSuccess) {
        onSuccess();
      }


    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update contact details"
      );

    } finally {

      setIsLoading(false);

    }
  };



  return (

    <form
      onSubmit={handleSubmit}
      className="
      min-h-full
      bg-gradient-to-br
      from-orange-50
      via-white
      to-red-50
      p-6
      rounded-3xl
      shadow-2xl
      border
      border-orange-100
      "
    >


      {/* Header */}

      <div className="
      flex
      flex-col
      md:flex-row
      justify-between
      items-start
      md:items-center
      gap-4
      mb-8
      ">


        <div>

          <h2 className="
          text-3xl
          font-extrabold
          text-orange-600
          ">
            📞 Contact & Business Hours
          </h2>


          <p className="text-gray-500 mt-2">
            Manage restaurant contact information and opening hours.
          </p>

        </div>



        {!isEditing && (

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="
            px-6
            py-3
            rounded-xl
            bg-gradient-to-r
            from-orange-500
            to-red-500
            text-white
            font-bold
            shadow-lg
            hover:scale-105
            transition
            "
          >
            ✏️ Edit Details
          </button>

        )}


      </div>





      <fieldset disabled={!isEditing}>


        {/* Contact Card */}

        <div className="
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        border
        border-orange-100
        ">


          <div className="flex items-center gap-3 mb-6">


            <div className="
            w-12
            h-12
            rounded-full
            bg-orange-100
            flex
            items-center
            justify-center
            text-2xl
            ">
              📱
            </div>


            <div>

              <h3 className="text-xl font-bold">
                Contact Information
              </h3>


              <p className="text-sm text-gray-500">
                Customer support details
              </p>

            </div>


          </div>





          <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
          ">



            <InputField
              label="📧 Contact Email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              type="email"
              placeholder="restaurant@gmail.com"
            />



            <InputField
              label="📞 Contact Phone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              type="tel"
              placeholder="+91 9876543210"
            />



            <InputField
              label="🌅 Opening Time"
              name="openingTime"
              value={formData.openingTime}
              onChange={handleChange}
              type="time"
            />



            <InputField
              label="🌙 Closing Time"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleChange}
              type="time"
            />


          </div>


        </div>






        {/* Social Media */}

        <div className="
        mt-6
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        border
        border-blue-100
        ">


          <h3 className="text-xl font-bold mb-5">
            🌐 Social Media Links
          </h3>



          <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
          ">


            <InputField
              label="🔵 Facebook"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="Facebook URL"
            />



            <InputField
              label="📸 Instagram"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="Instagram URL"
            />



            <InputField
              label="🐦 Twitter / X"
              name="twitterUrl"
              value={formData.twitterUrl}
              onChange={handleChange}
              placeholder="Twitter URL"
            />


          </div>


        </div>


      </fieldset>





      {isEditing && (

        <div className="
        flex
        justify-end
        gap-4
        mt-8
        ">


          <button
            type="button"
            onClick={handleCancel}
            className="
            px-6
            py-3
            rounded-xl
            bg-gray-200
            font-semibold
            hover:bg-gray-300
            "
          >
            ❌ Cancel
          </button>




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
            "
          >

            {isLoading && (
              <img
                src={runningLoader}
                className="w-5 h-5"
              />
            )}

            💾 Save Contact & Hours

          </button>


        </div>

      )}



    </form>

  );
};



// Reusable Input Component

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "url",
  placeholder = "",
}) => (

  <div>

    <label className="
    block
    mb-2
    font-semibold
    text-gray-700
    ">
      {label}
    </label>


    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
      w-full
      rounded-xl
      border
      border-orange-200
      px-4
      py-3
      bg-orange-50
      focus:bg-white
      focus:ring-2
      focus:ring-orange-400
      outline-none
      transition
      "
    />

  </div>

);



export default ContactAndHours;