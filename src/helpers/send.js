const path = require('path');
const fs = require('fs');
const mime = require('mime');
const boom = require('boom');
const resolvePath = require('resolve-path')
const config = require('../config');
const debug = require('../helpers/debug');

/**
 * https://github.com/ktmud/koa-spa
 * https://github.com/koajs/send/blob/master/index.js
 * https://github.com/uniibu/koa-better-static2/blob/master/send.js
 */

const NOT_FOUND_IO = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
const ONE_DAY = 24 * 60 * 60
const RULES = {
  notFound: '/not-found.html',
  cacheRules: [
    { matcher: /\.html$/i, duration: ONE_DAY },
    { matcher: /\.(js|json)$/i, duration: ONE_DAY },
    { matcher: /\.(gif|png|jpe?g|svg)$/i, duration: ONE_DAY },
    { matcher: /\.css$/i, duration: ONE_DAY },
    { matcher: /\.(eot|ttf|woff|woff2)$/i, duration: ONE_DAY }
  ],
  cacheDefault: ONE_DAY
}

function stat(path) {
  return new Promise(function(resolve, reject) {
    fs.stat(path, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
  });
}

function decodePath(path) {
  try {
    return decodeURIComponent(path);
  }
  catch (err) {
    return -1;
  }
}

function isHidden (root, path) {
  path = path.substr(root.length).split(path.sep);
  return (path.indexOf('.') !== -1);
}

const send = async (ctx, relativePath) => {

  const rootPath = path.resolve(path.join(__dirname, config.staticRoot));

  relativePath = decodePath(relativePath);
  if (path === -1) {
    return ctx.throw(400, 'Invalid path encoding');
  }

  if (relativePath.length > 1 && relativePath[0] === '/') {
    relativePath = relativePath.slice(1);
  }

  let filePath = resolvePath(rootPath, relativePath);

  if (isHidden(rootPath, relativePath)) {
    return;
  }

  if (ctx.acceptsEncodings('br', 'deflate', 'identity') === 'br' && (await fs.exists(filePath + '.br'))) {
    filePath = filePath + '.br'
    ctx.set('Content-Encoding', 'br')
    ctx.res.removeHeader('Content-Length')
  }
  else if (ctx.acceptsEncodings('gzip', 'deflate', 'identity') === 'gzip' && (await fs.exists(filePath + '.gz'))) {
    filePath = filePath + '.gz'
    ctx.set('Content-Encoding', 'gzip')
    ctx.res.removeHeader('Content-Length')
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
  ctx.set('Cache-Control', 'max-age=' + (maxage / 1000 | 0));

  ctx.set('Last-Modified', stats.mtime.toUTCString());
  ctx.set('Content-Length', stats.size);
  ctx.response.type = path.extname(filePath);
  ctx.response.body = fs.createReadStream(filePath);
};

module.exports = send;
