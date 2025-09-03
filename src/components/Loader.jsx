// src/components/Loader.jsx

import loader from "../assets/loader.gif"
export default function Loader() {
  return (
    <div className="flex ">
    <img src={loader} 
    className="size-[130px]"/>
    </div>

  );
}
