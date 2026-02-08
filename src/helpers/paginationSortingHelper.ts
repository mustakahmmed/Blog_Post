
type IOptions ={
    page?:number | string,
    limit?:number | string,
    sortBy?: string,
    sortOrder?:string
}
type IOptionsResults = {
    page:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder:string
}

function paginationSortingHelper(options: IOptions):IOptionsResults {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || "createdAt"
    const sortOrder = options.sortOrder || "desc"
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}
export default paginationSortingHelper;