var fs = require('fs');

// Set temporal variables
var init_time = +new Date;
function get_time() {
    nix_time = +new Date;
    time = new Date();
    utc = time.toUTCString();
}
get_time();

// Set coin variables
var tx_gl = 0; tx_json = ""; coin_name = ""; txt = ""; tx_ac =0; txps_ac =0;
var BTC_txps_gl = 0; BTC_txps = 0; BTC_count = 0;
var BCH_txps_gl = 0; BCH_txps = 0; BCH_count = 0;
var KMD_txps_gl = 0; KMD_txps = 0; KMD_count = 0; 
var ZEC_txps_gl = 0; ZEC_txps = 0; ZEC_count = 0;
var DASH_txps_gl = 0; DASH_txps = 0; DASH_count = 0;
var LTC_txps_gl = 0; LTC_txps = 0; LTC_count = 0;
var HUSH_txps_gl = 0; HUSH_txps = 0; HUSH_count = 0;
var ZEN_txps_gl = 0; ZEN_txps = 0; ZEN_count = 0;

// Set TXSCL variables
var TXSCL_txps_gl = 0; TXSCL_txps = 0; TXSCL_count = 0; TXSCL_count =0;
var TXSCL000_txps_gl = 0; TXSCL000_txps = 0; TXSCL000_count = 0; TXSCL000_ac =0;
var TXSCL001_txps_gl = 0; TXSCL001_txps = 0; TXSCL001_count = 0; TXSCL001_ac =0;
var TXSCL002_txps_gl = 0; TXSCL002_txps = 0; TXSCL002_count = 0; TXSCL002_ac =0;
var TXSCL003_txps_gl = 0; TXSCL003_txps = 0; TXSCL003_count = 0; TXSCL003_ac =0;
var TXSCL004_txps_gl = 0; TXSCL004_txps = 0; TXSCL004_count = 0; TXSCL004_ac =0;
var TXSCL005_txps_gl = 0; TXSCL005_txps = 0; TXSCL005_count = 0; TXSCL005_ac =0;
var TXSCL006_txps_gl = 0; TXSCL006_txps = 0; TXSCL006_count = 0; TXSCL006_ac =0;
var TXSCL007_txps_gl = 0; TXSCL007_txps = 0; TXSCL007_count = 0; TXSCL007_ac =0;

// Set log file
var logfile = "./combined_log.json";
var plotfile = "./combined_plot.json";

// interval_max is the seconds over which tx count will be averaged
// Low values will result in a misleadingly large tx/s when a block with a large mempool is solved quickly
// Recommend this value be at least 1/4 average block time (e.g. 300s or more for BTC)
// For coins with differing average block times, multiple interval variables could apply (on to do list).
var interval_max = 300;
var interval = 0; runtime = 0;

// Function for smoothing interval count up to max value in line with runtime
var interval_countup = setInterval(countup, 1000);
function countup() {
    runtime = Date.now() - init_time;
    if (runtime < interval_max * 1000) {
        interval++;
    }
}

// functions to track number of tx during interval
function apply_count(counter) { counter++; setTimeout(function(){ uncount(counter); }, interval*1000); }
function uncount(coin) { coin--; return coin; }

// Translate colors to english
var col = require('./colors.js');
green = color_2;
magenta = color_5;
cyan = color_6;
ltmagenta = color_13
LTCyan = color_14;
white = color_15;
blue = color_27;
mdblue = color_39;
altgreen = color_40;
ltblue = color_45;
dkgreen = color_74;
ltgreen = color_84;
altblue = color_153;
purp = color_165;
ltpurp = color_172;
fadeblue = color_195;
red = color_198;
ltred = color_202;
orange = color_212;
ltorange = color_224;
yellow = color_226;
ltyellow = color_229;
darkgrey = color_236;
ltgrey = color_239;
grey = color_244;

// Set tx speed heatramp
heat = blue; heat_gl = blue;
heat1=color_158;
heat2=color_156;
heat3=color_154;
heat4=color_82;
heat5=color_84;
heat6=color_86;
heat7=color_111;
heat8=color_141;
heat9=color_213;
heat10=color_207;
heat11=color_204;
heat12=color_202;
heat13=color_198;
heat14=color_196;

// Set column headings color
headings_col=color_33;

// Set coin text colors
BCH_col1=color_71; 
BCH_col2=color_155;
BTC_col1=color_228;
BTC_col2=color_3;
DASH_col1=color_69;
DASH_col2=color_27;
HUSH_col1=color_49;
HUSH_col2=color_127;
KMD_col1=color_10;
KMD_col2=color_2;
LTC_col1=color_242;
LTC_col2=color_231;
ZEC_col1=color_216;
ZEC_col2=color_208;
ZEN_col1=color_66;
ZEN_col2=color_108;
// set TXSCL text colours
TXSCL_col1=color_105; 
TXSCL_col2=color_93;
TXSCL000_col1=color_105; 
TXSCL000_col2=color_93;
TXSCL001_col1=color_105; 
TXSCL001_col2=color_93;
TXSCL002_col1=color_105; 
TXSCL002_col2=color_93;
TXSCL003_col1=color_105; 
TXSCL003_col2=color_93;
TXSCL004_col1=color_105; 
TXSCL004_col2=color_93;
TXSCL005_col1=color_105; 
TXSCL005_col2=color_93;
TXSCL006_col1=color_105; 
TXSCL006_col2=color_93;
TXSCL007_col1=color_105; 
TXSCL007_col2=color_93;

// fuction to colourize individual coin's tx/s heatramp colouring
function colorize_txps_i(tx) {
    switch(true) {
        case (tx < 0.5): heat = heat1; break;
        case (tx < 1): heat = heat2; break;
        case (tx < 1.5): heat = heat3; break;
        case (tx < 2.5): heat = heat4; break;
        case (tx < 3.5): heat = heat5; break;
        case (tx < 5): heat = heat6; break;
        case (tx < 7): heat = heat7; break;
        case (tx < 10): heat = heat8; break;
        case (tx < 20): heat = heat9; break;
        case (tx < 50): heat = heat10; break;
        case (tx < 100): heat = heat11; break;
        case (tx < 150): heat = heat12; break;
        case (tx < 200): heat = heat13; break;
        case (tx >= 200): heat = heat14; break;
        default: heat = grey;
    } 
}


// fuction to colourize sum of Asset chain coins' tx/s heatramp colouring
function colorize_txps_e(tx) {
    switch(true) {
        case (tx < 1): heat_ac = heat1; break;
        case (tx < 2): heat_ac = heat2; break;
        case (tx < 4): heat_ac = heat3; break;
        case (tx < 8): heat_ac = heat4; break;
        case (tx < 16): heat_ac = heat5; break;
        case (tx < 32): heat_ac = heat6; break;
        case (tx < 64): heat_ac = heat7; break;
        case (tx < 128): heat_ac = heat8; break;
        case (tx < 256): heat_ac = heat9; break;
        case (tx < 512): heat_ac = heat10; break;
        case (tx < 1024): heat_ac = heat11; break;
        case (tx < 2048): heat_ac = heat12; break;
        case (tx < 4096): heat_ac = heat13; break;
        case (tx >= 4096): heat_ac = heat14; break;
        default: heat_ac = grey;
    } 
}

// fuction to colourize sum of all coins and asset chain coins' tx/s heatramp colouring
function colorize_txps_g(tx) {
    switch(true) {
        case (tx < 1): heat_gl = heat1; break;
        case (tx < 2): heat_gl = heat2; break;
        case (tx < 3): heat_gl = heat3; break;
        case (tx < 4): heat_gl = heat4; break;
        case (tx < 5): heat_gl = heat5; break;
        case (tx < 10): heat_gl = heat6; break;
        case (tx < 20): heat_gl = heat7; break;
        case (tx < 40): heat_gl = heat8; break;
        case (tx < 80): heat_gl = heat9; break;
        case (tx < 150): heat_gl = heat10; break;
        case (tx < 250): heat_gl = heat11; break;
        case (tx < 500): heat_gl = heat12; break;
        case (tx < 1000): heat_gl = heat13; break;
        case (tx >= 1000): heat_gl = heat14; break;
        default: heat_gl = grey;
    } 
}

// Arrays for future use - on to do list
ac_names = ["TXSCL", "TXSCL000", "TXSCL001", "TXSCL002", "TXSCL003", "TXSCL004", "TXSCL005", "TXSCL006", "TXSCL007"];
coin_names = ["BCH", "BTC", "KMD", "LTC", "ZEC"];

// Functions to display column headings 5 seconds after starting app, and every 30 seconds.
var headerCountdown = setTimeout(showHeader, 5000);
var headerCountdown = setInterval(showHeader, 30000);
function showHeader() {
    console.log(white+"  --------------------------------------------------------------------------------------------------------------------------------------------------");
    console.log(white+" |"+headings_col+" ########### TIME ############ "+white+"|"+headings_col+" ######################## TRANSACTION ID ######################## "+white+"|"+headings_col+" # COIN # "+white+"|"+headings_col+" COIN TX/s "+white+"|"+headings_col+"  ALL TX/s "+white+"|"+headings_col+" TXSCL TX/s "+white+"|");
    console.log(white+"  --------------------------------------------------------------------------------------------------------------------------------------------------");
} 


// ###############################################################################
// ########################## Asset Chains #######################################
// ###############################################################################


// ################## TXSCL insight explorer socket connection ##################### 
var TXSCL_socket = require('socket.io-client')('http://txscl.meshbits.io/');
    TXSCL_socket.on('connect', function () {
    txt = green+"Connected to http://txscl.meshbits.io/ at "+utc+white;
    TXSCL_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL_count++; setTimeout(function(){ TXSCL_count = uncount(TXSCL_count) }, interval*1000);
    TXSCL_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL_json+",\r\n", function (err) {});
    TXSCL_txps = TXSCL_count/interval; txps_ac = tx_ac/interval; TXSCL_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL_col1+data.txid+white+" | "+TXSCL_col2+ac_name+white+"    | "+heat+TXSCL_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
   
});

// ################## TXSCL000 insight explorer socket connection ##################### 
var TXSCL000_socket = require('socket.io-client')('http://txscl000.meshbits.io/');
TXSCL000_socket.on('connect', function () {
    txt = green+"Connected to txscl000.meshbits.io at "+utc+white;
    TXSCL000_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL000_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL000"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL000_count++; setTimeout(function(){ TXSCL000_count = uncount(TXSCL000_count) }, interval*1000);
    TXSCL000_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL000_json+",\r\n", function (err) {});
    TXSCL000_txps = TXSCL000_count/interval; txps_ac = tx_ac/interval; TXSCL000_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL000_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL000_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL000_col1+data.txid+white+" | "+TXSCL000_col2+ac_name+white+" | "+heat+TXSCL000_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL000_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
     });

// ################## TXSCL001 insight explorer socket connection ##################### 
var TXSCL001_socket = require('socket.io-client')('http://txscl002.meshbits.io/');
TXSCL001_socket.on('connect', function () {
    txt = green+"Connected to txscl001.meshbits.io at "+utc+white;
    TXSCL001_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL001_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL001"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL001_count++; setTimeout(function(){ TXSCL001_count = uncount(TXSCL001_count) }, interval*1000);
    TXSCL001_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL001_json+",\r\n", function (err) {});
    TXSCL001_txps = TXSCL001_count/interval; txps_ac = tx_ac/interval; TXSCL001_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL001_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL001_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL001_col1+data.txid+white+" | "+TXSCL001_col2+ac_name+white+" | "+heat+TXSCL001_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL001_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
 });

// ################## TXSCL002 insight explorer socket connection ##################### 
var TXSCL002_socket = require('socket.io-client')('http://txscl002.meshbits.io/');
TXSCL002_socket.on('connect', function () {
    txt = green+"Connected to txscl002.meshbits.io at "+utc+white;
    TXSCL002_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL002_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL002"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL002_count++; setTimeout(function(){ TXSCL002_count = uncount(TXSCL002_count) }, interval*1000);    
    TXSCL002_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL002_json+",\r\n", function (err) {});
    TXSCL002_txps = TXSCL002_count/interval; txps_ac = tx_ac/interval; TXSCL002_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL002_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL002_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL002_col1+data.txid+white+" | "+TXSCL002_col2+ac_name+white+" | "+heat+TXSCL002_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL002_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
});

// ################## TXSCL003 insight explorer socket connection ##################### 
var TXSCL003_socket = require('socket.io-client')('http://txscl003.meshbits.io/');
TXSCL003_socket.on('connect', function () {
    txt = green+"Connected to txscl003.meshbits.io at "+utc+white;
    TXSCL003_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL003_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL003"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL003_count++; setTimeout(function(){ TXSCL003_count = uncount(TXSCL003_count) }, interval*1000);    
    TXSCL003_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL003_json+",\r\n", function (err) {});
    TXSCL003_txps = TXSCL003_count/interval; txps_ac = tx_ac/interval; TXSCL003_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL003_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL003_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL003_col1+data.txid+white+" | "+TXSCL003_col2+ac_name+white+" | "+heat+TXSCL003_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL003_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
});

// ################## TXSCL004 insight explorer socket connection ##################### 
var TXSCL004_socket = require('socket.io-client')('http://txscl004.meshbits.io/');
TXSCL004_socket.on('connect', function () {
    txt = green+"Connected to txscl004.meshbits.io at "+utc+white;
    TXSCL004_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL004_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL004"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL004_count++; setTimeout(function(){ TXSCL004_count = uncount(TXSCL004_count) }, interval*1000);
    TXSCL004_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL004_json+",\r\n", function (err) {});
    TXSCL004_txps = TXSCL004_count/interval; txps_ac = tx_ac/interval; TXSCL004_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL004_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL004_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL004_col1+data.txid+white+" | "+TXSCL004_col2+ac_name+white+" | "+heat+TXSCL004_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL004_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
 });

// ################## TXSCL005 insight explorer socket connection ##################### 
var TXSCL005_socket = require('socket.io-client')('http://txscl005.meshbits.io/');
TXSCL005_socket.on('connect', function () {
    txt = green+"Connected to txscl005.meshbits.io at "+utc+white;
    TXSCL005_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL005_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL005"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL005_count++; setTimeout(function(){ TXSCL005_count = uncount(TXSCL005_count) }, interval*1000);    
    TXSCL005_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL005_json+",\r\n", function (err) {});
    TXSCL005_txps = TXSCL005_count/interval; txps_ac = tx_ac/interval; TXSCL005_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL005_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL005_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL005_col1+data.txid+white+" | "+TXSCL005_col2+ac_name+white+" | "+heat+TXSCL005_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL005_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
});

// ################## TXSCL006 insight explorer socket connection ##################### 
var TXSCL006_socket = require('socket.io-client')('http://txscl006.meshbits.io/');
TXSCL006_socket.on('connect', function () {
    txt = green+"Connected to txscl006.meshbits.io at "+utc+white;
    TXSCL006_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL006_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL006"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL006_count++; setTimeout(function(){ TXSCL006_count = uncount(TXSCL006_count) }, interval*1000);
    TXSCL006_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL006_json+",\r\n", function (err) {});    
    TXSCL006_txps = TXSCL006_count/interval; txps_ac = tx_ac/interval; TXSCL006_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL006_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL006_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL006_col1+data.txid+white+" | "+TXSCL006_col2+ac_name+white+" | "+heat+TXSCL006_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL006_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
});

// ################## TXSCL007 insight explorer socket connection ##################### 
var TXSCL007_socket = require('socket.io-client')('http://txscl007.meshbits.io/');
TXSCL007_socket.on('connect', function () {
    txt = green+"Connected to txscl007.meshbits.io at "+utc+white;
    TXSCL007_socket.emit('subscribe', 'inv'); console.log(txt);
});

TXSCL007_socket.on('tx', function (data) {
    get_time(); ac_name = "TXSCL007"; 
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    tx_ac++; setTimeout(function(){ tx_ac = uncount(tx_ac) }, interval*1000);
    TXSCL007_count++; setTimeout(function(){ TXSCL007_count = uncount(TXSCL007_count) }, interval*1000);
    TXSCL007_json = '{"time": "'+time+'", "coin": "'+ac_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, TXSCL007_json+",\r\n", function (err) {});    
    TXSCL007_txps = TXSCL007_count/interval; txps_ac = tx_ac/interval; TXSCL007_txps_gl = tx_gl/interval;
    colorize_txps_i(TXSCL007_txps); colorize_txps_e(txps_ac); colorize_txps_g(TXSCL007_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+TXSCL007_col1+data.txid+white+" | "+TXSCL007_col2+ac_name+white+" | "+heat+TXSCL007_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+TXSCL007_txps_gl.toFixed(2)+" tx/s"+white+" | "+heat+txps_ac.toFixed(2)+" tx/s"+white+" |");
});


// ###############################################################################
// ########################## Reference Coins ####################################
// ###############################################################################

// ################## BTC insight explorer socket connection #####################
var BTC_socket = require('socket.io-client')('https://insight.bitpay.com/');
BTC_socket.on('connect', function () {
    BTC_txt = green+"Connected to https://insight.bitpay.com/ at "+utc+white
    BTC_socket.emit('subscribe', 'inv'); console.log(BTC_txt);
});

BTC_socket.on('tx', function (data) {
    get_time(); coin_name = "BTC";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    BTC_count++; setTimeout(function(){ BTC_count = uncount(BTC_count) }, interval*1000);
    BTC_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, BTC_json+",\r\n", function (err) {});
    BTC_txps = BTC_count/interval; BTC_txps_gl = tx_gl/interval; 
    colorize_txps_i(BTC_txps); colorize_txps_g(BTC_txps_gl); 
    console.log(fadeblue+" | "+utc+white+" | "+BTC_col1+data.txid+white+" |   "+BTC_col2+coin_name+white+"    | "+heat+BTC_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+BTC_txps_gl.toFixed(2)+" tx/s"+white+" |");
 });

// ################## BCH insight explorer socket connection #####################
var BCH_socket = require('socket.io-client')('https://BCH-insight.bitpay.com/');
BCH_socket.on('connect', function () {
    BCH_txt = green+"Connected to https://BCH-insight.bitpay.com at "+utc+white;
    BCH_socket.emit('subscribe', 'inv'); console.log(BCH_txt);
});

BCH_socket.on('tx', function (data) {
    get_time(); coin_name = "BCH";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    BCH_count++; setTimeout(function(){ BCH_count = uncount(BCH_count) }, interval*1000);
    BCH_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, BCH_json+",\r\n", function (err) {});
    BCH_txps = BCH_count/interval; BCH_txps_gl = tx_gl/interval; 
    colorize_txps_i(BCH_txps); colorize_txps_g(BCH_txps_gl); 
    console.log(fadeblue+" | "+utc+white+" | "+BCH_col1+data.txid+white+" |   "+BCH_col2+coin_name+white+"    | "+heat+BCH_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+BCH_txps_gl.toFixed(2)+" tx/s"+white+" |");
});

// ################## LTC insight explorer socket connection #####################
var LTC_socket = require('socket.io-client')('https://insight.litecore.io/');
LTC_socket.on('connect', function () {
    LTC_txt = green+"Connected to https://insight.litecore.io/ at "+utc+white;
    LTC_socket.emit('subscribe', 'inv'); console.log(LTC_txt);
});

LTC_socket.on('tx', function (data) {
    get_time(); coin_name = "LTC";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    LTC_count++; setTimeout(function(){ LTC_count = uncount(LTC_count) }, interval*1000);
    LTC_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, LTC_json+",\r\n", function (err) {});
    LTC_txps = LTC_count/interval; LTC_txps_gl = tx_gl/interval; 
    colorize_txps_i(LTC_txps); colorize_txps_g(LTC_txps_gl); 
    console.log(fadeblue+" | "+utc+white+" | "+LTC_col1+data.txid+white+" |   "+LTC_col2+coin_name+white+"    | "+heat+LTC_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+LTC_txps_gl.toFixed(2)+" tx/s"+white+" |");
});

// ################## ZEC insight explorer socket connection #####################
var ZEC_socket = require('socket.io-client')('https://zcashnetwork.info/');
ZEC_socket.on('connect', function () {
    ZEC_txt = green+"Connected to https://zcashnetwork.info/ at "+utc+white;
    ZEC_socket.emit('subscribe', 'inv'); console.log(ZEC_txt);
});

ZEC_socket.on('tx', function (data) {
    get_time(); coin_name = "ZEC";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    ZEC_count++; setTimeout(function(){ ZEC_count = uncount(ZEC_count) }, interval*1000);
    ZEC_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, ZEC_json+",\r\n", function (err) {});
    ZEC_txps = ZEC_count/interval; ZEC_txps_gl = tx_gl/interval; 
    colorize_txps_i(ZEC_txps); colorize_txps_g(ZEC_txps_gl); 
    console.log(fadeblue+" | "+utc+white+" | "+ZEC_col1+data.txid+white+" |   "+ZEC_col2+coin_name+white+"    | "+heat+ZEC_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+ZEC_txps_gl.toFixed(2)+" tx/s"+white+" |");
});

// ################## KMD insight explorer socket connection #####################
var KMD_socket = require('socket.io-client')('https://kmd.explorer.supernet.org/');
KMD_socket.on('connect', function () {
    KMD_txt = green+"Connected to https://kmd.explorer.supernet.org/ at "+utc+white;
    KMD_socket.emit('subscribe', 'inv'); console.log(KMD_txt);
});

KMD_socket.on('tx', function (data) {
    get_time(); coin_name = "KMD";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    KMD_count++; setTimeout(function(){ KMD_count = uncount(KMD_count) }, interval*1000);
    KMD_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, KMD_json+",\r\n", function (err) {});
    KMD_txps = KMD_count/interval; KMD_txps_gl = tx_gl/interval; 
    colorize_txps_i(KMD_txps); colorize_txps_g(KMD_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+KMD_col1+data.txid+white+" |   "+KMD_col2+coin_name+white+"    | "+heat+KMD_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+KMD_txps_gl.toFixed(2)+" tx/s"+white+" |");
});


// ################## KMD insight explorer socket connection #####################
var DASH_socket = require('socket.io-client')('https://insight.dash.siampm.com');
DASH_socket.on('connect', function () {
    DASH_txt = green+"Connected to https://DASH.explorer.supernet.org/ at "+utc+white;
    DASH_socket.emit('subscribe', 'inv'); console.log(DASH_txt);
});

DASH_socket.on('tx', function (data) {
    get_time(); coin_name = "DASH";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    DASH_count++; setTimeout(function(){ DASH_count = uncount(DASH_count) }, interval*1000);
    DASH_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, DASH_json+",\r\n", function (err) {});
    DASH_txps = DASH_count/interval; DASH_txps_gl = tx_gl/interval; 
    colorize_txps_i(DASH_txps); colorize_txps_g(DASH_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+DASH_col1+data.txid+white+" |   "+DASH_col2+coin_name+white+"   | "+heat+DASH_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+DASH_txps_gl.toFixed(2)+" tx/s"+white+" |");
});


// ################## HUSH insight explorer socket connection #####################
var HUSH_socket = require('socket.io-client')('https://explorer.myhush.org/');
HUSH_socket.on('connect', function () {
    HUSH_txt = green+"___________________________ Connected to https://explorer.myhush.org/ at "+utc+" _________________________________ "+white;
    HUSH_socket.emit('subscribe', 'inv'); console.log(HUSH_txt);
});

HUSH_socket.on('tx', function (data) {
    get_time(); coin_name = "HUSH";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    HUSH_count++; setTimeout(function(){ HUSH_count = uncount(HUSH_count) }, interval*1000);
    HUSH_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, HUSH_json+",\r\n", function (err) {});
    HUSH_txps = HUSH_count/interval; HUSH_txps_gl = tx_gl/interval; 
    colorize_txps_i(HUSH_txps); colorize_txps_g(HUSH_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+HUSH_col1+data.txid+white+" |   "+HUSH_col2+coin_name+white+"   | "+heat+HUSH_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+HUSH_txps_gl.toFixed(2)+" tx/s"+white+" |");
});

// ################## ZEN insight explorer socket connection #####################
var ZEN_socket = require('socket.io-client')('https://explorer.zen-solutions.io/');
ZEN_socket.on('connect', function () {
    ZEN_txt = green+"_______________________ Connected to https://explorer.zen-solutions.io/ at "+utc+" ____________________________ "+white;
    ZEN_socket.emit('subscribe', 'inv'); console.log(ZEN_txt);
});

ZEN_socket.on('tx', function (data) {
    get_time(); coin_name = "ZEN";
    tx_gl++; setTimeout(function(){ tx_gl = uncount(tx_gl) }, interval*1000);
    ZEN_count++; setTimeout(function(){ ZEN_count = uncount(ZEN_count) }, interval*1000);
    ZEN_json = '{"time": "'+time+'", "coin": "'+coin_name+'", "txid": "'+data.txid+'"}'; fs.appendFile(logfile, ZEN_json+",\r\n", function (err) {});
    ZEN_txps = ZEN_count/interval; ZEN_txps_gl = tx_gl/interval; 
    colorize_txps_i(ZEN_txps); colorize_txps_g(ZEN_txps_gl);
    console.log(fadeblue+" | "+utc+white+" | "+ZEN_col1+data.txid+white+" |   "+ZEN_col2+coin_name+white+"    | "+heat+ZEN_txps.toFixed(2)+" tx/s"+white+" | "+heat_gl+ZEN_txps_gl.toFixed(2)+" tx/s"+white+" |");
});


// Function for adding x y data to plotfile 
var get_xy = setInterval(plot_txps, 15000);
function plot_txps() {
    GLOBAL_graph = '{"class": "Global", "x": "'+nix_time+'", "y": "'+tx_gl/interval+'"}'; fs.appendFile(plotfile, GLOBAL_graph+",\r\n", function (err) {});
    BTC_graph = '{"class": "BTC", "x": "'+nix_time+'", "y": "'+BTC_txps+'"}'; fs.appendFile(plotfile, BTC_graph+",\r\n", function (err) {});
    DASH_graph = '{"class": "DASH", "x": "'+nix_time+'", "y": "'+DASH_txps+'"}'; fs.appendFile(plotfile, DASH_graph+",\r\n", function (err) {});
    KMD_graph = '{"class": "KMD", "x": "'+nix_time+'", "y": "'+KMD_txps+'"}'; fs.appendFile(plotfile, KMD_graph+",\r\n", function (err) {});
    ZEC_graph = '{"class": "ZEC", "x": "'+nix_time+'", "y": "'+ZEC_txps+'"}'; fs.appendFile(plotfile, ZEC_graph+",\r\n", function (err) {});
    LTC_graph = '{"class": "LTC", "x": "'+nix_time+'", "y": "'+LTC_txps+'"}'; fs.appendFile(plotfile, LTC_graph+",\r\n", function (err) {});
    BCH_graph = '{"class": "BCH", "x": "'+nix_time+'", "y": "'+BCH_txps+'"}'; fs.appendFile(plotfile, BCH_graph+",\r\n", function (err) {});
    ZEN_graph = '{"class": "LTC", "x": "'+nix_time+'", "y": "'+ZEN_txps+'"}'; fs.appendFile(plotfile, ZEN_graph+",\r\n", function (err) {});
    HUSH_graph = '{"class": "BCH", "x": "'+nix_time+'", "y": "'+HUSH_txps+'"}'; fs.appendFile(plotfile, HUSH_graph+",\r\n", function (err) {});
    AC_graph = '{"class": "Asset-Chains", "x": "'+nix_time+'", "y": "'+tx_ac/interval+'"}'; fs.appendFile(plotfile, AC_graph+",\r\n", function (err) {});
    TXSCL_graph = '{"class": "TXSCL", "x": "'+nix_time+'", "y": "'+TXSCL_txps+'"}'; fs.appendFile(plotfile, TXSCL_graph+",\r\n", function (err) {});
    TXSCL000_graph = '{"class": "TXSCL000", "x": "'+nix_time+'", "y": "'+TXSCL000_txps+'"}'; fs.appendFile(plotfile, TXSCL000_graph+",\r\n", function (err) {});
    TXSCL001_graph = '{"class": "TXSCL001", "x": "'+nix_time+'", "y": "'+TXSCL001_txps+'"}'; fs.appendFile(plotfile, TXSCL001_graph+",\r\n", function (err) {});
    TXSCL002_graph = '{"class": "TXSCL002", "x": "'+nix_time+'", "y": "'+TXSCL002_txps+'"}'; fs.appendFile(plotfile, TXSCL002_graph+",\r\n", function (err) {});
    TXSCL003_graph = '{"class": "TXSCL003", "x": "'+nix_time+'", "y": "'+TXSCL003_txps+'"}'; fs.appendFile(plotfile, TXSCL003_graph+",\r\n", function (err) {});
    TXSCL004_graph = '{"class": "TXSCL004", "x": "'+nix_time+'", "y": "'+TXSCL004_txps+'"}'; fs.appendFile(plotfile, TXSCL004_graph+",\r\n", function (err) {});
    TXSCL005_graph = '{"class": "TXSCL005", "x": "'+nix_time+'", "y": "'+TXSCL005_txps+'"}'; fs.appendFile(plotfile, TXSCL005_graph+",\r\n", function (err) {});
    TXSCL006_graph = '{"class": "TXSCL006", "x": "'+nix_time+'", "y": "'+TXSCL006_txps+'"}'; fs.appendFile(plotfile, TXSCL006_graph+",\r\n", function (err) {});
    TXSCL007_graph = '{"class": "TXSCL007", "x": "'+nix_time+'", "y": "'+TXSCL007_txps+'"}'; fs.appendFile(plotfile, TXSCL007_graph+",\r\n", function (err) {});
} 
