const AWS = require('aws-sdk');
const OAuth = require('oauth');

const TableName = process.env.TABLE_NAME;
const IdentityPoolId = process.env.IDENTITY_POOL;
const doc = new AWS.DynamoDB.DocumentClient();

const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
const accessTokenUrl  = 'https://api.twitter.com/oauth/access_token';
const authenticateUrl = 'https://api.twitter.com/oauth/authenticate';
const twitterToken = 'AcThMCY9i5ip46NUZtVgvbE0Q';
const twitterSecret = 'OOxnHtgZWVPgqijJ7mEuRBujwnTwrwfblDXO5jVXO4YInrdHFb';
const callbackUrl = 'http://localhost:8080';

const oauth = new OAuth.OAuth(
  requestTokenUrl,
  accessTokenUrl,
  twitterToken,
  twitterSecret,
  '1.0A',
  callbackUrl,
  'HMAC-SHA1'
);

const authorize = (event, context, callback) => {
  oauth.getOAuthRequestToken({}, (res, oauth_token, oauth_secret, results) => {
    const url = oauth.signUrl(authenticateUrl, oauth_token, oauth_secret, 'GET');
    callback(null, {
      statusCode: 302,
      headers: {
        Location: url,
      },
    });
  });
};

const verify = (event, context, callback) => {
  const { oauth_token, oauth_verifier } = JSON.parse(event.body);
  oauth.getOAuthAccessToken(oauth_token, null, oauth_verifier, (_, access_token, token_secret, results) => {

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({access_token, token_secret}),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  });
};

const showUser = (event, context, callback) => {
  const screen_name = event.pathParameters.screen_name;

  doc.get({TableName, Key: { screen_name }})
    .promise()
    .then(value => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({screen_name, value}),
      });
    }).catch(() => {
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({screen_name, message: 'not found'}),
      });
    });
};

const updateUser = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({status: 'success'}),
  });
};

const register = (event, context, callback) => {
  const { access_token, token_secret } = JSON.parse(event.body);
  const s = {
    IdentityPoolId,
    Logins: {
      'api.twitter.com': `${access_token};${token_secret}`,
    }
  };
  console.log(s);
  const credential = new AWS.CognitoIdentityCredentials(s);
  credential.getPromise().then(res => {
    console.log(res);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      },
    });
  });
};

const routings = [
  ['GET',     '/_auth',     authorize],
  ['POST',    '/_user',     updateUser],
  ['POST',    '/_register', register],
  ['POST',    '/_verify',   verify],
  ['GET',     /\/.+/,       showUser],
];

const router = (event) => {
  return routings.find(route => {
    return event.httpMethod == route[0]
      && event.path.match(route[1]);
  });
};

exports.twishlist = (event, context, callback) => {
  const route = router(event);
  route[2](event, context, callback);
};
