/**
 * Utility functions
 */

/**
 * Url encode object
 * @param {Object} params Params to encode
 */
exports.urlEncode = params =>
  Object.keys(params)
    .map(key => {
      return (
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(JSON.stringify(params[key]))
      );
    })
    .join('&');
