import React from 'react';
import { isNaN, toString } from 'lodash';
import NumericTextboxComponent from '../../../src';

class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10,
      min: -1000,
      max: 1000,
      disabled: false,
      autoCorrect: false,
      decimals: 3,
      placeholder: 'Input your number',
      format: '$ 0,0.000',
      rangeValidation: true
    };
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate() {
    this.updateState();
  }

  updateState() {
    const { value, min, max, decimals, valueNumber, minNumber, maxNumber, decimalsNumber } = this.state;
    let newValueNumber = this.parseValue(value);
    if (newValueNumber !== valueNumber) {
      this.setState({ valueNumber: newValueNumber });
    }

    let newMinNumber = this.parseValue(min);
    if (newMinNumber !== minNumber) {
      this.setState({ minNumber: newMinNumber });
    }

    let newMaxNumber = this.parseValue(max);
    if (newMaxNumber !== maxNumber) {
      this.setState({ maxNumber: newMaxNumber });
    }

    let newDecimalsNumber = this.parseValue(decimals);
    if (newDecimalsNumber !== decimalsNumber) {
      this.setState({ decimalsNumber: newDecimalsNumber });
    }
  }

  parseValue(text) {
    const value = parseFloat(text);
    return isNaN(value) ? null : value;
  }

  render() {
    const { value, min, max, disabled, autoCorrect, decimals, placeholder, format, rangeValidation, valueNumber, minNumber, maxNumber, decimalsNumber } = this.state;
    return (
      <div className="row">
        <div className="col-6">
          <div className="form-group">
            <p><strong>Configuration</strong></p>
          </div>
          <div className="form-group row">
            <label htmlFor="value" className="col-2 col-form-label">Value</label>
            <div className="col-10">
              <input
                id="value"
                value={value}
                onChange={(event) => this.setState({ value: event.target.value })}
                type="number"
                className="form-control"
                placeholder="Value"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="min" className="col-2 col-form-label">Min</label>
            <div className="col-10">
              <input
                id="min"
                value={min}
                onChange={(event) => this.setState({ min: event.target.value })}
                type="number"
                className="form-control"
                placeholder="Min"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="max" className="col-2 col-form-label">Max</label>
            <div className="col-10">
              <input
                id="max"
                value={max}
                onChange={(event) => this.setState({ max: event.target.value })}
                type="number"
                className="form-control"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-12">
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    checked={disabled}
                    onChange={() => this.setState({ disabled: !disabled })}
                    className="form-check-input"
                  />
                  Disabled
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    checked={autoCorrect}
                    onChange={() => this.setState({ autoCorrect: !autoCorrect })}
                    className="form-check-input"
                  />
                  Auto correct
                </label>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="decimals" className="col-2 col-form-label">Decimals</label>
            <div className="col-10">
              <input
                id="decimals"
                value={decimals}
                onChange={(event) => this.setState({ decimals: event.target.value })}
                type="number"
                className="form-control"
                placeholder="Decimals"
                min="0"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="format" className="col-2 col-form-label">Format</label>
            <div className="col-10">
              <input
                id="format"
                value={format}
                onChange={(event) => this.setState({ format: event.target.value })}
                type="text"
                className="form-control"
                placeholder="Format"
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="format" className="col-2 col-form-label">Placeholder</label>
            <div className="col-10">
              <input
                id="format"
                value={placeholder}
                onChange={(event) => this.setState({ placeholder: event.target.value })}
                type="text"
                className="form-control"
                placeholder="Placeholder"
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <p><strong>Component</strong></p>
          </div>
          <div className="form-group">
            <form>
              <NumericTextboxComponent
                name="currency"
                className="form-control"
                min={minNumber}
                max={maxNumber}
                disabled={disabled}
                autoCorrect={autoCorrect}
                decimals={decimalsNumber}
                format={format}
                rangeValidation={rangeValidation}
                value={valueNumber}
                placeholder={placeholder}
                onChange={(event) => this.onValueNumberChange(event)}
              />
            </form>
          </div>
          <div className="form-group">
            <p>Model: {valueNumber}</p>
          </div>
          <div className="form-group">
            <button className="btn btn-secondary" onClick={() => this.doubleValue()} >Double Value</button>
          </div>
        </div>
      </div>
    );
  }

  onValueNumberChange(event) {
    const valueNumber = event;
    const value = toString(valueNumber);
    this.setState({ value, valueNumber });
  }

  doubleValue() {
    this.setState({
      value: this.state.value * 2
    });
  }
}

export default Basic;