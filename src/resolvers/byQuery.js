
/**
 * Returns boolean determining whether a post should 
 * be filtered by a given query string argument
 * 
 * @param {String} query
 * @param {String[]} fields  
 */
 const byQuery = ({ query, fields }) => {
  const lowerCaseQuery = query.toLowerCase()

  return fields.some(
    (field => field.toLowerCase().includes(lowerCaseQuery))
  )
}

export { byQuery }
