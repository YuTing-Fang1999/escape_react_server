import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MySnackbarContentWrapper from './CustomizedSnackbars'
import Snackbar from '@material-ui/core/Snackbar';


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

class OpenDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dock_1: {}, // define a empty json
            dock_2: {},
            dock_3: {},
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.controlDock = this.controlDock.bind(this);
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
            .get('http://192.168.50.225:8888/checkDrawer')
            .then(response => {
                let data = response.data    ; // return value is a list
                this.setState({ // every 2 sec setState
                    dock_1: data[0],            // data[0] -> 192.168.50.40's json
                    dock_2: data[1],
                    dock_3: data[2],
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
    controlDock(ip, isOpen) {
        axios
            .get('http://192.168.50.225:8888/openDrawer/' + String(ip) + '/' + String(isOpen))
            .then(response => {
                this.setState({

                })
            })
    }
    // Snackbar close here
    snackClose(){
        this.setState({
            snackbarOpen: false
        });
    }
    render() {
        const { classes } = this.props;
        const { dock_1, dock_2, dock_3 } = this.state
        const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

        if (!dock_1) {
            return (
                <React.Fragment>
                    <h1>Loading ...</h1>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <h2>抽屜控制</h2>
                    <Paper className={fixedHeightPaper}>
                        <h2 className={classes.testMargin}>D (手寫辦視)</h2>
                        <div className="dock_1">
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlDock.bind(this, 40, 1)}>
                                Open Drawer 1
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlDock.bind(this, 40, 0)}>
                                Close Drawer 1
                            </Button> 
                        </div>
                        <div className="return_json">
                            <h2 className={classes.testMargin}>name/IP： {dock_1.name}/{dock_1.ip}</h2>
                            <h2 className={classes.testMargin}>open： {dock_1.variables && dock_1.variables.lock}</h2>
                            <h2 className={classes.testMargin}>isConnected： {String(!dock_1.error)}</h2>
                        </div>
                    </Paper>
                    <br/>    
                    <Paper className={fixedHeightPaper}>
                        <h2 className={classes.testMargin}>B (棺材)</h2>
                        <div className="dock_2">
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlDock.bind(this, 41, 1)}>
                                Open Drawer 2
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlDock.bind(this, 41, 0)}>
                                Close Drawer 2
                            </Button> 
                        </div>
                        <div className="return_json">
                            <h2 className={classes.testMargin}>name/IP： {dock_2.name}/{dock_2.ip}</h2>
                            <h2 className={classes.testMargin}>open： {dock_2.variables && dock_2.variables.lock}</h2>
                            <h2 className={classes.testMargin}>isConnected： {String(!dock_2.error)}</h2>
                        </div>
                    </Paper>
                    <br/>
                    <Paper className={fixedHeightPaper}>
                        <h2 className={classes.testMargin}>C (計算機)</h2>
                        <div className="dock_3">
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlDock.bind(this, 42, 1)}>
                                Open Drawer 3
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlDock.bind(this, 42, 0)}>
                                Close Drawer 3
                            </Button> 
                        </div>
                        <div className="return_json">
                            <h2 className={classes.testMargin}>name/IP： {dock_3.name}/{dock_3.ip}</h2>
                            <h2 className={classes.testMargin}>open： {dock_3.variables && dock_3.variables.lock}</h2>
                            <h2 className={classes.testMargin}>isConnected： {String(!dock_3.error)}</h2>
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
            </React.Fragment>
        );
    }
}

OpenDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenDrawer);