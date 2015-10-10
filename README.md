# GBA romname.lst Generator for EZ4 Client

We all know EZ_Client is crap. When you send a ROM which is not listed in `romname.lst` it gets stored with an empty name (".gba").

This script creates a new `romname.lst` file using your ROM filenames.

## Usage

### Print results to stdout

```bash
gba-romname-gen.js path/to/gba/roms
```
### Save results to file

```bash
gba-romname-gen.js path/to/gba/roms > romname.lst
```
## Possible problems

Some files are ignored/skipped:

* Files without .gba extension
* ROMs with empty title/code (unlicensed)
* ROMs without ASCII title/code

## License

MIT
