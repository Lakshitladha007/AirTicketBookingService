const { StatusCodes } = require("http-status-codes");

const { BookingService }= require("../services/index");

const { createChannel, publishMessage } = require("../utils/messgaeQueue");
const { REMINDER_BINDING_KEY }= require("../config/serverconfig");

const bookingService = new BookingService();

class BookingController{

    constructor(){
    }

    async sendMessageToQueue(req, res){
          const channel = await createChannel();
          const data = {messgae:'SUCCESS'};
          publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
          console.log("hello");
          return res.status(200).json({
            message: 'Successfully published the event'
          });
    }

    async create (req, res){
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: "Successfully completed booking",
                success: true,
                err:{},
                data: response  
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: true,
                err: error.explaination,
                data: {}
            })
        }
    }
}


module.exports={
    BookingController
}