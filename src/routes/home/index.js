import { h, Component } from 'preact';
import axios from 'axios';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Rheostat from 'preact-rheostat';
import './rheostat.css';

import Coin from './coin';
import style from './style';

TimeAgo.locale(en);
const timeAgo = new TimeAgo('en-AU');

export default class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			coins: [],
			minCoinRank: 1,
			maxCoinRank: 200
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

	handleSliderUpdate = (data) => {
		this.setState({
			minCoinRank: data.values[0],
			maxCoinRank: data.values[1]
		});
	}

	renderCoins = () => this.state.coins.map(coin => {
		if (coin.rank >= this.state.minCoinRank && coin.rank <= this.state.maxCoinRank) {
			return <Coin coin={coin} percent={coin.totalScore / this.state.maxScore * 100} />;
		}
	});

	render(props, state) {
		return (
			<div class={style.home}>
				<h1>Top CryptoCurrencies by Reddit Mentions</h1>
				<p style={{margin: '-8px 0 20px'}}>Last updated {timeAgo.format(parseInt(state.lastUpdated, 10))}</p>
				<div style={{display: 'inline-block', width: '100%', maxWidth: '400px'}}>
					<div>Include coins ranked: {state.minCoinRank} - {state.maxCoinRank}</div> 
					<Rheostat min={1} max={200} values={[1, 200]} snap onValuesUpdated={this.handleSliderUpdate} />
				</div>
				<br style={{clear: 'both'}} />
				{this.renderCoins()}
			</div>
		);
	}
}
