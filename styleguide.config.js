/* eslint strict: [0, "global"] */
/* eslint import/no-extraneous-dependencies: 0 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const reactDoc = require('library-utils/react-doc');
const upperCamelCase = require('uppercamelcase');
const WEBPACK_BASE_TEMPLATE = require('arui-presets/webpack.base');
const WEBPACK_DEV_TEMPLATE = require('arui-presets/webpack.development');

const PORT = parseInt(process.env.PORT || 8080, 10);
const TITLE = 'arui-feather';

module.exports = {
    title: TITLE,
    serverPort: PORT,
    skipComponentsWithoutExample: true,
    components: './src/*/index.js',
    propsParser(filePath) {
        return reactDoc(filePath);
    },
    getComponentPathLine(filePath) {
        const componentDirName = path.dirname(filePath);
        const componentSourcesFileName = componentDirName.split(path.sep).pop();
        const componentName = upperCamelCase(componentSourcesFileName);
        return `import ${componentName} from '${TITLE}/${componentSourcesFileName}';`;
    },
    getExampleFilename(componentPath) {
        return path.resolve(path.dirname(componentPath), './README.md');
    },
    ignore: ['**/*-test.jsx'],
    styleguideDir: path.resolve(__dirname, './demo/styleguide/'),
    styleguideComponents: {
        StyleGuide: path.resolve(__dirname, './demo/components/styleguide'),
        slots: path.resolve(__dirname, './demo/components/slots')
    },
    template: path.resolve(__dirname, './demo/template.html'),
    webpackConfig: merge.smart(WEBPACK_BASE_TEMPLATE, WEBPACK_DEV_TEMPLATE, {
        devServer: {
            disableHostCheck: true
        },
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/^arui-feather/, (resource) => {
                resource.request = resource.request.replace(/^arui-feather/, path.resolve(__dirname, './src'));
            })
        ]
    })
};
