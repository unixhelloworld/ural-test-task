import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadBrands, reset } from '../store/searchSlice'

const DEBOUNCE_MS = 500
const MIN_LENGTH = 3

export default function SearchForm() {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')

  useEffect(() => {
    const number = value.trim()
    if (number.length < MIN_LENGTH) {
      dispatch(reset())
      return
    }

    let request
    const timer = setTimeout(() => {
      request = dispatch(loadBrands(number))
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      request?.abort()
    }
  }, [value, dispatch])

  return (
    <div className="mb-4">
      <label htmlFor="number" className="form-label">
        Артикул
      </label>
      <input
        id="number"
        className="form-control form-control-lg"
        placeholder="Например, 01089"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        autoFocus
      />
      <div className="form-text">Поиск начнётся после ввода {MIN_LENGTH} символов</div>
    </div>
  )
}
