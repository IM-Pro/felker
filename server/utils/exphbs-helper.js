module.exports = {
  equals: function (val1, val2) {
    return val1 == val2;
  },
  isBigger: function (numBigger, numLower) {
    return Number(numBigger) > Number(numLower);
  },
  inRange: function (val, arr) {
    return (typeof arr == 'object' && arr.includes(val.trim()));
  },
  inc: function (val, increment) {
    return Number(val) + Number(increment);
  },
  isNotEmpty: function (val) {
    let result = false;
    if (typeof val == 'object') {
      result = (Object.keys(val).length > 0);
    }
    return result;
  },
  pre: function (val) {
    
    return `<pre>${val}</pre>`;
  },
  sum: function(val1, val2) {
    const frst = Number(val1);
    const scnd = Number(val2);
    if (typeof frst == 'number' && typeof scnd == 'number') {
      return frst + scnd;
    }

    return 0;
  },
  ifCond: function (v1, operator, v2, options) {

    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  }
}