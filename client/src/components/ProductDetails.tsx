import { useNavigate } from "react-router-dom"
import type { Product } from "../types"
import { formatCurrency } from "../utils"

type ProductDetailsProps = {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
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
        {product.availability ? 'Disponible' : 'No disponible'}
      </td>
      <td className="p-3 text-lg text-gray-800 ">
        <div className=" flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/productos/${product.id}/editar`)}
            className="rounded-md p-2 w-full text-sm font-bold uppercase text-center cursor-pointer text-white shadow-md bg-teal-700 hover:bg-teal-900 transition-colors delay-75"
          >Editar</button>
        </div>
      </td>
    </tr>
  )
}
