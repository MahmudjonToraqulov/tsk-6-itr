import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserName } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEmpty, setIsEmpty] = useState(false);

  const userName = useSelector((state) => state.users.userName);

  const handleEnter = () => {
    setIsEmpty(true);
    if (userName.trim() !== "") {
      navigate("/boards");
    }
  };

  const handleUserName = (event) => {
    setIsEmpty(false);
    dispatch(setUserName(event.target.value));
  };

  return (
    <div className="h-screen w-full bg-black flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div>
          <input
            className="border border-blue-500 px-4 py-2 mr-12 scale-125	 rounded bg-transparent text-white focus:border-blue-500  focus:outline-blue-500" 
            type="text"
            placeholder="Nickname..."
            value={userName}
            onChange={handleUserName}
          />
          <button
            onClick={handleEnter}
            htmlType="submit"
            className="bg-transparent hover:bg-blue-500 text-blue-700 hover:outline-blue-500 font-semibold hover:text-white py-2 px-4 scale-125 border border-blue-500 hover:border-transparent rounded"
          >
            Enter
          </button>
        </div>
        {isEmpty && <p className="my-2 text-red-700">Please, enter your name! (Not allowed empty!)</p>}
      </div>
    </div>
  );
}
