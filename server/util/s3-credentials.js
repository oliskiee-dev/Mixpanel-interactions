const { S3Client } = require("@aws-sdk/client-s3");

exports.s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // Explicit endpoint
    forcePathStyle: true, // Ensures proper URL structure
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
});
