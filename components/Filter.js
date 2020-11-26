import { useEffect, useState } from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'react-bootstrap-icons';

function Filter({ filterFeed }) {
    const [direction, setDirection] = useState('down')
    const [category, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('popularity')

    useEffect(() => {
        filterFeed(category, sortBy, direction)
    }, [direction, category, sortBy])

    return (

        <ul className="menu list pa3 near-dark sans-serif f5 fw5 tracked mb2">
            <li className="dib ma2 bg-animate hide-child relative-m relative-l w-100 w-auto-ns pointer">
                <a className="dib nav tc no-underline pa2 ph5 bg-gray white w-100">Filters
                    <ChevronDown size='16' className='v-mid ml1' />
                </a>
                <ul className="menu list bg-white mt1 pa1 child child-vs o-100-vs absolute-m absolute-l top-100-m w-100 br2 shadow-4 ">
                    <li
                        className="ma1 pa1 ph3 bg-animate hover-bg-light-gray"
                        onClick={() => setCategory('all')}
                    >
                        <a>Any</a>
                    </li>
                    <li
                        className="ma1 pa1 ph3 bg-animate hover-bg-light-gray"
                        onClick={() => setCategory('free')}
                    >
                        <a>Downloadable</a>
                    </li>
                    <li
                        className="ma1 pa1 ph3 bg-animate hover-bg-light-gray"
                        onClick={() => setCategory('notFree')}
                    >
                        <a>Copyrighted</a>
                    </li>
                </ul>
            </li>

            <li className="dib ma2 bg-animate hide-child relative-m relative-l w-100 w-auto-ns pointer">
                <a className="dib nav tc no-underline pa2 ph4 bg-gray white w-100">Sort By
                    <ChevronDown size='16' className='v-mid ml1' />
                </a>
                <ul className="menu list bg-white mt1 pa1 child child-vs o-100-vs absolute-m absolute-l top-100-m w-100 br2 shadow-4">
                    <li
                        className="ma1 pa1 ph3 bg-animate hover-bg-light-gray"
                        onClick={() => setSortBy('popularity')}
                    >
                        <a>Popularity</a>
                    </li>
                    <li
                        className="ma1 pa1 ph3 bg-animate hover-bg-light-gray"
                        onClick={() => setSortBy('date')}
                    >
                        <a>Date</a>
                    </li>
                </ul>
            </li>
            <div className='v-mid di pointer gray'>
                <ArrowUp size='24' className={direction == 'down' ? '' : 'near-black'} onClick={() => setDirection('up')} />
                <ArrowDown size='24' className={direction == 'up' ? '' : 'near-black'} onClick={() => setDirection('down')} />
            </div>

        </ul>
    );
}

export default Filter;