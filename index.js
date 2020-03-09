const Gpio = require('onoff').Gpio;

let rows = [];
let columns = [];
let keys = [];
let onKey = () => {};
let reading = null;

const reset = () => {
  //reset all columns
  for (const col of columns) {
    col.writeSync(defaultState);
  }
};

const listen = options => {
  onKey = options.onKey;
  keys = options.keys;
  defaultState = options.defaultState || 1; //1

  for (let r = 0; r < options.rows.length; r++) {
    const row = new Gpio(options.rows[r], 'in', 'rising', { debounceTimeout: 150 });
    rows.push(row);
  }
  for (let c = 0; c < options.columns.length; c++) {
    const col = new Gpio(options.columns[c], 'out');
    columns.push(col);
  }

  reset();

  setInterval(() => {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];

      const rowOn = row.readSync() === 1;

      if (rowOn && reading) {
        //a button is being pressed still.
        return;
      } else if (rowOn) {
        //console.log('ROW', r);
        for (let c = 0; c < columns.length; c++) {
          const col = columns[c];

          //turn off a column
          col.writeSync(1 - defaultState); //use the opposite of the default state

          //is row still receiving a signal
          if (row.readSync() === 0) {
            //key identified
            const key = keys[r][c];
            onKey(key);
            reading = key;
            reset();
            return;
          }
        }
      }
    }
    reading = null;
  }, 100);
};

exports.listen = listen;
