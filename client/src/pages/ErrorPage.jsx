import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-screnn h-screen flex flex-col justify-center items-center">
      <h2 className="text-2xl text-blue-600">Page not found...</h2> 
      <button
        onClick={goBack}
        className="bg-transparent hover:bg-blue-500 text-blue-700 hover:outline-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 mt-2 hover:border-transparent rounded"
        htmlType="submit"
      >
        Back
      </button>
    </div>
  );
}
