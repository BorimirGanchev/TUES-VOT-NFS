const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Internal Keycloak service URL (for Docker networking)
const keycloakInternalUrl = 'http://keycloak:8080';
// Publicly accessible Keycloak URL (used for validation)
const keycloakIssuer = 'http://localhost:8080/realms/node-app';

const clientId = 'account';

const client = jwksClient({
  jwksUri: `${keycloakInternalUrl}/realms/node-app/protocol/openid-connect/certs`, 
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, key.getPublicKey());
    }
  });
};

const authenticateKeycloakToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: clientId,
      issuer: keycloakIssuer,
    },
    (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded; 
      next();
    }
  );
};

module.exports = authenticateKeycloakToken;
