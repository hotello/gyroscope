import {
  Dict,
  HooksDict,
  StringsDict,
  FunctionsDict
} from 'meteor/hotello:useful-dicts';

import { config } from './config.js';
import { Permit } from './permit.js';

export const general = new Dict(config.general);
export const permit = new Permit(config.permit);
export const notifications = new FunctionsDict(config.notifications);
export const hooks = new HooksDict();
export const queries = new FunctionsDict(config.queries);
