// Default route
exports.defaultResponse = (req, res) => {
    try {
        return res.status(200).send({
            message: "Hello World!",
          });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: error.message,
        })
    }
  };