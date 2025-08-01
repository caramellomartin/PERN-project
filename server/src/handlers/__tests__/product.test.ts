import request from "supertest";
import server from "../../server";
import Product from "../../models/Product.model";

describe('Catch handlers for server errors', () => {
  // Clear mocks after the test
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('GET /api/products should handle internal error', async () => {
    jest.spyOn(Product, 'findAll').mockRejectedValueOnce(new Error('DB error'))

    const res = await request(server).get('/api/products')
    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })

  it('GET /api/products/:id should handle internal error', async () => {
    jest.spyOn(Product, 'findByPk').mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    const res = await request(server).get('/api/products/1')
    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })

  it('PUT /api/products/:id should handle internal error', async () => {
    jest.spyOn(Product, 'findByPk').mockRejectedValueOnce(new Error('DB error'))

    const res = await request(server).put('/api/products/1').send({
      name: "Error",
      price: 100,
      availability: true
    })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })

  it('DELETE /api/products/:id should handle internal error', async () => {
    jest.spyOn(Product, 'findByPk').mockRejectedValueOnce(new Error('DB error'))

    const res = await request(server).delete('/api/products/1')
    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })
})

describe('POST /api/products', () => {
  it('Should display validation errors', async () => {
    const res = await request(server).post('/api/products').send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveLength(4)

    expect(res.status).not.toBe(201)
    expect(res.body.errors).not.toHaveLength(5)
  })
  it('Should validate that the price is greater than 0', async () => {
    const res = await request(server).post('/api/products').send({
      name: "Mouse - Price Test",
      price: 0
    })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveLength(1)

    expect(res.status).not.toBe(201)
    expect(res.body.errors).not.toHaveLength(2)
  })
  it('Should validate that the price is a number and greater than 0', async () => {
    const res = await request(server).post('/api/products').send({
      name: "Mouse - Price Test",
      price: "Hello world!"
    })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveLength(2)

    expect(res.status).not.toBe(201)
    expect(res.body.errors).not.toHaveLength(1)
  })
  it('Should create a new product', async () => {
    const res = await request(server).post('/api/products').send({
      name: "Keyboard Wireless - Testing",
      price: 220
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('data')

    expect(res.status).not.toBe(404)
    expect(res.status).not.toBe(200)
    expect(res.body).not.toHaveProperty('error')
  })
})

describe('GET /api/products', () => {
  it('Should check if "/api/products" URL exists', async () => {
    const res = await request(server).get('/api/products')

    expect(res.status).not.toBe(404)
  })

  it('GET a JSON response with products', async () => {
    const res = await request(server).get('/api/products')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveLength(1)

    expect(res.status).not.toBe(404)
    expect(res.body).not.toHaveProperty('errors')
  })
})

describe('GET /api/products/:id', () => {
  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 9999999
    const res = await request(server).get(`/api/products/${productId}`)

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe('Producto no encontrado')

    expect(res.status).not.toBe(200)
  })

  it('Should check a valid ID in the URL', async () => {
    const res = await request(server).get(`/api/products/not-valid-url`)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveLength(1)
    expect(res.body.errors[0].msg).toBe('Id inválido')
  })

  it('Get a JSON response for a single product', async () => {
    const res = await request(server).get(`/api/products/1`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
  })
})

describe('PUT /api/products/:id', () => {
  it('Should check a valid ID in the URL', async () => {
    const res = await request(server).put(`/api/products/not-valid-url`).send({
      name: "Mouse - Testing",
      price: 115,
      availability: true
    })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveLength(1)
    expect(res.body.errors[0].msg).toBe('Id inválido')
  })

  it('Should display validation error messages when updating a product', async () => {
    const res = await request(server).put('/api/products/1').send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toBeTruthy()
    expect(res.body.errors).toHaveLength(5)

    expect(res.status).not.toBe(200)
    expect(res.status).not.toHaveProperty('data')
  })

  it('Should validate that the price is greater than 0', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: "Mouse - Testing",
      price: 0,
      availability: true
    })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors[0].msg).toBe('Precio inválido')
    expect(res.body.errors).toHaveLength(1)

    expect(res.status).not.toBe(200)
    expect(res.status).not.toHaveProperty('data')
  })

  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 9999999
    const res = await request(server).put(`/api/products/${productId}`).send({
      name: "Mouse - Testing",
      price: 350,
      availability: true
    })

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe('Producto no encontrado')

    expect(res.status).not.toBe(200)
    expect(res.status).not.toHaveProperty('data')
  })

  it('Should update an existing product with valid data', async () => {
    const res = await request(server).put('/api/products/1').send({
      name: "Mouse - Testing",
      price: 125,
      availability: true
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')

    expect(res.status).not.toBe(400)
    expect(res.status).not.toHaveProperty('errors')
  })
})

describe('PATCH /api/products/:id', () => {
  it('Should check a valid ID in the URL', async () => {
    const res = await request(server).patch(`/api/products/not-valid-url`).send({
      name: "Mouse - Testing",
      price: 115,
      availability: true
    })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveLength(1)
    expect(res.body.errors[0].msg).toBe('Id inválido')
  })

  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 9999999
    const res = await request(server).patch(`/api/products/${productId}`).send({
      name: "Mouse - Testing",
      price: 350,
      availability: true
    })

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe('Producto no encontrado')

    expect(res.status).not.toBe(200)
    expect(res.status).not.toHaveProperty('data')
  })

  it('Should update the product availability', async () => {
    const res = await request(server).patch('/api/products/1')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data.availability).toBe(false)

    expect(res.status).not.toBe(400)
    expect(res.status).not.toBe(404)
    expect(res.status).not.toHaveProperty('errors')
  })
})

describe('DELETE /api/products/:id', () => {
  it('Should check a valid ID', async () => {
    const res = await request(server).delete('/api/products/not-valid-url')

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors[0].msg).toBe('Id inválido')
  })

  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 9999999
    const res = await request(server).delete(`/api/products/${productId}`)

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe('Producto no encontrado')

    expect(res.status).not.toBe(200)
  })

  it('Should delete a product', async () => {
    const res = await request(server).delete('/api/products/1')

    expect(res.status).toBe(200)
    expect(res.body.data).toBe('Producto eliminado correctamente.')

    expect(res.status).not.toBe(404)
    expect(res.status).not.toBe(400)
    expect(res.body).not.toHaveProperty('error')
  })
})