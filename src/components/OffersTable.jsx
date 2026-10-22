import { useDispatch, useSelector } from 'react-redux'
import { loadOffers } from '../store/searchSlice'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })
const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })

export default function OffersTable() {
  const dispatch = useDispatch()
  const { number, selectedBrand, offers } = useSelector((state) => state.search)

  if (offers.status === 'idle') return null
  if (offers.status === 'loading') return <Loader text="Загружаем предложения..." />
  if (offers.status === 'failed') {
    return (
      <ErrorMessage
        message={offers.error}
        onRetry={() => dispatch(loadOffers({ number, brand: selectedBrand }))}
      />
    )
  }
  if (!offers.items.length) {
    return <div className="alert alert-warning">Предложений не найдено</div>
  }

  return (
    <div>
      <h2 className="h5">
        Предложения: {selectedBrand} {number}
      </h2>
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead>
            <tr>
              <th>Производитель</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Склад</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
              <th>Отгрузка</th>
            </tr>
          </thead>
          <tbody>
            {offers.items.map((offer) => (
              <tr key={offer.id} className={offer.stock ? '' : 'text-secondary'}>
                <td>
                  {offer.brand}
                  {!offer.isAnalog && <span className="badge text-bg-primary ms-2">искомый</span>}
                </td>
                <td>{offer.number}</td>
                <td>{offer.name}</td>
                <td>{offer.warehouse ?? '—'}</td>
                <td className="text-end text-nowrap">
                  {offer.price != null ? priceFormat.format(offer.price) : '—'}
                </td>
                <td className="text-end">{offer.stock || 'нет'}</td>
                <td>{offer.shipmentDate ? dateFormat.format(new Date(offer.shipmentDate)) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
