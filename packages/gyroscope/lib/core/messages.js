export class Messages {
  /**
   * Sets up the messages dictionary
   * @param {Object} messages key/value pairs for the messages dictionary
   */
  constructor(messages) {
    this.messages = {};

    this._setMessages(messages);
  }

  /**
   * Set messages in the dictionary
   * @param {Object} messages key/value pairs for the messages dictionary
   */
  setMessages(messages) {
    this._setMessages(messages);
  }

  /**
   * Get a String from the messages dictionary
   * @param {String} key name of the message
   * @return {String} message found
   */
  get(key) {
    if (!_.isString(key)) throw new Error('messages.get: must provide a String.');
    return this.messages[key];
  }

  // set messages in the internal messages dict
  _setMessages(messages) {
    if (_.isObject(messages)) {
      // check for non strings
      this._checkMessages(messages);
      _.extend(this.messages, messages);
    } else {
      throw new Error('messages.setMessages: must provide an object.');
    }
  }

  // check if we have only strings
  _checkMessages(messages) {
    _.each(_.values(messages), (message) => {
      if (!_.isString(message)) {
        throw new Error('messages.setMessages: must provide only strings as values.');
      }
    });
  }
}
