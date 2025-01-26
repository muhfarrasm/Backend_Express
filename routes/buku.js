const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/database");


router.get("/kategori/:id_kategori", (req, res) => {
    let id_kategori = req.params.id_kategori;
    connection.query(
        `SELECT buku.*, kategori.nama_kategori 
         FROM buku 
         JOIN kategori ON buku.id_kategori = kategori.id_kategori 
         WHERE kategori.id_kategori = ?`,
        [id_kategori],
        (err, rows) => {
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
                        data: rows,
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "No books found for this category",
                    });
                }
            }
        }
    );
 });
 
//getall
router.get("/", (req, res) => {
    connection.query("SELECT * FROM buku ORDER BY id_buku DESC", (err, rows) => {
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

router.post("/store", [
    body("id_buku").notEmpty(),
    body("nama_buku").notEmpty(),
    body("deskripsi_buku").notEmpty(),
    body("tanggal_terbit").notEmpty(),
    body("status_buku").notEmpty(),
    body("id_kategori").notEmpty(),
    body("id_penulis").notEmpty(),
    body("id_penerbit").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    let { id_buku,nama_buku, deskripsi_buku, tanggal_terbit, status_buku, id_kategori, id_penulis, id_penerbit } = req.body;
    let formData = { id_buku,nama_buku, deskripsi_buku, tanggal_terbit, status_buku, id_kategori, id_penulis, id_penerbit };

    connection.query("INSERT INTO buku SET ?", formData, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
                error: err,
            });
        } else {
            return res.status(201).json({
                status: true,
                message: "Buku created",
                data: formData,
            });
        }
    });
});

// router.get("/:id_buku", (req, res) => {
//     let id_buku = req.params.id_buku;
//     connection.query(
//         `SELECT buku.*, kategori.nama_kategori, penulis.nama_penulis, penerbit.nama_penerbit
//         FROM buku
//         JOIN kategori ON buku.id_kategori = kategori.id_kategori
//         JOIN penulis ON buku.id_penulis = penulis.id_penulis
//         JOIN penerbit ON buku.id_penerbit = penerbit.id_penerbit
//         WHERE buku.id_buku = ?`, 
//         [id_buku], 
//         (err, rows) => {
//             if (err) {
//                 return res.status(500).json({
//                     status: false,
//                     message: "Internal Server Error",
//                 });
//             } else {
//                 if (rows.length > 0) {
//                     return res.status(200).json({
//                         status: true,
//                         message: "Success",
//                         data: rows[0],
//                     });
//                 } else {
//                     return res.status(404).json({
//                         status: false,
//                         message: "Buku not found",
//                     });
//                 }
//             }
//         }
//     );
// });

//Detail
router.get("/:id_buku", (req, res) => {
    let id_buku = req.params.id_buku;
    connection.query(
        "SELECT * FROM buku WHERE id_buku = ?",
        id_buku,
        (err, rows) => {
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
                message: "Buku not found",
            });
        }
    }
}

);
});

//Update Mahasiswa
router.put("/:id_buku", [
    body("nama_buku").notEmpty(),
    body("deskripsi_buku").notEmpty(),
    body("tanggal_terbit").notEmpty(),
    body("status_buku").notEmpty(),
    body("id_kategori").notEmpty(),
    body("id_penulis").notEmpty(),
    body("id_penerbit").notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.array(),
        });
    }

    let { id_buku } = req.params;
    let { nama_buku, deskripsi_buku, tanggal_terbit, status_buku, id_kategori, id_penulis, id_penerbit } = req.body;
    let formData = { nama_buku, deskripsi_buku, tanggal_terbit, status_buku, id_kategori, id_penulis, id_penerbit };

    connection.query("UPDATE buku SET ? WHERE id_buku = ?", [formData, id_buku], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Buku updated",
                data: formData,
            });
        }
    });

    // connection.query("SELECT id_kategori FROM kategori WHERE id_kategori = ?", [id_kategori], (err, rows) => {
    //     if (err || rows.length === 0) {
    //         return res.status(400).json({
    //             status: false,
    //             message: "Kategori tidak ditemukan",
    //         });
    //     }
    // });
});

router.delete("/:id_buku", (req, res) => {
    let { id_buku } = req.params;
    connection.query("DELETE FROM buku WHERE id_buku = ?", id_buku, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Buku deleted",
            });
        }
    });

    // connection.query("SELECT id_kategori FROM kategori WHERE id_kategori = ?", [id_kategori], (err, rows) => {
    //     if (err || rows.length === 0) {
    //         return res.status(400).json({
    //             status: false,
    //             message: "Kategori tidak ditemukan",
    //         });
    //     }
    // });
});

module.exports = router;
