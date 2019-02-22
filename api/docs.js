// Document symbols for jsdoc

/**
 * Represents a set of structured data, called records.
 * @interface Model
 * @see {@link https://sailsjs.com/documentation/concepts/models-and-orm/models|Sails Concepts}
 * @see {@link https://sailsjs.com/documentation/reference/waterline-orm/models|Sails Reference}
 */

/**
 * Provides an opportunity for a model to customize a newly populated record.
 * After populating a record, the <code><a href="global.html#sails.helpers.populateOne">populateOne</a></code> 
 * function will call this function if the record's model has defined it.
 * @function afterPopulateOne
 * @argument {Record} record - The record that has just been populated.
 * @memberof Model
 * @async
 * @public
 */
 
/**
 * A uniquely identifiable object that corresponds 1-to-1 with a physical database entry.
 * @interface Record
 * @see {@link https://sailsjs.com/documentation/concepts/models-and-orm/records|Sails Concepts}
 * @see {@link https://sailsjs.com/documentation/reference/waterline-orm/records|Sails Reference}
 */

/**
 * A dictionary of request-handling actions. 
 * @interface Controller
 * @see {@link https://sailsjs.com/documentation/concepts/actions-and-controllers#?controllers|Sails Concepts}
 */

/** 
 * Represents the HTTP request, with properties for the query string, parameters, body, HTTP headers, and so on.
 * @external Request 
 * @see {@link https://sailsjs.com/documentation/reference/request-req|Sails Reference}
 * @see {@link http://expressjs.com/en/4x/api.html#req|Express API Reference}
 */

/** 
 * Represents the HTTP response that an Express app sends when it gets an HTTP request. 
 * @external Response
 * @see {@link https://sailsjs.com/documentation/reference/response-res|Sails Reference}
 * @see {@link http://expressjs.com/en/4x/api.html#res|Express API Reference}
 */
