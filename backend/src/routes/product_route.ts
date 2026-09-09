import { Router } from "express";
import { upload } from "../middlewares/multer_middleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProductDetails,
} from "../controllers/product_controller.js";

const productrouter = Router();

productrouter
  .route("/addProduct")
  .post(upload.array("product_img", 5), addProduct);
productrouter.route("/getAllProducts").get(getAllProducts);
productrouter.route("/getProductById/:product_id").get(getProductById);
productrouter
  .route("/updateProductDetails/:productId")
  .patch(upload.array("product_img", 5), updateProductDetails);
productrouter.route("/deleteProduct/:productId").delete(deleteProduct);

export { productrouter };
