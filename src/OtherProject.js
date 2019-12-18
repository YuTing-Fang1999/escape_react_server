import React, { Component } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MySnackbarContentWrapper from './CustomizedSnackbars'
import { Link } from 'react-router-dom';
import { HuePicker } from 'react-color';

import {
    Tab,
    Tabs,
    Button,
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
        display: 'flex',
        flexDirection: 'row',
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
    tabText: {                          // Tab text
        fontSize: "20px",
        padding: theme.spacing(2),
    },
    rightDiv: {
        marginRight: theme.spacing(2),
    },
    colorTextMargin: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(4),
    },
});

class OtherProject extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabValue: 0,            // tab index value
            powerOpen: {},
            wireBoxOpen: {},
            coffinOpen: {},
            nineBlock: {},
            warningLight: {},
            gear: {},
            RFID: {},
            writingCamera: {},
            lightError: false,

            lightColorContinue: "#ffffff",     // light color initial to #fff
            lightColorComplete: "#ffffff",
            modeName: "沒有模式",
            placeName: "沒有位置",

            error: true,
            snackbarOpen: false,
            snackbarContent: "",
            variant: "error",
        }
        this.handleTabChange = this.handleTabChange.bind(this)
        this.controlPower = this.controlPower.bind(this)
        this.controlCamera = this.controlCamera.bind(this)
        this.controlWireBox = this.controlWireBox.bind(this)
        this.controlCoffin = this.controlCoffin.bind(this)
        this.controlNineBlock = this.controlNineBlock.bind(this)
        this.controlRFID = this.controlRFID.bind(this)
        this.controlWarningLight = this.controlWarningLight.bind(this)
        this.controlGear = this.controlGear.bind(this)
        this.handleLightColorContinueFloar = this.handleLightColorContinueFloar.bind(this)
        this.handleLightColorCompleteFloar = this.handleLightColorCompleteFloar.bind(this)
        this.handleLightColorContinueMask = this.handleLightColorContinueMask.bind(this)
        this.handleLightColorCompleteMask = this.handleLightColorCompleteMask.bind(this)
        this.handleControlLight = this.handleControlLight.bind(this)
        this.handlePlaceName = this.handlePlaceName.bind(this)
    }
    componentDidMount() { // per two second update
        this.timerID = setInterval(
            () => this.pingIP(),
            5000
        );
    }
    pingIP(){     
        axios
            .get('http://192.168.50.225:8888/checkPower')
            .then(response => {
                let data = response.data;
                this.setState({
                    powerOpen: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/checkWireBox')
            .then(response => {
                let data = response.data;
                this.setState({
                    wireBoxOpen: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/checkWritingCamera/0/0')
            .then(response => {
                let data = response.data;
                this.setState({
                    writingCamera: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/checkCoffin')
            .then(response => {
                let data = response.data;
                this.setState({
                    coffinOpen: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/NineBlock')
            .then(response => {
                let data = response.data;
                // console.log(data)
                this.setState({
                    nineBlock: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/checkRFID')
            .then(response => {
                let data = response.data;
                // console.log(data)
                this.setState({
                    RFID: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/checkWarningLight')
            .then(response => {
                let data = response.data;
                // console.log(data)
                this.setState({
                    warningLight: data[0]
                })
            })
        axios
            .get('http://192.168.50.225:8888/checkGear')
            .then(response => {
                let data = response.data;
                // console.log(data)
                this.setState({
                    gear: data[0]
                })
            })
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    handleTabChange(event, newValue){
        this.setState({
            tabValue: newValue,
        })
    };
    controlPower(isOpen){
        axios
            .get('http://192.168.50.225:8888/getPower/' + isOpen)
    }
    controlOnlyLight(isOpen){
        axios
            .get('http://192.168.50.225:8888/getOnlyLight/' + isOpen)
    }
    controlCamera(isOpen){
        if (isOpen === 0){
            axios
                .get('http://192.168.50.225:8888/setFirstRoomCamera/0')
        }
        else if (isOpen === 1){
            axios
                .get('http://192.168.50.225:8888/setFirstRoomCamera/1')
            axios
                .get('http://192.168.50.225:8888/setFirstRoomCamera/2')
        }
        else if (isOpen === 2){
            axios
                .get('http://192.168.50.225:8888/setFirstRoomCamera/3')
        }
        else if (isOpen === 3){
            axios
                .get('http://192.168.50.225:8888/killFirstRoomCamera')
        }
    }
    controlWireBox(isOpen){
        axios
            .get('http://192.168.50.225:8888/resetWireBox/' + isOpen)
    }
    controlCoffin(isOpen){
        axios
            .get('http://192.168.50.225:8888/resetCoffin/' + isOpen)
    }
    controlNineBlock(isOpen){
        if (isOpen == 0){
            axios
                .get('http://192.168.50.225:8888/firstUsb')
        }
        else if (isOpen == 1){
            axios
                .get('http://192.168.50.225:8888/startNineBlock')
        }
        else if (isOpen == 2){
            axios
                .get('http://192.168.50.225:8888/checkNineBlock/0')
        }
        else if (isOpen == 3){
            axios
                .get('http://192.168.50.20/set_btn?params=0')
        }
    }
    controlRFID(isOpen){
        axios
            .get('http://192.168.50.225:8888/resetRFID/' + isOpen)
            .then(res => {
                // console.log(res)
            })
    }
    controlWarningLight(isOpen){
        axios
            .get('http://192.168.50.225:8888/resetWarningLight/' + isOpen)
            .then(res => {
                // console.log(res)
            })
    }
    controlGear(isOpen){
        axios
            .get('http://192.168.50.225:8888/resetGear/' + isOpen)
            .then(res => {
                // console.log(res)
            })
    }
    handleLightColorCompleteFloar = (color, event) => {
        this.setState({
            lightColorContinue: '#ffffff',
            lightColorComplete: color.hex,
        });
        let colorNow = color.hex
        colorNow = colorNow.substr(1)
        axios
            .get('http://192.168.50.70/set_color?params=' + colorNow)
    };
    handleLightColorContinueFloar = (color, event) => {
        this.setState({
            lightColorComplete: '#ffffff',
            lightColorContinue: color.hex, 
        });
        let colorNow = color.hex
        colorNow = colorNow.substr(1)
        axios
            .get('http://192.168.50.70/set_color?params=' + colorNow)
    };
    handleLightColorCompleteMask = (color, event) => {
        this.setState({
            lightColorContinue: '#ffffff',
            lightColorComplete: color.hex,
        });
        let colorNow = color.hex
        colorNow = colorNow.substr(1)
        axios
            .get('http://192.168.50.19/set_color?params=' + colorNow)       // TODO: CHANGE
    };
    handleLightColorContinueMask = (color, event) => {
        this.setState({
            lightColorComplete: '#ffffff',
            lightColorContinue: color.hex, 
        });
        let colorNow = color.hex
        colorNow = colorNow.substr(1)
        axios
            .get('http://192.168.50.19/set_color?params=' + colorNow)       // TODO: CHANGE
    };
    handleControlLight(index, ip){
        if (index == 0){
            this.setState({
                'modeName': "一般模式",
            })
            axios
                .get('http://192.168.50.' + ip + '/set_breathing_light?params=0')
                .catch(error => {
                    this.setState({
                        lightError: true,
                    })
                })
        }
        else if (index == 1){
            this.setState({
                'modeName': "呼吸燈模式",
            })
            axios
                .get('http://192.168.50.' + ip + '/set_breathing_light?params=1')
                .catch(error => {
                    this.setState({
                        lightError: true,
                    })
                })
        }
    }
    handlePlaceName(index){
        if (index == 0){
            this.setState({
                placeName: "地板燈條",
                modeName: "沒有模式",
            })
        }
        else if (index == 1){
            this.setState({
                placeName: "面具燈條",
                modeName: "沒有模式",
            })
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
            <h2>其它機關 GET</h2>
            <Paper className={classes.root}>
                <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab to="/other/one" component={Link} label="第一間房間機關" className={classes.tabText} />
                    <Tab to="/other/two" component={Link} label="第二間房間機關" className={classes.tabText} />
                    <Tab to="/other/three" component={Link} label="第三間房間機關" className={classes.tabText} />
                </Tabs>
            </Paper>
            <TabPanel value={this.state.tabValue} index={0}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin} >電源總開關</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlPower.bind(this, 1)}>
                            Set Open
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlPower.bind(this, 0)}>
                            Set Close
                        </Button> 
                        <br></br>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlOnlyLight.bind(this, 1)}>
                            ONLY Open Light
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlOnlyLight.bind(this, 0)}>
                            ONLY Close Light
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isOpen：{this.state.powerOpen.isOpen}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(!this.state.powerOpen.error)}</h2>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>四個攝影機</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlCamera.bind(this, 1)}>
                            對向玩家
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlCamera.bind(this, 0)}>
                            背向玩家
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlCamera.bind(this, 2)}>
                            轉向第二間
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlCamera.bind(this, 3)}>
                            kill 攝影機
                        </Button>
                    </div> 
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>四張卡片 NFC</h2>
                    <div>
                        {/* <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlRFID.bind(this, 1)}>
                            Set Open
                        </Button> */}
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlRFID.bind(this, 0)}>
                            Set Close
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isOpen：{String(this.state.RFID.isOpen)}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(this.state.RFID.isConnect)}</h2>
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>娃娃棺材</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlCoffin.bind(this, 1)}>
                            Set Open
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlCoffin.bind(this, 0)}>
                            Set Close
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isOpen：{this.state.coffinOpen.isOpen}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(!this.state.coffinOpen.error)}</h2>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>手寫辨識攝影機</h2>
                    <h2 className={classes.textMargin} >date：{this.state.writingCamera.date}</h2>
                    <h2 className={classes.textMargin} >month：{this.state.writingCamera.month}</h2>
                    <h2 className={classes.textMargin} >isRunning：{String(this.state.writingCamera.isRunning)}</h2>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>接線盒</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlWireBox.bind(this, 1)}>
                            Set Open
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlWireBox.bind(this, 0)}>
                            Set Close
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isCorrect：{this.state.wireBoxOpen.isOpen}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(!this.state.wireBoxOpen.error)}</h2>
                </Paper>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>九宮格</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlNineBlock.bind(this, 0)}>
                            第一個 USB 插入後的流程
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlNineBlock.bind(this, 1)}>
                            按下按鈕後的流程
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlNineBlock.bind(this, 2)}>
                            停止掃描中的流程
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlNineBlock.bind(this, 3)}>
                            把紅按鈕關掉
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isPushBtn：{String(this.state.nineBlock.pushBtn)}</h2>
                    <h2 className={classes.textMargin} >isCorrect：{String(this.state.nineBlock.correct)}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(this.state.nineBlock.isConnect)}</h2>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>警示燈</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlWarningLight.bind(this, 1)}>
                            Set Open
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlWarningLight.bind(this, 0)}>
                            Set Close
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isOpen：{String(this.state.warningLight.isOpen)}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(this.state.warningLight.isConnect)}</h2>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>齒輪</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.controlGear.bind(this, 1)}>
                            Set Open
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.controlGear.bind(this, 0)}>
                            Set Close
                        </Button> 
                    </div>
                    <h2 className={classes.textMargin} >isOpen：{String(this.state.gear.isOpen)}</h2>
                    <h2 className={classes.textMargin} >isConnected：{String(this.state.gear.isConnect)}</h2>
                </Paper>
                <br/>
                <Paper className={fixedHeightPaper}>
                    <h2 className={classes.textMargin}>燈條調色器</h2>
                    <div>
                        <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handlePlaceName.bind(this, 0)}>
                            地板燈條
                        </Button>
                        <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handlePlaceName.bind(this, 1)}>
                            面具燈條
                        </Button>
                    </div>
                    {(() => {
                        if(this.state.placeName == "地板燈條"){
                            return (
                                <div>
                                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleControlLight.bind(this, 0, 70)}>
                                        一般模式
                                    </Button>
                                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handleControlLight.bind(this, 1, 70)}>
                                        呼吸燈模式
                                    </Button>
                                    <h2 className={classes.textMargin}>目前模式及位置：{this.state.modeName}、{this.state.placeName}</h2>
                                    <h2 className={classes.textMargin}>isConnected：{String(this.state.lightError)}</h2>
                                </div>
                            )
                        }
                        else if (this.state.placeName == "面具燈條"){
                            return (
                                <div>
                                    <Button className={classes.buttonMargin} variant="contained" color="primary" onClick={this.handleControlLight.bind(this, 0, 19)}>     {/*TODO:  CHANGE */}
                                        一般模式
                                    </Button>
                                    <Button className={classes.buttonMargin} variant="contained" color="secondary" onClick={this.handleControlLight.bind(this, 1, 19)}>     {/*TODO:  CHANGE */}
                                        呼吸燈模式
                                    </Button>
                                    <h2 className={classes.textMargin}>目前模式及位置：{this.state.modeName}、{this.state.placeName}</h2>
                                    <h2 className={classes.textMargin}>isConnected：{String(this.state.lightError)}</h2>
                                </div>
                            )
                        }
                    })()}
                    {(() => {
                        if (this.state.modeName == "一般模式" && this.state.placeName == "地板燈條"){
                            return (
                                <div>
                                    <div className={classes.textMargin}>
                                        <HuePicker    
                                            color={ this.state.lightColorComplete }
                                            onChangeComplete={ this.handleLightColorCompleteFloar }
                                        /> 
                                        <div className={classes.rightDiv}>
                                            <h2 className={classes.colorTextMargin}>更改顏色</h2>
                                            <Button variant="contained" size="large" style={{backgroundColor: this.state.lightColorComplete}} className={classes.colorTextMargin}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </Button>
                                            <h2 className={classes.colorTextMargin}>{this.state.lightColorComplete}</h2>
                                        </div>
                                    </div>
                                    <div className={classes.textMargin}>
                                        <HuePicker    
                                            color={ this.state.lightColorContinue }
                                            onChange={ this.handleLightColorContinueFloar }
                                        />
                                        <div className={classes.rightDiv}>
                                            <h2 className={classes.colorTextMargin}>即時更改顏色</h2>
                                            <Button variant="contained" size="large" style={{backgroundColor: this.state.lightColorContinue}} className={classes.colorTextMargin}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </Button> 
                                            <h2 className={classes.colorTextMargin}>{this.state.lightColorContinue}</h2>                                                       
                                        </div> 
                                    </div>
                                </div>
                            )
                        }
                        else if (this.state.modeName == "一般模式" && this.state.placeName == "面具燈條"){
                            return (
                                <div>
                                    <div className={classes.textMargin}>
                                        <HuePicker    
                                            color={ this.state.lightColorComplete }
                                            onChangeComplete={ this.handleLightColorCompleteMask }
                                        /> 
                                        <div className={classes.rightDiv}>
                                            <h2 className={classes.colorTextMargin}>更改顏色</h2>
                                            <Button variant="contained" size="large" style={{backgroundColor: this.state.lightColorComplete}} className={classes.colorTextMargin}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </Button>
                                            <h2 className={classes.colorTextMargin}>{this.state.lightColorComplete}</h2>
                                        </div>
                                    </div>
                                    <div className={classes.textMargin}>
                                        <HuePicker    
                                            color={ this.state.lightColorContinue }
                                            onChange={ this.handleLightColorContinueMask }
                                        />
                                        <div className={classes.rightDiv}>
                                            <h2 className={classes.colorTextMargin}>即時更改顏色</h2>
                                            <Button variant="contained" size="large" style={{backgroundColor: this.state.lightColorContinue}} className={classes.colorTextMargin}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </Button> 
                                            <h2 className={classes.colorTextMargin}>{this.state.lightColorContinue}</h2>                                                       
                                        </div> 
                                    </div>
                                </div>
                            )
                        }
                    })()}
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

OtherProject.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OtherProject);