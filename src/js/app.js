import AWS from 'aws-sdk';
import qs from 'query-string';

const IdentityPoolId = 'us-east-1:31d32548-33f5-488d-9c0e-c818c6708adf';
const RoleArn = 'arn:aws:iam::009775665146:role/twishlist-AuthenticatedRole-CCZT02WITXCS';

AWS.config.region = 'us-east-1';
const api = process.env.API_HOST;

const startAuthenticate = () => {
  window.location = `${api}/_auth`;
};

const main = () => {
  const { oauth_token, oauth_verifier } = qs.parse(location.search);
/*
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId
  });
  AWS.config.credentials.getPromise()
    .then(() => {
      console.log(AWS.config.credentials);
    });
*/
  window.history.replaceState({}, '', '/');
  if (oauth_token && oauth_verifier) {
    fetch(`${api}/_verify`, {
      method: 'POST',
      body: JSON.stringify({ oauth_token, oauth_verifier })
    }).
      then(res => res.json()).
      then(json => {
        const { access_token, token_secret } = json;
        //*
        const credentials = {
          IdentityPoolId,
          RoleArn,
          Logins: {
            'api.twitter.com': `${access_token};${token_secret}`,
          },
        };
        console.log(credentials);
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(credentials);

        return AWS.config.credentials.getPromise();
         /*/
        return fetch(`${api}/_register`, {
          method: 'POST',
          body: JSON.stringify({access_token, token_secret}),
        });
        //*/
      }).
      then(() => {
        console.log(AWS.config.credentials);
      });;
  }
};


document.addEventListener('DOMContentLoaded', main);
