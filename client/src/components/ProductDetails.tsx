import { useNavigate, redirect, Form, type ActionFunctionArgs, useFetcher } from "react-router-dom"
import type { Product } from "../types"
import { formatCurrency } from "../utils"
import { deleteProduct } from "../services/ProductService"

type ProductDetailsProps = {
  product: Product
}

export async function action({ params }: ActionFunctionArgs) {
  if (params.id !== undefined) {
    await deleteProduct(+params.id)
    return redirect('/')
  }
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const fetcher = useFetcher()
  const navigate = useNavigate()

  return (
    <tr className="border-b text-center">
      <td className="p-3 text-lg text-gray-800">
        {product.name}
      </td>
      <td className="p-3 text-lg text-gray-800">
        {formatCurrency(product.price)}
      </td>
      <td className="p-3 text-lg text-gray-800">
        <fetcher.Form method="POST">
          <button
            type="submit"
            name="id"
            value={product.id}
            className={`${product.availability ?  'text-teal-800' : 'text-rose-600'} rounded-lg p-2 text-md cursor-pointer font-bold w-full border border-black-100`}
          >
            {product.availability ? 'Disponible' : 'No disponible'}
          </button>
        </fetcher.Form>
      </td>
      <td className="p-3 text-lg text-gray-800 ">
        <div className=" flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/productos/${product.id}/editar`)}
            className="rounded-md p-2 w-full text-sm font-bold uppercase text-center cursor-pointer text-white shadow-md bg-teal-700 hover:bg-teal-900 transition-colors delay-75"
          >Editar</button>
          <Form
            className="w-full"
            method="POST"
            action={`productos/${product.id}/eliminar`}
            onSubmit={(e) => {
              if (!confirm(`Eliminar producto: ${product.name}?`)) {
                e.preventDefault()
              }
            }}
          >
            <input
              type="submit"
              value="Eliminar"
              className="rounded-md p-2 w-full text-sm font-bold uppercase text-center cursor-pointer text-white shadow-md bg-rose-600 hover:bg-rose-800 transition-colors delay-75"
            />
          </Form>
        </div>
      </td>
    </tr>
  )
}
