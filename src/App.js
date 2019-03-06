import React, { Component } from 'react';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import './App.css';
import audio1 from './assets/Heater-1.mp3';
import audio2 from './assets/Heater-2.mp3';
import audio3 from './assets/Heater-3.mp3';
import audio4 from './assets/Heater-4_1.mp3';
import audio5 from './assets/Heater-6.mp3';
import audio6 from './assets/Dsc_Oh.mp3';
import audio7 from './assets/Kick_n_Hat.mp3';
import audio8 from './assets/RP4_KICK_1.mp3';
import audio9 from './assets/Cev_H2.mp3';
import audio10 from './assets/Chord_1.mp3';
import audio11 from './assets/Chord_2.mp3';
import audio12 from './assets/Chord_3.mp3';
import audio13 from './assets/Give_us_a_light.mp3';
import audio14 from './assets/Dry_Ohh.mp3';
import audio15 from './assets/Bld_H1.mp3';
import audio16 from './assets/punchy_kick_1.mp3';
import audio17 from './assets/side_stick_1.mp3';
import audio18 from './assets/Brk_Snr.mp3';

class App extends Component {
  render() {
    const setupBoard = {
      rows: 3,
      cols: 3,
      keys: [
        { kbKey: 'Q', kbCode: 'KeyQ'},
        { kbKey: 'W', kbCode: 'KeyW'},
        { kbKey: 'E', kbCode: 'KeyE'},
        { kbKey: 'A', kbCode: 'KeyA'},
        { kbKey: 'S', kbCode: 'KeyS'},
        { kbKey: 'D', kbCode: 'KeyD'},
        { kbKey: 'Z', kbCode: 'KeyZ'},
        { kbKey: 'X', kbCode: 'KeyX'},
        { kbKey: 'C', kbCode: 'KeyC'},
      ],
    };
    const ids = {
      machineId: "drum-machine",
      infoId: "display",
    };
    const banks = [[
        audio1,
        audio2,
        audio3,
        audio4,
        audio5,
        audio6,
        audio7,
        audio8,
        audio9,
      ], [
        audio10,
        audio11,
        audio12,
        audio13,
        audio14,
        audio15,
        audio16,
        audio17,
        audio18,
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
    const flatBoard = this.props.board.keys.map((key, keyid) => ({
      kbKey: key.kbKey,
      kbCode: key.kbCode,
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


// this.props.board - 2d array of objects {kbKey, kbCode, clip}
class DrumPadBoard extends Component {
  render() {
    const board = this.props.board.map((row, rowid) => {
      const rowTiles = row.map((tile, colid) => (
        <div className="col" key={colid}>
          <DrumPad kbKey={tile.kbKey} kbCode={tile.kbCode} clip={tile.clip}/>
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
  constructor(props){
    super(props);
    this.audioRef = React.createRef();
    this.playClip = this.playClip.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  async playClip(event){
    
    if (this.audioRef.current === null){
      return;
    }

    try {
      await this.audioRef.current.play();
    } catch(err) {
      console.log(err);
    }
  }

  handleKeyDown(e){
    if (e.isDefaultPrevented){
      return;
    }

    // avoid messing with special keys
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey){
      return;
    }

    // handle keys
    if (e.code === this.props.kbCode || e.key.toUpperCase() === this.props.kbKey){
      this.playClip(e);
      e.preventDefault();
    }
  }

  render() {
    return (
      <button type="button" className="btn btn-secondary DrumPad drum-pad" id={"clip-" + this.props.kbKey} onClick={this.playClip}>
        <div className="DrumPadText d-flex flex-column justify-content-center">
          <div>
        {this.props.kbKey}
          </div>
          <audio className="clip" ref={this.audioRef} id={this.props.kbKey} src={this.props.clip} type="audio/mpeg" preload="metadata">
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
