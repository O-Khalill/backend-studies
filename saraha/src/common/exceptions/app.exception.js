export function BadRequestException({
  errmMsg = "Bad Request exception",
  errors = null,
} = {}) {
  const cause = { statusCode: 400, errors };
  throw new Error(errmMsg, { cause });
}

export function conflictException({
  errmMsg = "Conflict",
  errors = null,
} = {}) {
  const cause = { statusCode: 409, errors };
  throw new Error(errmMsg, { cause });
}

export function notFoundException({
  errmMsg = "Not found",
  errors = null,
} = {}) {
  const cause = { statusCode: 404, errors };
  throw new Error(errmMsg, { cause });
}
