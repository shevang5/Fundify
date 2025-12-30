import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';

const AdminDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [showOfflineForm, setShowOfflineForm] = useState(null);
    const [offlineForm, setOfflineForm] = useState({ donorName: '', amount: '' });
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const fetchAll = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/campaigns', config);
            setCampaigns(data);
        } catch (err) {
            console.error("Not authorized or server error");
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/admin/campaigns/${id}`, { status: newStatus }, config);
            fetchAll();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleAddOfflineDonation = async (campaignId) => {
        try {
            if (!offlineForm.donorName || !offlineForm.amount) {
                alert("Please fill in all fields");
                return;
            }
            await axios.post('http://localhost:5000/api/payment/offline', {
                campaignId,
                donorName: offlineForm.donorName,
                amount: parseInt(offlineForm.amount)
            });
            alert("Offline donation added successfully!");
            setOfflineForm({ donorName: '', amount: '' });
            setShowOfflineForm(null);
            fetchAll();
        } catch (err) {
            alert("Failed to add offline donation");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Admin Review Panel</h1>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <tr>
                                <th className="p-4">Campaign</th>
                                <th className="p-4">Organizer</th>
                                <th className="p-4">Target</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {campaigns.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium">{c.title}</td>
                                    <td className="p-4 text-gray-600">{c.organizer?.name || 'Unknown'}</td>
                                    <td className="p-4">₹{c.targetAmount}</td>
                                    <td className="p-4">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="p-4">
                                        <ActionButtons 
                                            campaign={c} 
                                            handleStatusUpdate={handleStatusUpdate} 
                                            setShowOfflineForm={setShowOfflineForm} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View - Hidden on desktop */}
                <div className="md:hidden divide-y divide-gray-200">
                    {campaigns.map((c) => (
                        <div key={c._id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                                    <p className="text-sm text-gray-500">By {c.organizer?.name || 'Unknown'}</p>
                                </div>
                                <StatusBadge status={c.status} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-indigo-600">Target: ₹{c.targetAmount}</span>
                                <div className="flex gap-1">
                                    <ActionButtons 
                                        campaign={c} 
                                        handleStatusUpdate={handleStatusUpdate} 
                                        setShowOfflineForm={setShowOfflineForm} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Offline Donation Modal */}
            {showOfflineForm && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm md:max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add Donation</h2>
                            <button onClick={() => setShowOfflineForm(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Donor Name"
                                value={offlineForm.donorName}
                                onChange={(e) => setOfflineForm({ ...offlineForm, donorName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                value={offlineForm.amount}
                                onChange={(e) => setOfflineForm({ ...offlineForm, amount: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={() => handleAddOfflineDonation(showOfflineForm)}
                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 order-1 sm:order-2"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setShowOfflineForm(null)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 order-2 sm:order-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components for cleaner code
const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase ${
        status === 'active' ? 'bg-green-100 text-green-700' :
        status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
    }`}>
        {status}
    </span>
);

const ActionButtons = ({ campaign, handleStatusUpdate, setShowOfflineForm }) => (
    <div className="flex gap-1 md:gap-2">
        {campaign.status === 'pending' && (
            <>
                <button
                    onClick={() => handleStatusUpdate(campaign._id, 'active')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Approve"
                >
                    <CheckCircle size={20} />
                </button>
                <button
                    onClick={() => handleStatusUpdate(campaign._id, 'rejected')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Reject"
                >
                    <XCircle size={20} />
                </button>
            </>
        )}
        {campaign.status === 'active' && (
            <button
                onClick={() => setShowOfflineForm(campaign._id)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
            >
                <Plus size={20} />
                <span className="text-xs font-bold md:hidden">Add Donation</span>
            </button>
        )}
    </div>
);

export default AdminDashboard;