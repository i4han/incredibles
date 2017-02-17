
Package.describe({
    summary: 'incredible object, array, string, number and boolean',
    "version": "0.0.27",
    git: 'https://github.com/i4han/cubesat.git',
    documentation: 'README.md'
});

Package.on_use( function (api) {
    api.use('ecmascript@0.6.3')
    api.use('isaac:underscore2@0.5.52')
    api.add_files( 'src/incredibles.js', ['client'] )
    api.export( 'in$',                   ['client', 'server'] )
})
