import { h, Component } from 'preact';
import { route } from 'preact-router';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
// import style from './style';

export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
		this.state = {
			darkThemeEnabled: false
		};
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openDialog = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');

	toggleDarkTheme = () => {
		this.setState(
			{
				darkThemeEnabled: !this.state.darkThemeEnabled
			},
			() => {
				if (this.state.darkThemeEnabled) {
					document.body.classList.add('mdc-theme--dark');
				}
				else {
					document.body.classList.remove('mdc-theme--dark');
				}
			}
		);
	}

	render() {
		return (
			<div>
				<Toolbar className="toolbar">
					<Toolbar.Row>
						<Toolbar.Section align-start>
							<Toolbar.Icon menu onClick={this.openDrawer}>
								menu
							</Toolbar.Icon>
							<Toolbar.Title>Reddit CryptoCurrency Monitor</Toolbar.Title>
						</Toolbar.Section>
						<Toolbar.Section align-end>
							<div style="margin-right: 15px;">
								Dark theme &nbsp; <Switch onClick={this.toggleDarkTheme} />
							</div>
						</Toolbar.Section>
					</Toolbar.Row>
				</Toolbar>
				<Drawer.TemporaryDrawer ref={this.drawerRef}>
					<Drawer.TemporaryDrawerContent>
						<List>
							<List.LinkItem href="https://github.com/GusRuss89/reddit-crypto-ui" target="_blank">
								<List.ItemIcon>tv</List.ItemIcon>
								Front end code
							</List.LinkItem>
							<List.LinkItem href="https://github.com/GusRuss89/reddit-crypto-monitor" target="_blank">
								<List.ItemIcon>code</List.ItemIcon>
								Back end code
							</List.LinkItem>
							<List.LinkItem onClick={this.openDialog}>
								<List.ItemIcon>attach_money</List.ItemIcon>
								Donate
							</List.LinkItem>
						</List>
					</Drawer.TemporaryDrawerContent>
				</Drawer.TemporaryDrawer>
				<Dialog ref={this.dialogRef}>
					<Dialog.Header>Donate</Dialog.Header>
					<Dialog.Body>
						<ul>
							<li>XRB: xrb_3ceqsfona5a9usuwpfyd9m36ibmdk7r97ajf7cmkwbhu69nsnabus86fhyp5</li>
							<li>BTC: 18MmG36SM77uUvkSrsjhnTiZS46nuiq1qz</li>
							<li>ETH: 0x11249fC1D239ac9c624765e0EDF20f2Bc7dd3F3d</li>
						</ul>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept>Done</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
