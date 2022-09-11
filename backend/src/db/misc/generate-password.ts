const readline = require('readline');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + './../../../.env' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter password: ', async (password) => {
  try {
    const hash = await bcrypt.hash(password, process.env.SALT);
    console.log(hash);
  } catch(err) {
    console.log(err);
  }
  finally {
    rl.close();
  }
});

rl.on('close', () => {
  process.exit(0);
});
