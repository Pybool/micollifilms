const filterById = (arr, id) => {
  return arr?.find((item) => item?.id === id);
};

const data = {filterById };

module.exports = data;