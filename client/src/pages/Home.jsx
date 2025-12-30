import { useEffect, useState } from 'react';
import { fetchCampaigns } from '../api';
import CampaignCard from '../components/CampaignCard';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const getCampaigns = async () => {
            const { data } = await fetchCampaigns();
            setCampaigns(data);
        };
        getCampaigns();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Community Events</h1>
                    <p className="text-gray-500 mt-2">Support local initiatives and festivals</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map((c) => (
                        <CampaignCard key={c._id} campaign={c} />
                    ))}
                </div>

                {campaigns.length === 0 && (
                    <p className="text-center text-gray-500 py-20">No active campaigns found. Check back later!</p>
                )}
            </div>
        </div>
    );
};

export default Home;