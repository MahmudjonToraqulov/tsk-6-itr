import axios from "axios";

export const fetchBoards = (setData, setIsLoading) => {
  setIsLoading(true);
  axios
    .get("http://localhost:8000/api/boards")
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
    .post("http://localhost:8000/api/boards", {
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
