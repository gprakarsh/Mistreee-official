import React from 'react'
import './ItemsMapper.scss'

function ItemsMapper(props) {
    const { items, deleteItem, style1,style2 } = props
    console.log({ items })
    const mapper = items.map((item, i) => {
        if (style1 && style2) {
            return (
                <button key={i} style={style2}>{item}<i class="fas fa-times" onClick={() => deleteItem(i)} style={style1}></i></button>
            )
        }
        else {
            return (
                <button key={i}>{item}<i class="fas fa-times" onClick={() => deleteItem(i)} ></i></button>
            )
        }
    })
    return (<div className='ItemsMapper'>
        {mapper}
    </div>)
}

export default ItemsMapper