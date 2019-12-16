import React, { Component } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MySnackbarContentWrapper from './CustomizedSnackbars'
import { Link } from 'react-router-dom';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import ReplayIcon from '@material-ui/icons/Replay';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import FastForwardIcon from '@material-ui/icons/FastForward';

import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import SyncIcon from '@material-ui/icons/Sync';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import {
    Tab,
    Tabs,
    Fab,
    Box,
    Typography,
    Snackbar,
    Paper,
    TextField,
    IconButton,
    Button,
    LinearProgress,
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

const PlayBar = withStyles({
    root: {
        height: 5,
        backgroundColor: '#68fa6a',
    },
    bar: {
        backgroundColor: '#227c23',
    },
})(LinearProgress);

const PauseBar = withStyles({
    root: {
        height: 5,
        backgroundColor: '#fda548',
    },
    bar: {
        backgroundColor: '#e48119',
    },
})(LinearProgress);

const StopBar = withStyles({
    root: {
        height: 5,
        backgroundColor: '#fc5151',
    },
    bar: {
        backgroundColor: '#c22a2a',
    },
})(LinearProgress);

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
    paperIsPlaying: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        backgroundColor: "#68fa6a",
    },
    paperIsPauseing: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        backgroundColor: "#fda548",
    },
    paperIsStoping: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        backgroundColor: "#fc5151",
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
        flexDirection: "row",
    },
    paperColumn: {
        padding: theme.spacing(2),
    },
    textField: {                                   
        marginLeft: theme.spacing(2),       // textfile style
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        fontSize: "20px",
        width: 400,
    },
    textFieldMargin: {
        marginBottom: theme.spacing(2),
    },
    textRight: {
        "marginLeft": "auto",
        "padding": theme.spacing(2.5),
    },
    deleteIcon: {
        "marginLeft": "auto",
    },
    startButton: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: "#fff",
        backgroundColor: "#339933",
        "&:hover": {
            backgroundColor: "#267326"
        },
    },
    pauseButton: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: "#fff",
        backgroundColor: "#ff944d",
        "&:hover": {
            backgroundColor: "#e65c00"
        },
    },
    stopButton: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: "#fff",
        backgroundColor: "#ff3333",
        "&:hover": {
            backgroundColor: "#e60000"
        },
    },
    otherButton: {
        color: "#fff",
        backgroundColor: "#2273B3",
        "&:hover": {
            backgroundColor: "#114570"
        },
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    upButton: {
        position: "fixed",
        bottom: 40,
        right: 40,
    },
    playerMargin: {
        marginLeft: theme.spacing(5),
        display: "flex",
        flexDirection: "row",
    },
    textFieldDivMargin: {
        marginTop: theme.spacing(5),
        display: "flex",
        flexDirection: "row",
    },
});
class ScrollButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalId: 0
        };
    }
    
    scrollStep() {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }
    
    scrollToTop() {
        let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
        this.setState({ intervalId: intervalId });
    }
    
    render () {
        const { classes } = this.props;
        return (
            <Fab 
                aria-label="FastForward" 
                style={{
                    position: "fixed",
                    bottom: 40,
                    right: 40,
                }} 
                onClick={() => { this.scrollToTop() }}>
                <ExpandLessIcon/>
            </Fab>
        )
     }
} 

class AudioControl extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabValue: 0,            // tab index value
            songList: [],
            playNowIndex: 0,        // play now index
            isStopState: false,
            nowProgress: 0,         // player position
            textfieldText: "",    // tab text
            sync: true,             // is sync

            isReplayDisable: true,
            isPauseDisable: false,
            isStopDisable: false,

            error: true,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        // Textfield
        this.focusTextInput = this.focusTextInput.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this)
        // Sound function
        this.soundStop = this.soundStop.bind(this)
        this.loopSoundStop = this.loopSoundStop.bind(this)
        this.soundPower = this.soundPower.bind(this)
        this.soundRFID = this.soundRFID.bind(this)
        this.soundDrawer = this.soundDrawer.bind(this)
        this.soundWireBox = this.soundWireBox.bind(this)
        this.soundEnterAlert = this.soundEnterAlert.bind(this)
        this.soundNoise = this.soundNoise.bind(this)
        this.soundNineBox = this.soundNineBox.bind(this)
        this.soundDefeated = this.soundDefeated.bind(this)
        this.deleteSong = this.deleteSong.bind(this)
        this.handlePlayer = this.handlePlayer.bind(this)
    }
    handleTabChange(event, newValue){
        this.setState({
            tabValue: newValue,
        })
    };
    soundStop(){
        axios
            .get('http://192.168.50.210:5000/stopPlayingSound')
    }
    loopSoundStop(){
        axios
            .get('http://192.168.50.210:5000/stopLoopPlayer')
    }
    soundPower(){
        axios
            .get('http://192.168.50.210:5000/playFirstRoomPowerOn')
    }
    soundRFID(){
        axios
            .get('http://192.168.50.210:5000/playFirstRoomRFID')
    }
    soundDrawer(){
        axios
            .get('http://192.168.50.210:5000/playSecondRoomDrawerOpen')
    }
    soundWireBox(){
        axios
            .get('http://192.168.50.210:5000/playSecondRoomWireBox')
    }
    soundEnterAlert(){
        axios
            .get('http://192.168.50.210:5000/playThirdRoomAlert')
    }
    soundNoise(){
        axios
            .get('http://192.168.50.210:5000/playStartAnnoyingSound')
    }
    soundNineBox(){
        axios
            .get('http://192.168.50.210:5000/playThirdRoomNineBoxScan')
    }
    soundDefeated(){
        axios
            .get('http://192.168.50.210:5000/playThirdRoomAIDefeated')
    }
    componentDidMount() { // per two second update
        // this.timerID = setInterval(
        //     () => this.pingIP(),
        //     2000
        // );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    // pingIP() {
    //     axios
    //         .get('http://192.168.50.225:8888/checkYoutubeSongList')
    //         .then(response => {
    //             let data = response.data
    //             this.setState({
    //                 // songList: data
    //                 songLIst: []
    //             })
    //         })
    //         .catch(error => {
    //             this.setState({
    //                 songList: []
    //             })
    //             console.log(error)
    //         })
    //     axios
    //         .get('http://192.168.50.225:8888/checkSongIndex')
    //         .then(response => {
    //             let data = response.data
    //             this.setState({
    //                 playNowIndex: data[0].playNowIndex,
    //                 isStopState: data[0].isStopState,
    //                 nowProgress: data[0].nowProgress,
    //             })
    //         })
    //         .catch(error => {
    //             this.setState({
    //                 songList: []
    //             })
    //             console.log(error)
    //         })
    // }
    handleTextFieldChange(e){                           // handle submit add songList
        this.setState({
            textfieldText: e.target.value
        });
    }
    focusTextInput(e) {                      // handle the textfield text to button
        this.setState({
            textfieldText: e.target.value
        })
        this.downloadYoutubeDL(this.state.textfieldText)
        this.setState({
            textfieldText: ""
        })
    }
    downloadYoutubeDL(ytWebsite){
        let videoURL = ""
        try{
            let url = new URL(ytWebsite)
            let params = url.searchParams;
            for (let pair of params.entries()) {
                if (pair[0] === "v"){
                    videoURL = pair[1]
                }
                if (pair[0] === "list"){
                    console.log("Cannot Enter List!")
                }
            }
        }
        catch(e){
            console.log(e)
        }
        axios
            .get('http://192.168.50.225:8888/downloadYoutubeSongList/' + videoURL)
    }
    deleteSong(index){
        axios
            .get('http://192.168.50.225:8888/deleteYoutubeSongList/' + String(index))
    }
    deleteAllSongs(){
        axios
            .get('http://192.168.50.225:8888/deleteAllSongList')
    }
    handlePlayer(isPlayer, songIndex){
        if (isPlayer === 0){
            axios
                .get('http://192.168.50.225:8888/restartPlaying')
            this.setState({
                isReplayDisable: true,
                isPauseDisable: false,
            })
        }
        if (isPlayer === 1){
            axios
                .get('http://192.168.50.225:8888/nextSongIndex/' + String(songIndex))
            axios
                .get('http://192.168.50.225:8888/startPlaying/' + String(songIndex))
            this.setState({
                isReplayDisable: true,
                isPauseDisable: false,
            })
        }
        if (isPlayer === 2){
            axios
                .get('http://192.168.50.225:8888/pausePlaying')
            this.setState({
                isReplayDisable: false,
                isPauseDisable: true,
            })
        }
        if (isPlayer === 3){
            axios
                .get('http://192.168.50.225:8888/stopPlaying')
            this.setState({
                isReplayDisable: true,
                isPauseDisable: true,
            })
        }
        if (isPlayer === 4){
            axios
                .get('http://192.168.50.225:8888/stopContinue')
        }
        if (isPlayer === 5){
            axios
                .get('http://192.168.50.225:8888/stopContinue')
        }
        if (isPlayer === 6){
            axios
                .get('http://192.168.50.210:5000/changeVolume/0')
        }
        if (isPlayer === 7){
            axios
                .get('http://192.168.50.210:5000/changeVolume/1')
        }
        if (isPlayer === 8){
            axios
                .get('http://192.168.50.210:5000/changeVolume/2')
        }
        if (isPlayer === 9){
            if (this.state.sync === true){
                this.setState({
                    sync: false,
                })
                axios
                    .get('http://192.168.50.225:8888/stopContinue')
            }
            else if (this.state.sync === false){
                this.setState({
                    sync: true,
                })
                axios
                    .get('http://192.168.50.225:8888/startContinue')
            }
            
        }
    }
    scrollToTop(){
        console.log("scroll?")
        window.scroll(100, 100)
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
      const fixedHeightPaperPlaying = clsx(classes.paperIsPlaying, classes.fixedHeight);
      const fixedHeightPaperPauseing = clsx(classes.paperIsPauseing, classes.fixedHeight);
      const fixedHeightPaperStoping = clsx(classes.paperIsStoping, classes.fixedHeight);

      return (
        <div>
            <h2>音效控制</h2>
            <Paper className={classes.root}>
                <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab to="/audio/one" component={Link} label="第一間房間音效" className={classes.tabText} />
                    <Tab to="/audio/two" component={Link} label="第二間房間音效" className={classes.tabText} />
                    <Tab to="/audio/three" component={Link} label="第三間房間音效" className={classes.tabText} />
                    <Tab to="/audio/four" component={Link} label="背影音樂" className={classes.tabText} />
                    <Tab to="/audio/five" component={Link} label="Youtube" className={classes.tabText} />
                </Tabs>
            </Paper>
            <TabPanel value={this.state.tabValue} index={0}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>開總電源音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundPower}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div> 
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>RFID 解鎖音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundRFID}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div>
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>抽屜解鎖音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundDrawer}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>接線盒解鎖音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundWireBox}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div>    
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>警告音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundEnterAlert}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>房間底噪音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundNoise}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.loopSoundStop}>
                            Close Sound
                        </Button>
                    </div>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>九宮格音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundNineBox}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>AI 打敗音效</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.soundDefeated}>
                            Open Sound
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.soundStop}>
                            Close Sound
                        </Button>
                    </div>
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={3}>
                <Paper className={fixedHeightPaper}>
                    
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={4}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>Youtube 播放器</h2>
                    <div>
                        <div className={classes.TimeText}>
                            <div className={classes.TimeText}>
                                <Fab aria-label="start" disabled={this.state.isReplayDisable} className={classes.startButton} onClick={this.handlePlayer.bind(this, 0)}>
                                      <ReplayIcon/>
                                </Fab>
                                <Fab aria-label="pause" disabled={this.state.isPauseDisable} className={classes.pauseButton} onClick={this.handlePlayer.bind(this, 2)}>
                                      <PauseIcon/>
                                </Fab>
                                <Fab aria-label="refresh" disabled={this.state.isStopDisable} className={classes.stopButton} onClick={this.handlePlayer.bind(this, 3)}>
                                      <StopIcon/>
                                </Fab>
                            </div>
                            <div className={classes.playerMargin}>
                                <Fab aria-label="FastRewind" className={classes.otherButton} onClick={this.handlePlayer.bind(this, 4)}>
                                      <FastRewindIcon/>
                                </Fab>
                                <Fab aria-label="FastForward" className={classes.otherButton} onClick={this.handlePlayer.bind(this, 5)}>
                                      <FastForwardIcon/>
                                </Fab>
                            </div>
                            <div className={classes.playerMargin}>
                                <Fab aria-label="FastRewind" className={classes.startButton} onClick={this.handlePlayer.bind(this, 6)}>
                                      <VolumeDownIcon/>
                                </Fab>
                                <Fab aria-label="FastForward" className={classes.pauseButton} onClick={this.handlePlayer.bind(this, 7)}>
                                      <VolumeUpIcon/>
                                </Fab>
                                <Fab aria-label="FastForward" className={classes.stopButton} onClick={this.handlePlayer.bind(this, 8)}>
                                      <VolumeOffIcon/>
                                </Fab>
                            </div>
                            <div className={classes.playerMargin}>
                                <Fab aria-label="FastRewind" className={classes.otherButton} onClick={this.handlePlayer.bind(this, 9)}>
                                      {this.state.sync ? <SyncIcon /> : <SyncDisabledIcon />}
                                </Fab>
                            </div>
                        </div>
                        <div className={classes.textFieldDivMargin}>
                            <TextField
                                    id="songList"
                                    label="Enter youtube website"
                                    className={classes.textField}
                                    margin="normal"
                                    value={this.state.textfieldText}
                                    onChange={(e) => this.handleTextFieldChange(e)}
                                />
                            <Fab color="primary" aria-label="send" onClick={(e) => this.focusTextInput(e)}>
                                <SendIcon/>
                            </Fab>
                            <Fab aria-label="delete" className={classes.deleteIcon} onClick={this.deleteAllSongs}>
                                <DeleteIcon/>
                            </Fab>
                        </div>
                    </div>
                </Paper>
                <br/>
                {this.state.songList.map(list => (
                    <div>
                        {(() => {
                            if (list.index == this.state.playNowIndex) {
                                if (this.state.isStopState == 2){
                                    return (
                                        <Paper className={fixedHeightPaperStoping}>
                                            <div className={classes.TimeText}>
                                                <h2 key={list.index} className={classes.textMargin}>{list.index} : {list.songName}</h2>
                                                <IconButton aria-label="close" onClick={this.handlePlayer.bind(this, 1, list.index)}>
                                                    <PlayArrowIcon/>
                                                </IconButton>
                                                <IconButton aria-label="close" className={classes.textRight} onClick={this.deleteSong.bind(this, list.index)}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </div>
                                            <StopBar
                                                variant="determinate"
                                                color="secondary"
                                                value={this.state.nowProgress}
                                            />   
                                        </Paper>
                                    )
                                }
                                else if (this.state.isStopState == 1){            
                                    return (
                                        <Paper className={fixedHeightPaperPauseing}>
                                            <div className={classes.TimeText}>
                                                <h2 key={list.index} className={classes.textMargin}>{list.index} : {list.songName}</h2>
                                                <IconButton aria-label="close" onClick={this.handlePlayer.bind(this, 1, list.index)}>
                                                    <PlayArrowIcon/>
                                                </IconButton>
                                                <IconButton aria-label="close" className={classes.textRight} onClick={this.deleteSong.bind(this, list.index)}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </div>
                                            <PauseBar
                                                variant="determinate"
                                                color="secondary"
                                                value={this.state.nowProgress}
                                            />                                        
                                        </Paper>
                                    )
                                }
                                else if (this.state.isStopState == 0){
                                    return (
                                        <Paper className={fixedHeightPaperPlaying}>
                                            <div className={classes.TimeText}>
                                                <h2 key={list.index} className={classes.textMargin}>{list.index} : {list.songName}</h2>
                                                <IconButton aria-label="close" onClick={this.handlePlayer.bind(this, 1, list.index)}>
                                                    <PlayArrowIcon/>
                                                </IconButton>
                                                <IconButton aria-label="close" className={classes.textRight} onClick={this.deleteSong.bind(this, list.index)}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </div>
                                            <PlayBar
                                                variant="determinate"
                                                color="secondary"
                                                value={this.state.nowProgress}
                                            />
                                        </Paper>
                                    )
                                }
                            } else {
                                return (
                                    <Paper className={fixedHeightPaper}>
                                        <div className={classes.TimeText}>
                                            <h2 key={list.index} className={classes.textMargin}>{list.index} : {list.songName}</h2>
                                            <IconButton aria-label="close" onClick={this.handlePlayer.bind(this, 1, list.index)}>
                                                <PlayArrowIcon/>
                                            </IconButton>
                                            <IconButton aria-label="close" className={classes.textRight} onClick={this.deleteSong.bind(this, list.index)}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </div>
                                    </Paper>
                                )
                            }
                        })()}
                        <br/>
                    </div>
                ))}
                <ScrollButton scrollStepInPx="50" delayInMs="16.66"/>
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

AudioControl.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AudioControl);