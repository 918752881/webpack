import React from 'react'
import  ReactDom from 'react-dom'
import "./search.less"
import logo from '../images/logo.png'
console.log(logo)

class Search extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            data:"js是世界上最好的语言"
        }
    }
    render(h) {
        return <div>
            <div className="search-text">
            Search Text 222
            { this.state.data }
            </div>
            {/* <img src={  logo  }></img> */}
            </div>;
    }
}

ReactDom.render(
    <Search />,
    document.getElementById('root')
)
