import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById } from '../api';
import axios from 'axios';
import { Calendar, Target, IndianRupee, ArrowLeft, Users } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState('');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const getCampaign = async () => {
      try {
        const { data } = await fetchCampaignById(id);
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign details", error);
      } finally {
        setLoading(false);
      }
    };
    getCampaign();
  }, [id]);

  const handlePayment = async (amount) => {
    // Check if user is logged in
    if (!user) {
      navigate('/register');
      return;
    }

    try {
      // 1. Create Order on Backend
      const { data: order } = await axios.post('http://localhost:5000/api/payment/orders', { amount });

      const options = {
        key: "rzp_test_RwamaWm0iS2e9R",
        amount: order.amount,
        currency: "INR",
        name: "Community Fund",
        description: `Donation for ${campaign.title}`,
        order_id: order.id,
        handler: async (response) => {
          // 2. Verify Payment on Backend
          const verifyData = {
            ...response,
            campaignId: campaign._id,
            amount,
            donorName: user?.name || "Anonymous"
          };
          const { data } = await axios.post('http://localhost:5000/api/payment/verify', verifyData);

          if (data.status === "success") {
            alert("Donation Successful! Thank you.");
            window.location.reload();
          }
        },
        prefill: {
          name: user?.name || "Donor Name",
          email: user?.email || "donor@example.com"
        },
        theme: { color: "#4F46E5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Something went wrong with the payment process.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!campaign) return <div className="h-screen flex items-center justify-center">Campaign not found</div>;

  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header / Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          <ArrowLeft size={20} /> Back to Campaigns
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full aspect-video object-cover"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {campaign.title}
            </h1>
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </div>
          </div>
        {/* Right Column: Fundraising Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-indigo-50 sticky top-24">
            <div className="space-y-6">
              <div>
                <span className="text-4xl font-black text-indigo-600">₹{campaign.currentAmount}</span>
                <span className="text-gray-500 ml-2">raised of ₹{campaign.targetAmount}</span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-2xl border">
                  <Target className="mx-auto text-gray-400 mb-1" size={20} />
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Goal</p>
                  <p className="font-bold text-gray-900">₹{campaign.targetAmount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border">
                  <Calendar className="mx-auto text-gray-400 mb-1" size={20} />
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">End Date</p>
                  <p className="font-bold text-gray-900">{new Date(campaign.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Enter donation amount (₹)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  min="1"
                />
                <button
                  onClick={() => {
                    const amount = customAmount ? parseInt(customAmount) : 1000;
                    if (amount > 0) {
                      handlePayment(amount);
                      setCustomAmount('');
                    } else {
                      alert('Please enter a valid amount');
                    }
                  }}
                  disabled={!customAmount || parseInt(customAmount) <= 0}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Donate {customAmount ? `₹${customAmount}` : '₹0'}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 px-4">
                By donating, you agree to our terms and community guidelines. All funds go directly to the organizer.
              </p>
            </div>
          </div>
        </div>

          {/* Donor List Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Users className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Donors</h2>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                {campaign.donors?.length || 0}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaign.donors && campaign.donors.length > 0 ? (
                campaign.donors.slice().reverse().map((donor, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                        {donor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800">{donor.name}</p>
                          {donor.method === 'offline' && (
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              Offline
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{new Date(donor.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="font-black text-indigo-600 text-lg">₹{donor.amount}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <p className="text-gray-400">No donations yet. Be the first to support this cause!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default CampaignDetails;