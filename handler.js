const aws = require('aws-sdk');
const TableName = process.env.TABLE_NAME;
const doc = new aws.DynamoDB.DocumentClient();

const authorize = (event, context, callback) => {
  callback(null, {
    statusCode: 302,
    headers: {
      Location: "https://google.com"
    }
  });
};

const showUser = (event, context, callback) => {
  const screen_name = event.pathParameters.screen_name;
  const identity_pool = process.env.IDENTITY_POOL;
  console.log(screen_name);

  doc.get({TableName, Key: { screen_name }})
    .promise()
    .then(value => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({screen_name, value})
      });
    }).catch(() => {
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({screen_name, message: 'not found', identity_pool})
      });
    });
};

const updateUser = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({status: 'success'})
  });
};

const routings = [
  ["GET",  "/_auth", authorize],
  ["POST", "/_user", updateUser]
  ["GET",  /\/.+/, showUser],
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
