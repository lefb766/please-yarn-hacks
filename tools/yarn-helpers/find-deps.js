/**
 * Enumerates third-party npm dependencies.
 *
 * It is intended to be used with Please specific post_build and add_dep
 * documented at https://please.build/post_build.html.
 * See rules.build_defs for usage.
 */

const pnp = require('pnpapi');
const path = require('path');

const targetPackageLocator = pnp.findPackageLocator(process.env.TARGET_PACKAGE);

const depsMap = new Map();
traverseDeps(depsMap, targetPackageLocator);

// Ensure no duplication but it is uncertain if there is.
const depLabels = new Set();

for (const info of depsMap.values()) {
    const label = qualifyLabel(info.packageLocation);

    if (label) {
        depLabels.add(label);
    }
}

for (const label of depLabels) {
    console.log(label);
}

process.exit();

/**
 * Populates depMap
 */
function traverseDeps(depsMap, locator) {
    const key = JSON.stringify(locator);
    if (depsMap.has(key)) {
        return;
    }

    const info = pnp.getPackageInformation(locator);
    depsMap.set(key, info);
    if (info === null) {
        return;
    }

    for (const [name, ref] of info.packageDependencies) {
        if (ref === null) {
            continue;
        }

        traverseDeps({
            name: name,
            reference: ref,
        });
    }
}

/**
 * Given physical location of npm dependency, create a label as defined in .yarn/BUILD.
 * Returns null if it is not a npm dependency.
 */
function qualifyLabel(location) {
    const parts = location.split(path.sep);

    for (let i = 0; i < parts.length; i++) {
        if (parts[i].endsWith('.zip')) {
            return 'cache#' + parts[i];
        }

        if (parts[i] === 'unplugged') {
            if (i + 1 >= parts.length) {
                throw new Error('An entry named "unplugged" was not a directory');
            }
            return 'unplugged#' + parts[i + 1];
        }
    }

    if (!/\.yarn/.test(location)) {
        // mostly other packages in the same monorepo
        return null;
    }

    throw new Error(`Uncategorized location: ${location}`);
}
