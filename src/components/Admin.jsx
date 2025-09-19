import React, { useState } from 'react';
import { Shield, BarChart, Bell, Leaf, LogOut, Edit, Trash2, PlusCircle, User } from 'lucide-react';
import clsx from 'clsx';

// --- FAKE DATA (To simulate a database) ---
const initialMspData = [
  { id: 1, crop: 'Paddy (Grade A)', price: 2203 },
  { id: 2, crop: 'Jowar (Hybrid)', price: 3180 },
  { id: 3, crop: 'Cotton (Long Staple)', price: 7020 },
  { id: 4, crop: 'Tur (Arhar)', price: 7000 },
];

const initialSeedData = [
  { id: 1, crop: 'Cotton', variety: 'BT-II', certification: 'Agri-Gold', vendor: 'Kisan Seeds' },
  { id: 2, crop: 'Paddy', variety: 'Sona Masuri', certification: 'Govt. Certified', vendor: 'Telangana Seeds Corp' },
];

// --- Main Admin Dashboard Component ---
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('msp'); // 'msp', 'notifications', 'seeds', 'profile'
  const adminUsername = "admin_user"; // Placeholder username

  // Simple logout function placeholder
  const handleLogout = () => {
    alert("Logged out successfully!");
    // In a real app, you'd clear the auth token and redirect
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'msp':
        return <ManageMsp />;
      case 'notifications':
        return <ManageNotifications />;
      case 'seeds':
        return <ManageSeeds />;
      case 'profile':
        return <ProfilePage username={adminUsername} />;
      default:
        return <ManageMsp />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={clsx(
        "flex items-center w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200",
        { "bg-gray-700": activeView === view }
      )}
    >
      <Icon className="mr-3" size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    // This root div sets the default text colors for light and dark modes
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            <Shield className="text-green-400" size={32} />
            <h1 className="text-2xl font-bold ml-2">Admin Panel</h1>
          </div>
          <nav className="space-y-2">
            <NavItem view="msp" icon={BarChart} label="Manage MSP" />
            <NavItem view="notifications" icon={Bell} label="Notifications" />
            <NavItem view="seeds" icon={Leaf} label="Seed Listings" />
            <NavItem view="profile" icon={User} label="Profile" />
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <LogOut className="mr-3" size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {renderActiveView()}
      </main>
    </div>
  );
}


// --- Feature Sub-Components ---

const Card = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{children}</h2>
);

const Button = ({ children, onClick, className = "bg-green-600 hover:bg-green-700" }) => (
  <button onClick={onClick} className={`px-4 py-2 text-white font-semibold rounded-lg shadow transition-colors ${className}`}>
    {children}
  </button>
);

const Input = ({ placeholder, type = "text" }) => (
    <input type={type} placeholder={placeholder} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
);

// MSP Management Component
function ManageMsp() {
  const [msp, setMsp] = useState(initialMspData);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manage MSP Prices</h1>
        <Button onClick={() => alert("Opening form to add new MSP...")}>
          <PlusCircle className="inline mr-2" /> Add New MSP
        </Button>
      </div>
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="p-4">Crop Name</th>
              <th className="p-4">Price (₹ per Quintal)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {msp.map(({ id, crop, price }) => (
              <tr key={id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-4 font-semibold">{crop}</td>
                <td className="p-4">₹{price.toLocaleString('en-IN')}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => alert(`Editing ${crop}`)} className="text-blue-500 hover:text-blue-400 p-2"><Edit /></button>
                  <button onClick={() => alert(`Deleting ${crop}`)} className="text-red-500 hover:text-red-400 p-2"><Trash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// Notifications Component
function ManageNotifications() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Publish Notifications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardTitle>Create New Notification</CardTitle>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Publishing notification...'); }}>
                <Input placeholder="Notification Title" />
                <textarea placeholder="Notification Body..." rows="4" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Low Priority</option>
                    <option>Medium Priority</option>
                    <option>High Priority</option>
                </select>
                <Input placeholder="Expiry Date" type="date" />
                <Button>Publish Notification</Button>
            </form>
        </Card>
        <Card>
            <CardTitle>Active Notifications</CardTitle>
            <div className="space-y-4">
                {/* MODIFIED: Added explicit text colors for light/dark modes */}
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 rounded-r-lg">
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Subsidy Application Deadline Extended</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">The deadline for PM-KISAN subsidy applications has been extended to Oct 15, 2025.</p>
                </div>
                 {/* MODIFIED: Added explicit text colors for light/dark modes */}
                 <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30 rounded-r-lg">
                    <h3 className="font-bold text-red-800 dark:text-red-200">High Alert: Pest Warning</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">Pink Bollworm infestation reported in Warangal district. Farmers are advised to take preventive measures.</p>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}

// Seed Listings Component
function ManageSeeds() {
    const [seeds, setSeeds] = useState(initialSeedData);
    return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manage Seed Listings</h1>
        <Button onClick={() => alert("Opening form to add new seed...")}>
          <PlusCircle className="inline mr-2" /> Add New Listing
        </Button>
      </div>
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="p-4">Crop</th>
              <th className="p-4">Variety</th>
              <th className="p-4">Certification</th>
              <th className="p-4">Vendor</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seeds.map(({ id, crop, variety, certification, vendor }) => (
              <tr key={id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-4 font-semibold">{crop}</td>
                <td className="p-4">{variety}</td>
                <td className="p-4">{certification}</td>
                <td className="p-4">{vendor}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => alert(`Editing ${crop}`)} className="text-blue-500 hover:text-blue-400 p-2"><Edit /></button>
                  <button onClick={() => alert(`Deleting ${crop}`)} className="text-red-500 hover:text-red-400 p-2"><Trash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// Profile Page Component
function ProfilePage({ username }) {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Admin Profile</h1>
            <Card className="max-w-md">
                <CardTitle>Change Password</CardTitle>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Updating password...'); }}>
                    <div className="text-lg">
                        <strong>Username:</strong> {username}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Current Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">New Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Confirm New Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button>Update Password</Button>
                </form>
            </Card>
        </div>
    );
}
