const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");

// GET /bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.render("bookings/list", { bookings });
  } catch (error) {
    res.status(500).render("bookings/list", { 
      bookings: [],
      error: "Lỗi khi tải danh sách đặt xe"
    });
  }
};

const getBookings = getAllBookings;

// POST /bookings - Tạo đặt xe mới
const createBooking = async (req, res) => {
  try {
    const { customerName, carNumber, startDate, endDate } = req.body;

    const conflict = await Booking.findOne({
      carNumber,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (conflict) {
      const cars = await Car.find();
      return res.status(400).render("bookings/form", { 
        error: "Xe này đã được đặt trong khoảng thời gian này",
        cars,
        isEdit: false
      });
    }

    const car = await Car.findOne({ carNumber });
    if (!car) {
      const cars = await Car.find();
      return res.status(404).render("bookings/form", { 
        error: "Không tìm thấy xe",
        cars,
        isEdit: false
      });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

    const totalAmount = Math.ceil(days) * car.pricePerDay;

    const booking = await Booking.create({
      customerName,
      carNumber,
      startDate,
      endDate,
      totalAmount
    });

    res.redirect("/bookings?success=Tạo đơn đặt xe thành công");
  } catch (error) {
    const cars = await Car.find();
    res.status(400).render("bookings/form", { 
      error: "Lỗi khi tạo đặt xe: " + error.message,
      cars,
      isEdit: false
    });
  }
};

// PUT /bookings/:id - Cập nhật đặt xe
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!booking) {
      return res.status(404).render("bookings/list", { 
        bookings: [],
        error: "Không tìm thấy đơn đặt xe"
      });
    }
    res.redirect("/bookings?success=Cập nhật đơn đặt xe thành công");
  } catch (error) {
    res.status(400).redirect("/bookings/" + req.params.id + "/edit?error=Lỗi khi cập nhật");
  }
};

// DELETE /bookings/:id - Xóa đặt xe
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/bookings?success=Xóa đơn đặt xe thành công");
  } catch (error) {
    res.status(500).redirect("/bookings?error=Lỗi khi xóa đơn đặt xe");
  }
};

// Hiển thị form tạo đặt xe mới
const showCreateForm = async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("bookings/form", { 
      cars,
      isEdit: false,
      error: req.query.error
    });
  } catch (error) {
    res.status(500).render("bookings/form", { 
      cars: [],
      error: "Lỗi khi tải danh sách xe",
      isEdit: false
    });
  }
};

// Hiển thị form sửa đặt xe
const showEditForm = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    const cars = await Car.find();
    if (!booking) {
      return res.status(404).render("bookings/list", { 
        bookings: [],
        error: "Không tìm thấy đơn đặt xe"
      });
    }
    res.render("bookings/form", { 
      booking,
      cars,
      isEdit: true
    });
  } catch (error) {
    res.status(500).render("bookings/form", { 
      cars: [],
      error: "Lỗi khi tải thông tin đặt xe",
      isEdit: false
    });
  }
};

// GET /bookings/overdue-open
// Returns bookings where endDate is null/undefined and startDate is over 24 hours ago
const getOverdueOpenBookings = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const bookings = await Booking.find({
      endDate: { $in: [null, undefined, ""] },
      startDate: { $lt: cutoff }
    });
    res.render("bookings/overdue", { bookings });
  } catch (error) {
    res.status(500).render("bookings/overdue", { 
      bookings: [],
      error: "Lỗi khi tải danh sách đơn quá hạn"
    });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookings,
  getOverdueOpenBookings,
  showCreateForm,
  showEditForm
};
