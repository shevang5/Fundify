import { Calendar, Target } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
    const [showDonors, setShowDonors] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

    const handleDonateClick = () => {
        if (!user) {
            navigate('/register');
        } else {
            navigate(`/campaign/${campaign._id}`);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
            <Link to={`/campaign/${campaign._id}`}>
                <img src={campaign.image} alt={campaign.title} className="h-48 w-full object-cover" />
            </Link>
            <div className="p-5">
                <Link to={`/campaign/${campaign._id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition">{campaign.title}</h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-gray-500 text-sm pt-2">
                        <div className="flex items-center gap-1">
                            <Target size={16} />
                            <span>₹{campaign.targetAmount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDonateClick}
                    className="w-full mt-5 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Donate
                </button>

                <div className="mt-4 border-t pt-4">
                    <button
                        onClick={() => setShowDonors(!showDonors)}
                        className="text-indigo-600 text-sm font-bold hover:underline"
                    >
                        {showDonors ? 'Hide Donors' : `View ${campaign.donors?.length || 0} Donors`}
                    </button>

                    {showDonors && (
                        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                            {campaign.donors && campaign.donors.length > 0 ? (
                                campaign.donors.map((donor, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                        <span className="font-medium text-gray-700">{donor.name}</span>
                                        <span className="text-gray-500 font-bold">₹{donor.amount}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-2">No donations yet. Be the first!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;