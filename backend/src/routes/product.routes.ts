import { Router } from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/product.controller';
import { upload } from '../utils/upload';
import { isAdmin, verifyToken } from '../common/middlewares';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, isAdmin, upload.single('image'), createProduct);

export default router;