import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampaign } from '../api';
import { LayoutGrid, IndianRupee, Image as ImageIcon, Calendar } from 'lucide-react';

const CreateCampaign = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCampaign(formData);
            alert('Campaign created! Waiting for Admin approval.');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Start a Campaign</h1>
                    <p className="text-gray-500">Fill in the details for your community event.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <LayoutGrid size={18} className="text-indigo-600" /> Event Title
                        </label>
                        <input
                            type="text" required placeholder="e.g. Annual Ganpati Festival 2024"
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
                        <textarea
                            rows="4" required placeholder="Tell people why they should donate..."
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Target Amount */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <IndianRupee size={18} className="text-indigo-600" /> Target Amount
                            </label>
                            <input
                                type="number" required placeholder="50000"
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Calendar size={18} className="text-indigo-600" /> End Date
                            </label>
                            <input
                                type="date" required
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <ImageIcon size={18} className="text-indigo-600" /> Banner Image URL
                        </label>
                        <input
                            type="text" required placeholder="https://image-link.com/photo.jpg"
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Launch Campaign'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;