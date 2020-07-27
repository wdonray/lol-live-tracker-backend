const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const response = (statusCode: number, body: {}) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

export const success = (body: {}) => response(200, body);

export const failure = (body, {}) => response(500, body);
