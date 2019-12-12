import React, { Component } from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import {
    Fab,
    Avatar,
    Badge,
    Typography,
    IconButton,
    Menu,
    MenuItem,
} from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';

// icon
import DashboardIcon from '@material-ui/icons/Dashboard';
import VideocamIcon from '@material-ui/icons/Videocam';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import WifiIcon from '@material-ui/icons/Wifi';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import DnsIcon from '@material-ui/icons/Dns';
import UsbIcon from '@material-ui/icons/Usb';
import DialpadIcon from '@material-ui/icons/Dialpad';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';

import classNames from "classnames";

const styles = theme => ({
    headerMenuButton: {                       // Menu button style
        marginLeft: theme.spacing(6),
        padding: theme.spacing(2.5),
    },
    headerClearButton: {                       // Menu button style
        marginTop: theme.spacing(3),        
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5),
        marginBottom: theme.spacing(3),
    },
    headerMenu: {                             // Menu style
        marginTop: theme.spacing(7),
    },
    headerMenuList: {
        display: "flex",
        flexDirection: "column",
    },
    profileMenuUser: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(3),
    },
    profileMenuLink: {
        fontSize: 16,
        textDecoration: "none",
        "&:hover": {
            cursor: "pointer",
        },
    },
    messageNotification: {
        height: "auto",
        display: "flex",
        alignItems: "center",
        "&:hover, &:focus": {
            backgroundColor: theme.palette.background.light,
        },
    },
    messageNotificationSide: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: theme.spacing(2),
    },
    messageNotificationBodySide: {
        alignItems: "flex-start",
        marginRight: 0,
    },
    pinkAvatar: {                         // Avatar style
        margin: 10,
        color: '#fff',
        backgroundColor: pink[500],
    },
});

class Notifications extends Component {
    constructor(props){
        super(props)
        this.state = {
            notifications: [],
            notificationsMenu: null,
            isNotificationsUnread: true,
        }
        this.handleNotificationClose = this.handleNotificationClose.bind(this);
        this.whitchLink = this.whitchLink.bind(this)
        this.whitchAvatar = this.whitchAvatar.bind(this)
        this.clearMessage = this.clearMessage.bind(this)
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
            .get('http://192.168.50.225:8888/checkNotifications')
            .then(response => {
                let data = response.data; // return value is a list
                this.setState({ // every 2 sec setState
                    notifications: data
                })
                if (data.length === 0){
                    this.setState({
                        isNotificationsUnread: false,
                    })
                }
                else{
                    this.setState({
                        isNotificationsUnread: true,
                    })
                }
            })
            .catch((error)=>{

            })
    }
    whitchAvatar(state){
        switch(state) {
            case 'DashboardIcon':
                return <DashboardIcon />;
            case 'PersonalVideoIcon':
                return <PersonalVideoIcon/>;
            case 'MeetingRoomIcon':
                return <MeetingRoomIcon />;
            case 'DnsIcon':
                return <DnsIcon />;
            case 'Brightness6Icon':
                return <Brightness6Icon />
            case 'VideocamIcon':
                return <VideocamIcon />
            case 'UsbIcon':
                return <UsbIcon />
            case 'DialpadIcon':
                return <DialpadIcon />
            case 'WifiIcon':
                return <WifiIcon />
            case 'AudiotrackIcon':
                return <AudiotrackIcon />
            case 'PhoneAndroidIcon':
                return <PhoneAndroidIcon />
            case 'NotificationImportantIcon':
                return <NotificationImportantIcon />

            case 'BuildIcon_1':                  // 3 Tabs
                return <BuildIcon />
            case 'BuildIcon_2':
                return <BuildIcon />
            case 'BuildIcon_3':
                return <BuildIcon />

            default:
                return null;
        }
    }
    whitchLink(state){
        switch(state) {
            case 'DashboardIcon':
                return '/dashboard';
            case 'PersonalVideoIcon':
                return '';
            case 'MeetingRoomIcon':
                return '/door';
            case 'DnsIcon':
                return '/drawer';
            case 'Brightness6Icon':
                return ''
            case 'VideocamIcon':
                return '/video'
            case 'UsbIcon':
                return '/usb'
            case 'DialpadIcon':
                return '/calculator'
            case 'WifiIcon':
                return ''
            case 'AudiotrackIcon':
                return ''
            case 'PhoneAndroidIcon':
                return ''
            case 'NotificationImportantIcon':
                return ''
                
            case 'BuildIcon_1':                 // 3 Tabs
                return '/other/one'
            case 'BuildIcon_2':
                return '/other/two'
            case 'BuildIcon_3':
                return '/other/three'
            default:
                return null;
        }
    }
    handleNotificationClose(){
        this.setState({ 
            notificationsMenu: null,
        });
    };
    clearMessage(){
        axios
            .get('http://192.168.50.225:8888/clearNotifications')
    }

    render() {
      const { classes } = this.props;
        return (
            <div>
            <IconButton
              color="inherit"
              aria-haspopup="true"
              aria-controls="notification-menu"
              onClick={e => {
                this.setState({ // every 2 sec setState
                  notificationsMenu: e.currentTarget,
                  isNotificationsUnread: false,
                })
              }}
              className={classes.headerMenuButton}
            >
              <Badge
                badgeContent={this.state.isNotificationsUnread ? this.state.notifications.length : null}
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              id="notification-menu"
              anchorEl={this.state.notificationsMenu}
              open={Boolean(this.state.notificationsMenu)}
              onClose={this.handleNotificationClose}
              MenuListProps={{ className: classes.headerMenuList }}
              className={classes.headerMenu}
              classes={{ paper: classes.profileMenu }}
              disableAutoFocusItem
            >
              <div className={classes.profileMenuUser}>
                <Typography variant="h4" weight="medium">
                  New Messages
                </Typography>
                <Typography
                  className={classes.profileMenuLink}
                  color="secondary"
                >
                  {this.state.notifications.length} New Messages
                </Typography>
              </div>
              {this.state.notifications.map(message => (
                <MenuItem 
                    button 
                    to={this.whitchLink(message.avatarIcon)} 
                    component={Link} 
                    key={message.id} 
                    className={classes.messageNotification}
                >
                  <div className={classes.messageNotificationSide}>
                    <Avatar className={classes.pinkAvatar}>
                      {this.whitchAvatar(message.avatarIcon)}
                    </Avatar>
                    <Typography size="sm" color="secondary">
                      {message.time}
                    </Typography>
                  </div>
                  <div
                    className={classNames(
                      classes.messageNotificationSide,
                      classes.messageNotificationBodySide,
                    )}
                  >
                    <Typography>
                      {message.message}
                    </Typography>
                  </div>
                </MenuItem>
              ))}
                <Fab color="secondary" variant="extended" aria-label="like" className={classes.headerClearButton} onClick={this.clearMessage.bind()}>
                      <DeleteIcon />
                      Delete Message
                </Fab>
            </Menu>
            </div>
        );
    }
}

Notifications.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Notifications);