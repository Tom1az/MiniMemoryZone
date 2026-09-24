const index = (req, res) => {
    return res.status(200).json({
            message: 'You requested the list of users'
    })
}

module.exports = {
    index
}