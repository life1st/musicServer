import React, { useState, useMemo } from 'react'

interface Props {
  onSearch: (val: string) => void;
  onClear: () => void;
}

export const Search = (props: Props) => {
  const { onSearch, onClear } = props
  const [ searchText, setSearchText ] = useState<string>('')

  const handleChange = (e) => {
    const val = e.target.value
    setSearchText(val)
    if (!val) {
      onClear?.()
    }
  }

  const handleKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      e.preventDefault()
      if (searchText) {
        onSearch?.(searchText)
      }
    }
  }
  const handleClear = () => {
    setSearchText('')
    onClear?.()
  }

  const showClear = useMemo(() => searchText.length, [searchText])
  return (
    <div>
          <input type="text" placeholder='input search text' value={searchText} onChange={handleChange} onKeyUp={handleKeyUp} />
          { showClear ? <button onClick={handleClear}>Clear</button> : null }
    </div>
  )
}
