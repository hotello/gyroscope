import { CollectionFast } from 'meteor/hotello:collection-fast';

// create collection
export const Categories = new CollectionFast('categories', {
  schema: {
    name: {type: String, max: 100}
  },
  pickForMethods: ['name']
});
