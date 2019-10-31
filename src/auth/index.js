const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const Model = require('./models');

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
};

const authMiddleware = ({ req }) => {
  // simple auth check on every request
  const token = req.headers.authorization;
  const user = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded.email);
    });
  });

  return {
    user,
    models: {
      LinhaOnibus: Model.LinhaOnibus,
      ObservacaoHorario: Model.ObservacaoHorario,
      Percurso: Model.Percurso,
      DiaSemana: Model.DiaSemana,
      Horario: Model.Horario,
      Itinerario: Model.Itinerario,
      Via: Model.Via,
    },
  };
};

export default authMiddleware;
