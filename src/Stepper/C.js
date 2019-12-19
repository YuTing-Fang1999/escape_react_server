import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import axios from 'axios';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import StepConnector from '@material-ui/core/StepConnector';
import { withStyles } from '@material-ui/core/styles';

import PanoramaIcon from '@material-ui/icons/Panorama';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import AppsIcon from '@material-ui/icons/Apps';
import DnsIcon from '@material-ui/icons/Dns';
import DialpadIcon from '@material-ui/icons/Dialpad';


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
    1: <PanoramaIcon />,
    2: <MusicVideoIcon />,
    3: <DialpadIcon />,
    4: <DnsIcon/>
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

function getSteps() {
  return (['對話紀錄','手機掃描鋼琴譜', '計算機', '抽屜']);
}

function getStepContent(step) {
  switch (step) {
    case 0:
      console.log('Step 1') ;
      break;
    case 1:
      console.log('Step 2') ;
      break;
    case 2:
      console.log('Step 3') ;
      break;
    case 3:
      console.log('Step 4') ;
      break;
    default:
        console.log('unknow');
  }
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function HorizontalNonLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [count, setCount] = useState(0);
  const steps = getSteps();

  useInterval(() => {
    update();
    setCount(count + 1);
  },2000);

  const update = () => {
    let url="http://192.168.50.225:8888/checkC"
    axios
      .get(url, {
      })
      .then((response) => {
        let data =response.data;
        if(response.data){
          // console.log(data);
          const newCompleted = completed;
          newCompleted[0] = data["photo"];
          newCompleted[1] = data["piano"];
          newCompleted[2] = data["calculator"];
          newCompleted[3] = data["drawer"];
          setCompleted(newCompleted);
          // this.setState(
          //   {
          //     snackbarOpen: true,
          //     snackbarContent: "update",
          //     variant: "success"
          //   }
          // )
        }
      })
      .catch((error)=>{
          console.log(error);
          // this.setState(
          //   {
          //     snackbarOpen: true,
          //     snackbarContent: "fail: cannot conect flask",
          //     variant: "error"
          //   }
          // )
      });
    
  }

  const handleStep = step => () => {
    setActiveStep(step);
    getStepContent(step);
  };

  return (
    <div className={classes.root}>
     <h1 className={classes.title}>C</h1>
      <Stepper nonLinear activeStep={null} alternativeLabel connector={<ColorlibConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={handleStep(index)} completed={completed[index]}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </StepButton>
              </Step>
            ))}
      </Stepper>
    </div>
  );
}
