import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBrands, loadOffers } from '../store/searchSlice'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

export default function BrandList() {
  const dispatch = useDispatch()
  const { number, selectedBrand, brands } = useSelector((state) => state.search)
  const request = useRef(null)

  useEffect(() => () => request.current?.abort(), [])

  const select = (brand) => {
    request.current?.abort()
    request.current = dispatch(loadOffers({ number, brand }))
  }

  if (brands.status === 'idle') return null
  if (brands.status === 'loading') return <Loader text="Ищем производителей..." />
  if (brands.status === 'failed') {
    return <ErrorMessage message={brands.error} onRetry={() => dispatch(loadBrands(number))} />
  }
  if (!brands.items.length) {
    return <div className="alert alert-warning">По артикулу «{number}» ничего не найдено</div>
  }

  return (
    <div className="mb-4">
      <h2 className="h5">Производители</h2>
      <div className="list-group">
        {brands.items.map((item) => (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action ${selectedBrand === item.brand ? 'active' : ''}`}
            onClick={() => select(item.brand)}
          >
            <strong>{item.brand}</strong>
            <span className="ms-2 opacity-75">
              {item.number} — {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
