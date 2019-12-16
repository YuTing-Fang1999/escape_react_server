import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
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

class OpenDoor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            door_1: {}, // define a empty json
            door_2: {},
            door_3: {},
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.controlDoor = this.controlDoor.bind(this);
        this.controlOnlyDoor = this.controlOnlyDoor.bind(this);
    }
    componentDidMount() { // per two second update
        this.timerID = setInterval(
            () => this.pingIP(),
            2000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    pingIP() {
        axios
            .get('http://192.168.50.225:8888/checkDoor')
            .then(response => {
                let data = response.data; // return value is a list
                this.setState({ // every 2 sec setState
                    door_1: data[0],            // data[0] -> 192.168.50.40's json
                    door_2: data[1],
                    door_3: data[2],
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
    controlDoor(ip, isOpen) {
        axios
            .get('http://192.168.50.225:8888/openDoor/' + String(ip) + '/' + String(isOpen))
            .then(response => {
                // this.setState({

                // })
            })
    }
    controlOnlyDoor(ip, isOpen) {
        axios
            .get('http://192.168.50.225:8888/openOnlyDoor/' + String(ip) + '/' + String(isOpen))
            .then(response => {
                // this.setState({

                // })
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
        const { door_1, door_2, door_3 } = this.state
        const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

        if (!door_1) {
            return (
                <React.Fragment>
                    <h1>Loading ...</h1>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <h2>機關門控制</h2>
                    <Paper className={fixedHeightPaper}>
                        <div className="door_1">
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlDoor.bind(this, 45, 1)}>
                                Open Door 1
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlDoor.bind(this, 45, 0)}>
                                Close Door 1
                            </Button> 
                            <br></br>
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlOnlyDoor.bind(this, 45, 1)}>
                                ONLY Open Door 1
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlOnlyDoor.bind(this, 45, 0)}>
                                ONLY Close Door 1
                            </Button> 
                        </div>
                        <div className="return_json">
                            <h2 className={classes.testMargin}>name/IP： {door_1.name}/{door_1.ip}</h2>
                            <h2 className={classes.testMargin}>lock： {door_1.variables && door_1.variables.lock}</h2>
                            <h2 className={classes.testMargin}>isConnected： {String(!door_1.error)}</h2>
                        </div>
                    </Paper>
                    <br/>    
                    <Paper className={fixedHeightPaper}>
                        <div className="door_2">
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlDoor.bind(this, 46, 1)}>
                                Open Door 2
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlDoor.bind(this, 46, 0)}>
                                Close Door 2
                            </Button> 
                            <br></br>
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlOnlyDoor.bind(this, 46, 1)}>
                                ONLY Open Door 2
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlOnlyDoor.bind(this, 46, 0)}>
                                ONLY Close Door 2
                            </Button> 
                        </div>
                        <div className="return_json">
                            <h2 className={classes.testMargin}>name/IP： {door_2.name}/{door_2.ip}</h2>
                            <h2 className={classes.testMargin}>lock： {door_2.variables && door_2.variables.lock}</h2>
                            <h2 className={classes.testMargin}>isConnected： {String(!door_2.error)}</h2>
                        </div>
                    </Paper>
                    <br/>
                    <Paper className={fixedHeightPaper}>
                        <div className="door_3">
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlDoor.bind(this, 47, 1)}>
                                Open Door 3
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlDoor.bind(this, 47, 0)}>
                                Close Door 3
                            </Button> 
                            <br></br>
                            <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlOnlyDoor.bind(this, 47, 1)}>
                                ONLY Open Door 3
                            </Button>
                            <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlOnlyDoor.bind(this, 47, 0)}>
                                ONLY Close Door 3
                            </Button> 
                        </div>
                        <div className="return_json">
                            <h2 className={classes.testMargin}>name/IP： {door_3.name}/{door_3.ip}</h2>
                            <h2 className={classes.testMargin}>lock： {door_3.variables && door_3.variables.lock}</h2>
                            <h2 className={classes.testMargin}>isConnected： {String(!door_3.error)}</h2>
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

OpenDoor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenDoor);