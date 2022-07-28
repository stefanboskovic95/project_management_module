const readline = require("readline");
const bcrypt = require('bcrypt')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter password: ', async (password) => {
    try {
        const hash = await bcrypt.hash(password, 10)
        console.log(hash)
    }
    finally {
        rl.close()
    }
})

rl.on("close", () => {
    process.exit(0);
});
