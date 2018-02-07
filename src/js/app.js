import AWS from 'aws-sdk';

const main = () => {
  console.log('loaded');
  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:43ccd6aa-3e0b-476c-8e7d-89ac5075f860'
  });

};

document.addEventListener('DOMContentLoaded', main);
