
const Error = (error_id, cause, status) => {
    return {
        error_id: error_id,
        cause: cause,
        status: status
    }
}
 
module.exports =  {
    Error
}