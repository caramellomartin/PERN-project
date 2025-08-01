import { Router } from "express"
import { createProducts, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "../handlers/products"
import { productByIdValidatorRules, productUpdateValidatorRules, productValidatorRules } from "../validators/productValidator"
import { handleInputErrors } from "../middlewares/validationMiddleware"

const router = Router()

/**
 * @swagger
 * components:
 *    schemas:
 *        Product:
 *            type: object
 *            properties:
 *                id:
 *                    type: integer
 *                    description: The product ID
 *                    example: 1
 *                name:
 *                    type: string
 *                    description: The product name
 *                    example: Mouse
 *                price:
 *                    type: number
 *                    description: The product price
 *                    example: 105
 *                availability:
 *                    type: boolean
 *                    description: The product availability
 *                    example: true
 */

/**
 * @swagger
 * /api/products:
 *    get:
 *        summary: Get a list of products
 *        tags:
 *            - Products
 *        description: Return a list of products
 *        responses:
 *            200:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Get a product by ID
 *        tags:
 *            - Products
 *        description: Return a product based on its unique ID
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            404:
 *                description: Not Found
 *            400:
 *                description: Bad request - Invalid ID
 */
router.get('/:id', productByIdValidatorRules, handleInputErrors, getProductById)

/**
 * @swagger
 * /api/products:
 *    post:
 *        summary: Creates a new product
 *        tags:
 *            - Products
 *        description: Return a new record in the database
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            name:
 *                                type: string
 *                                example: "Mousepad"
 *                            price:
 *                                type: number
 *                                example: 15
 *        responses:
 *            201:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad request - Invalid input data
 */
router.post('/', productValidatorRules, handleInputErrors, createProducts)

/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *        summary: Updates a product with user input
 *        tags:
 *            - Products
 *        description: Returns the updated product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            name:
 *                                type: string
 *                                example: "Mousepad"
 *                            price:
 *                                type: number
 *                                example: 15
 *                            availability:
 *                                type: boolean
 *                                example: true
 *        responses:
 *            200:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad request - Invalid ID or invalid input data
 *            404:
 *                description: Product Not Found
 */
router.put('/:id', productUpdateValidatorRules, handleInputErrors, updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *    patch:
 *        summary: Updates a product availability
 *        tags:
 *            - Products
 *        description: Returns the updated availability product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad request - Invalid ID
 *            404:
 *                description: Product Not Found
 */
router.patch('/:id', productByIdValidatorRules, handleInputErrors, updateAvailability)

/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *        summary: Deletes a product by ID
 *        tags:
 *            - Products
 *        description: Deletes a product from the database
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Succesful response
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: string
 *                            value: 'Producto eliminado correctamente'
 *            400:
 *                description: Bad request - Invalid ID
 *            404:
 *                description: Product Not Found
 */
router.delete('/:id', productByIdValidatorRules, handleInputErrors, deleteProduct)

export default router