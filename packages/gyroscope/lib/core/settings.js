import { config } from './config.js';
import { StringsDict } from './strings-dict.js';
import { FunctionsDict } from './functions-dict.js';
import { Permit } from './permit.js';

export const permit = new Permit(config.permit);
export const messages = new StringsDict(config.messages);
export const notifications = new FunctionsDict(config.notifications);
