require('normalize.css/normalize.css');

import React from 'react';
import {
	Link
} from 'react-router-dom';
import Pubsub from 'pubsub-js';


// 单个组件li
class Li extends React.Component {
	// 播放指定音乐
	playMusicClick(item) {
		return function() {
			Pubsub.publish('PLAYMUSICX', item);
		}
	}

	// 删除支付那个音乐
	delClick(item) {
		return function(e) {
			e.preventDefault();
			e.stopPropagation();
			Pubsub.publish('DELETE', item);
		}
	}

	render() {
		return (
			<li className = { `${ this.props.isCurrentItem ? 'current-item' : 'null' }` }
      onClick = { this.playMusicClick(this.props.data) }> 
      {this.props.data.title + '-' + this.props.data.artist} 
      <span className="cross" onClick = { this.delClick(this.props.data) }></span> </li>
		)
	}
}

// 整个表单组件
class List extends React.Component {
	render() {
		let liArr = [],
			musicDatas = this.props.musicDatas;
		musicDatas.forEach(function(e, i) {
			let isCurrentItem = musicDatas.indexOf(this.props.currentMusicItem) == i ? true : false;
			liArr.push(<Li key = { i } data = { e } isCurrentItem = { isCurrentItem }></Li>)
		}.bind(this));

		return (
			<div>
				<ol className="list">
					{liArr}
				</ol>
				<Link to='' className='link'>
					<span className='icon-back'></span><br/>
					<span className='back'>返回</span>
				</Link>
			</div>
		);
	}
}

List.defaultProps = {};

export default List;