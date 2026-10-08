export function BadRequestException({
  errmMsg = "Bad Request exception",
  cause = { statusCode: 400 },
} = {}) {
  throw new Error(errmMsg, { cause });
}
export function conflictException({
  errmMsg = "Conflict",
  cause = { statusCode: 409 },
} = {}) {
  throw new Error(errmMsg, { cause });
}
export function notFoundException({
  errmMsg = "Not found",
  cause = { statusCode: 404 },
} = {}) {
  throw new Error(errmMsg, { cause });
}
