'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const { execSync } = require('child_process');
const { runTranslate } = require('../src/i18n/excel2Json');

const shell = require('shelljs');

const getBranch = () => {
  try {
    const command = 'git rev-parse --abbrev-ref HEAD';
    const branch = execSync(command).toString().trim();
    console.log('245行打印：=====当前分支是=======:', branch);
    return branch;
  } catch (e) {
    console.log('248行打印：============:', e);
    return '';
  }
};

const replaceTranslateFile = async () => {
  if (getBranch() === 'test' || getBranch() === 'master') await runTranslate(true);
};

const init = () => {
  replaceTranslateFile();
}

init()

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
