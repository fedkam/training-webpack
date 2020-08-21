import Post from './Post';
import json from './assets/json';
import './styles/styles.css';
import Webpacklogo from './assets/webpack-logo'; // расширение .PNG удален, контролируется из webpack в resolve -> extensions
import xml from './assets/data.xml';
import csv from './assets/data.csv';

const post = new Post('Webpack post title', Webpacklogo);

// console.log('post to string:', post.toString());
// console.log('json:', json);
// console.log('Xml:', xml);
// console.log('Csv:', csv);
