import { config } from './config.js';
import { Dict } from './dict.js';
import { StringsDict } from './strings-dict.js';
import { FunctionsDict } from './functions-dict.js';
import { Permit } from './permit.js';

export const general = new Dict(config.general);
export const permit = new Permit(config.permit);
export const messages = new StringsDict(config.messages);
export const notifications = new FunctionsDict(config.notifications);
