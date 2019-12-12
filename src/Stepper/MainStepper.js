import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StepButton from '@material-ui/core/StepButton';
import Room1 from './Room1'
import B from './B'
import C from './C'
import D from './D'
import Room2 from './Room2'
import Room3 from './Room3'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import StepConnector from '@material-ui/core/StepConnector';
import { withStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  completed: {
    '& $line': {
      backgroundImage:
        'red',
    },
  },
  line: {
    color: 'pink'
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
    1: <HomeRoundedIcon />,
    2: <HomeRoundedIcon />,
    3: <HomeRoundedIcon />,
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
  return ['Room 1', 'Room 2', 'Room 3'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Room1/>;
    case 1:
      return (<div>
          <B/>
          <C/>
          <D/>
          <Room2/>
      </div> );
    case 2:
      return <Room3/>;
    default:
      return 'Unknown step';
  }
}

export default function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const steps = getSteps();

  const handleReset = () => {
    setActiveStep(0);

  };

  const handleStep = step => () => {
    setActiveStep(step);
  };
  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical" connector={<ColorlibConnector />}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)} >
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </StepButton>
            <StepContent>
              <Typography>{getStepContent(activeStep)}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {/* {activeStep === steps.length && ( */}
        <Paper square elevation={0} className={classes.resetContainer}>
          {/* <Button onClick={handleReset} color="primary" variant="contained">
            Reset
          </Button> */}
        </Paper>
      {/* )} */}
    </div>
  );
}
