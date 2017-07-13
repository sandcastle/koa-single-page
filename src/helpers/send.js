const path = require('path');
const fs = require('fs');
const boom = require('boom');
const resolvePath = require('resolve-path');
const config = require('../config');

/**
 * https://github.com/ktmud/koa-spa
 * https://github.com/koajs/send/blob/master/index.js
 * https://github.com/uniibu/koa-better-static2/blob/master/send.js
 */

const NOT_FOUND_IO = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
const ONE_DAY = 24 * 60 * 60;

// const RULES = {
//   notFound: '/not-found.html',
//   cacheRules: [
//     { matcher: /\.html$/i, duration: ONE_DAY },
//     { matcher: /\.(js|json)$/i, duration: ONE_DAY },
//     { matcher: /\.(gif|png|jpe?g|svg)$/i, duration: ONE_DAY },
//     { matcher: /\.css$/i, duration: ONE_DAY },
//     { matcher: /\.(eot|ttf|woff|woff2)$/i, duration: ONE_DAY }
//   ],
//   cacheDefault: ONE_DAY
// };

function existsAsync(filePath) {
  return new Promise((resolve) => {
    fs.exists(filePath, resolve);
  });
}

function stat(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

function decodePath(p) {
  try {
    return decodeURIComponent(p);
  }
  catch (err) {
    return -1;
  }
}

function isHidden(root, relativePath) {
  relativePath = relativePath.substr(root.length).split(path.sep);
  return (relativePath.indexOf('.') !== -1);
}

const send = async (ctx, relativePath) => {

  const rootPath = path.resolve(path.join(__dirname, config.staticRoot));

  relativePath = decodePath(relativePath);
  if (path === -1) {
    ctx.throw(400, 'Invalid path encoding');
    return;
  }

  if (relativePath.length > 1 && relativePath[0] === '/') {
    relativePath = relativePath.slice(1);
  }

  let filePath = resolvePath(rootPath, relativePath);

  if (isHidden(rootPath, relativePath)) {
    return;
  }

  if (ctx.acceptsEncodings('br', 'identity') === 'br' && (await existsAsync(`${filePath}.br`))) {
    filePath += '.br';
    ctx.set('Content-Encoding', 'br');
    ctx.res.removeHeader('Content-Length');
  }
  else if (ctx.acceptsEncodings('gzip', 'identity') === 'gzip' && (await existsAsync(`${filePath}.gz`))) {
    filePath += '.gz';
    ctx.set('Content-Encoding', 'gzip');
    ctx.res.removeHeader('Content-Length');
  }

  let stats;
  try {
    stats = await stat(filePath);
  }
  catch (err) {
    if (~NOT_FOUND_IO.indexOf(err.code)) {
      return;
    }
    ctx.setError(boom.badRequest('Bad request'));
    return;
  }

  const maxage = ONE_DAY;
  ctx.set('Cache-Control', `max-age=${maxage / 1000 | 0}`);

  ctx.set('Last-Modified', stats.mtime.toUTCString());
  ctx.set('Content-Length', stats.size);
  ctx.response.type = path.extname(filePath);
  ctx.response.body = fs.createReadStream(filePath);
};

module.exports = send;
