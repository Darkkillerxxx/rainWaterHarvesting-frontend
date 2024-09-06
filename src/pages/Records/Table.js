import React, { useState, useMemo } from 'react'
import './Table.css'

// Sample data (replace with your actual data)
const initialData = [
  { district: "District A", taluka: "Taluka 1", village: "Village X", location: "Location 1", inauguration_date: "2023-01-15" },
  { district: "District A", taluka: "Taluka 2", village: "Village Y", location: "Location 2", inauguration_date: "2023-02-20" },
  { district: "District B", taluka: "Taluka 3", village: "Village Z", location: "Location 3", inauguration_date: "2023-03-25" },
  // Add more data as needed
]

export default function Records() {
  const [data] = useState(initialData)
  const [filters, setFilters] = useState({
    district: '',
    taluka: '',
    village: ''
  })

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return (
        (filters.district === '' || item.district === filters.district) &&
        (filters.taluka === '' || item.taluka === filters.taluka) &&
        (filters.village === '' || item.village === filters.village)
      )
    })
  }, [data, filters])

  const uniqueValues = useMemo(() => {
    return {
      districts: [...new Set(data.map(item => item.district))],
      talukas: [...new Set(data.map(item => item.taluka))],
      villages: [...new Set(data.map(item => item.village))]
    }
  }, [data])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="filtered-table">
      <div className="filters">
        <select 
          onChange={(e) => handleFilterChange('district', e.target.value)}
          className="filter-select"
        >
          <option value="">All Districts</option>
          {uniqueValues.districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>

        <select 
          onChange={(e) => handleFilterChange('taluka', e.target.value)}
          className="filter-select"
        >
          <option value="">All Talukas</option>
          {uniqueValues.talukas.map(taluka => (
            <option key={taluka} value={taluka}>{taluka}</option>
          ))}
        </select>

        <select 
          onChange={(e) => handleFilterChange('village', e.target.value)}
          className="filter-select"
        >
          <option value="">All Villages</option>
          {uniqueValues.villages.map(village => (
            <option key={village} value={village}>{village}</option>
          ))}
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>DISTRICT</th>
            <th>TALUKA</th>
            <th>VILLAGE</th>
            <th>LOCATION</th>
            <th>INAUGURATION DATE</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.district}</td>
              <td>{item.taluka}</td>
              <td>{item.village}</td>
              <td>{item.location}</td>
              <td>{item.inauguration_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}