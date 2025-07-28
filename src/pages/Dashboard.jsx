import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import spendingData from "../spending_data";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c",
  "#d0ed57", "#8dd1e1", "#83a6ed", "#ffbb28", "#ff6666",
];

//gets all unique years
function getYears(data){
  const y = new Set(data.map(item => new Date(item.date).getFullYear()))
  return Array.from(y).sort()
};

const getMonths = () => [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
//gets all unique categories
function getCategories(d){
  const cats = new Set(d.map(el => el.category))
  return Array.from(cats).sort()
}

//data for the dashboard
const Dashboard = ()=> {
    const [viewMode, setViewMode] = useState("year");
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");

    const filteredData = spendingData.filter(item => {
        const date = new Date(item.date);
        const yMatch = date.getFullYear() === Number(selectedYear);
        const mMatch = date.getMonth() === selectedMonth;
        const cMatch = selectedCategory === "" || item.category === selectedCategory;

        if(viewMode === "year") return yMatch && cMatch;
        if(viewMode === "month") return yMatch && mMatch && cMatch;
        if(viewMode === "category") return cMatch;
        return true;
    });

    const chartData = Object.values(
      filteredData.reduce((acc, curr)=>{
        const cat = curr.category;
        if(!acc[cat]) acc[cat] = { name: cat, value: 0 }
        acc[cat].value += curr.amount;
        return acc;
      }, {})
    );

    const timeMap = filteredData.reduce((acc, curr) => {
      let dt = new Date(curr.date);
      let mo = getMonths()[dt.getMonth()];
      let key = `${mo} ${dt.getFullYear()}`;

      if(!acc[key]) acc[key] = { name: key, value: 0, categories: new Set() };

      acc[key].value += curr.amount;
      acc[key].categories.add(curr.category);

      return acc;
    }, {})

    const timeSeriesData = Object.values(timeMap).map(i => ({
      name: i.name,
      value: i.value,
      categories: Array.from(i.categories).join(', ')
    }));

    timeSeriesData.sort((a,b)=>{
      const parse = (str)=>{
        let [month, yr] = str.split(" ");
        return new Date(`${month} 1, ${yr}`);
      }
      return parse(a.name) - parse(b.name);
    });

    const totalSpending = filteredData.reduce((sum, curr)=> sum + curr.amount, 0);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length){
          let p = payload[0].payload;
          return (
            <div style={{
              backgroundColor: "#222",
              color: "#eee", padding: "10px",
              borderRadius: "5px", fontSize: "14px"
            }}>
              <strong>{label}</strong><br />
              Spending: ${p.value}<br />
              Categories: {p.categories}
            </div>
          );
        }
        return null;
    };

    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding: 20 }}>
        <h1 style={{ fontSize: 32, marginBottom: 20, textAlign: "center" }}>Spending Overview</h1>

		{/*Buttons and dropdown*/}
        <div style={{
          display:"flex", flexWrap:"wrap", justifyContent:"center",
          alignItems:"center", gap: 16, marginBottom: 30
        }}>
          <label>
            <input type="radio" name="viewMode" value="year"
              checked={viewMode === "year"}
              onChange={()=>setViewMode("year")}
            /> Yearly
          </label>

          <select
            value={selectedYear}
            onChange={(e)=>setSelectedYear(+e.target.value)}
            disabled={viewMode==="category"}
            style={{ marginRight: 30 }}
          >
            {getYears(spendingData).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <label>
            <input type="radio" name="viewMode" value="month"
              checked={viewMode==="month"}
              onChange={()=>setViewMode("month")}
            /> Monthly
          </label>

          <select
            value={selectedMonth}
            onChange={(e)=>setSelectedMonth(Number(e.target.value))}
            disabled={viewMode!=="month"}
          >
            {getMonths().map((m, i)=>(
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <label>
            <input type="radio" name="viewMode" value="category"
              checked={viewMode==="category"}
              onChange={()=>setViewMode("category")}
            /> Category
          </label>

          <select
            value={selectedCategory}
            onChange={(e)=>setSelectedCategory(e.target.value)}
            disabled={viewMode !== "category"}
          >
            <option value="">All</option>
            {getCategories(spendingData).map((c)=>(
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20, fontSize: 18 }}>
          Total Spending: <strong>${totalSpending.toFixed(2)}</strong>
        </div>

        {/*Charts #_#*/}
        <div style={{ display:"flex", flexDirection:"row", gap: 40 }}>
          <div style={{ width: 400, height: 300 }}>
            <h3 style={{ textAlign:"center" }}>Category Breakdown</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
                  {chartData.map((_, i)=>(
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: 800, height: 350 }}>
            <h3 style={{ textAlign:"center" }}>Time Series</h3>
            <ResponsiveContainer>
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-75}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: 0,
                    border: "1px solid #ccc",
                  }}
                  itemStyle={{ color: "#000" }}
                />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
}

export default Dashboard;
