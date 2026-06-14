import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div className=" flex justify-between  bg-(--primary) text-3xl text-(--bg)  h-16">cravings
        <div className="flex gap-4">
         <Link to={"/Home"}>Home</Link>
          <Link to={"/Contactus"}>Contactus</Link>
           <Link to={"/Login"}>Login</Link>
            <Link to={"/Register"}>Register</Link>
        </div>
      </div>
      
    </>
  );
};
export default Navbar;
