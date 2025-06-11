const asyncHandler = (requestrHandler)=>async(req , res , next)=>{
       try {
           console.log("I am here");
              await   requestrHandler(req, res , next)
         
          
       } catch (error) {
         res.status(error.code || 500).json({
            success : false,
            message : error.message
         })
       }
}
export {asyncHandler}
// const promiseHandler = (Handler)=>{
//     return (req, res , next)=>{
//         Promise.resolve(Handler(req, res , next)).catch((err)=>next(err))
//     }
// }