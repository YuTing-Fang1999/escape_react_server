import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MySnackbarContentWrapper from './CustomizedSnackbars'
import Snackbar from '@material-ui/core/Snackbar';
import MainStepper from './Stepper/MainStepper'
import SaveVideo from './SaveVideo'

const styles = theme => ({
    buttonMargin: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(3),
        color: "#ffffff",
        backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
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

class Dashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            progress: 0,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.handleResetAllButton = this.handleResetAllButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleResetDataButton = this.handleResetDataButton.bind(this)
    }
    componentDidMount() { 

    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    handleResetButton(room){
        axios
            .get('http://192.168.50.225:8888/resetRoomState/' + String(room))
            if(room==1){
                axios
                    .get('http://192.168.50.213:5000/playBlackVideo')
            }
            if(room==2){
                axios
                    .get('http://192.168.50.214:5000/playBlackVideo')
                axios
                    .get('http://192.168.50.215:5000/playBlackVideo')
                axios
                    .get('http://192.168.50.216:5000/playBlackVideo')
            }
            if(room==3){
                axios
                    .get('http://192.168.50.212:5000/playBlackVideo')

                axios
                    .get('http://192.168.50.217:5000/playBlackVideo')
                axios
                    .get('http://192.168.50.218:5000/usb/4/1')
            }
    }
    handleResetAllButton(){
        axios
            .get('http://192.168.50.225:8888/resetALLState')
    }
    handleResetDataButton(index){
        if (index == 0){
            axios
                .get('http://192.168.50.225:8888/resetALLDataState')
        }
        else if (index == 1){
            axios
                .get('http://192.168.50.225:8888/resetPhoneState')
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
            <h2>密室主監控畫面</h2>
            <Paper className={fixedHeightPaper}>
                <MainStepper/>
            </Paper>
            <br/>
            <Paper className={fixedHeightPaper}>
                <div>
                    <Button className={classes.buttonMargin} variant="contained" onClick={this.handleResetButton.bind(this, 3)}>
                        重新設定第三間房間
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" onClick={this.handleResetButton.bind(this, 2)}>
                        重新設定第二間房間
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" onClick={this.handleResetButton.bind(this, 1)}>
                        重新設定第一間房間
                    </Button>
                </div>
                <br/>
                <div>
                    <Button className={classes.buttonMargin} variant="contained" onClick={this.handleResetDataButton.bind(this, 0)}>
                        重設機關資料庫
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" onClick={this.handleResetDataButton.bind(this, 1)}>
                        重設手機資料庫
                    </Button>
                </div>
                <br/>
                <div>
                    <Button className={classes.buttonMargin} variant="contained" onClick={this.handleResetAllButton}>
                        重新設定所有伺服器(危險！)
                    </Button>
                </div>
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
            <SaveVideo/>
        </div>
      );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);