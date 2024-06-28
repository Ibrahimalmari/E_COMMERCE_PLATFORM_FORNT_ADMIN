import React from 'react';
import "../../App.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Cell as PieCell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const lineChartData = [
  { month: 'Jan', visitors: 80, buyers: 40 },
  { month: 'Feb', visitors: 70, buyers: 50 },
  { month: 'Mar', visitors: 60, buyers: 60 },
  { month: 'Apr', visitors: 50, buyers: 70 },
  { month: 'May', visitors: 40, buyers: 80 },
  { month: 'Jun', visitors: 30, buyers: 90 },
  { month: 'Jul', visitors: 20, buyers: 100 },
  { month: 'Aug', visitors: 10, buyers: 110 },
  { month: 'Sep', visitors: 0, buyers: 120 },
  { month: 'Oct', visitors: 10, buyers: 130 },
  { month: 'Nov', visitors: 20, buyers: 140 },
  { month: 'Dec', visitors: 30, buyers: 150 },
];

const barChartData = [
  { month: 'Jan', Stores: 30, Products: 40, Sellers: 20 },
  { month: 'Feb', Stores: 35, Products: 45, Sellers: 25 },
  { month: 'Mar', Stores: 40, Products: 50, Sellers: 30 },
  { month: 'Apr', Stores: 38, Products: 48, Sellers: 28 },
  { month: 'May', Stores: 42, Products: 52, Sellers: 32 },
  { month: 'Jun', Stores: 45, Products: 55, Sellers: 35 },
  { month: 'Jul', Stores: 50, Products: 60, Sellers: 40 },
  { month: 'Aug', Stores: 48, Products: 58, Sellers: 38 },
  { month: 'Sep', Stores: 55, Products: 65, Sellers: 45 },
  { month: 'Oct', Stores: 60, Products: 70, Sellers: 50 },
  { month: 'Nov', Stores: 58, Products: 68, Sellers: 48 },
  { month: 'Dec', Stores: 63, Products: 73, Sellers: 53 },
];

const pieChartData = [
  { name: 'Category 1', value: 20 },
  { name: 'Section 2', value: 30 },

];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
const Dashboard = () => {
const COLORS_STORES = ['#0088FE']; // ألوان stores
const COLORS_PRODUCTS = ['#173446']; // ألوان products
const COLORS_SELLERS = ['#0E8C66'];
  return (
    <div style={{ display: 'flex' }}>
      {/* Line Chart */}
      <div style={{ marginRight: '20px' }}>
        <LineChart
          width={800}
          height={400}
          data={lineChartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="buyers" stroke="#82ca9d" />
        </LineChart>

        {/* Bar Chart */}
        <BarChart
  width={800}
  height={400}
  data={barChartData}
  margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  
  <Bar dataKey="Stores" fill={COLORS_STORES[0]}>
    {barChartData.map((entry, index) => (
      <Cell key={`cell-stores-${index}`} fill={COLORS_STORES[index % COLORS_STORES.length]} />
    ))}
  </Bar>
  <Bar dataKey="Products" fill={COLORS_PRODUCTS[0]}>
    {barChartData.map((entry, index) => (
      <Cell key={`cell-products-${index}`} fill={COLORS_PRODUCTS[index % COLORS_PRODUCTS.length]} />
    ))}
  </Bar>
  <Bar dataKey="Sellers" fill={COLORS_SELLERS[0]}>
    {barChartData.map((entry, index) => (
      <Cell key={`cell-sellers-${index}`} fill={COLORS_SELLERS[index % COLORS_SELLERS.length]} />
    ))}
  </Bar>
</BarChart>
      </div>

      {/* Pie Chart */}
      <div>
      <div style={{ marginRight: 'auto',marginTop:'150px' }}>
        <PieChart width={400} height={400}>
          <Pie
            data={pieChartData}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
