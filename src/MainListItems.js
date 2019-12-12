import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import DnsIcon from '@material-ui/icons/Dns';
import UsbIcon from '@material-ui/icons/Usb';
import DialpadIcon from '@material-ui/icons/Dialpad';
import List from '@material-ui/core/List';
import BuildIcon from '@material-ui/icons/Build';
import VideocamIcon from '@material-ui/icons/Videocam';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { Link } from 'react-router-dom';

export default function MainListItems(props) {
  return(
    <div>
    <List>
      <ListSubheader inset>server 控制頁面</ListSubheader>
      <ListItem button to="/dashboard" component={Link}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="密室主監控畫面" />
      </ListItem>
      <ListItem button to="/monitor" component={Link}>
        <ListItemIcon>
          <PersonalVideoIcon />
        </ListItemIcon>
        <ListItemText primary="密室監視畫面" />
      </ListItem>
      <ListItem button to="/door" component={Link}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary="機關門控制" />
      </ListItem>
      <ListItem button to="/drawer" component={Link}>
        <ListItemIcon>
          <DnsIcon />
        </ListItemIcon>
        <ListItemText primary="抽屜控制" />
      </ListItem>
      <ListItem button to="/usb" component={Link}>
        <ListItemIcon>
          <UsbIcon />
        </ListItemIcon>
        <ListItemText primary="USB 畫面控制" />
      </ListItem>
      <ListItem button to="/calculator" component={Link}>
        <ListItemIcon>
          <DialpadIcon />
        </ListItemIcon>
        <ListItemText primary="計算機控制" />
      </ListItem>
      <ListItem button to="/other" component={Link}>
        <ListItemIcon>
          <BuildIcon />
        </ListItemIcon>
        <ListItemText primary="其他機關 GET" />
      </ListItem>
      <ListItem button to="/audio" component={Link}>
        <ListItemIcon>
          <AudiotrackIcon />
        </ListItemIcon>
        <ListItemText primary="音效控制" />
      </ListItem>
      <ListItem button to="/screen" component={Link}>
        <ListItemIcon>
          <VideocamIcon />
        </ListItemIcon>
        <ListItemText primary="螢幕影片控制" />
      </ListItem>
      <ListItem button to="/save_vedio" component={Link}>
        <ListItemIcon>
          <YouTubeIcon />
        </ListItemIcon>
        <ListItemText primary="儲存影片" />
      </ListItem>
    </List>
    </div>
  );
}
