

const validateProxy = async (req, res, next) => {
    try {
        
        const { requestType } = req.body;

        if (!requestType) {
            return res.status(400).json({
                success: false,
                message: "Request Type is required"
            })
        }

        if (requestType !== 'proxy') {
            return res.status(400).json({
                success: false,
                messsage: "You are not allowed to perform this action"
            })
        }

        next();
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: `Proxy Error: ${error.message}`,
            cause: error.cause?.message || "Unknown Network Error",
            time: 0,
            size: 0
        });
    }
}

const validateApiMock = async (req, res, next) => {
    try {
        const { requestType } = req.body;

        if (!requestType) {
            return res.status(400).json({
                success: false,
                message: "Request Type is required"
            })
        }

        if (requestType !== 'apimock') {
            return res.status(400).json({
                success: false,
                messsage: "You are not allowed to perform this action"
            })
        }

        next();
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: `Proxy Error: ${error.message}`,
            cause: error.cause?.message || "Unknown Network Error",
            time: 0,
            size: 0
        });
    }
}

module.exports = { validateProxy, validateApiMock }