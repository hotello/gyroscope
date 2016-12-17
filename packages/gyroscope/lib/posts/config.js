import { Gyroscope } from '../core/gyroscope.js';
import { Posts, postsIndex } from './posts.js';

// extend gyroscope with posts variables
Gyroscope.Posts = Posts;
Gyroscope.postsIndex = postsIndex;
