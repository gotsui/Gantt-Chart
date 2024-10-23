import React from "react";

function formatMM(date: Date) {
    return `${('0' + (date.getMonth() + 1)).slice(-2)}`;
}

const DisplayPeriod: React.FC<any> = ({startDate, endDate, onChangeStartYear, onChangeStartMonth, onChangeEndYear, onChangeEndMonth}) => {
    return (
        <>
            <div className="ml-20">表示期間</div>
            <select className="border mx-2 p-1" value={startDate.getFullYear()} onChange={(e) => {onChangeStartYear(e)}}>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
                <option>2029</option>
                <option>2030</option>
            </select>
            <div>年</div>
            <select className="border mx-2 p-1" value={formatMM(startDate)} onChange={(e) => {onChangeStartMonth(e)}}>
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>06</option>
                <option>07</option>
                <option>08</option>
                <option>09</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
            </select>
            <div>月～</div>
            <select className="border mx-2 p-1" value={endDate.getFullYear()} onChange={(e) => {onChangeEndYear(e)}}>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
                <option>2029</option>
                <option>2030</option>
            </select>
            <div>年</div>
            <select className="border mx-2 p-1" value={formatMM(endDate)} onChange={(e) => {onChangeEndMonth(e)}}>
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>06</option>
                <option>07</option>
                <option>08</option>
                <option>09</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
            </select>
            <div>月</div>
        </>
    )
}

export { DisplayPeriod };
