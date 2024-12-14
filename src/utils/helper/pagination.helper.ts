export function generateMeta(totalData, page, perPage) {
  let countTotalPage = 1;
  if (totalData < perPage && page == 1) {
    countTotalPage = 1
  } else {
    countTotalPage = Math.round(totalData / perPage)
  }
  return {
    currentPage: page,
    perPage,
    totalData,
    totalPage: countTotalPage
  }
}