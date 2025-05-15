const bcrypt = require('bcrypt');

async function test() {
  const password = 'AdminEdd';
  const hash = '$2b$10$3JBBjl1aRa/SeBeN.Du5V.sTfQMjBwt2IXD44rFKAlaTpXXyBrhHm';

  const isValid = await bcrypt.compare(password, hash);
  console.log('Password match:', isValid);
}

test();
