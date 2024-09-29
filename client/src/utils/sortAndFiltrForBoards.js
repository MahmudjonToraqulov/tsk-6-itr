export const sortBoardsByName = (boards, ascending = true) => {
  return [...boards].sort((a, b) => {
    if (ascending) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
};

export const sortBoardsByDate = (boards, ascending = true) => {
  return [...boards].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (ascending) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};

export const filterBoardsByName = (boards, query) => {
  return boards.filter((board) =>
    board.name.toLowerCase().includes(query.toLowerCase())
  );
};
