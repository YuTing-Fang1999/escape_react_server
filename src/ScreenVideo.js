import React, { Component } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MySnackbarContentWrapper from './CustomizedSnackbars'
import { Link } from 'react-router-dom';

import {
    Tab,
    Tabs,
    Box,
    Typography,
    Snackbar,
    Paper,
    Button,
} from "@material-ui/core";


function TabPanel(props) {                                  // define tabpanel
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(4),
    },
    buttonMargin: {
        margin: theme.spacing(1),
    },
    textMargin: {
        margin: theme.spacing(2),
    },
    paper: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        height: 'auto',
        padding: theme.spacing(2),
    },
    tabText: {                          // Tab text
        fontSize: "20px",
        padding: theme.spacing(2),
    },
    TimeText: {
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection: "row",
    },
    paperColumn: {
        padding: theme.spacing(2),
    },
});

class ScreenVideo extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabValue: 0,            // tab index value
            allScreenState: [],
            error: true,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handlePlayVideoButton = this.handlePlayVideoButton.bind(this)
        this.handlePlayBlackVideoButton = this.handlePlayBlackVideoButton.bind(this)
        this.handleStopPlayButton = this.handleStopPlayButton.bind(this)
    }
    componentDidMount() { // per two second update
        this.timerID = setInterval(
            () => this.pingIP(),
            2000
        );
    }
    pingIP() {
        axios
            .get('http://192.168.50.225:8888/checkAllScreenState')
            .then(response => {
                let data = response.data
                this.setState({
                    allScreenState: data
                })
            })
    }
    handleTabChange(event, newValue){
        this.setState({
            tabValue: newValue,
        })
    };
    handlePlayVideoButton(videoIP){
        axios
            .get('http://192.168.50.' + String(videoIP) + ':5000/playVideo')
    }
    handlePlayBlackVideoButton(videoIP){
        axios
            .get('http://192.168.50.' + String(videoIP) + ':5000/playBlackVideo')
    }
    handleStopPlayButton(videoIP){
        axios
            .get('http://192.168.50.' + String(videoIP) + ':5000/stopVideo')
    }
    // Snackbar close here
    snackClose(){
        this.setState({
            snackbarOpen: false
        });
    }
    render() {
      const { classes } = this.props;
      const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      return (
        <div>
            <h2>螢幕影片控制頁面</h2>
            <Paper className={classes.root}>
                <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab to="/screen/one" component={Link} label="第一間房間螢幕" className={classes.tabText} />
                    <Tab to="/screen/two" component={Link} label="第二間房間螢幕" className={classes.tabText} />
                    <Tab to="/screen/three" component={Link} label="第三間房間螢幕" className={classes.tabText} />
                </Tabs>
            </Paper>
            <TabPanel value={this.state.tabValue} index={0}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>第一間螢幕(暫定)</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handlePlayVideoButton.bind(this, 213)}>
                            播放影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handlePlayBlackVideoButton.bind(this, 213)}>
                            播放黑影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleStopPlayButton.bind(this, 213)}>
                            停止播放
                        </Button>
                        <h2 className={classes.textMargin}>目前正在播：{this.state.allScreenState[0] && this.state.allScreenState[0].isPlaying}</h2>
                        <h2 className={classes.textMargin}>isConnected：{String(this.state.allScreenState[0] && this.state.allScreenState[0].isConnect)}</h2>
                    </div> 
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>第二間螢幕 B (暫定)</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handlePlayVideoButton.bind(this, 214)}>
                            播放影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handlePlayBlackVideoButton.bind(this, 214)}>
                            播放黑影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleStopPlayButton.bind(this, 214)}>
                            停止播放
                        </Button>
                        <h2 className={classes.textMargin}>目前正在播：{this.state.allScreenState[1] && this.state.allScreenState[1].isPlaying}</h2>
                        <h2 className={classes.textMargin}>isConnected：{String(this.state.allScreenState[1] && this.state.allScreenState[1].isConnect)}</h2>
                    </div> 
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>第二間螢幕 C (暫定)</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handlePlayVideoButton.bind(this, 215)}>
                            播放影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handlePlayBlackVideoButton.bind(this, 215)}>
                            播放黑影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleStopPlayButton.bind(this, 215)}>
                            停止播放
                        </Button>
                        <h2 className={classes.textMargin}>目前正在播：{this.state.allScreenState[2] && this.state.allScreenState[2].isPlaying}</h2>
                        <h2 className={classes.textMargin}>isConnected：{String(this.state.allScreenState[2] && this.state.allScreenState[2].isConnect)}</h2>
                    </div> 
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>第二間螢幕 D (暫定)</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handlePlayVideoButton.bind(this, 216)}>
                            播放影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handlePlayBlackVideoButton.bind(this, 216)}>
                            播放黑影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleStopPlayButton.bind(this, 216)}>
                            停止播放
                        </Button>
                        <h2 className={classes.textMargin}>目前正在播：{this.state.allScreenState[3] && this.state.allScreenState[3].isPlaying}</h2>
                        <h2 className={classes.textMargin}>isConnected：{String(this.state.allScreenState[3] && this.state.allScreenState[3].isConnect)}</h2>
                    </div> 
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>第三間螢幕 (暫定)</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handlePlayVideoButton.bind(this, 217)}>
                            播放影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handlePlayBlackVideoButton.bind(this, 217)}>
                            播放黑影片
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleStopPlayButton.bind(this, 217)}>
                            停止播放
                        </Button>
                        <h2 className={classes.textMargin}>目前正在播：{this.state.allScreenState[4] && this.state.allScreenState[4].isPlaying}</h2>
                        <h2 className={classes.textMargin}>isConnected：{String(this.state.allScreenState[4] && this.state.allScreenState[4].isConnect)}</h2>
                    </div> 
                </Paper>
            </TabPanel>

            <Snackbar
                anchorOrigin = {{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open = {this.state.snackbarOpen}
                autoHideDuration = {1000}
                onClose = {this.snackClose.bind(this)}
                ContentProps = {{
                  'aria-describedby': 'message-id',
                }}
            >
            <MySnackbarContentWrapper
                onClose={this.snackClose.bind(this)}
                variant={this.state.variant}
                message={<span id="message-id">{this.state.snackbarContent}</span>}
            />
            </Snackbar>
        </div>
      );
    }
}

ScreenVideo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScreenVideo);