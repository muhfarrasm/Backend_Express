const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");


// Menambahkan kategori baru
router.post("/store", [
    body("id_kategori").notEmpty(),
    body("nama_kategori").notEmpty(),
    body("deskripsi_kategori").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    const { id_kategori, nama_kategori, deskripsi_kategori } = req.body;
    const formData = { id_kategori, nama_kategori, deskripsi_kategori };

    connection.query("INSERT INTO kategori SET ?", formData, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err,
            });
        } else {
            return res.status(201).json({
                status: true,
                message: "Kategori created",
                data: formData,
            });
        }
    });
});

router.get("/:id_kategori", (req, res) => {
    let id_kategori = req.params.id_kategori;
    console.log(`Requested Kategori ID: ${id_kategori}`); // Logging
    connection.query(
        "SELECT * FROM kategori WHERE id_kategori = ?",
        [id_kategori],
        (err, rows) => {
            console.log(`Query Result:`, err, rows); // Detailed logging
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                });
            } else {
                if (rows.length > 0) {
                    return res.status(200).json({
                        status: true,
                        message: "Success",
                        data: rows[0],
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "Buku not found for this category",
                    });
                }
            }
        }
    );
});


// Menampilkan daftar kategori
router.get("/", (req, res) => {
    connection.query("SELECT * FROM kategori ORDER BY id_kategori DESC", (err, rows) => {
        if (!err) {
            return res.status(200).json({
                status: true,
                message: "Success",
                data: rows,
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        }
    });
});

// Mengupdate kategori
router.put("/:id_kategori", [
    body("nama_kategori").notEmpty(),
    body("deskripsi_kategori").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    const { id_kategori } = req.params;
    const { nama_kategori, deskripsi_kategori } = req.body;
    const formData = { nama_kategori, deskripsi_kategori };

    connection.query("UPDATE kategori SET ? WHERE id_kategori = ?", [formData, id_kategori], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Kategori updated",
                data: formData,
            });
        }
    });
});

// Menghapus kategori
router.delete("/:id_kategori", (req, res) => {
    const { id_kategori } = req.params;
    connection.query("DELETE FROM kategori WHERE id_kategori = ?", id_kategori, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Kategori deleted",
            });
        }
    });


});

module.exports = router;