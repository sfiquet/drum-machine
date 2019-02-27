import React, { Component } from 'react';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import './App.css';

class App extends Component {
  render() {
    const setupBoard = [['Q', 'W', 'E'], ['A', 'S', 'D'], ['Z', 'X', 'C']];
    const ids = {
      machineId: "drum-machine",
      infoId: "display",
    };
    return (
      <div className="App">
        <header className="App-header">
          <h1>Drum Machine</h1>
        </header>
        <main className="container my-1">
          <DrumMachine board={setupBoard} ids={ids}/>
        </main>
      </div>
    );
  }
}

class DrumMachine extends Component {
  render() {
    const {machineId, ...drumCtrlIds} = this.props.ids;
    return (
      <div className="row" id={machineId}>
        <div className="col-12 col-sm-6 d-flex flex-column justify-content-center">
          <DrumPadBoard board={this.props.board}/>
        </div>
        <div className="col-12 col-sm-6 d-flex flex-column justify-content-center">
          <DrumControl ids={drumCtrlIds} />
        </div>
      </div>
    );
  }
}

class DrumPadBoard extends Component {
  render() {
    const board = this.props.board.map((row, rowid) => {
      const res = row.map((col, colid) => (
        <div className="col" key={colid}>
          <DrumPad text={col}/>
        </div>
      ));

      return (
        <div className="row" key={rowid}>
          {res}
        </div>
      )});

    return (
      <div className="DrumPadBoard">
      {board}
      </div>
    );
  }
}

class DrumPad extends Component {
  render() {
    return (
      <button type="button" className="btn btn-secondary DrumPad drum-pad" id={this.props.text}>
        <div className="DrumPadText d-flex flex-column justify-content-center">
          <div>
        {this.props.text}
          </div>
        </div>
      </button>
    );
  }
}

class DrumControl extends Component {
  render() {
    return (
      <div>
        <Toggle label="Power" name="power-toggle"/>
        <InfoDisplay text="Info" id={this.props.ids.infoId}/>
        <Slider className="form-group" defaultValue={50}/>
        <Toggle label="Bank" name="bank-toggle"/>    
      </div>
    );
  }
}

class Toggle extends Component {
  render() {
    return (
      <fieldset className="form-group Toggle">
        <legend>
          {this.props.label}
        </legend>
        <div className="btn-group btn-group-toggle" role="group" data-toggle="buttons">
          <label className="btn btn-primary">
            <input type="radio" name={this.props.name} id={this.props.name + "-off"} autoComplete="off"/>
            Off
          </label>
          <label className="btn btn-primary">
            <input type="radio" name={this.props.name} id={this.props.name + "-on"} autoComplete="off" />
            On
          </label>
        </div>
      </fieldset>
    );
  }
}

class InfoDisplay extends Component {
  render() {
    return (
      <div className="form-group bg-info text-white p-3" id={this.props.id}>
        {this.props.text}
      </div>
    );
  }
}

export default App;
