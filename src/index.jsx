import React from 'react';
import PropTypes from 'prop-types';
import { isNil, isNumber, toString } from 'lodash';
import numeral from 'numeral';
import classnames from 'classnames';

const propTypes = {
  className: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  placeholder: PropTypes.string,
  decimals: PropTypes.number,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  autoCorrect: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onEnter: PropTypes.func,
  onEscape: PropTypes.func
};

const defaultProps = {
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  decimals: 2,
  disabled: false,
  format: '0,0.00',
  autoCorrect: false
};

const keyCodes = {
  enter: 13,
  escape: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

const Helper = {
  anyChanges(properties, prevProps, props) {
    for (const property of properties) {
      if (prevProps[property] !== props[property]) {
        return true;
      }
    }

    return false;
  },

  createNumericRegex(hasDecimal, hasSign) {
    let regexString = '^';
    if (hasSign) {
      regexString += '-?';
    }

    regexString += '(?:(?:\\d+';
    if (hasDecimal) {
      regexString += '(\\.\\d*)?';
    }

    regexString += ')|(?:\\.\\d*))?$';
    return new RegExp(regexString);
  }
};

class NumericTextboxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.focused = false;
    this.numericRegex = null;
    this.numericInput = null;
    this.value = this.props.value;
    this.state = {
      value: ''
    };
  }

  componentDidMount() {
    this.setInputValue();
  }

  componentDidUpdate(prevProps) {
    this.verifySettings();

    if (Helper.anyChanges(['autoCorrect', 'decimals'], prevProps, this.props)) {
      delete this.numericRegex;
    }

    if (Helper.anyChanges(['format'], prevProps, this.props)) {
      this.setInputValue();
    }

    if (Helper.anyChanges(['value'], prevProps, this.props)) {
      const { value, autoCorrect } = this.props;
      let newValue = this.restrictDecimals(value);
      if (autoCorrect && this.limitValue(newValue) !== newValue) {
        newValue = null;
      }

      this.value = newValue;
      this.setInputValue();
    }
  }

  render() {
    const { placeholder, disabled, className } = this.props;
    const { value } = this.state;
    return (
      <input
        ref={(element) => this.numericInput = element}
        type="text"
        className={classnames('form-control', className)}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={() => this.handleInput()}
        onBlur={() => this.handleBlur()}
        onFocus={() => this.handleFocus()}
        onKeyDown={(event) => this.handleKeyDown(event)} />
    );
  }

  handleInput() {
    const { selectionStart, selectionEnd, value } = this.numericInput;
    if (!this.isValidInput(value)) {
      this.setInputValue(this.value);
      this.setSelection(selectionStart - 1, selectionEnd - 1);
    } else {
      const orginalInputValue = this.parseNumber(value);
      let limitInputValue = this.restrictDecimals(orginalInputValue);
      const { autoCorrect } = this.props;
      if (autoCorrect) {
        limitInputValue = this.limitValue(limitInputValue);
      }

      if (orginalInputValue !== limitInputValue) {
        this.setInputValue(limitInputValue);
        this.setSelection(selectionStart, selectionEnd);
      } else {
        this.setInputValue(value);
      }

      this.updateValue(limitInputValue);
    }
  }

  handleFocus() {
    if (!this.focused) {
      this.focused = true;
      this.setInputValue();
      setTimeout(() => {
        const { value } = this.state;
        this.setSelection(0, value.length)
      });
    }

    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  }

  handleBlur() {
    if (this.focused) {
      this.focused = false;
      this.setInputValue();
    }

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  }

  handleKeyDown(event) {
    const { disabled, onEnter, onEscape } = this.props;
    if (!disabled) {
      switch (event.which) {
        case keyCodes.down:
          this.addStep(-1);
          break;
        case keyCodes.up:
          this.addStep(1);
          break;
        case keyCodes.enter:
          if (onEnter) {
            onEnter();
          }
          break;
        case keyCodes.escape:
          if (onEscape) {
            onEscape();
          }
          break;
      }
    }
  }

  verifySettings() {
    const { min, max, decimals } = this.props;
    if (isNumber(min) && isNumber(max) && min > max) {
      throw new Error('The max value should be bigger than the min value');
    }

    if (isNumber(decimals) && decimals < 0) {
      throw new Error('The decimals value should be bigger than 0');
    }
  }

  isValidInput(input) {
    let numericRegex = this.numericRegex;
    if (isNil(numericRegex)) {
      const { min, decimals, autoCorrect } = this.props;
      let hasDecimal = true;
      if (isNumber(decimals) && decimals === 0) {
        hasDecimal = false;
      }

      let hasSign = true;
      if (isNumber(min) && min >= 0 && autoCorrect) {
        hasSign = false;
      }

      numericRegex = Helper.createNumericRegex(hasDecimal, hasSign);
    }

    return numericRegex.test(input);
  }

  parseNumber(input) {
    return numeral(input).value();
  }

  addStep(step) {
    let value = this.value ? step + this.value : step;
    value = this.limitValue(value);
    value = this.restrictDecimals(value);
    this.setInputValue(value);
    this.updateValue(value);
  }

  restrictDecimals(value) {
    const { decimals } = this.props;
    if (isNumber(decimals)) {
      const words = String(value).split('.');
      if (words.length === 2) {
        const decimalPart = words[1];
        if (decimalPart.length > decimals) {
          value = parseFloat(words[0] + '.' + decimalPart.substr(0, decimals));
        }
      }
    }

    return value;
  }

  limitValue(value) {
    const { min, max } = this.props;
    if (isNumber(max) && value > max) {
      return max;
    }

    if (isNumber(min) && value < min) {
      return min;
    }

    return value;
  }

  setInputValue(value = null) {
    if (isNil(value)) {
      value = this.value;
    }
    const inputValue = this.formatValue(value);
    if (inputValue !== this.state.value) {
      this.setState({ value: inputValue });
    }
  }

  updateValue(value) {
    if (this.value !== value) {
      this.previousValue = this.value;
      this.value = value;
      const { onChange } = this.props;
      if (onChange) {
        onChange(value);
      }
    }
  }

  formatValue(value) {
    if (!isNil(value)) {
      if (this.focused) {
        return this.formatInputValue(value);
      } else {
        return this.formatNumber(value);
      }
    }

    return '';
  }

  formatInputValue(value) {
    return String(value);
  }

  formatNumber(value) {
    const { format } = this.props;
    if (format) {
      return numeral(value).format(format);
    } else {
      return toString(value);
    }
  }

  setSelection(start, end) {
    this.numericInput.setSelectionRange(start, end);
  }
}

NumericTextboxComponent.propTypes = propTypes;
NumericTextboxComponent.defaultProps = defaultProps;
export default NumericTextboxComponent;