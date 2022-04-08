import React, { useEffect, useState } from "react";
import "./App.scss";

function App() {
    const lists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [list1, setList1] = useState("");
    const [list2, setList2] = useState([]);
    const [value, setValue] = useState([]);
    const onSelect = (id, num, i) => {
        let idObj = {
            1: () => onList1(num),
            2: () => onList2(i, num),
        };
        return idObj[id]();
    };
    const onList1 = (num) => {
        setList1(num);
    };
    const onList2 = (i, num) => {
        let items = value.slice();
        console.log("items:", items);
        let index = items.indexOf(num);
        index === -1 ? items.push(num) : items.splice(index, 1);
        setList2((tagIndexList) =>
            tagIndexList.includes(i)
                ? tagIndexList.filter((item) => item !== i)
                : [...tagIndexList, i]
        );
        setValue(items);
    };
    return (
        <div className="App">
            <header className="App-header">
                <ul className="list">
                    {lists.map((item, i) => (
                        <li
                            onClick={() => onSelect(1, item)}
                            key={i}
                            className={`${list1 === item ? "active" : ""}`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
                <ul className="list">
                    {lists.map((item, i) => (
                        <li
                            onClick={() => onSelect(2, i, item)}
                            key={i}
                            className={`${list2.includes(i + 1) ? "active" : ""}`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </header>
        </div>
    );
}

export default App;
