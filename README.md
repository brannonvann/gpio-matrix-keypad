# gpio-matrix-keypad

This is a simple node package I developed after having trouble with some of the other packages available. I tested this with a 3x4 keypad and a raspberry pi. Please make sure that you row GPIO connections are either all pulldown or all pullup. If you use pullup connections you will need to set defaultState = 0 in the options.

The default pullup/pulldown GPIO connections can be seen in Table 6-31 in the [BCM2835 ARM Peripherals](http://www.farnell.com/datasheets/1521578.pdf) documentation.

## Install

        npm install gpio-matrix-keypad --save

## Usage

    const Keypad = require('gpio-matrix-keypad');

    const options = {
        keys: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['*', '0', '#']
        ], // keypad layout
        rows: [26, 19, 13, 21], // row GPIO pins. Use ones that pull down or are configured to pull down
        columns: [11, 9, 10], // colum GPIO pins,
        onKey: (key)=> console.log(key) //key pressed
        //defaultState: 1 // 1 for pulldown row gpio, 0 for pullup rows. The default is 1. Mixing of pullup/pulldown for the row connections is not supported.
    };

    Keypad.listen(options)

## Example

This is an example of using this package to acquire a 4 digit pin code and doing something with it.

    const Keypad = require('gpio-matrix-keypad');

    let pin = [];

    function newKey(key) {
        pin.push(key);

        if (pin.length === 4) submit();
    }

    function submit() {
        console.log(pin.join(''));
        pin = [];
    }

    const options = {
        keys: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['*', '0', '#']
        ], // keypad layout
        rows: [26, 19, 13, 21], // row GPIO pins. Use ones that pull down or are configured to pull down
        columns: [11, 9, 10], // colum GPIO pins,
        onKey: newKey
        //defaultState: 1 // 1 for pulldown row gpio, 0 for pullup rows. The default is 1. Mixing of pullup/pulldown for the row connections is not supported.
    };

    Keypad.listen(options)
