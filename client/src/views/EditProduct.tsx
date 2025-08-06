import { Link, Form, useActionData, type ActionFunctionArgs, redirect, type LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { getProductById, updateProduct } from "../services/ProductService";
import type { Product } from "../types";
import ProductForm from "../components/ProductForm";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.id !== undefined) {
    const product = await getProductById(+params.id)
    if (!product) {
      return redirect('/')
    }
    return product
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData())

  if (Object.values(data).includes('')) {
    return { error: 'Todos los campos son obligatorios' }
  }

  if (params.id !== undefined) {
    await updateProduct(data, +params.id)
    return redirect('/')
  }
}

const availabilityOptions = [
  { name: 'Disponible', value: true },
  { name: 'No Disponible', value: false }
]

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
        <ProductForm
          product={product}
        />

        <div className="mb-4">
          <label
            className="text-gray-800"
            htmlFor="availability"
          >Disponibilidad:</label>
          <select
            id="availability"
            className="mt-2 block w-full p-3 rounded-md bg-gray-50 cursor-pointer"
            name="availability"
            defaultValue={product?.availability.toString()}
          >
            {availabilityOptions.map(option => (
              <option key={option.name} value={option.value.toString()}>{option.name}</option>
            ))}
          </select>
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
