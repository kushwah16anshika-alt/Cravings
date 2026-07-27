
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineAddAPhoto,
  MdDelete,
  MdEdit,
  MdCloudUpload,
} from "react-icons/md";
import api from "../../../config/api.config.js";


const MAX_IMAGE_SIZE_BYTES = 5242880;
const MAX_GALLERY_IMAGES = 8;


const RestaurantPhotos = ({ initialData, onSuccess }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [coverImage, setCoverImage] = useState(null);


  const [coverImagePreview, setCoverImagePreview] = useState(
    initialData?.coverImage?.url || null
  );


  const [restaurantImages, setRestaurantImages] = useState([]);


  const [existingImagesToKeep, setExistingImagesToKeep] = useState(
    initialData?.restaurantImage || []
  );


  const [restaurantImagesPreview, setRestaurantImagesPreview] = useState(
    initialData?.restaurantImage?.map((img)=>img.url) || []
  );



  useEffect(()=>{

    setCoverImagePreview(
      initialData?.coverImage?.url || null
    );


    setExistingImagesToKeep(
      initialData?.restaurantImage || []
    );


    setRestaurantImagesPreview(
      initialData?.restaurantImage?.map((img)=>img.url) || []
    );


  },[initialData]);




  const handleCoverImageChange=(e)=>{

    const file=e.target.files[0];

    if(!file) return;


    if(file.size > MAX_IMAGE_SIZE_BYTES){

      toast.error("Image size must be less than 5MB");

      return;

    }


    setCoverImage(file);

    setCoverImagePreview(
      URL.createObjectURL(file)
    );

  };





  const handleRestaurantImagesChange=(e)=>{


    const files=Array.from(e.target.files);


    if(
      restaurantImagesPreview.length + files.length >
      MAX_GALLERY_IMAGES
    ){

      toast.error(
        `Maximum ${MAX_GALLERY_IMAGES} images allowed`
      );

      return;

    }



    const validFiles=[];
    const previews=[];



    files.forEach(file=>{


      if(file.size > MAX_IMAGE_SIZE_BYTES){

        toast.error(
          `${file.name} is larger than 5MB`
        );

      }

      else{

        validFiles.push(file);

        previews.push(
          URL.createObjectURL(file)
        );

      }


    });



    setRestaurantImages(prev=>[
      ...prev,
      ...validFiles
    ]);


    setRestaurantImagesPreview(prev=>[
      ...prev,
      ...previews
    ]);

  };





  const removeRestaurantImage=(index)=>{


    if(index < existingImagesToKeep.length){

      setExistingImagesToKeep(prev=>
        prev.filter((_,i)=>i!==index)
      );

    }

    else{

      const newIndex =
        index-existingImagesToKeep.length;


      setRestaurantImages(prev=>
        prev.filter((_,i)=>i!==newIndex)
      );

    }


    setRestaurantImagesPreview(prev=>
      prev.filter((_,i)=>i!==index)
    );

  };





  const handleCancel=()=>{

    setCoverImage(null);

    setRestaurantImages([]);


    setCoverImagePreview(
      initialData?.coverImage?.url || null
    );


    setExistingImagesToKeep(
      initialData?.restaurantImage || []
    );


    setRestaurantImagesPreview(
      initialData?.restaurantImage?.map(img=>img.url)||[]
    );


    setIsEditing(false);

  };
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const payload = new FormData();

      if (coverImage) {
        payload.append("coverImage", coverImage);
      }


      restaurantImages.forEach((image) => {
        payload.append("restaurantImage", image);
      });


      payload.append(
        "existingRestaurantImages",
        JSON.stringify(existingImagesToKeep)
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
        "Images updated successfully"
      );


      setIsEditing(false);
      setCoverImage(null);
      setRestaurantImages([]);


      if (onSuccess) onSuccess();


    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to upload images"
      );

    } finally {

      setIsLoading(false);

    }
  };



  return (

    <div
      className="
      bg-gradient-to-br
      from-orange-50
      via-white
      to-red-50
      rounded-3xl
      shadow-2xl
      border
      border-orange-100
      overflow-hidden
      "
    >


      {/* Header */}

      <div
        className="
        bg-gradient-to-r
        from-orange-500
        via-red-500
        to-pink-500
        p-6
        text-white
        flex
        flex-col
        md:flex-row
        justify-between
        items-start
        md:items-center
        gap-4
        "
      >


        <div>


          <h2 className="
          text-3xl
          font-extrabold
          flex
          items-center
          gap-3
          ">
            <MdOutlineAddAPhoto />
            Restaurant Photos
          </h2>


          <p className="mt-2 text-white/90">
            Upload and manage your restaurant images
          </p>


        </div>




        {!isEditing ? (

          <button
            onClick={()=>setIsEditing(true)}
            className="
            bg-white
            text-orange-600
            px-6
            py-3
            rounded-xl
            font-bold
            shadow-lg
            hover:scale-105
            transition
            flex
            items-center
            gap-2
            "
          >

            <MdEdit />

            Edit Photos

          </button>


        ) : (


          <div className="
          flex
          gap-3
          ">


            <button
              onClick={handleCancel}
              className="
              px-6
              py-3
              rounded-xl
              bg-white/20
              border
              border-white
              text-white
              font-semibold
              hover:bg-white/30
              transition
              "
            >
              Cancel
            </button>




            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="
              px-6
              py-3
              rounded-xl
              bg-white
              text-green-600
              font-bold
              shadow-lg
              hover:scale-105
              transition
              "
            >

              {isLoading
                ? "Saving..."
                : "💾 Save"}

            </button>


          </div>


        )}


      </div>





      <div
        className="
        p-6
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-8
        "
      >



        {/* Cover Image */}


        <div
          className="
          bg-white
          rounded-3xl
          p-6
          shadow-lg
          border
          border-orange-100
          "
        >


          <h3 className="
          text-xl
          font-bold
          mb-4
          text-gray-800
          ">
            🖼 Cover Image
          </h3>



          <div
            className="
            h-80
            rounded-2xl
            border-2
            border-dashed
            border-orange-300
            overflow-hidden
            relative
            group
            "
          >


            {coverImagePreview ? (

              <img
                src={coverImagePreview}
                className="
                w-full
                h-full
                object-cover
                group-hover:scale-110
                transition
                duration-500
                "
              />

            ) : (

              <div
                className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-gray-400
                "
              >

                <MdCloudUpload size={50}/>

                <p>
                  No Cover Image
                </p>

              </div>

            )}




            {isEditing && (

              <label
                className="
                absolute
                inset-0
                bg-black/50
                text-white
                flex
                items-center
                justify-center
                cursor-pointer
                opacity-0
                group-hover:opacity-100
                transition
                font-bold
                text-lg
                "
              >

                📤 Upload Cover


                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />


              </label>

            )}


          </div>


        </div>
                {/* Gallery Images */}

        <div
          className="
          bg-white
          rounded-3xl
          p-6
          shadow-lg
          border
          border-pink-100
          "
        >


          <div className="
          flex
          justify-between
          items-center
          mb-5
          ">


            <div>

              <h3 className="
              text-xl
              font-bold
              text-gray-800
              ">
                📸 Gallery Images
              </h3>


              <p className="text-sm text-gray-500">
                Maximum 8 images allowed
              </p>

            </div>





            {isEditing && (

              <label
                className="
                cursor-pointer
                bg-gradient-to-r
                from-pink-500
                to-purple-600
                text-white
                px-5
                py-2.5
                rounded-xl
                font-bold
                shadow-md
                hover:scale-105
                transition
                flex
                items-center
                gap-2
                "
              >

                <MdOutlineAddAPhoto />

                Add Image


                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleRestaurantImagesChange}
                  className="hidden"
                />

              </label>

            )}



          </div>






          {restaurantImagesPreview.length === 0 ? (


            <div
              className="
              h-56
              rounded-2xl
              border-2
              border-dashed
              border-pink-200
              flex
              flex-col
              justify-center
              items-center
              text-gray-400
              "
            >

              <MdOutlineAddAPhoto size={45}/>

              <p className="mt-3">
                No gallery images added
              </p>


            </div>



          ) : (


            <div
              className="
              grid
              grid-cols-2
              md:grid-cols-3
              gap-4
              "
            >



              {restaurantImagesPreview.map(
                (img,index)=>(


                <div
                  key={index}
                  className="
                  relative
                  aspect-square
                  rounded-2xl
                  overflow-hidden
                  group
                  shadow-md
                  "
                >



                  <img
                    src={img}
                    className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-110
                    transition
                    duration-500
                    "
                  />




                  {isEditing && (

                    <button
                      type="button"
                      onClick={() =>
                        removeRestaurantImage(index)
                      }
                      className="
                      absolute
                      top-3
                      right-3
                      bg-red-500
                      text-white
                      p-2
                      rounded-full
                      shadow-lg
                      hover:bg-red-600
                      hover:scale-110
                      transition
                      "
                    >

                      <MdDelete size={20}/>

                    </button>

                  )}




                  <div
                    className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    bg-gradient-to-t
                    from-black/70
                    to-transparent
                    h-16
                    "
                  />


                </div>


              ))}



            </div>


          )}



        </div>



      </div>


    </div>


  );

};


export default RestaurantPhotos;