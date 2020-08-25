import * as $ from 'jquery';
import Post from '@models/Post'; // настройка путей в resolve -> alias
import json from './assets/json';
import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';
import Webpacklogo from './assets/webpack-logo'; // расширение .PNG удален, контролируется из webpack в resolve -> extensions
import xml from './assets/data.xml';
import csv from './assets/data.csv';

const post = new Post('Webpack post title', Webpacklogo);

$('pre').html(post.toString()); //вставка в тег <pre> значение

// console.log('post to string:', post.toString());
// console.log('json:', json);
// console.log('Xml:', xml);
// console.log('Csv:', csv);
