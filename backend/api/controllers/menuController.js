const Menu = require("../models/Menu");

const getAllMenuItems = async (req, res) => {
    try {
        const menus = await Menu.find({}).sort({ createdAt: -1 });
        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// post a new menu item

const postMenuItem = async (req, res) => {
    const newItem = req.body;

    try {
        const result = await Menu.create(newItem);
        res.status(200).json({ result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteMenuItem = async (req, res) => {
    const menuId = req.params.id;
    try {
        const deletedItem = await Menu.findByIdAndDelete(menuId);
        if (!deletedItem) {
            return res.status(404).json({ message: "Menu not found" })
        }
        res.status(200).json({ message: "Menu Item deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}
// get single menu item used in update menu

const singleMenuItem = async (req, res) => {
    const menuId = req.params.id;
    try {
        const menu = await Menu.findById(menuId)
        res.status(200).json(menu)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update a single menu item

const updateMenuItem = async (req, res) => {
    const menuId = req.params.id;
    const { name, category, image, price, recipe, createdAt } = req.body;
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            { name, category, image, price, recipe, createdAt },
            { new: true, runValidator: true }
        );
        if (!updatedMenu) {
            return res.status(404).json({ message: "Menu not found" })
        }

        res.status(200).json(updatedMenu)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// Update the inStock status of a menu item by ID
const updateStockStatus = async (req, res) => {
    const { id } = req.params;
    const { inStock } = req.body;
    try {
        const menuItem = await Menu.findByIdAndUpdate(
            id,
            { inStock },
            { new: true }
        );
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getAllMenuItems,
    postMenuItem,
    deleteMenuItem,
    singleMenuItem,
    updateMenuItem,
    updateStockStatus
}
