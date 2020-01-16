import React from 'react'
import  ReactDom from 'react-dom'
import "./search.less"
import logo from '../images/logo.png'
import '../../common'
import { a , b} from './tree-shaking'

class Search extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            data:"js是世界上最好的语言",
            Text: null
        }
    }
    loadComponent() {
        import('./test.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }
    render(h) {
        const FuncA = a()
        const { Text } = this.state
        return <div>
            { 
                Text ? <Text/>: null
            }
            <div className="search-text" onClick={ this.loadComponent.bind(this) }>
            { FuncA }
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
