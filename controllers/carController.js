const Car = require("../models/carModel");

const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.redirect("/cars?success=Thêm xe thành công");
  } catch (error) {
    // re-render the form so user can correct inputs
    res.status(400).render("cars/form", { 
      error: "Lỗi khi thêm xe: " + error.message,
      isEdit: false,
      success: null,
      car: req.body // keep previously entered data (not used when isEdit=false but could be referenced)
    });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("cars/list", { 
      cars,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.status(500).render("cars/list", { 
      cars: [],
      error: "Lỗi khi tải danh sách xe",
      success: null
    });
  }
};

// Hiển thị form thêm xe mới
const showCreateForm = (req, res) => {
  // pass through query parameters to allow showing messages
  res.render("cars/form", { 
    isEdit: false,
    success: req.query.success || null,
    error: req.query.error || null
  });
};

// Hiển thị form sửa xe
const showEditForm = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).render("cars/form", { 
        error: "Không tìm thấy xe",
        isEdit: false,
        success: null
      });
    }
    res.render("cars/form", { 
      car,
      isEdit: true,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    res.status(500).render("cars/form", { 
      error: "Lỗi khi tải thông tin xe",
      isEdit: false,
      success: null
    });
  }
};

// Cập nhật xe
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!car) {
      return res.status(404).render("cars/list", { 
        cars: [],
        error: "Không tìm thấy xe"
      });
    }
    res.redirect("/cars?success=Cập nhật xe thành công");
  } catch (error) {
    res.status(400).redirect("/cars/" + req.params.id + "/edit?error=Lỗi khi cập nhật");
  }
};

// Xóa xe
const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect("/cars?success=Xóa xe thành công");
  } catch (error) {
    res.status(500).redirect("/cars?error=Lỗi khi xóa xe");
  }
};

module.exports = {
  createCar,
  getCars,
  showCreateForm,
  showEditForm,
  updateCar,
  deleteCar
};
