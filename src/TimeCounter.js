import React, { Component } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    Popover,
    Fab,
    Typography,
    Menu,
    TextField,
} from "@material-ui/core";

// icon
import AlarmIcon from '@material-ui/icons/Alarm';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import SendIcon from '@material-ui/icons/Send';

const styles = theme => ({
    timeButton:{
        padding: theme.spacing(2),
        borderRadius: "20px",
        marginRight: 30,
    },
    title: {
        marginLeft: 8,
        flexGrow: 1,
    },
    headerMenu: {                             // Menu style
        marginTop: theme.spacing(7),
    },
    headerMenuList: {
        display: "flex",
        flexDirection: "column",
    },
    remainTime: {
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection: "column",
        marginTop: theme.spacing(1),        
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    remainTimeText: {
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection: "row",
        marginTop: theme.spacing(3),        
    },
    TimeText: {
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection: "row",
        padding: theme.spacing(2),
    },
    headerClearButton: {                       // Menu button style
        marginTop: theme.spacing(1),        
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5),
        marginBottom: theme.spacing(1),
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
    refreshButton: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: "#fff",
        backgroundColor: "#ff3333",
        "&:hover": {
            backgroundColor: "#e60000"
        },
    },
    popoverText: {                       // popover style
        padding: theme.spacing(3),
    },
    textField: {
        marginLeft: theme.spacing(2),       // textfile style
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: 150,
    },
});

class TimeCounter extends Component {
    constructor(props){
        super(props)
        this.state = {
            timeNow: {},
            textfieldText: null,
            timeMenu: null,
            anchorElAdd: null,
            anchorElSub: null,
        }
        this.handletimeMenuClose = this.handletimeMenuClose.bind(this)
        this.handleAnchorElAddClose = this.handleAnchorElAddClose.bind(this)
        this.handleAnchorElSubClose = this.handleAnchorElSubClose.bind(this)
        this.focusTextInput = this.focusTextInput.bind(this);
        this.handleCounterButton = this.handleCounterButton.bind(this)      // handle button
        this.handleAddButton = this.handleAddButton.bind(this)
        this.handleSubButton = this.handleSubButton.bind(this)
    }
    componentDidMount() { // per two second update
        this.timerID = setInterval(
            () => this.pingIP(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    pingIP() {
        axios
            .get('http://192.168.50.225:8888/checkTimeNow')
            .then(response => {
                let data = response.data
                this.setState({
                    timeNow: data[0]
                })
            })
            .catch((error)=>{

            })
    }
    handletimeMenuClose(){                  // handle button/fab close
        this.setState({ 
            timeMenu: null,
        });
    };
    handleAnchorElAddClose() {
        this.setState({
            anchorElAdd: null,
        });
    };
    handleAnchorElSubClose() {
        this.setState({
            anchorElSub: null,
        });
    };
    handleTextFieldChange(e){
        this.setState({
            textfieldText: e.target.value
        });
    }
    focusTextInput(e, operator) {                      // handle the textfield text to button
        this.setState({
            textfieldText: e.target.value
        })
        this.handleCounterButton(operator, this.state.textfieldText)
    }
    handleCounterButton(index, adjustTime) {
        axios
            .get('http://192.168.50.225:8888/checkTimeCounter/' + index + '/' + adjustTime)
            .then(response => {
                
            })
            .catch((error)=>{

            })
    }
    handleAddButton(event){
        this.setState({ // every 2 sec setState
            anchorElAdd: event.currentTarget,
        })
    }
    handleSubButton(event){
        this.setState({ // every 2 sec setState
            anchorElSub: event.currentTarget,
        })
    }
    displayTime(){
        if (this.state.timeNow.countdown_num !== 1){
            return this.state.timeNow.countdown_num + " min"
        }
        else{
            return this.state.timeNow.countdown_sec + " sec"
        }
    }
    isPlaying(isPlaying){
        if (isPlaying === 1){
            return <PlayArrowIcon />
        }
        else if (isPlaying === 0){
            return <PauseIcon />
        }
    }

    render() {
        const { classes } = this.props;
        const idAdd = Boolean(this.state.anchorElAdd) ? 'popoverAdd' : undefined;
        const idSub = Boolean(this.state.anchorElSub) ? 'popoverSub' : undefined;
        const isConnected = this.state.timeNow.error ? 'isConnected false' : undefined;

        return (
            <div>
                <Button 
                    color="inherit" 
                    className={classes.timeButton}
                    aria-controls="time-menu"
                    onClick={e => {
                        this.setState({ // every 2 sec setState
                            timeMenu: e.currentTarget,
                        })
                    }}
                >
                  <AlarmIcon/>
                  <Typography variant="h5" color="inherit" className={classes.title}>
                        {this.displayTime()}
                  </Typography>
                </Button>
                <Menu
                    id="time-menu"
                    anchorEl={this.state.timeMenu}
                    open={Boolean(this.state.timeMenu)}
                    onClose={this.handletimeMenuClose}
                    MenuListProps={{ className: classes.headerMenuList }}
                    className={classes.headerMenu}
                    classes={{ paper: classes.profileMenu }}
                    PaperProps={{
                        style: {
                            maxHeight: 800,
                        },
                    }}
                    disableAutoFocusItem
                >
                    <div className={classes.remainTimeText}>
                        <Typography variant="h5" weight="bold">
                            遊玩時間剩下
                        </Typography>
                    </div>
                    <div className={classes.remainTime}>
                        <Typography variant="h3" weight="medium">
                            {this.displayTime()}
                        </Typography>    
                    </div>
                    <div className={classes.remainTime}>
                        {this.isPlaying(this.state.timeNow.countdown_run)}
                    </div>
                    <div className={classes.TimeText}>
                        <Fab aria-label="start" className={classes.startButton} onClick={this.handleCounterButton.bind(this, 2, 0)}>
                              <PlayArrowIcon/>
                        </Fab>
                        <Fab aria-label="pause" className={classes.pauseButton} onClick={this.handleCounterButton.bind(this, 3, 0)}>
                              <PauseIcon/>
                        </Fab>
                        <Fab aria-label="refresh" className={classes.refreshButton} onClick={this.handleCounterButton.bind(this, 4, 0)}>
                              <RefreshIcon/>
                        </Fab>
                    </div>
                    <div className={classes.TimeText}>
                        <Fab color="primary" variant="extended" aria-label="like" onClick={this.handleCounterButton.bind(this, 1, 5)}>
                              + 5 min
                        </Fab>
                    </div>
                    <div className={classes.TimeText}> 
                        <Fab color="secondary" variant="extended" aria-label="like" onClick={this.handleCounterButton.bind(this, 0, 5)}>
                              - 5 min
                        </Fab>
                    </div>
                    <div className={classes.TimeText}>
                        <Fab 
                            aria-describedby={idAdd}
                            color="primary" 
                            variant="extended" 
                            aria-label="like"  
                            onClick={this.handleAddButton}
                        >
                              + ? min
                        </Fab>
                    </div>
                    <div className={classes.TimeText}> 
                        <Fab 
                            aria-describedby={idSub}
                            color="secondary" 
                            variant="extended" 
                            aria-label="like"  
                            onClick={this.handleSubButton}
                        >
                              - ? min
                        </Fab>
                    </div>
                    <div className={classes.TimeText}>
                        <Typography>
                            {isConnected}
                        </Typography>
                    </div>
                    <Popover
                        id={idAdd}
                        open={Boolean(this.state.anchorElAdd)}
                        anchorEl={this.state.anchorElAdd}
                        onClose={this.handleAnchorElAddClose.bind()}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                        }}
                          transformOrigin={{
                            vertical: 'center',
                            horizontal: 'right',
                        }}
                    >
                        <div className={classes.TimeText}>
                            <TextField
                                id="add"
                                label="Add Times"
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                variant="outlined"
                                value={this.state.textfieldText}
                                onChange={(e) => this.handleTextFieldChange(e)}
                            />
                            <Fab color="primary" aria-label="send" onClick={(e) => this.focusTextInput(e, 1)}>
                                <SendIcon/>
                            </Fab>
                        </div>
                    </Popover>
                    <Popover
                        id={idSub}
                        open={Boolean(this.state.anchorElSub)}
                        anchorEl={this.state.anchorElSub}
                        onClose={this.handleAnchorElSubClose.bind()}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                        }}
                          transformOrigin={{
                            vertical: 'center',
                            horizontal: 'right',
                        }}
                    >
                        <div className={classes.TimeText}>
                            <TextField
                                id="sub"
                                color="secondary"
                                label="Sub Times"
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                variant="outlined"
                                value={this.state.textfieldText}
                                onChange={(e) => this.handleTextFieldChange(e)}
                            />
                            <Fab color="secondary" aria-label="send" onClick={(e) => this.focusTextInput(e, 0)}>
                                <SendIcon/>
                            </Fab>
                        </div>
                    </Popover>
                </Menu>
            </div>
        );
    }
}

TimeCounter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimeCounter);