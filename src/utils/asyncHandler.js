// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

const asyncHandler = (reqHnadler) => {
    return (req, res, next) => {
        Promise.resolve(reqHnadler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler };