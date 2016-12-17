import { config } from './config.js';
import { Permit } from './permit.js';
import { Messages } from './messages.js';

export const permit = new Permit(config.permit);
export const messages = new Messages(config.messages);

export const Gyroscope = {
  permit: permit,
  messages: messages
};
