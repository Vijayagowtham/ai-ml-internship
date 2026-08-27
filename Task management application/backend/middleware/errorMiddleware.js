module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log technical details server-side only

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errorMessages = err.errors.map(e => e.message);
        return res.status(400).json({ error: errorMessages.join(', ') });
    }

    res.status(500).json({ error: 'Internal Server Error' });
};
