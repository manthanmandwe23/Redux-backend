//When a child class extends a parent class, you use super(...) to call the parent's constructor, and you pass the arguments that the parent constructor needs.
//so basically when we extend a class like apierror extends error so here whatever paramter is passed inside constructore of error class we need to pass that parameter inside super while using it in child class
//here statuscode and success is the extra property we are adding it is not coming from Error class its like adds our own extra information.

// Object.setPrototypeOf(this, ApiError.prototype)  it make sure that objected created should always be of type apierror
//Object.setPrototypeOf(this, ApiError.prototype) makes sure the current object inherits from ApiError.prototype, so JavaScript correctly recognizes it as an ApiError.
class ApiError extends Error {
  statusCode: number;
  success: boolean;
  constructor(statusCode: number, message = "something went wrong") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError