const jwt = require('jsonwebtoken');

const generateAnonToken = (tokenId) => {
  return jwt.sign(
    { tokenId, type: 'anon' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const generateAdminToken = (adminId) => {
  return jwt.sign(
    { adminId, type: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  generateAnonToken,
  generateAdminToken
};

