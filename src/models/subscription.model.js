import mongoose, {model, Schema} from "mongoose";

const SubscriptionModel =  new Schema({
     subscriber : {
         type : Schema.Types.ObjectId,
         ref : "User"
     },
     channel :{
       type  : Schema.Types.ObjectId,
        ref : "User"
     }
}
    ,{timestamps : true})

export const Subcription = model('Subcription', SubscriptionModel)