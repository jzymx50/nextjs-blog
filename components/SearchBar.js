import { Search } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react'
export default function SearchBar() {
    const [startTime, setStartTime] = useState(0)
    const [elapsed, setElapsed] = useState(0)
    const [id, setID] = useState(-1)
    const [query, setQuery] = useState('')
    const [lists, setLists] = useState([])
    const [ulStyle, setUlStyle] = useState({})
    const [br, setBr] = useState('')

    const handleInputChange = async function (e) {
        if (e.target.value !== '') {
            setStartTime(Date.now())
            setQuery(e.target.value)
        } else {
            clearInterval(id)
            setLists([])
        }
    }

    // get the height of search bar
    useEffect(() => {
        const searchBar = document.querySelector('.search-bar form')
        const height = searchBar.clientHeight
        const offsetTop = searchBar.offsetTop
        const left = 0
        const top = height + offsetTop
        setUlStyle({
            top: top,
            left: left,
            'borderRadius': `0 0 ${height / 2}px ${height / 2}px`,
            'boxShadow': '0px 2px 8px 0px rgba(0,0,0,0.2)',
            display: 'none',
            userSelect: 'none'
        })
        setBr(`${height / 2}px ${height / 2}px 0 0`)

    }, [])

    // debouncing setup
    useEffect(() => {
        // clear the setInterval function
        if (id !== -1) {
            clearInterval(id)
        }

        if (startTime !== 0) {
            const id = setInterval(() => { setElapsed(Date.now() - startTime) }, 100)
            setID(id)
        }
    }, [startTime])

    useEffect(() => {
        if (elapsed > 500) {
            // send the request to get suggestions
            clearInterval(id)
            getSuggestions()
        }
    }, [elapsed])

    useEffect(() => {
        const suggestion = document.querySelector('.search-bar ul')
        const form = document.querySelector('.search-bar form')
        if (lists.length == 0) {
            suggestion.style.display = 'none'
            form.style['border-radius'] = null
        } else {
            suggestion.style.display = null
            form.style['border-radius'] = br
        }

    }, [lists])

    const getSuggestions = () => {
        fetch("/api/getSuggestions", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                query: query,
                timeStamp: new Date(),
            }),
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.json()
                } else {
                    setLists([<li key='serverErr' className='db f4 pl4 pv2 i gray'>Oops, cannot retrieve suggestions from the server.</li>])
                    throw new Error('error')
                }
            })
            .then((data) => {
                if (data.fail) {
                    setLists([<li key='noResults' className='db f4 pl4 pv2 i gray'>No matched results in the community.</li>])
                } else {

                    setLists(data.results.map(result => {
                        const pos = result.toLowerCase().indexOf(query.toLowerCase())
                        const left = result.slice(0, pos)
                        const mid = result.slice(pos, pos + query.length)
                        const right = result.slice(pos + query.length)

                        return (
                            <li
                                key={result}
                                className='db f4 pl4 pv2'
                                onClick={handleSuggestionClick}
                            >
                                <strong>{left}</strong>
                                {mid}
                                <strong>{right}</strong>
                            </li>
                        )
                    }))
                }
            }).catch((err) => -1);
    }

    const handleSuggestionClick = function (e) {
        document.querySelector('.search-bar input').value = e.currentTarget.textContent
        document.querySelector('.search-bar form').submit()
    }

    return (
        <div className='bg-black-80'>
            <div className='center mw6 pv3 search-bar relative black-80'>
                <form
                    className='br-pill pv2 ph3 bg-white relative bt'
                    action='/community/search'
                    autoComplete='off'
                    method='get'
                    role='search'

                >
                    <Search className='absolute f3' />
                    <input
                        type='search'
                        placeholder='Search the community'
                        required
                        className='bn f4 outline-0 w-100 pl4 ml2 black-80'
                        onInput={handleInputChange}
                        name='query'
                    ></input>
                </form>
                <ul
                    className='auto-suggestion absolute bg-white mw6 ma0 ph0 pb3 w-100'
                    style={ulStyle}
                >{lists}</ul>
            </div>
        </div>


    )
}