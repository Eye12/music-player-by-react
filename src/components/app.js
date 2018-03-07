require('normalize.css/normalize.css');
require('styles/css/app.css');

import React from 'react';

import {
	HashRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import $ from 'jquery';
import 'jplayer';
import Pubsub from 'pubsub-js';


import Header from './header.js';
import Single from './single.js';
import List from './list.js';

let duration;

// 获取音乐数据
let musicDatas = require('../data/musicDatas.json');
musicDatas = (function(arr) {
	for (var i = arr.length - 1; i >= 0; i--) {
		arr[i].imgURL = require('../images/img/' + arr[i].id + '.jpg');
		arr[i].sourceURL = require('../sources/music/' + arr[i].file);
	}
	return arr;
})(musicDatas)

// 主控件
class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentMusicItem: musicDatas[2],
			timing: 0,
			progress: 0,
			volume: 0,
			isPlay: true
		};
	}

	// 播放指定音乐函数
	playMusic(musicItem) {
		$('#player').jPlayer('setMedia', {
			mp3: musicItem.sourceURL
		}).jPlayer('play');
	}

	// 所有组件第一次渲染结束后
	componentDidMount() {
		$('#player').jPlayer({
			supplied: 'mp3',
			wmode: 'window'
		})
		this.playMusic(this.state.currentMusicItem);


		// 音乐准备就绪获取总时长
		$('#player').bind($.jPlayer.event.ready, (e) => {
			duration = e.jPlayer.status.duration;

		})

		// 音乐实时播放更新相关数据
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {
			this.setState({
				timing: Math.round(e.jPlayer.status.currentTime),
				progress: e.jPlayer.status.currentPercentAbsolute,
				volume: e.jPlayer.options.volume
			})
		})

		// 歌曲播放结束自动播放下一曲
		$('#player').bind($.jPlayer.event.ended, (e) => {
			Pubsub.publish('PLAYX', 'next');
		})

		// 播放进度控制
		Pubsub.subscribe('CHANGEPROGRESS', (msg, proportion) => {
			$('#player').jPlayer('play', duration * proportion);
		})

		// 音量控制
		Pubsub.subscribe('CHANGEVOICE', (msg, proportion) => {
			$('#player').jPlayer('volume', proportion);
		})

		// 是否暂停播放
		Pubsub.subscribe('PLAYORPAUSE', (msg, p) => {
			if (p) {
				$('#player').jPlayer('pause');
			} else {
				$('#player').jPlayer('play');
			}
			this.setState({
				isPlay: !this.state.isPlay
			})
		})

		// 播放上一曲或者是下一曲
		Pubsub.subscribe('PLAYX', (msg, p) => {
			let number = musicDatas.indexOf(this.state.currentMusicItem),
				length = musicDatas.length,
				index = null;
			if (p == 'prev') {
				index = (length + number - 1) % length;
			}
			if (p == 'next') {
				index = (number + 1) % length;
			}
			this.setState({
				currentMusicItem: musicDatas[index]
			})
			this.playMusic(this.state.currentMusicItem);

		})

		// 来自List的播放指定音乐
		Pubsub.subscribe('PLAYMUSICX', (msg, item) => {
			this.setState({
				currentMusicItem: item
			})

			this.playMusic(item);
		})


		// 删除指定音乐
		Pubsub.subscribe('DELETE', (msg, item) => {
			musicDatas = musicDatas.filter(function(e) {
				return e !== item;
			})
		});
	}

	render() {
		return (
			<div>
				<div id='player'></div>
				<Header></Header>
				<Router>
					<Switch>
						<Route exact path='/' render = {() => <Single
        timing = { this.state.timing }
        currentMusicItem = { this.state.currentMusicItem }
        progress = { this.state.progress }
        volume = { this.state.volume }
        isPlay = { this.state.isPlay }
        ></Single>}>
        				</Route>
						<Route path='/list' render = {() => <List
        musicDatas = { musicDatas }
        currentMusicItem = { this.state.currentMusicItem }
        ></List>}></Route>
					</Switch>
				</Router>
			</div>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;