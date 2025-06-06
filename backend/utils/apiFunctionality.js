class APIFunctionality {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keywordFilter = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    const categoryFilter = this.queryString.category
      ? {
          category: {
            $regex: this.queryString.category,
            $options: "i",
          },
        }
      : {};

    const finalFilter = { ...keywordFilter, ...categoryFilter };

    this.query = this.query.find(finalFilter);
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };
    const removeFilters = ["keyword", "page", "limit"];
    removeFilters.forEach((key) => delete queryCopy[key]);
    this.query = this.query.find(queryCopy);
    return this;
  }
  pagination(resultPerPage) {
    const current_page = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (current_page - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default APIFunctionality;
