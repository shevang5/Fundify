import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById } from '../api';
import axios from 'axios';
import { Calendar, Target, ArrowLeft, Users, ShieldCheck, Share2, Info, Globe } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState('');
  const [showDonateInput, setShowDonateInput] = useState(false);
  const [showOfflineInput, setShowOfflineInput] = useState(false);
  const [offlineAmount, setOfflineAmount] = useState('');
  const [offlineDonorName, setOfflineDonorName] = useState('');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const getCampaign = async () => {
      try {
        const { data } = await fetchCampaignById(id);
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign", error);
      } finally {
        setLoading(false);
      }
    };
    getCampaign();
  }, [id]);

  const handlePayment = async (amount) => {
    if (!user) { navigate('/register'); return; }
    try {
      const { data: order } = await axios.post('http://localhost:5000/api/payment/orders', { amount });
      const options = {
        key: "rzp_test_RwamaWm0iS2e9R",
        amount: order.amount,
        currency: "INR",
        name: "Fundify",
        order_id: order.id,
        handler: async (response) => {
          const verifyData = { ...response, campaignId: campaign._id, amount, donorName: user?.name || "Anonymous" };
          await axios.post('http://localhost:5000/api/payment/verify', verifyData);
          window.location.reload();
        },
        theme: { color: "#86efac" } // Mint green theme to match image
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment failed");
    }
  };

  const handleOfflineDonation = async () => {
    if (!offlineAmount || !offlineDonorName) {
      alert('Please enter both name and amount');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/campaigns/offline-donation', {
        campaignId: campaign._id,
        amount: parseInt(offlineAmount),
        donorName: offlineDonorName
      });
      alert('Offline donation recorded!');
      setOfflineAmount('');
      setOfflineDonorName('');
      setShowOfflineInput(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to record offline donation");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!campaign) return <div className="h-screen flex items-center justify-center">Not Found</div>;

  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-12 font-sans antialiased text-slate-800">
      
      {/* Mobile Header Nav */}
      <nav className="lg:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-50 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-100 rounded-xl shadow-sm"><ArrowLeft size={20}/></button>
        <span className="font-bold text-sm tracking-tight text-slate-500">Fundify</span>
        <button className="p-2 border border-gray-100 rounded-xl shadow-sm"><Share2 size={20}/></button>
      </nav>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT: Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* The "Main Card" Look from the image */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-4 lg:p-8 shadow-sm">
              <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-slate-900 leading-tight">
                {campaign.title}
              </h1>

              {/* Image Section with "Empower Change" style label */}
              <div className="relative rounded-[1.5rem] overflow-hidden mb-6">
                <img src={campaign.image} alt={campaign.title} className="w-full aspect-video object-cover" />
                <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-2xl shadow-lg hidden lg:block">
                  <p className="font-black text-slate-900 uppercase leading-none text-xl">Empower<br/>Change!</p>
                </div>
              </div>

              {/* Stats Bar directly under image (as per your request) */}
              <div className="space-y-4 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-500">₹{campaign.currentAmount.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm font-medium">Collected from ₹{campaign.targetAmount.toLocaleString()}</span>
                </div>

                <div className="relative w-full h-3 bg-emerald-50 rounded-full overflow-hidden">
                   <div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-lime-300 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                   />
                </div>
                
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                   <span>{Math.round(progress)}% Progress</span>
                   <span>12 Days Left</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-500 leading-relaxed text-sm lg:text-base border-t pt-6">
                {campaign.description}
              </p>

              {/* Organizer Info Box */}
              <div className="mt-8 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">★</div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Fundraising Information</p>
                    <p className="font-bold text-slate-800 text-sm">Verified Organization <ShieldCheck size={14} className="inline text-emerald-500"/></p>
                  </div>
                </div>
                <button className="hidden lg:flex items-center gap-2 text-xs font-bold border px-4 py-2 rounded-xl bg-white">Details of fund <Info size={14}/></button>
              </div>
            </div>

            {/* Supporter List (Mobile Optimized) */}
{/* Supporter List (Mobile Optimized & 3-Column Layout) */}
<div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
    <h3 className="font-bold mb-6 text-slate-900 flex items-center gap-2">
        <Users size={20} className="text-emerald-500" /> Recent Supporters
    </h3>
    
    <div className="space-y-4">
        {/* --- DESKTOP HEADER (3 Columns) --- */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Donor Name</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Donated Amount</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Payment Type</span>
        </div>
        
        {campaign.donors?.length > 0 ? (
            campaign.donors.slice().reverse().map((donor, i) => (
                <div key={i} className="block md:grid md:grid-cols-3 gap-4 py-4 border-b border-gray-50 last:border-0 items-center transition-colors hover:bg-slate-50/50 rounded-xl px-2">
                    
                    {/* COLUMN 1: DONOR NAME */}
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                            donor.type === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {donor.name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-800">{donor.name}</p>
                            {/* Mobile-only sub-text */}
                            <p className="md:hidden text-[10px] text-slate-400">
                                {new Date(donor.date || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* COLUMN 2: AMOUNT */}
                    <div className="mt-3 md:mt-0 flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-[11px] font-bold text-slate-400 uppercase">Amount:</span>
                        <p className="font-black text-sm text-slate-900">₹{donor.amount.toLocaleString()}</p>
                    </div>

                    {/* COLUMN 3: TYPE (Online/Offline) */}
                    <div className="mt-2 md:mt-0 flex items-center justify-between md:justify-end">
                        <span className="md:hidden text-[11px] font-bold text-slate-400 uppercase">Via:</span>
                        <span className={`flex items-center gap-1.5 px-3 py-1.2 md:py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                            donor.type === 'online' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-blue-100 text-blue-700'
                        }`}>
                            {donor.type === 'online' ? (
                                <><Globe size={10} /> Online</>
                            ) : (
                                <><IndianRupee size={10} /> Offline</>
                            )}
                        </span>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-slate-400 text-sm italic">No donations yet. Be the first to support!</p>
            </div>
        )}
    </div>
</div>

            
          </div>

          {/* RIGHT: Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm sticky top-10">
               {!showDonateInput ? (
                 <>
                   <button 
                    onClick={() => setShowDonateInput(true)}
                    className="w-full bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-900 font-bold py-4 rounded-2xl mb-4 hover:shadow-lg transition"
                   >
                     Donate
                   </button>
                   {campaign.offlineCollectorEmail && user?.email === campaign.offlineCollectorEmail && (
                     <button 
                      onClick={() => setShowOfflineInput(true)}
                      className="w-full border-2 border-blue-200 text-blue-600 font-bold py-4 rounded-2xl mb-4 hover:bg-blue-50 transition"
                     >
                       Add Offline Donation
                     </button>
                   )}
                   <button className="w-full border-2 border-emerald-100 text-emerald-600 font-bold py-4 rounded-2xl mb-8">
                     Share
                   </button>
                 </>
               ) : (
                 <div className="space-y-3 mb-8">
                   {!showOfflineInput ? (
                     <>
                       <input 
                         type="number" 
                         placeholder="Enter amount in ₹"
                         value={customAmount}
                         onChange={(e) => setCustomAmount(e.target.value)}
                         autoFocus
                         className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:outline-none font-bold text-slate-700 border border-emerald-200"
                       />
                       <button 
                        onClick={() => handlePayment(parseInt(customAmount || 1000))}
                        className="w-full bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-900 font-bold py-3 rounded-xl hover:shadow-lg transition"
                       >
                         Confirm Donation
                       </button>
                     </>
                   ) : (
                     <>
                       <input 
                         type="text" 
                         placeholder="Donor Name"
                         value={offlineDonorName}
                         onChange={(e) => setOfflineDonorName(e.target.value)}
                         autoFocus
                         className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:outline-none font-bold text-slate-700 border border-blue-200"
                       />
                       <input 
                         type="number" 
                         placeholder="Amount in ₹"
                         value={offlineAmount}
                         onChange={(e) => setOfflineAmount(e.target.value)}
                         className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:outline-none font-bold text-slate-700 border border-blue-200"
                       />
                       <button 
                        onClick={handleOfflineDonation}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition"
                       >
                         Record Donation
                       </button>
                     </>
                   )}
                   <button 
                    onClick={() => {
                      setShowDonateInput(false);
                      setShowOfflineInput(false);
                      setCustomAmount('');
                      setOfflineAmount('');
                      setOfflineDonorName('');
                    }}
                    className="w-full border-2 border-gray-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
                   >
                     Cancel
                   </button>
                 </div>
               )}

               <div className="space-y-4">
                 {/* Re-using donor items like the image */}
                 {/* {campaign.donors?.slice(0, 3).map((donor, i) => (
                   <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl">
                      <span className="font-bold">{donor.name}</span>
                      <span className="text-emerald-500 font-black">₹{donor.amount}</span>
                   </div>
                 ))} */}
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* FIXED MOBILE DONATION BAR */}
      {/* Fixed Mobile Donation Bar with Slide-up Animation */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100]">
  
  {/* 1. Dim Backdrop: Appears when user is typing an amount */}
  {showDonateInput && (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={() => setShowDonateInput(false)}
    />
  )}

  {/* 2. Main Action Bar */}
  <div className={`relative bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-4 pb-8 transition-all duration-300 ${showDonateInput || showOfflineInput ? 'rounded-t-[2rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]' : ''}`}>
    
    {!showDonateInput && !showOfflineInput ? (
      /* Initial State: Big bold CTA */
      <div className="space-y-3">
        <button 
          onClick={() => setShowDonateInput(true)}
          className="w-full bg-[#D1F266] hover:bg-[#c4e650] text-black font-black rounded-2xl py-4 shadow-xl shadow-lime-200/50 active:scale-[0.98] transition-all"
        >
          Donate
        </button>
        {campaign.offlineCollectorEmail && user?.email === campaign.offlineCollectorEmail && (
          <button 
            onClick={() => setShowOfflineInput(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl py-4 shadow-xl shadow-blue-200/50 active:scale-[0.98] transition-all"
          >
            Add Offline Donation
          </button>
        )}
      </div>
    ) : showDonateInput ? (
      /* Online Donation State */
      <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-bold text-slate-500">Enter Amount</span>
          <button 
            onClick={() => { setShowDonateInput(false); setCustomAmount(''); }}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
            <input 
              type="number" 
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-4 py-4 bg-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none font-black text-xl text-slate-900 transition-all"
            />
          </div>
          
          <button 
            onClick={() => handlePayment(parseInt(customAmount || 500))}
            disabled={!customAmount || customAmount <= 0}
            className=" bg-black text-[#D1F266] font-black rounded-2xl px-6 py-6 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Confirm
          </button>
        </div>
      </div>
    ) : (
      /* Offline Donation State */
      <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-bold text-slate-500">Record Offline Donation</span>
          <button 
            onClick={() => { setShowOfflineInput(false); setOfflineAmount(''); setOfflineDonorName(''); }}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Donor Name"
            value={offlineDonorName}
            onChange={(e) => setOfflineDonorName(e.target.value)}
            autoFocus
            className="w-full px-4 py-4 bg-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none font-bold text-slate-900 transition-all"
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
            <input 
              type="number" 
              placeholder="0.00"
              value={offlineAmount}
              onChange={(e) => setOfflineAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-4 bg-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none font-black text-xl text-slate-900 transition-all"
            />
          </div>
          
          <button 
            onClick={handleOfflineDonation}
            disabled={!offlineAmount || !offlineDonorName || offlineAmount <= 0}
            className="bg-blue-600 text-white font-black rounded-2xl px-6 py-6 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Record
          </button>
        </div>
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default CampaignDetails;