import { config } from './config.js';
import { Permit } from './permit.js';
import { Messages } from './messages.js';

export const Gyroscope = {
  permit: new Permit(config.permit),
  messages: new Messages(config.messages)
};
