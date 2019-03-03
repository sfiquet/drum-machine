import React, { Component } from 'react';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import './App.css';

class App extends Component {
  render() {
    const setupBoard = {
      rows: 3,
      cols: 3,
      keys: 'QWEASDZXC',
    };
    const ids = {
      machineId: "drum-machine",
      infoId: "display",
    };
    const assetPath = './assets/';
    const banks = [[
        `${assetPath}Heater-1.mp3`,
        `${assetPath}Heater-2.mp3`,
        `${assetPath}Heater-3.mp3`,
        `${assetPath}Heater-4_1.mp3`,
        `${assetPath}Heater-6.mp3`,
        `${assetPath}Dsc_Oh.mp3`,
        `${assetPath}Kick_n_Hat.mp3`,
        `${assetPath}RP4_KICK_1.mp3`,
        `${assetPath}Cev_H2.mp3`,
      ], [
        `${assetPath}Chord_1.mp3`,
        `${assetPath}Chord_2.mp3`,
        `${assetPath}Chord_3.mp3`,
        `${assetPath}Give_us_a_light.mp3`,
        `${assetPath}Dry_Ohh.mp3`,
        `${assetPath}Bld_H1.mp3`,
        `${assetPath}punchy_kick_1.mp3`,
        `${assetPath}side_stick_1.mp3`,
        `${assetPath}Brk_Snr.mp3`,
      ],
    ];
    return (
      <div className="App">
        <header className="App-header">
          <h1>Drum Machine</h1>
        </header>
        <main className="container my-1">
          <DrumMachine board={setupBoard} banks={banks} ids={ids}/>
        </main>
      </div>
    );
  }
}

class DrumMachine extends Component {
  constructor(props){
    super(props);
    this.state = {
      isPowerOn: true,
      volume: 50,
      bank: 0,
    };
    this.handlePowerChange = this.handlePowerChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleBankChange = this.handleBankChange.bind(this);
  }

  handlePowerChange(isPowerOn){
    this.setState({isPowerOn: isPowerOn});
  }

  handleVolumeChange(volume){
    this.setState({volume: volume});
  }

  handleBankChange(bank){
    this.setState({bank: bank});
  }

  render() {
    const flatBoard = [...this.props.board.keys].map((key, keyid) => ({
      key: key, 
      clip: this.props.banks[this.state.bank][keyid],
    }));
    const board = flatBoard.reduce((rows, item, itemid) => {
      if (itemid % this.props.board.cols === 0){
        rows.push([item]);
      } else {
        rows[rows.length - 1].push(item);
      }
      return rows;
    }, []);

    const {machineId, ...drumCtrlIds} = this.props.ids;
    return (
      <div className="row" id={machineId}>
        <div className="col-12 col-sm-6 d-flex flex-column justify-content-center">
          <DrumPadBoard board={board}/>
        </div>
        <div className="col-12 col-sm-6 d-flex flex-column justify-content-center">
          <DrumControl 
            ids={drumCtrlIds} 
            isPowerOn={this.state.isPowerOn} 
            volume={this.state.volume} 
            bank={this.state.bank}
            onPowerChange={this.handlePowerChange}
            onVolumeChange={this.handleVolumeChange}
            onBankChange={this.handleBankChange}
          />
        </div>
      </div>
    );
  }
}

// this.props.board - 2d array of objects {key, clip}
class DrumPadBoard extends Component {
  render() {
    const board = this.props.board.map((row, rowid) => {
      const rowTiles = row.map((tile, colid) => (
        <div className="col" key={colid}>
          <DrumPad text={tile.key} clip={tile.clip}/>
        </div>
      ));

      return (
        <div className="row" key={rowid}>
          {rowTiles}
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
          <audio className="clip" id={this.props.text} src={this.props.clip} type="audio/mp3" preload="metadata">
            !
          </audio>
        </div>
      </button>
    );
  }
}

class DrumControl extends Component {
  render() {
    return (
      <div>
        <Toggle label="Power" values={['Off', 'On']} name="power-toggle" selected={this.props.isPowerOn? 1 : 0} onChange={this.props.onPowerChange}/>
        <InfoDisplay text="Info" id={this.props.ids.infoId}/>
        <Slider className="form-group" defaultValue={50} value={this.props.volume} onChange={this.props.onVolumeChange}/>
        <Toggle label="Bank" values={['1', '2']} name="bank-toggle" selected={this.props.bank} onChange={this.props.onBankChange}/>    
      </div>
    );
  }
}

// props: label, values, name, selected, onChange
class Toggle extends Component {
  constructor(props){
    super(props);
    this.handleToggleChange = (e) => {
      const checkedEl = e.currentTarget.querySelector('input').id;
      let index = 0;
      const suffix = checkedEl.split(`${this.props.name}-`);
      if (suffix.length > 1 && suffix[0] === ''){
        index = suffix[1];
      }
      this.props.onChange(index);
    }; 
  }

  render() {
    const defaultValues = ['0', '1'];
    let values = this.props.values;
    if (!Array.isArray(this.props.values) || this.props.values.length < 2){
      values = defaultValues;
    }
    const radiobuttons = values.map((item, index) => {
      const checked = (index === this.props.selected);
      return (
      <label className={"btn btn-secondary" + (checked ? " active" : "")}  key={index} onClick={this.handleToggleChange}>
        <input type="radio" name={this.props.name} id={`${this.props.name}-${index}`} 
          autoComplete="off" defaultChecked={checked}/>
        {item}
      </label>
    )});

    return (
      <fieldset className="form-group Toggle">
        <legend>
          {this.props.label}
        </legend>
        <div className="btn-group btn-group-toggle" role="group" data-toggle="buttons">
          {radiobuttons}
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
