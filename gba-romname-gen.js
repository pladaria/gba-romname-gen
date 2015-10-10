#!/usr/bin/env node
'use strict';

const SP = ' ';

let fs = require('fs');
let path = require('path');
let walk = require('fs-walk');

if (process.argv.length != 3 || process.argv.some(v => v == '--help' || v == '-h')) {
  console.log(`Usage:\n\t${path.basename(process.argv[1])} <gba roms path>`);
  process.exit();
}

let romsPath = process.argv[2];

let padRight = (str, n) => str + (str.length < n ? SP.repeat(n - str.length) : '');

let extractRomInfo = (filename) => {
  let romData = new Buffer(0xC0);
  let fd = fs.openSync(filename, 'r');
  fs.readSync(fd, romData, 0, romData.length, 0);
  fs.closeSync(fd);
  return {
    gameTitle: romData.slice(0xA0, 0xA0 + 12).toString().replace(/\0/g, SP),
    gameCode: romData.slice(0xAC, 0xAC + 4).toString().replace(/\0/g, SP),
  };
};

walk.filesSync(romsPath, (basedir, filename) => {
  if (!(/.gba$/i).test(filename)) {
    return; // skip non .gba files
  }

  let romInfo = extractRomInfo(path.join(basedir, filename));
  let key = romInfo.gameTitle + romInfo.gameCode;

  if (!key.trim()) {
    return; // skip roms without title and code
  }

  if (key != new Buffer(key, 'utf8').toString('ascii')) {
    return; // skip roms without ascii title or code
  }

  let title = filename
    .replace(/\.gba$/i, '') // strip extension
    .replace(/^\d{4}\s*\-?\s*/, '') // strip leading ROM number
    .replace(/(\s*\[:?.*\]|\s*\(:?.*\))+$/, '') // strip trailing [] or ()
    .replace(/\s+/g, SP) // remove extra spaces
    .trim();

  console.log(`${key}|${romInfo.gameCode}|${title}\r`);
});
