import SearchForm from './components/SearchForm'
import BrandList from './components/BrandList'
import OffersTable from './components/OffersTable'

export default function App() {
  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Поиск запчастей</h1>
      <SearchForm />
      <BrandList />
      <OffersTable />
    </div>
  )
}
