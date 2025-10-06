const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((rr) => next(err))
    }
    
}

export {asyncHandler}





// const asyncHandler = () => {}
// const asyncHandler = (func) => ()=> {}
// const asyncHandler = (func) => async () => {} #for async function

// const asyncHandler = (func) => async (req, res, next) => {
//     try {
//         await func(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
        
//     }
// }
