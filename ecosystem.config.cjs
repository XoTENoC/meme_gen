module.exports = {
    apps: [
        {
            name: 'Meme_gen',
            port: '80',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}
