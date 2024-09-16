const requestHandler = (
  res,
  statusCode = 200,
  content = '{}',
  contentType = 'application/json'
) => {
  if (contentType === 'application/json') {
    content = JSON.stringify(content);
  }

  res.writeHead(statusCode, {
    'Content-Type': contentType
  });
  res.write(content);
  res.end();
};

module.exports = { requestHandler };
