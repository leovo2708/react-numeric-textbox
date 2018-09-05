# react-numeric-textbox

An ReactJS numeric textbox component

## Dependencies

* [ReactJS](https://reactjs.org/)
* [Lodash](https://lodash.com)
* [Numeral](http://numeraljs.com)
* [Bootstrap 4](http://getbootstrap.com/)

You can customize CSS yourself to break down dependencies to Bootstrap.

## Demo

[https://leovo2708.github.io/react-numeric-textbox/](https://leovo2708.github.io/react-numeric-textbox/)

## Installation

After install the above dependencies, install `react-numeric-textbox` via:
```shell
npm install react-numeric-textbox --save
```

## Usage

```js
<NumericTextboxComponent
  min={min}
  max={max}
  disabled={disabled}
  autoCorrect={autoCorrect}
  decimals={decimals}
  format={format}
  value={value}
  placeholder={placeholder}
  onChange={(event) => this.onChange(event)}
  onFocus={() => this.onFocus(event)}
  onBlur={() => this.onBlur(event)}
  onEnter={() => this.onEnter(event)}
  onEscape={() => this.onEscape(event)}
/>
```

## API
```js
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
```

* format string: [http://numeraljs.com/#format](http://numeraljs.com/#format)

## Contributing

I am very appreciate for your ideas, proposals and found bugs which you can leave in github issues. Thanks in advance!