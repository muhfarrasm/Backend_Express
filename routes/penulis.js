const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");



// Menambahkan penulis baru
router.post("/store", [
    body("id_penulis").notEmpty(),
    body("nama_penulis").notEmpty(),
    body("biografi").notEmpty(),
    body("kontak").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    const { id_penulis,nama_penulis, biografi, kontak } = req.body;
    const formData = {id_penulis, nama_penulis, biografi, kontak };

    connection.query("INSERT INTO penulis SET ?", formData, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err,
            });
        } else {
            return res.status(201).json({
                status: true,
                message: "Penulis created",
                data: formData,
            });
        }
    });
});

// Menampilkan daftar penulis
router.get("/", (req, res) => {
    connection.query("SELECT * FROM penulis ORDER BY id_penulis DESC", (err, rows) => {
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

// Mengupdate penulis
router.put("/:id_penulis", [
    
    body("nama_penulis").notEmpty(),
    body("biografi").notEmpty(),
    body("kontak").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    const { id_penulis } = req.params;
    const { nama_penulis, biografi, kontak } = req.body;
    const formData = { nama_penulis, biografi, kontak };

    connection.query("UPDATE penulis SET ? WHERE id_penulis = ?", [formData, id_penulis], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Penulis updated",
                data: formData,
            });
        }
    });
});

// Menghapus penulis
router.delete("/:id_penulis", (req, res) => {
    const { id_penulis } = req.params;
    connection.query("DELETE FROM penulis WHERE id_penulis = ?", id_penulis, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Penulis deleted",
            });
        }
    });
});

module.exports = router;