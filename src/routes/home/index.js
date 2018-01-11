import { h, Component } from 'preact';
import axios from 'axios';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import Coin from './coin';
import style from './style';

TimeAgo.locale(en);
const timeAgo = new TimeAgo('en-AU');

export default class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			coins: []
		};
	}

	componentDidMount() {
		axios.get(`./db/db.json`)
			.then(res => {
				this.setState({
					coins: res.data.dates[0].coins,
					maxScore: res.data.dates[0].coins[0].totalScore,
					lastUpdated: res.data.dates[0].date
				});
			})
			.catch(err => console.error(new Error('Couldn\'t get JSON')));
	}

	renderCoins = () => this.state.coins.map(coin => <Coin coin={coin} percent={coin.totalScore / this.state.maxScore * 100} />);

	render() {
		return (
			<div class={style.home}>
				<h1>Top CryptoCurrencies by Reddit Mentions</h1>
				<p style={{margin: '-8px 0 20px'}}>Last updated {timeAgo.format(parseInt(this.state.lastUpdated, 10))}</p>
				{this.renderCoins()}
			</div>
		);
	}
}
