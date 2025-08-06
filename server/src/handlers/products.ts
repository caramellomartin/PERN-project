import { Request, Response } from "express"
import Product from "../models/Product.model"

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [
        ['id', 'DESC']
      ]
    })
    res.json({ data: products })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const productById = await Product.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
    if (!productById) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }
    res.json({ data: productById })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

//Create new Product
export const createProducts = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    //Find product
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }

    //Update Product
    await product.update(req.body)
    await product.save()

    res.json({ data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    //Find product
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }

    //Update Product availability
    product.availability = !product.dataValues.availability
    await product.save()

    res.json({ data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

//Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    //Find product
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }
    //Delete Product
    await product.destroy()

    res.json({ data: 'Producto eliminado correctamente.' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}