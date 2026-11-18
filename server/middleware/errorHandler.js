export default function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(400).json({ message: 'A record with those details already exists' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(error.errors)[0]?.message || 'Validation failed' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Something went wrong'
  });
}