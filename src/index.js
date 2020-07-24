const app = require('./app')
require('./db')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`>>> [Auth] v1 | Run server on http://localhost:${port} <<<`)
})
