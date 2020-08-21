import Post from './Post';
import json from './assets/json';
import './styles/styles.css';
import Webpacklogo from './assets/webpack-logo.png';

const post = new Post('Webpack post title', Webpacklogo);

console.log('post to string:', post.toString());
console.log('json:', json);