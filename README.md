## About
This repo is an experimental showcase on how Please (https://please.build), a Bazel-clone build system, can work with PnP enabled Yarn (Berry).

The goal of this repo is to be a referential setup rather than to be an importable set of rules which people can rely on.

## Roadmap
- [x] Run build tools from third-party npm package
- [x] Reuse npm scripts defined in package.json
- [ ] Tool specific rule example which can be used throughout the repo
- [ ] Hydrate `node_modules` for a package (Useful for deploy image)

## License
MIT
