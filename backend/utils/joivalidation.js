import HandleEror from "./handleError.js";
class JoiValidation {
  constructor(request, schema) {
    this.request = request;
    this.schema = schema;
  }

  validator() {
    const { error } = this.schema.validate(this.request);
    if (error) {
      const message = error.details.map((err) => err.message);
      return new HandleEror(message, 400);
    }
  }
}

export default JoiValidation;
