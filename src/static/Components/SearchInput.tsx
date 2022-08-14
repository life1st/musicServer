import * as React from 'react'
import * as style from './SearchInput.module.less'
import { useFocus } from '../hooks/useFocus'

const { useState, useMemo, useRef } = React

interface Props {
  onSearch: (val: string) => void;
  onClear: () => void;
}

export const SearchInput = (props: Props) => {
  const { onSearch, onClear } = props
  const [ searchText, setSearchText ] = useState<string>('')

  const searchInputRef = useRef<HTMLInputElement>()
  useFocus(searchInputRef)
  
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
      onSearch?.(searchText)
    }
  }
  const handleClear = () => {
    setSearchText('')
    onClear?.()
  }

  const showClear = useMemo(() => searchText.length, [searchText])
  return (
    <div className={style.container}>
        <img src={require('../imgs/ic-search.svg')} className={style.searchIcon} />
        <input
          className={style.input}
          type="text" 
          placeholder='input search text' 
          value={searchText} 
          onChange={handleChange} 
          onKeyUp={handleKeyUp} 
          ref={searchInputRef}
        />
        { showClear ? (
          <img src={require('../imgs/ic-cross.svg')} onClick={handleClear} className={style.icClose} />
        ) : null }
    </div>
  )
}
