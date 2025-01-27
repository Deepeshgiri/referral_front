import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { apiCaller } from "../utils/Apis";
import { useLoading } from "../context/LoadingContext";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [recentActivity, setRecentActivity] = useState({});
  const [error, setError] = useState(null);
  
  const { token } = useContext(AuthContext);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const result = await apiCaller.get("/api/user/dashboard");
        if (result && result.user) {
          setData(result.user);
        } else {
          setError("No data found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, setLoading]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoading(true);
      try {
        const result = await apiCaller.get("/api/referral/recent-act");

        setRecentActivity(result.result);

      } catch (err) {
        setError(err.message || "Failed to fetch recent activity");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [token, setLoading]);

  if (error) {
    return <div className="flex-1 p-6 text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  console.log(recentActivity)

  const progress = data.stageId && data.stageCount ? Math.floor((data.stageId / data.stageCount) * 100) : 0;

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Referrals</h2>
          <p className="text-3xl font-bold">{data.totalReferrals || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Points Earned</h2>
          <p className="text-3xl font-bold">{data.pointsEarned || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Active Referrals</h2>
          <p className="text-3xl font-bold">{data.activeReferrals || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Your Progress</h2>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          You are at <strong>{data.currentStage || "N/A"}</strong> stage and have completed <br />
          <strong>{progress}%</strong> of your progress!!!
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>


        <ul className="divide-y divide-gray-100">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (

              <li className="flex justify-between gap-x-6 py-5" key={index}>
                <div className="flex min-w-0 gap-x-4">
                  <img className="size-12 flex-none rounded-full bg-gray-50" src={activity.image || "default-image-url"} alt={activity.first_name || "User"}></img>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-900"> {activity.first_name} </p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{activity.phone}</p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm/6 text-gray-900">{activity.referral_code}</p>
                  <p className="mt-1 text-xs/5 text-blue-600 ">{activity.stageName}</p>
                </div>

              </li>

            ))
          ) : (
            <li>No recent activity.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;