const API_URL = '/api/'
const API_KEY = import.meta.env.VITE_API_KEY

async function request(params, signal) {
  const query = new URLSearchParams({ key: API_KEY, ...params })

  let response
  try {
    response = await fetch(`${API_URL}?${query}`, { signal })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new Error('Сервис недоступен, проверьте подключение')
  }

  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`)

  const data = await response.json()
  if (data.error) throw new Error(data.error)

  // при пустом результате API отдаёт массив с одной пустой записью
  return (data.goods || []).filter((item) => item.brand)
}

export async function fetchBrands(number, signal) {
  const goods = await request({ number }, signal)
  const unique = new Map()
  goods.forEach((item) => {
    if (!unique.has(item.brand)) {
      unique.set(item.brand, { brand: item.brand, number: item.number, name: item.name })
    }
  })
  return [...unique.values()]
}

export async function fetchOffers(number, brand, signal) {
  const goods = await request({ number, brand, analogues: 'on' }, signal)
  const items = goods.flatMap((item) => [
    { ...item, isAnalog: false },
    ...(item.analogues || []).map((analog) => ({ ...analog, isAnalog: true })),
  ])

  return items.flatMap((item) => {
    const base = {
      goodsID: item.goodsID,
      brand: item.brand,
      number: item.number,
      name: item.name,
      isAnalog: item.isAnalog,
    }
    if (!item.warehouses?.length) {
      return [{ ...base, id: item.goodsID, warehouse: null, price: null, stock: 0, shipmentDate: null }]
    }
    return item.warehouses.map((w) => ({
      ...base,
      id: `${item.goodsID}-${w.id}`,
      warehouse: w.code || '—',
      price: w.price,
      stock: w.stock,
      shipmentDate: w.shipmentDate,
    }))
  })
}
