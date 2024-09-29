import axios from "axios";

export const fetchBoards = (setData, setIsLoading) => {
  setIsLoading(true);
  axios
    .get("https://tsk-6-itr-2.onrender.com/api/boards")
    .then((response) => {
      setData(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error", error);
    });
};

export const addNewBoard = (
  boards,
  setBoards,
  setNewBoardName,
  newBoardName
) => {
  axios
    .post("https://tsk-6-itr-2.onrender.com/boards", {
      name: newBoardName,
    })
    .then((response) => {
      setBoards([...boards, response.data]);
      setNewBoardName("");
    })
    .catch((error) => {
      console.error("Error set new board:", error.response.data);
    });
};
