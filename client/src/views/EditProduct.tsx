import { Link, Form, useActionData, type ActionFunctionArgs, redirect, type LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { addProduct, getProductById } from "../services/ProductService";
import type { Product } from "../types";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.id !== undefined){
    const product = await getProductById(+params.id)
    if(!product) {
      return redirect('/')
    }
    return product
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData())

  if (Object.values(data).includes('')) {
    return { error: 'Todos los campos son obligatorios' }
  }
  await addProduct(data)

  return redirect('/')
}

export default function EditProduct() {
  const product: Product = useLoaderData()
  const data = useActionData()

  return (
    <>
      <div className="flex justify-between">
        <h2 className=" text-4xl font-black text-slate-500">Editar producto</h2>
        <Link
          to="/"
          className=" rounded-md  p-3 text-sm font-bold text-white shadow-md bg-indigo-600 hover:bg-indigo-800 transition-colors delay-75"
        >
          Lista de Productos
        </Link>
      </div>

      {data?.error && <ErrorMessage>{data.error}</ErrorMessage>}
      <Form
        className="mt-10"
        method="POST"
      >
        <div className="mb-4">
          <label
            className="text-gray-800 font-semibold"
            htmlFor="name"
          >Nombre Producto:</label>
          <input
            id="name"
            type="text"
            className="mt-2 block w-full p-3 rounded-md bg-gray-50 placeholder:italic"
            placeholder="Nombre del Producto"
            name="name"
            defaultValue={product.name}
          />
        </div>
        <div className="mb-4">
          <label
            className="text-gray-800 font-semibold"
            htmlFor="price"
          >Precio:</label>
          <input
            id="price"
            type="number"
            className="mt-2 block w-full p-3 rounded-md bg-gray-50 placeholder:italic"
            placeholder="Precio Producto, ej. 100, 250..."
            name="price"
            defaultValue={product.price}
          />
        </div>
        <input
          type="submit"
          className="mt-5 w-full p-2 text-white font-bold uppercase text-lg cursor-pointer rounded-md bg-teal-700 hover:bg-teal-900 transition-colors delay-75"
          value="Actualizar producto"
        />
      </Form>
    </>
  )
}
