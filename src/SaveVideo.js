import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import StepConnector from '@material-ui/core/StepConnector';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
// ===========================>stepper
const useStyles = makeStyles(theme => ({
    root: {
      width: '700px',
      // border: 'solid 1px',
      marginLeft: '0px',
      position: 'relative',
    },
    title: {
      position: 'absolute',
      // border: 'solid 1px',
      fontSize: '30px',
      left: '10px',
      top: '5px',
    }
  }));
  const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      '& $line': {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    completed: {
      '& $line': {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
    },
  })(StepConnector);
  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#ccc',
      zIndex: 1,
      color: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
  });
  
  function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;
  
    const icons = {
      1: <VideoLibraryIcon />,
      2: <VideoLibraryIcon />,
      3: <VideoLibraryIcon />,
      4: <VideoLibraryIcon />,
    };
  
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {icons[String(props.icon)]}
      </div>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
  };
  
// ===============================>
class SaveVideo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            outputA: false,
            outputB: false,
            outputC: false,
            outputD: false,
            frame_person_A: false,
            frame_person_B: false,
            frame_person_C: false,
            frame_person_D: false,
            start: false,
            end: false,
            min: 0,
            sec: 0,
            time: 0,
            completed: {},
            step: 0,
            msg: "",
            open: false,
            index: 0,
        }
        this.chechVideo=this.chechVideo.bind(this);
        this.getSteps=this.getSteps.bind(this);
        this.SaveVideo=this.saveVedio.bind(this);
        this.reset=this.reset.bind(this);
        this.sure=this.sure.bind(this);
        this.handleClickOpen=this.handleClickOpen.bind(this);
    }
    componentDidMount() { // per two second update
        this.chechVideo();
        this.timerID = setInterval(
            () => this.chechVideo(),
            5000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    computeSec(){
        var now=new Date();
        var t=now.getSeconds()-this.state.sec;
        t=t+(now.getMinutes()+60-this.state.min)%60*60;
        t=t-76
        this.setState({
            time: t
        })
    }
    chechVideo(){
        axios
            .get('http://192.168.50.225:8888/checkVideo')
            .then(data => {
                data=data["data"];
                console.log("end:"+this.state.end+",start:"+this.state.start);
                const newCompleted = this.state.completed;
                newCompleted[0] = data["state"]["A_done"];
                newCompleted[1] = data["state"]["B_done"];
                newCompleted[2] = data["state"]["C_done"];
                newCompleted[3] = data["state"]["D_done"];
                this.setState({
                    start: data["state"]["start"],
                    end: data["state"]["end"],
                    min: data["time"]["min"],
                    sec: data["time"]["sec"],
                    completed: newCompleted,
                },function(){
                  if(!this.state.start && !this.end){
                    this.setState({msg: "還未儲存",time: ""})
                  }else if(this.state.start && !this.state.end){
                    this.setState({msg: "正在儲存"});
                    this.computeSec();
                  }else if(this.state.start && this.state.end){
                    this.setState({msg: "儲存完畢",time: ""});
                    clearInterval(this.timerID);
                  }

                  if(this.state.start &&　this.state.time>150){
                    this.setState({
                      msg: "影片掛了",
                    })
                  }
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    getSteps() {
        return (['frame_person_A', 'frame_person_B', 'frame_person_C','frame_person_D']);
    };
    saveVedio(index){
        var name=this.getSteps()[index]
        // console.log(name);
        axios
            .get('http://192.168.50.225:8888/StoreVideo/'+name)
            .then(response => {
                // console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
    }
    reset(){
      this.chechVideo();
      this.timerID = setInterval(
          () => this.chechVideo(),
          2000
      );
      axios
          .get('http://192.168.50.225:8888/ResetStoreVideo')
          .then(response=>{

          })
          .catch(error=>{
            console.log(error);
          })
    }
    handleClickOpen(index){
      this.setState({
        open: true,
        index: index,
      });
    };
    sure(){
      this.saveVedio(this.state.index);
      this.setState({open:false});
    }
    render() {
    return(
    <div>
      <br></br>
      <Stepper nonLinear activeStep={null} alternativeLabel connector={<ColorlibConnector />}>
            {this.getSteps().map((label, index) => (
              <Step key={label}>
                <StepButton onClick={()=> this.handleClickOpen(index)} completed={this.state.completed[index]}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </StepButton>
              </Step>
            ))}
      </Stepper>
      <Dialog
        open={this.state.open}
        onClose={()=>{this.setState({open: false})}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"因為影片掛掉我也無法用pid砍，所以此按鈕只是用來測試資料庫的"}</DialogTitle>
        <DialogActions>
          <Button onClick={()=>{this.setState({open: false})}} color="primary">
            取消
          </Button>
          <Button onClick={()=>{this.sure()}} color="primary" autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    <h1>{this.state.msg}</h1>
    <h1>{this.state.time}</h1>
    <Button onClick={this.reset} color="primary" variant="contained">
      Reset
    </Button>
    </div>
    )
    }
}
export default SaveVideo