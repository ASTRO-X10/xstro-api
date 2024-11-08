import { createRequire } from 'module';
const require = createRequire(import.meta.url);

global.require = require; // Make `require` available globally
global.express = require('express');
global.cors = require('cors');
global.axios = require('axios');
global.ffmpeg = require('fluent-ffmpeg');
