
export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
export const COMMON_HEADERS = ["Authorization", "Content-Type", "Accept", "User-Agent", "Cache-Control", "Origin", "X-API-Key", "X-Auth-Token"];
export const COMMON_VALUES = ["application/json", "application/xml", "application/x-www-form-urlencoded", "Bearer <token>", "no-cache"];
export const methodStyles = { GET: "text-green-600", POST: "text-blue-600", PUT: "text-orange-500", PATCH: "text-yellow-600", DELETE: "text-red-600"};
export const STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];
export const URLS = ['http://localhost:9090/proxy','http://localhost:9090/apimock'];