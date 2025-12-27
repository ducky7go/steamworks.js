const { init } = require('../index.js');

(async () => {
    const client = init(3167020)

    const items = await client.workshop.getItem(3595314238n, {
        returnChildren: true
    })
    console.log(items)
})()
