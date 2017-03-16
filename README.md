usando
https://www.npmjs.com/package/linklocal

  {
            mobx: {
                root: 'Mobx',
                commonjs2: 'mobx',
                commonjs: 'mobx',
                amd: 'mobx'
            }
        }

    "mobx-react": "^4.1.2",
    "mobx-utils": "^2.0.1",
    "react": "^15.4.2",

    "build:umd": "BABEL_ENV=commonjs NODE_ENV=development webpack src/index.js dist/mobxTinyRouter.js",
    "build:umd:min": "BABEL_ENV=commonjs NODE_ENV=production webpack src/index.js dist/mobxTinyRouter.min.js",