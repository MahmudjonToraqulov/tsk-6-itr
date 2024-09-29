import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { fetchBoards, addNewBoard } from "../api/fetchBoards";
import Loader from "../components/Loader";
import EmptyData from "../components/EmptyData";
import { useSelector } from "react-redux";
import BoardItem from "../components/BoardList/BoardItem";
import {
  sortBoardsByName,
  filterBoardsByName,
} from "../utils/sortAndFiltrForBoards";
import { Link } from "react-router-dom";

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state) => state.users.userName);

  useEffect(() => {
    fetchBoards(setBoards, setIsLoading);
  }, []);

  const handleAddBoard = (event) => {
    event.preventDefault();
    addNewBoard(boards, setBoards, setNewBoardName, newBoardName);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedAndFilteredBoards = filterBoardsByName(boards, searchQuery);
  const currentItems = sortedAndFilteredBoards.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItems = sortedAndFilteredBoards.length;

  const sortBoardsAZ = () => {
    const sortedBoardsAZ = sortBoardsByName(boards);
    setBoards(sortedBoardsAZ);
  };

  const sortBoardsZA = () => {
    const sortedBoardsZA = sortBoardsByName(boards, false);
    setBoards(sortedBoardsZA);
  };

  return (
    <div className="container mx-auto min-h-screen flex flex-col flex-wrap px-3 sm:px-0">
        <Link to={`/`} className="text-2xl text-blue-600 mt-3">
          Home
        </Link>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
        <p className="mt-2 text-lg">
          Hello {" "}
          <span className="text-blue-800 font-semibold text-xl mr-auto sm:mr-0">
            {user}
          </span>
        </p>
      </div>

      <div className="flex flex-col h-screen flex-1">
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex mt-5 mb-5">
            <form onSubmit={handleAddBoard}>
              <div className="flex gap-3 wrap">
                <input
                  className="border border-blue-500 px-4 py-2 rounded bg-transparent  focus:outline-blue-500"
                  type="text"
                  value={newBoardName}
                  onChange={(event) => setNewBoardName(event.target.value)}
                  placeholder="Board name..."
                />
                <button
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded  hover:outline-blue-500"
                  htmlType="submit"
                >
                  Add board
                </button>
              </div>
            </form>
          </div>

          <div className="flex mt-5 mb-5 items-center">
              <button className="mr-3 size-lg border border-blue-500 px-4 py-2 hover:outline-blue-500" onClick={sortBoardsAZ} title="A to Z">
                A - Z
              </button>
              <button className="mr-3 size-lg border border-blue-500 px-4 py-2 hover:outline-blue-500" onClick={sortBoardsZA} title="Z to A">
                Z - A
              </button>
              <input
                className="border border-blue-500 px-4 py-2  rounded bg-transparent focus:outline-blue-500"
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search boards"
              />
          </div>
        </div>

        {isLoading && <Loader />}

        {!isLoading && currentItems.length === 0 && boards.length > 0 && (
          <EmptyData />
        )}

        {currentItems.length > 0 && (
          <div className=" flex flex-col flex-1 justify-between">
            <div className="flex flex-col flex-1 h-full ">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
                {currentItems.map((board, index) => (
                  <BoardItem key={board._id} board={board} index={index} />
                ))}
              </div>
            </div>

            {!isLoading && (
              <div className="flex m-auto my-5">
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  pageSize={itemsPerPage}
                  onChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}

        {!isLoading && currentItems.length === 0 && boards.length === 0 && (
          <EmptyData />
        )}
      </div>
    </div>
  );
};

export default BoardListPage;
