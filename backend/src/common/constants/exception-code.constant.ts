export const ExceptionCode = {
    UNKNOWN_ERROR: { code: 1000, msg: "Unknown error" },
    VALIDATION_ERROR: { code: 1001, msg: "Validation failed" },
    NOT_FOUND: { code: 1002, msg: "Resource not found" },
    UNAUTHORIZED: { code: 1003, msg: "Unauthorized access" },
    FORBIDDEN: { code: 1004, msg: "Forbidden access" },
    CONFLICT: { code: 1005, msg: "Conflict error" },
    BAD_REQUEST: { code: 1006, msg: "Bad request" },
    INTERNAL_SERVER_ERROR: { code: 1007, msg: "Internal server error" },

    INVALID_PASSWORD: { code: 1008, msg: "Password is incorrect" },
    ACCESS_DENIED: { code: 1009, msg: "Access denied" },
    TOKEN_FAILED: { code: 4000, msg: "Token validation failed" },
    HASHING_FAILED: { code: 4001, msg: "Hashing failed" },
} as const;
