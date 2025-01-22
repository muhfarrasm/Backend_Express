const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");


// Menambahkan penerbit baru
router.post("/store", [
    body("id_penerbit").notEmpty(),
    body("nama_penerbit").notEmpty(),
    body("alamat_penerbit").notEmpty(),
    body("telepon_penerbit").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    const { id_penerbit, nama_penerbit, alamat_penerbit, telepon_penerbit } = req.body;
    const formData = { id_penerbit,nama_penerbit, alamat_penerbit, telepon_penerbit };

    connection.query("INSERT INTO penerbit SET ?", formData, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err,
            });
        } else {
            return res.status(201).json({
                status: true,
                message: "Penerbit created",
                data: formData,
            });
        }
    });
});

// Menampilkan daftar penerbit
router.get("/", (req, res) => {
    connection.query("SELECT * FROM penerbit ORDER BY id_penerbit DESC", (err, rows) => {
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

// Mengupdate penerbit
router.put("/:id_penerbit", [
    
    body("nama_penerbit").notEmpty(),
    body("alamat_penerbit").notEmpty(),
    body("telepon_penerbit").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    const id_penerbit = req.params.id_penerbit;
    const { nama_penerbit, alamat_penerbit, telepon_penerbit } = req.body;
    const formData = { nama_penerbit, alamat_penerbit, telepon_penerbit };

    connection.query("UPDATE penerbit SET ? WHERE id_penerbit = ?", [formData, id_penerbit], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Penerbit updated",
                data: formData,
            });
        }
    });
});

// Menghapus penerbit
router.delete("/:id_penerbit", (req, res) => {
    const { id_penerbit } = req.params;
    connection.query("DELETE FROM penerbit WHERE id_penerbit = ?", id_penerbit, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Penerbit deleted",
            });
        }
    });
});

module.exports = router;