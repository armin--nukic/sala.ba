import { ApiError } from "./errors.js";

export function routeParam(value: string | string[] | undefined, name: string) {
  if (!value || Array.isArray(value)) throw new ApiError(400, `Invalid ${name}`);
  return value;
}
