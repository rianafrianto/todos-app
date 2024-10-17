export const formatResponse = (success, status, data = null, message = null) => {
    return {
      success,
      status,
      data,
      message,
    };
  };