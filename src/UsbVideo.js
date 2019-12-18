import React, { Component } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import MySnackbarContentWrapper from './CustomizedSnackbars'
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';



const styles = theme => ({
    buttonMargin: {
        margin: theme.spacing(1),
    },
    testMargin: {
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
    },
});

class UsbVideo extends Component {
    constructor(props){
        super(props)
        this.state = {
            'usb_1': 0,
            'usb_2': 0,
            'usb_3': 0,
            'usb_loop': 0,
            'isPlaying': "stop",
            'error': true,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.controlUsb = this.controlUsb.bind(this)
    }
    componentDidMount() { // per two second update
        this.timerID = setInterval(
            () => this.pingIP(),
            5000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    pingIP() {
        axios
            .get('http://192.168.50.225:8888/checkUsb')
            .then(response => {
                let data = response.data[0]; // return value is a list
                this.setState({ // every 2 sec setState
                    usb_1: data.usb_1,            
                    usb_2: data.usb_2,
                    usb_3: data.usb_3,
                    usb_loop: data.usb_loop,
                    isPlaying: data.isPlaying,
                    error: data.error
                })
            })
            .catch((error)=>{
                console.log(error);
                this.setState({
                    snackbarOpen: true,
                    snackbarContent: "Fail: cannot conect flask !!",
                    variant: "error"
                })
            })
    }
    controlUsb(index, isOpen){
        if (index === 1){
            axios
                .get("http://192.168.50.218:5000/forcePlayUSB/1")
        }
        else if (index === 2){
            axios
                .get("http://192.168.50.218:5000/forcePlayUSB/2")
        }
        else if (index === 3){
            axios
                .get("http://192.168.50.218:5000/forcePlayUSB/3")
        }
        else if (index === 4){
            axios
                .get("http://192.168.50.218:5000/forcePlayUSB/4")
        }
        else if (index === 5){
            axios
                .get("http://192.168.50.218:5000/playBlackVideo")
        }
        else if (index === 6){
            axios
                .get("http://192.168.50.218:5000/playFinishVideo")
        }
        else if (index === 7){
            axios
                .get("http://192.168.50.218:5000/stopPlaying")
        }
        else if (index === 8){
            axios
                .get("http://192.168.50.218:5000/resetFirstUsb")
        }
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
            <h2>Usb 畫面控制</h2>
            <Paper className={fixedHeightPaper}>
                <div className="usbVideo">
                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlUsb.bind(this, 1)}>
                        Play USB 1 (C)
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlUsb.bind(this, 2)}>
                        Play USB 2 (B)
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlUsb.bind(this, 3)}>
                        Play USB 3 (D)
                    </Button>  
                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlUsb.bind(this, 4)}>
                        Play LOOP
                    </Button>     
                </div>
                <div>
                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlUsb.bind(this, 5)}>
                        播放黑影片
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlUsb.bind(this, 6)}>
                        播放爆炸影片
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlUsb.bind(this, 7)}>
                        停止播放
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlUsb.bind(this, 8)}>
                        清空第一次播放
                    </Button>
                </div>
                <br/>
                <h2 className={classes.testMargin}>Usb 1 (C)：{this.state.usb_1}</h2>
                <h2 className={classes.testMargin}>Usb 2 (B)：{this.state.usb_2}</h2>
                <h2 className={classes.testMargin}>Usb 3 (D)：{this.state.usb_3}</h2>
                <h2 className={classes.testMargin}>Usb Loop：{this.state.usb_loop}</h2>
                <h2 className={classes.testMargin}>現正播放：{this.state.isPlaying}</h2>
                <br/>
                <h2 className={classes.testMargin}>isConnected：{String(!this.state.error)}</h2>
            </Paper>
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

UsbVideo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsbVideo);