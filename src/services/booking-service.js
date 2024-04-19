const axios= require("axios");

const { BookingRepository }= require("../repository/index");
const { FLIGHT_SERVICE_PATH }= require('../config/serverconfig');
const { ServiceError } = require("../utils/errors");

class BookingService{
    constructor(){
        this.bookingRepository= new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId= data.flightId;
            const getFlightRequestURL= `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData= response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError("Something went wrong in booking process", "Insufficient seats");
            }
            const totalCost= priceOfTheFlight* data.noOfSeats;
            const bookingPayload=  { ...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateflightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateflightRequestUrl,{
                totalSeats: flightData.totalSeats- data.noOfSeats
            });
            const finalBooking = await this.bookingRepository.update(booking.id, {status:"Booked"});
            return finalBooking;
         
        } catch (error) {
            console.log(error);
            if(error.name == "RepositoryError" || error.name == "ValiadtionError"){
                throw error;
            }
            throw new ServiceError();
        }
        
    }
}

module.exports= BookingService;