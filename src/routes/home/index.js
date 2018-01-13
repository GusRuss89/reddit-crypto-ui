import { h, Component } from 'preact';
import axios from 'axios';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Rheostat from 'preact-rheostat';
import './rheostat.css';
import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';

import Coin from './coin';
import style from './style';

TimeAgo.locale(en);
const timeAgo = new TimeAgo('en-AU');
const timeAgoStyle = {
	units: ['second', 'minute', 'hour', 'day']
};

export default class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			coins: [],
			minCoinRank: 1,
			maxCoinRank: 200,
			comparisons: [],
			chosenComparison: 0,
			comparison: {},
			loadingComparison: false,
			search: ''
		};
	}

	componentDidMount() {
		axios.get(`./db/db.json`)
			.then(res => {
				this.setState({
					coins: res.data.latest.coins,
					maxScore: res.data.latest.coins[0].totalScore,
					lastUpdated: res.data.latest.date,
					comparisons: res.data.dates
				});
			})
			.catch(err => console.error(new Error('Couldn\'t get JSON')));
	}

	updateComparison = (date) => {
		axios.get(`./db/db-${date}.json`)
			.then(res => {
				this.setState({
					comparison: res.data.latest,
					loadingComparison: false
				});
			})
			.catch(err => console.error(new Error('Couldn\'t get comparison')));
	}

	getCoinComparison = (coin) => {
		if (this.state.comparison.hasOwnProperty('coins')) {
			const filtered = this.state.comparison.coins.filter((cCoin) => cCoin.id === coin.id);
			return filtered.length ? filtered[0] : null;
		} else {
			return null;
		}
	}

	handleSliderUpdate = (data) => {
		this.setState({
			minCoinRank: data.values[0],
			maxCoinRank: data.values[1]
		});
	}

	handleCompareChange = (e) => {
		const comparison = this.state.comparisons[e.selectedIndex-1];
		if (typeof comparison === 'object' && comparison.hasOwnProperty('date')) {
			this.updateComparison(this.state.comparisons[e.selectedIndex-1].date);
			this.setState({
				chosenComparison: e.selectedIndex,
				loadingComparison: true
			});
		} else {
			this.setState({
				comparison: {},
				chosenComparison: e.selectedIndex
			});
		}
	}

	handleSearchUpdate = (e) => {
		this.setState({
			search: e.target.value
		});
	}

	renderCoins = () => this.state.coins.map(coin => {
		// Rank
		if (coin.rank >= this.state.minCoinRank && coin.rank <= this.state.maxCoinRank) {
			// Search
			let search = this.state.search.toUpperCase();
			let name = coin.name.toUpperCase();
			let symbol = coin.symbol.toUpperCase();
			if (search === '' || name.indexOf(search) >= 0 || symbol.indexOf(search) >= 0) {
				return <Coin coin={coin} comparison={this.getCoinComparison(coin)} percent={coin.totalScore / this.state.maxScore * 100} />;
			}
		}
	});

	renderComparisonOptions = () => {
		return this.state.comparisons.map(comparison => <Select.Item>{timeAgo.format(parseInt(comparison.date, 10), timeAgoStyle)}</Select.Item>)
	}

	render(props, state) {
		return (
			<div class={style.home}>
				<h1>Top CryptoCurrencies by Reddit Mentions</h1>
				<p style={{margin: '-8px 0 20px', fontStyle: 'italic'}}>Last updated {timeAgo.format(parseInt(state.lastUpdated, 10), timeAgoStyle)}</p>
				<div class={style.controls}>
					<div class={style.control}>
						<label class={style.label}>Filter</label>
						<TextField value={state.search} placeholder="Search..." onInput={this.handleSearchUpdate} />
					</div>
					<div class={style.control}>
						<label class={style.label}>Compare to previous runs {state.loadingComparison && `(loading...)`}</label>
						<Select _hintText="Compare with"
							selectedIndex={state.chosenComparison}
							onChange={this.handleCompareChange}
						>
							<Select.Item>None</Select.Item>
							{this.renderComparisonOptions()}
						</Select>
					</div>
					<div class={style.control}>
						<label class={style.label}>Include coins ranked: {state.minCoinRank} - {state.maxCoinRank}</label> 
						<Rheostat min={1} max={200} values={[state.minCoinRank, state.maxCoinRank]} snap onValuesUpdated={this.handleSliderUpdate} />
					</div>
				</div>
				{this.renderCoins()}
			</div>
		);
	}
}
