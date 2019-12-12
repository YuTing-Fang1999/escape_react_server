import React, { Component } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// icon
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ErrorIcon from '@material-ui/icons/Error';

import MainListItems from './MainListItems';
import Notifications from './Notifications';
import TimeCounter from './TimeCounter'


import {
  AppBar,
  Button,
  Grid,
  Link,
  Drawer,
  Container,
  Divider,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, 
} from "@material-ui/core";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://192.168.50.225:8888">
        NCHU_420 team
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    marginLeft: 8,
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
});

class DashboardTemplates extends Component {

  constructor(props){
      super(props)
      this.state = {
          drawerList: true,
          helpPop: false,
      }
      this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
      this.handleDrawerClose = this.handleDrawerClose.bind(this);
      this.handleHelpOpen = this.handleHelpOpen.bind(this);
      this.handleHelpClose = this.handleHelpClose.bind(this);
  }
  componentDidMount() { // per two second update
      axios
        .get('http://192.168.50.225:8888/checkMenuList/2')
        .then(response => {
            this.setState({ // every 2 sec setState
                drawerList: response.data[0].open,
            })
        })
      this.timerID = setInterval(
        () => this.pingIP(),
        3000
      );
  }
  pingIP(){
      axios
        .get('http://192.168.50.225:8888/checkPlayerHelp')
        .then(response => {
            this.setState({ // every 2 sec setState
                helpPop: response.data[0].playerHelp,
            })
            // console.log(String(this.state.helpPop))
        })
  }

  handleDrawerOpen(){
    axios
      .get('http://192.168.50.225:8888/checkMenuList/1')
      .then(response => {
          this.setState({ // every 2 sec setState
              drawerList: response.data[0].open,
          })
      })
  };
  handleDrawerClose(){
    axios
      .get('http://192.168.50.225:8888/checkMenuList/0')
      .then(response => {
          this.setState({ // every 2 sec setState
              drawerList: response.data[0].open,
          })
      })
  };
  handleHelpOpen(){
      this.setState({
          helpPop: true,
      })
  };

  handleHelpClose(){
      this.setState({
          helpPop: false,
      })
      axios
        .get('http://192.168.50.225:8888/clearPlayerHelp')
  };
  render(){
  
    // style
    const { classes } = this.props;
  
    return(    
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, this.state.drawerList && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(classes.menuButton, this.state.drawerList && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              密室脫逃 server 控制主畫面
            </Typography>
            <TimeCounter/>
            <Notifications/>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !this.state.drawerList && classes.drawerPaperClose),
          }}
          open={this.state.drawerList}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <MainListItems/>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={8}>
                <Grid item xs={12} md={12} lg={12}>          
                  <div>
                    {this.props.page}
                  </div>
                </Grid>
              </Grid>
            </Container>
          <Copyright />
        </main>

        <Dialog
          open={this.state.helpPop}
          onClose={this.handleHelpClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"突發狀況！"}</DialogTitle>
          <DialogContent>
            <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;玩家發出求救訊息！！！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleHelpClose} color="primary">
              收到！
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  } 
}

DashboardTemplates.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardTemplates);