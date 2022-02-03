# Screen listing for Prosperous Universe
TamperMonkey script to improve UI of Prosperous Universe.
This script adds individual screens from the SCRNS dropdown to the top bar next to the **FULL** button.

![Top bar](image.PNG)

## Usage

Copy and paste contents of `addon.js` into a new TamperMonkey script and save, then reload the Prosperous Universe tab.

## Adding exceptions

If you don't want to expand all screens to the top bar, open the script in TamperMonkey and edit `const exceptions = ['finances'];`.
Write all exceptions in **lowercase**.

**Example:** All screens will be displayed at the top:

```js
const exceptions = [];
```

**Example:** All screens except 'Finances' and 'Base 2' will be displayed:

```js
const exceptions = ['finances', 'base 2'];
```
