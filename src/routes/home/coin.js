import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import List from 'preact-material-components/List';
import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/List/style.css';
import style from './style';

// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 0
});

export default class Coin extends Component {
	constructor (props) {
		super(props);
		this.state = {
			showMentions: false
		};
	}

	formatPercent = (val) => {
		val = parseFloat(val).toFixed(1);
		let colour = 'green'
		if (val < 0) {
			colour = 'red';
		}
		return <span style={{color: colour}}>{val}%</span>;
	}

	compare = (prop) => {
		const { comparison, coin } = this.props;
		if (comparison !== null) {
			let colour = 'inherit';
			let symbol = '';
			let change = parseFloat(coin[prop]) - parseFloat(comparison[prop]);
			change = change.toFixed(0);
			if (change > 0) {
				colour = 'green';
				symbol = '+';
			} else if (change < 0) {
				colour = 'red';
			} else {
				change = '-';
			}
			return <span>{coin[prop].toFixed(0)} (<span style={{color: colour}}>{symbol}{change}</span>)</span>;
		} else {
			return <span>{coin[prop].toFixed(0)}</span>;
		}
	}

	renderTidbit = (key, value) => {
		return <div style={{display: 'inline-block', marginRight: '15px' }}><strong>{key}:</strong> {value}</div>;
	}

	renderPosts = () => {
		return this.props.coin.posts.map(post => (
			<List.LinkItem href={post.url} target="_blank">{post.title}</List.LinkItem>
		));
	}

	renderComments = () => {
		return this.props.coin.comments.map(post => (
			<List.LinkItem href={post.url} target="_blank">{post.title}</List.LinkItem>
		));
	}

	render({ coin, percent, comparison }, state) {
		return (
			<Card>
				<Card.Primary>
					<Card.Title large>{coin.name} (<a href={`https://coinmarketcap.com/currencies/${coin.id}`} target="_blank">{coin.symbol}</a>)</Card.Title>
					<Card.Subtitle>
						{this.renderTidbit('Market Cap', formatter.format(coin.market_cap_usd))}
						{this.renderTidbit('CMC Rank', coin.rank)}
						{this.renderTidbit('1hr', this.formatPercent(coin.percent_change_1h))}
						{this.renderTidbit('24hr', this.formatPercent(coin.percent_change_24h))}
						{this.renderTidbit('7d', this.formatPercent(coin.percent_change_7d))}
						{this.renderTidbit('Post Mentions', this.compare('postMentions'))}
						{this.renderTidbit('Comment Mentions', this.compare('commentMentions'))}
						{this.renderTidbit('Weighted Score', this.compare('totalScore'))}
					</Card.Subtitle>
				</Card.Primary>
				<Card.Media className="card-media">
					<div style={{background: '#EEE', height: '10px', position: 'relative'}}>
						<div style={{position: 'absolute', background: '#3f51b5', left: 0, top: 0, bottom: 0, width: `${percent}%`}} />
					</div>
				</Card.Media>
				{state.showMentions && (
					<Card.SupportingText>
						<List dense style={{border: '1px solid rgba(175,175,175,0.2)'}}>
							<h3 class="mdc-list-group__subheader" style={{marginBottom: '0.4rem'}}>Post Mentions</h3>
							{this.renderPosts(coin)}
							<List.Divider />
							<h3 class="mdc-list-group__subheader" style={{marginBottom: '0.4rem'}}>Comment Mentions</h3>
							{this.renderComments(coin)}
						</List>
					</Card.SupportingText>
				)}
				<Card.Actions>
					<Card.Action onClick={() => this.setState({showMentions: !state.showMentions})}>{state.showMentions ? 'Hide' : 'Show'} Mentions</Card.Action>
				</Card.Actions>
			</Card>
		);
	}
}
