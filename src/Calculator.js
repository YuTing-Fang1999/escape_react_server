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

class Calculator extends Component {
    constructor(props){
        super(props)
        this.state = {
            note_array: "",
            isAnswer: false,
            error: true,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.correctAnswer = this.correctAnswer.bind(this);
        this.clearNote = this.clearNote.bind(this);
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
            .get('http://192.168.50.225:8888/checkCalculator')
            .then(response => {
                let data = response.data[0]; // return value is a list
                // console.log(data)
                this.setState({ // every 2 sec setState
                    note_array: data.note_array,
                    isAnswer: data.isAnswer,
                    error: data.error,
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
    clearNote() {
        axios
            .get('http://192.168.50.211:5000/calculator/11')
            .then(response => {
                this.setState({

                })
            })
    }
    correctAnswer() {
        axios
            .get('http://192.168.50.211:5000/calculator/14')
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
      const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      return (
        <div>
            <h2>計算機控制</h2>
            <Paper className={fixedHeightPaper}>
                <div className="Calculator">
                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.clearNote.bind(this)}>
                        Clear code
                    </Button>
                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.correctAnswer.bind(this)}>
                        Correct answer
                    </Button> 
                </div>
                <h2 className={classes.testMargin}>Answer : 165456156156</h2>   {/*adding space*/}
                <h2 className={classes.testMargin}>Note : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.note_array}</h2>
                <h2 className={classes.testMargin}>isCorrect : {String(this.state.isAnswer)}</h2>
                <br/>
                <h2 className={classes.testMargin}>isConnected : {String(!this.state.error)}</h2>
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

Calculator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calculator);