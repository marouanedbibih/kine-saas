class RequestHelpers {
  /**
   * Helper method to properly serialize query parameters
   * @param params Query parameters to serialize
   * @returns Serialized query parameters
   */
  serializeQueryParams(params: Record<string, any>): Record<string, string> {
    const serialized: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          serialized[key] = JSON.stringify(value);
        } else {
          serialized[key] = String(value);
        }
      }
    });

    return serialized;
  }
}

export default RequestHelpers;
