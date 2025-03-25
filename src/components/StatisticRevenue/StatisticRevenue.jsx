import { useQuery } from "@tanstack/react-query";
import * as DashboardService from '../../services/DashboardService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const StatisticRevenue = () => {
    const user = useSelector(state => state.user);
    const fetchRevenueByDay = async () => {
        const res = await DashboardService.getRevenueByDay(user?.access_token);
        return res;
    };
    const { data: revenueByDay, isLoading: isLoadingRevenueByDay } = useQuery({
        queryKey: ["revenueByDay"],
        queryFn: fetchRevenueByDay,
        retry: 3
    });

    const fetchRevenueByMonth = async () => {
        const res = await DashboardService.getRevenueByMonth(user?.access_token);
        return res;
    };
    const { data: revenueByMonth, isLoading: isLoadingRevenueByMonth } = useQuery({
        queryKey: ["revenueByMonth"],
        queryFn: fetchRevenueByMonth,
        retry: 3
    });

    const fetchRevenueByYear = async () => {
        const res = await DashboardService.getRevenueByYear(user?.access_token);
        return res;
    };
    const { data: revenueByYear, isLoading: isLoadingRevenueByYear } = useQuery({
        queryKey: ["revenueByYear"],
        queryFn: fetchRevenueByYear,
        retry: 3
    });

    const isLoading = isLoadingRevenueByDay || isLoadingRevenueByMonth || isLoadingRevenueByYear;

    // ✅ Format dữ liệu đúng
    const chartData = [
        { name: "Hôm nay", revenue: revenueByDay?.data || 0 },
        { name: "Tháng này", revenue: revenueByMonth?.data || 0 },
        { name: "Năm nay", revenue: revenueByYear?.data || 0 }
    ];
    return (
        <div style={{ width: "100%", height: "400px", minWidth: "500px"}}>
            <h2>Biểu đồ doanh thu</h2>
            {/* <LoadingComponent isLoading={isLoading}> */}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotoneX" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            {/* </LoadingComponent> */}
        </div>
    );
};

export default StatisticRevenue;
