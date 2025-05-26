const asyncHandler = (requestrHandler)=>async(req , res , next)=>{
       try {
           await   requestrHandler(req, res , next)
       } catch (error) {
         res.status(err.code || 500).json({
            success : false,
            message : err.message
         })
       }
}
export {asyncHandler}
// const promiseHandler = (Handler)=>{
//     return (req, res , next)=>{
//         Promise.resolve(Handler(req, res , next)).catch((err)=>next(err))
//     }
// }