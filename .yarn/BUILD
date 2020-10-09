for file in glob(['cache/*.zip']):
    export_file(
        name = file.replace('/', '#'),
        src = file,
        visibility = ['PUBLIC']
    )

for dir in glob(['unplugged/*']):
    export_file(
        name = dir.replace('/', '#'),
        src = dir,
        visibility = ['PUBLIC']
    )
