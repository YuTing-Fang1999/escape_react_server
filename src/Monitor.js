import React, { Component } from 'react';
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
    monitorUp: {
        position: "static",
        transformOrigin: "44% 35%",
        transform: "rotate(180deg) scale(0.5)",
        visibility: "visible",
        height: "730px",
        width: "1290px",
    },
    monitorDown: {
        position: "static",
        transformOrigin: "44% 3%",
        transform: "rotate(180deg) scale(0.5)",
        visibility: "visible",
        height: "730px",
        width: "1290px",
    },
    monitorOne: {
        position: "static",
        transformOrigin: "69% 39%",
        transform: "rotate(180deg) scale(0.45)",
        visibility: "visible",
        height: "730px",
        width: "1290px",
    },
    monitorTwo: {
        position: "static",
        transformOrigin: "69% 0.5%",
        transform: "rotate(180deg) scale(0.45)",
        visibility: "visible",
        height: "730px",
        width: "1290px",
    },
    monitorThree: {
        position: "static",
        transformOrigin: "31% 39%",
        transform: "rotate(180deg) scale(0.45)",
        visibility: "visible",
        height: "730px",
        width: "1290px",
    },
    monitorFour: {
        position: "static",
        transformOrigin: "31% 0.5%",
        transform: "rotate(180deg) scale(0.45)",
        visibility: "visible",
        height: "730px",
        width: "1290px",
    },
    monitorWrite: {
        position: "static",
        transformOrigin: "35% 34%",
        transform: "rotate(180deg) scale(0.5)",
        visibility: "visible",
        height: "1090px",
        width: "1930px",
    },
});

class Monitor extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabValue: 0,            // tab index value
            error: true,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.handleTabChange = this.handleTabChange.bind(this)
    }
    handleTabChange(event, newValue){
        this.setState({
            tabValue: newValue,
        })
    };
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
            <h2>密室監視畫面</h2>
            <Paper className={classes.root}>
                <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab to="/monitor/one" component={Link} label="第一間房間監控畫面" className={classes.tabText} />
                    <Tab to="/monitor/two" component={Link} label="第二間房間監控畫面" className={classes.tabText} />
                    <Tab to="/monitor/three" component={Link} label="第三間房間監控畫面" className={classes.tabText} />
                    <Tab to="/monitor/four" component={Link} label="手寫辨識監控畫面" className={classes.tabText} />
                </Tabs>
            </Paper>
            <TabPanel value={this.state.tabValue} index={0}>
                <Paper className={fixedHeightPaper}>
                    <div className={classes.TimeText}>
                        <div>
                            <iframe 
                                src="http://192.168.50.201:8080/?action=stream" 
                                title="201_1"
                                className={classes.monitorOne}
                            />
                            <iframe 
                                src="http://192.168.50.202:8080/?action=stream" 
                                title="202_1"
                                className={classes.monitorTwo}
                            />
                        </div>
                        <div>
                            <iframe 
                                src="http://192.168.50.200:8080/?action=stream"
                                title="200_1" 
                                className={classes.monitorThree}
                            />
                            <iframe 
                                src="http://192.168.50.203:8080/?action=stream" 
                                title="203_1"
                                className={classes.monitorFour}
                            />
                        </div>
                    </div>
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
                <Paper className={fixedHeightPaper}>
                    <iframe 
                        src="http://192.168.50.200:8080/?action=stream" 
                        title="200_2"
                        className={classes.monitorUp}
                    />
                    <iframe 
                        src="http://192.168.50.203:8080/?action=stream" 
                        title="203_2"
                        className={classes.monitorDown}
                    />
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
                <Paper className={fixedHeightPaper}>
                    <div className={classes.TimeText}>
                        <div>
                            <iframe 
                                src="http://192.168.50.207:8080/?action=stream" 
                                title="207_3"
                                className={classes.monitorOne}
                            />
                            <iframe 
                                src="http://192.168.50.208:8080/?action=stream" 
                                title="208_3"
                                className={classes.monitorTwo}
                            />
                        </div>
                        <div>
                            <iframe 
                                src="http://192.168.50.209:8080/?action=stream"
                                title="209_3" 
                                className={classes.monitorThree}
                            />
                            <iframe 
                                src="http://192.168.50.200:8080/?action=stream" 
                                title="200_2"
                                className={classes.monitorFour}
                            />
                        </div>
                    </div>
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={3}>
                <Paper className={fixedHeightPaper}>
                    <iframe 
                        src="http://192.168.50.205:8080/?action=stream" 
                        title="205_4"
                        className={classes.monitorWrite}
                    />
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

Monitor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Monitor);