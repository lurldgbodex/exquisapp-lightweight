export class ApiError extends Error {
    status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  }
  
  export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
      this.name = 'UnauthorizedError';
    }
  }
  
  export class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
      super(message, 404);
      this.name = 'NotFoundError';
    }
  }