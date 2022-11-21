import * as React from 'react'
import * as style from './styles/SearchInput.module.less'
import cls from 'classnames'
import { Svg } from './Svg'
import { useFocus } from '../hooks/useFocus'

const { useState, useMemo, useRef } = React

interface Props {
  onSearch: (val: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
  initText?: string;
  className?: string;
}

export const SearchInput = (props: Props) => {
  const { onSearch, onClear, autoFocus = true, initText = '', className } = props
  const [ searchText, setSearchText ] = useState<string>(initText)

  const searchInputRef = useRef<HTMLInputElement>()
  useFocus(autoFocus ? searchInputRef : undefined)
  
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
    <div className={cls(style.container, className)}>
        <Svg src={require('../imgs/ic-search.svg')} className={style.searchIcon} />
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
          <Svg src={require('../imgs/ic-cross.svg')} onClick={handleClear} className={style.icClose} />
        ) : null }
    </div>
  )
}
