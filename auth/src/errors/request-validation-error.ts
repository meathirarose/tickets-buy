import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidatonError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]){
        super('Invalid request parameters!');

        //we are extending a built in class
        Object.setPrototypeOf(this, RequestValidatonError.prototype);
    }
    serializeErrors(){
        return this.errors.map(error => (
            { message: error.msg, field: error.type }
        ));
    }
} 