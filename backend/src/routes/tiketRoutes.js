import express from 'express';
import * as tiketController from '../controllers/tiketController.js';

const router = express.Router();

router.get('/', tiketController.index); // GET /tiket
router.get('/:id', tiketController.show); // GET /tiket/:id
router.post('/store', tiketController.store); // POST /users/store
router.put('/update/:id', tiketController.update); // PUT /users/update/:id
router.delete('/delete/:id', tiketController.destroy); // DELETE /users/delete/:id

/**
 * @swagger
 * /tiket:
 *   get:
 *     summary: Ambil semua tiket
 *     description: Endpoint untuk mendapatkan semua data tiket
 *     responses:
 *       200:
 *         description: Sukses
 */
router.get('/', (req, res) => {
  res.json({ message: 'Daftar tiket berhasil diambil' });
});

/**
 * @swagger
 * /tiket/:id:
 *   get:
 *     summary: Ambil semua tiket
 *     description: Endpoint untuk mendapatkan semua data tiket
 *     responses:
 *       200:
 *         description: Sukses
 */
router.get('/', (req, res) => {
  res.json({ message: 'Daftar tiket berhasil diambil' });
});

export default router;
