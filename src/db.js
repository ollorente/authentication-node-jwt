const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, async () => {
    await console.log(`>>> [DB] is connected... <<<`)
})