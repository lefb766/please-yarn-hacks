subinclude('//tools/yarn-helpers:rules.build_defs')

yarn_run_bin(
    name = 'build',
    bin = 'rollup',
    args = ['-c'],
    srcs = glob(['**']) + ['.babelrc'],
    outs = ["dist"]
)

filegroup(
    name = 'files',
    srcs = glob(['*'])
)