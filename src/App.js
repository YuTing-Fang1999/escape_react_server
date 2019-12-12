// /src/App.js
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import DashboardTemplates from './DashboardTemplates'
import Dashboard from './Dashboard'
import OpenDrawer from './OpenDrawer'
import OpenDoor from './OpenDoor'
import UsbVideo from './UsbVideo'
import Login from './login/Login'
import Calculator from './Calculator'
import OtherProject from './OtherProject'
import Monitor from './Monitor'
import AudioControl from './AudioControl'
import SaveVideo from './SaveVideo'
import ScreenVideo from './ScreenVideo'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Route path="/dashboard" exact render={() => <DashboardTemplates page={<Dashboard/>}/>} />
        <Route exact path="/app" render={() => <Redirect to="/" />} />
        <Route exact path="/" render={() => <Login/>} />
        <Route path="/drawer" render={() => <DashboardTemplates page={<OpenDrawer/>}/>} />
        <Route path="/door" render={() => <DashboardTemplates page={<OpenDoor/>}/>} />
        <Route path="/usb" render={() => <DashboardTemplates page={<UsbVideo/>}/>} />
        <Route path="/calculator" render={() => <DashboardTemplates page={<Calculator/>}/>} />
        <Route path="/other" render={() => <DashboardTemplates page={<OtherProject/>}/>} />
        <Route path="/monitor" render={() => <DashboardTemplates page={<Monitor/>}/>} />
        <Route path="/audio" render={() => <DashboardTemplates page={<AudioControl/>}/>} />
        <Route path="/save_vedio" render={() => <DashboardTemplates page={<SaveVideo/>}/>} />
        <Route path="/screen" render={() => <DashboardTemplates page={<ScreenVideo/>}/>} />
      </div>
    );
  }
}

export default App;