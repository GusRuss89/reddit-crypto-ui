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

	render({ coin, percent }, state) {
		return (
			<Card>
				<Card.Primary>
					<Card.Title large>{coin.name} (<a href={`https://coinmarketcap.com/currencies/${coin.id}`} target="_blank">{coin.symbol}</a>)</Card.Title>
					<Card.Subtitle>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>Market Cap:</strong> {formatter.format(coin.market_cap_usd)}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>CMC Rank:</strong> {coin.rank}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>Post Mentions:</strong> {coin.postMentions}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>Comment Mentions:</strong> {coin.commentMentions}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>Weighted Score:</strong> {coin.totalScore.toFixed(2)}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>1hr:</strong> {this.formatPercent(coin.percent_change_1h)}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>24hr:</strong> {this.formatPercent(coin.percent_change_24h)}</div>
						<div style={{display: 'inline-block', marginRight: '15px' }}><strong>7d:</strong> {this.formatPercent(coin.percent_change_7d)}</div>
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
