export function paginate(list, { pageSize, page }) {
  const listPage = list.slice(pageSize * (page - 1), pageSize * page)
  const hasMorePages = pageSize * page < list.length

  const data = {
    list: listPage,
    page,
    hasMorePages,
  }
  return data
}
