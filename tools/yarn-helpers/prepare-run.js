/**
 * Prepare files for yarn_run rule.
 *
 * Creates shims for bins from other packages and
 * an entrypoint file which holds the scirpt body.
 *
 * Environment variables:
 * - BIN_DIR:           dir name to which bin shims are written
 * - ENTRYPOINT_PATH:   path to the entrypoint file to be written
 * - SCRIPT_NAME:       script name to run (e.g. "test" when "yarn run test")
 * - PNP_PATH:          .pnp.js path
 * - PACKAGE_JSON_PATH: package.json path
 */

const pnp = require('pnpapi');
const fs = require('fs');
const path = require('path');

main();
process.exit();

function main() {
    const outputBinDir = process.env.BIN_DIR;
    const outputEntrypointPath = process.env.ENTRYPOINT_PATH;

    const scriptName = process.env.SCRIPT_NAME;

    const pnpPath = process.env.PNP_PATH;
    const packageJsonPath = process.env.PACKAGE_JSON_PATH;
    const targetPackageLocator = pnp.findPackageLocator(process.env.PACKAGE_JSON_PATH);

    const packageInfo = pnp.getPackageInformation(targetPackageLocator);

    prepareEntrypoint(packageJsonPath, outputEntrypointPath, scriptName);
    prepareBinDir(outputBinDir, packageInfo, pnpPath);
}

function prepareEntrypoint(packageJsonPath, entrypointPath, scriptName) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }));

    if (!packageJson.scripts || !(scriptName in packageJson.scripts)) {
        throw new Error(`Script named ${scriptName} was not found in package.json`);
    }

    const scriptBody = packageJson.scripts[scriptName];

    const content = [
        '#! /bin/sh',
        scriptBody,
    ].join('\n');

    fs.writeFileSync(entrypointPath, content, { encoding: 'utf-8' });
    fs.chmodSync(entrypointPath, '755');
}

function prepareBinDir(binDir, packageInfo, pnpPath) {
    for (const [name, ref] of packageInfo.packageDependencies) {
        const packageJson = require(name + '/package.json');
        if (typeof packageJson.bin === 'object') {
            for (const [binName, entrypointPath] of Object.entries(packageJson.bin)) {
                const qualifiedPath = qualifyBinPath(
                    name,
                    ref,
                    entrypointPath,
                );

                genBinShim({
                    binPath: path.join(binDir, binName),
                    pnpPath,
                    entryPointPath: qualifiedPath,
                });
            }
        }
    }
}

function genBinShim({binPath, pnpPath, entryPointPath}) {
    const content = [
        '#! /bin/sh',
        `exec $TOOL -r ${pnpPath} ${entryPointPath} "$@"`,
    ].join('\n');
    fs.writeFileSync(binPath, content, { encoding: 'utf-8' })
    fs.chmodSync(binPath, '755');
}

function qualifyBinPath(pkgName, pkgReference, binPath) {
    const info = pnp.getPackageInformation({
        name: pkgName,
        reference: pkgReference,
    });

    return path.join(info.packageLocation, binPath);
}
