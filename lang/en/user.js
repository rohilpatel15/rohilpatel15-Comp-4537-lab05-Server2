module.exports = class messages{
    constructor() {
      this.msg = {
        '404': 'Error: 404 Not Found',
        'invalid_query': 'Error: Invalid query',
        'forbidden_query_get': 'Error: Cannot execute queries other than SELECT queries in a GET request',
        'forbidden_query_post': 'Error: Cannot execute queries other than INSERT queries in a POST request',
        'inserted': 'Success: %num% row inserted successfully',
      };
    }
    error() {
      return this.msg['404'];
    }
    invalid_query() {
      return this.msg['invalid_query'];
    }
    forbidden_query_get() {
      return this.msg['forbidden_query_get'];
    }
    forbidden_query_post() {
      return this.msg['forbidden_query_post'];
    }
    inserted(num) {
      return this.msg['inserted'].replace('%num%', num);
    }
  };