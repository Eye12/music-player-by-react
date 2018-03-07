require('normalize.css/normalize.css');

import React from 'react';
import {
	Link
} from 'react-router-dom';
import Pubsub from 'pubsub-js';

class Single extends React.Component {
	// 播放进度条控制函数
	progressClick(e) {
		let proportion = (e.clientX - this.refs.progressBar.offsetLeft) / this.refs.progressBar.offsetWidth;
		Pubsub.publish('CHANGEPROGRESS', proportion);
	}

	// 音量控制函数
	voiceClick(e) {
		let proportion = ((this.refs.voiceRange.offsetHeight + this.refs.voiceRange.offsetTop) - e.clientY) / this.refs.voiceRange.offsetHeight;
		Pubsub.publish('CHANGEVOICE', proportion);
	}

	// 暂停播放切换函数
	isPlayClick() {
		var p = this.props.isPlay;
		Pubsub.publish('PLAYORPAUSE', p);
	}

	// 播放上或下一曲事件函数
	playClick(p) {
		return function() {
			Pubsub.publish('PLAYX', p);
		}
	}

	render() {
		let styleWidth = {
				width: this.props.progress + '%'
			},
			styleHeight = {
				height: (this.props.volume * 100) + '%'
			},
			isPlayClassName = this.props.isPlay ? 'play' : 'pause',
			munites = Math.floor(this.props.timing / 60),
			seconds = this.props.timing % 60,
			time = munites + ':' + (seconds < 10 ? ('0' + seconds) : seconds);

		return (
			<div className="single">
				<div className="left">
					<ol>
						<li><Link to='/list' className='link-list'>私人音乐坊</Link></li>
						<li className='music-title'>{ this.props.currentMusicItem.title }</li>
						<li className='artist'>{ this.props.currentMusicItem.artist }</li>
						<li className='time-voice'>
							{ time } 
							<span className="voice-img"></span>
							<span className="voice-range" onClick = { this.voiceClick.bind(this) } ref = 'voiceRange'>
								<span className="voice-range-in" style = { styleHeight }></span>
							</span>
						</li>
						<li className='progress-bar' onClick = { this.progressClick.bind(this) } ref = 'progressBar'>
							<span className="progress-in" style = { styleWidth }></span>
						</li>
						<li className='icon-imgs'>
							<img src={ require('../images/icon/arrow-left.png') } alt="icon-arrow" onClick = { this.playClick('prev') }/>
							<span className={ isPlayClassName } onClick = { this.isPlayClick.bind(this) }></span>
							<img src={ require('../images/icon/arrow-right.png') } alt="icon-arrow" onClick = { this.playClick('next') }/>
							<img src={ require('../images/icon/circle.png') } alt="icon-circle" className='icon-circle' />
						</li>
					</ol>
				</div>
				<div className="right">
					<img src={ this.props.currentMusicItem.imgURL } alt="cover-img" className="cover-img"/>
				</div>
			</div>
		);
	}
}

Single.defaultProps = {};

export default Single;