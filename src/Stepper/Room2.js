import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import axios from 'axios';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AllInboxRoundedIcon from '@material-ui/icons/AllInboxRounded';
import StepConnector from '@material-ui/core/StepConnector';
import { withStyles } from '@material-ui/core/styles';

import CasinoIcon from '@material-ui/icons/Casino';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const useStyles = makeStyles(theme => ({
  root: {
    width: '700px',
    // border: 'solid 1px',
    postion: 'relative'
  },
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title:{
    postion: 'absolute',
    left: '30px',
    top: '50px',
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
    1: <CasinoIcon />,
    2: <MeetingRoomIcon />,
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
  return (['接線盒', '門']);
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
  }, 1000);

  const update = () => {
    let url="http://192.168.50.225:8888/checkRoom2"
    axios
      .get(url, {
      })
      .then((response) => {
        let data =response.data;
        if(response.data){
          // console.log(data);
          const newCompleted = completed;
          newCompleted[0] = data["wireBox"];
          newCompleted[1] = !data["door2_lock"];
          setCompleted(newCompleted);
        }
      })
      .catch((error)=>{
          console.log(error);
      });
    
  }

  const handleStep = step => () => {
    setActiveStep(step);
    getStepContent(step);
  };

  return (
    <div className={classes.root}>
      {/* <h1 className={classes.title}>B</h1> */}
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
