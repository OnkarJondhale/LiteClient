let mockRegistry = [];

const apiMockController = async (req, res) => {
    try {
        const { mocks } = req.body;
        mockRegistry = Array.isArray(mocks) ? mocks : [];
        
        res.status(200).json({
            ok: true,
            message: "Mocks updated"
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const getMockRegistry = () => mockRegistry;

module.exports = { apiMockController, getMockRegistry };