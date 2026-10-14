import { BadRequestException } from "../common/exceptions/app.exception.js";

export const validateData = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      throw BadRequestException({
        errmMsg: "Validation failed",
        errors: errors,
      });
    }

    req.body = result.data;
    next();
  };
};
