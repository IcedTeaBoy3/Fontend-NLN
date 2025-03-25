import { useQuery } from "@tanstack/react-query";
import * as DashboardService from "../../services/DashboardService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import LoadingComponent from "../LoadingComponent/LoadingComponent";


const StaticPaidvsUnPaid = () => {
    const user = useSelector(state => state.user);

    const fetchPaidVsUnpaidOrders = async () => {
        const res = await DashboardService.getPaidVsUnpaidOrders(user?.access_token);
        return res.data; // Chỉ lấy phần `data`
    };

    const { data: orderStats, isLoading } = useQuery({
        queryKey: ["paidVsUnpaidOrders"],
        queryFn: fetchPaidVsUnpaidOrders,
        retry: 3
    });

    const COLORS = ["#4CAF50", "#FF5733"]; // Màu xanh: đã thanh toán, đỏ: chưa thanh toán

    const chartData = [
        { name: "Đã thanh toán", value: orderStats?.paid || 0 },
        { name: "Chưa thanh toán", value: orderStats?.unpaid || 0 }
    ];
    console.log(orderStats);

    return (
        <div style={{ width: "100%", height: "400px"}}>
            <h2>Thống kê đơn hàng đã thanh toán vs chưa thanh toán</h2>
            {/* <LoadingComponent isLoading={isLoading}> */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            {/* </LoadingComponent> */}
        </div>
    );
};

export default StaticPaidvsUnPaid;
