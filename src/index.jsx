import * as $ from 'jquery';
import Post from '@models/Post'; // настройка путей в resolve -> alias
import json from './assets/json';
import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';
import Webpacklogo from './assets/webpack-logo'; // расширение .PNG удален, контролируется из webpack в resolve -> extensions
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import './babel-example';
import React from 'react';
import { render } from 'react-dom';

const post = new Post('Webpack post title', Webpacklogo);
$('pre').html(post.toString()); //вставка в тег <pre> значение



// console.log('post to string:', post.toString());
// console.log('json:', json);
// console.log('Xml:', xml);
// console.log('Csv:', csv);


//React
const App = () => (
    <div className="container">
        <h1>Training</h1>
        <hr />
        <div className="logo" />
        <hr />
        <pre></pre>
        <hr />
        <div className="boxLess">
            <h2>Less</h2>
        </div>
        <hr />
        <div className="boxScss">
            <h2>Scss</h2>
        </div>
    </div>
);
render(<App />, document.getElementById('app'))