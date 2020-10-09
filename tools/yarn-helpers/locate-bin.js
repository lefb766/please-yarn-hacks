const pnp = require('pnpapi');
const path = require('path');

const targetBinName = process.env.BIN_NAME;
const targetPackageLocator = pnp.findPackageLocator(process.env.TARGET_PACKAGE);
const packageInfo = pnp.getPackageInformation(targetPackageLocator);
for (const [name, ref] of packageInfo.packageDependencies) {
    const packageJson = require(name + '/package.json');
    if (typeof packageJson.bin === 'object' && targetBinName in packageJson.bin) {
        const path = qualifyBinPath(
            name,
            ref,
            packageJson.bin[targetBinName]
        );

        console.log(path);
    }
}

function qualifyBinPath(pkgName, pkgReference, binPath) {
    const info = pnp.getPackageInformation({
        name: pkgName,
        reference: pkgReference,
    });

    return path.join(info.packageLocation, binPath);
}
