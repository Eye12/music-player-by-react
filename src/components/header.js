require('normalize.css/normalize.css');

import React from 'react';


class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<img className='icon-img' src={ require('../images/icon/music.png') } alt="icon-music"/>
				<span className='words' >Music Player</span>
			</div>
		);
	}
}

Header.defaultProps = {};

export default Header;