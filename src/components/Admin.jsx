// AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, BarChart, Bell, Leaf, LogOut, Edit, Trash2, PlusCircle, User, X } from 'lucide-react';
import clsx from 'clsx';

// --- FAKE DATA (To simulate parts of the dashboard that still use local state) ---
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
  const navigate = useNavigate(); // Get the navigation function from the router

  // Logout: clear session key and navigate home
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/');
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
        return <ProfilePage username={adminUsername} onLogout={handleLogout} />;
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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between hidden md:flex">
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

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
}

// --- Reusable UI Components ---
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{children}</h2>
);

const Button = ({ children, onClick, className = "bg-green-600 hover:bg-green-700", type = "button" }) => (
  <button onClick={onClick} type={type} className={`px-4 py-2 text-white font-semibold rounded-lg shadow transition-colors ${className}`}>
    {children}
  </button>
);

const Input = React.forwardRef(({ value, onChange, placeholder, type = "text", name }, ref) => (
  <input
    ref={ref}
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200"
  />
));

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><X size={24} /></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Form Components for Modals ---
function MspForm({ onSave, onCancel, msp }) {
  const [formData, setFormData] = useState({
    crop: msp?.crop || '',
    price: msp?.price || ''
  });
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...msp, ...formData, price: Number(formData.price) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Crop Name</label>
        <Input ref={firstInputRef} name="crop" value={formData.crop} onChange={handleChange} placeholder="e.g., Paddy (Grade A)" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Price (₹ per Quintal)</label>
        <Input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="e.g., 2203" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

function SeedForm({ onSave, onCancel, seed }) {
  const [formData, setFormData] = useState({
    crop: seed?.crop || '',
    variety: seed?.variety || '',
    certification: seed?.certification || '',
    vendor: seed?.vendor || ''
  });
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...seed, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Crop Name</label>
        <Input ref={firstInputRef} name="crop" value={formData.crop} onChange={handleChange} placeholder="e.g., Cotton" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Variety</label>
        <Input name="variety" value={formData.variety} onChange={handleChange} placeholder="e.g., BT-II" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Certification</label>
        <Input name="certification" value={formData.certification} onChange={handleChange} placeholder="e.g., Govt. Certified" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Vendor</label>
        <Input name="vendor" value={formData.vendor} onChange={handleChange} placeholder="e.g., Kisan Seeds" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
        <Button type="submit">Save Listing</Button>
      </div>
    </form>
  );
}

// --- Feature Components ---
function ManageMsp() {
  const [mspList, setMspList] = useState(initialMspData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMsp, setEditingMsp] = useState(null);

  const handleAddNew = () => {
    setEditingMsp(null);
    setIsModalOpen(true);
  };

  const handleEdit = (msp) => {
    setEditingMsp(msp);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this MSP entry?")) {
      setMspList(mspList.filter(item => item.id !== id));
    }
  };

  const handleSave = (mspData) => {
    if (editingMsp) {
      setMspList(mspList.map(item => item.id === mspData.id ? mspData : item));
    } else {
      setMspList([...mspList, { ...mspData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Manage MSP Prices</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="inline mr-2" size={20} /> Add New MSP
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="p-4">Crop Name</th>
                <th className="p-4">Price (₹ per Quintal)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mspList.map((msp) => (
                <tr key={msp.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-4 font-semibold">{msp.crop}</td>
                  <td className="p-4">₹{msp.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(msp)} className="text-blue-500 hover:text-blue-400 p-2"><Edit /></button>
                    <button onClick={() => handleDelete(msp.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMsp ? "Edit MSP Price" : "Add New MSP Price"}
      >
        <MspForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} msp={editingMsp} />
      </Modal>
    </div>
  );
}

function ManageNotifications() {
  // We now use axios to fetch/post/delete notifications at http://localhost:5000/notifications
  const API_BASE = 'http://localhost:5000/notifications';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', body: '', priority: 'Low', expiry: '' });

  useEffect(() => {
    let cancelled = false;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_BASE);
        if (!cancelled) {
          // assume backend returns an array
          // sort by newest first if `createdAt` or by id (if numeric timestamp)
          setNotifications(Array.isArray(res.data) ? res.data.slice().reverse() : []);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
        alert('Warning: Could not fetch notifications from server. Running with local view only.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchNotifications();
    return () => { cancelled = true; };
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      alert('Please fill in the title and body.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      priority: form.priority || 'Low',
      expiry: form.expiry || '',
      date: new Date().toISOString().slice(0, 10),
      active: true
    };

    try {
      // Optimistic UI: add immediately (but backend ID may differ)
      const tempId = Date.now();
      const optimistic = { ...payload, id: tempId };
      setNotifications(prev => [optimistic, ...prev]);

      // POST to backend
      const res = await axios.post(API_BASE, payload);

      // If server returns created object with ID, replace optimistic id
      const created = res && res.data ? res.data : null;
      if (created && created.id) {
        setNotifications(prev => prev.map(n => n.id === tempId ? created : n));
      } else {
        // If backend didn't provide id, leave optimistic one (or update with server response)
        // Optionally, you can refresh list from server here.
      }

      setForm({ title: '', body: '', priority: 'Low', expiry: '' });
      alert('Notification added!');
    } catch (err) {
      console.error('Failed to add notification', err);
      // rollback optimistic
      setNotifications(prev => prev.filter(n => n.date !== payload.date || n.title !== payload.title));
      alert('Failed to add notification to server.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    // optimistic remove
    const prev = notifications;
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await axios.delete(`${API_BASE}/${id}`);
    } catch (err) {
      console.error('Failed to delete notification', err);
      alert('Failed to delete notification on server. Restoring locally.');
      setNotifications(prev); // rollback
    }
  };

  const priorityColorClasses = {
    'Low': 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
    'Medium': 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30',
    'High': 'border-red-500 bg-red-50 dark:bg-red-900/30',
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Publish Notifications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardTitle>Create New Notification</CardTitle>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="title" value={form.title} onChange={handleInputChange} placeholder="Notification Title" />
            <textarea name="body" value={form.body} onChange={handleInputChange} placeholder="Notification Body..." rows="4" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200"></textarea>
            <select name="priority" value={form.priority} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <Input name="expiry" value={form.expiry} onChange={handleInputChange} placeholder="Expiry Date" type="date" />
            <div className="flex justify-end">
              <Button type="submit">Publish Notification</Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardTitle>Active Notifications</CardTitle>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {loading && <p>Loading notifications...</p>}
            {!loading && notifications.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No notifications found.</p>}
            {!loading && notifications.map(n => (
              <div key={n.id} className={`p-4 border-l-4 rounded-r-lg ${priorityColorClasses[n.priority || 'Low']}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{n.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{n.body}</p>
                    {n.expiry && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Expires on: {n.expiry}</p>}
                    {n.date && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Published: {n.date}</p>}
                  </div>
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-400 p-1 ml-2 flex-shrink-0"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ManageSeeds() {
  const [seedList, setSeedList] = useState(initialSeedData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeed, setEditingSeed] = useState(null);

  const handleAddNew = () => {
    setEditingSeed(null);
    setIsModalOpen(true);
  };

  const handleEdit = (seed) => {
    setEditingSeed(seed);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this seed listing?")) {
      setSeedList(seedList.filter(item => item.id !== id));
    }
  };

  const handleSave = (seedData) => {
    if (editingSeed) {
      setSeedList(seedList.map(item => item.id === seedData.id ? seedData : item));
    } else {
      setSeedList([...seedList, { ...seedData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Manage Seed Listings</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="inline mr-2" /> Add New Listing
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
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
              {seedList.map((seed) => (
                <tr key={seed.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-4 font-semibold">{seed.crop}</td>
                  <td className="p-4">{seed.variety}</td>
                  <td className="p-4">{seed.certification}</td>
                  <td className="p-4">{seed.vendor}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(seed)} className="text-blue-500 hover:text-blue-400 p-2"><Edit /></button>
                    <button onClick={() => handleDelete(seed.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSeed ? "Edit Seed Listing" : "Add New Seed Listing"}
      >
        <SeedForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} seed={editingSeed} />
      </Modal>
    </div>
  );
}

function ProfilePage({ username, onLogout }) {
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirmPass: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      alert("New passwords do not match!");
      return;
    }
    if (!passwords.current || !passwords.newPass) {
      alert("Please fill all fields.");
      return;
    }
    alert(`Password for ${username} has been updated successfully!`);
    setPasswords({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Admin Profile</h1>
      <Card className="max-w-md">
        <CardTitle>Change Password</CardTitle>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-lg">
            <strong>Username:</strong> {username}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Current Password</label>
            <Input type="password" name="current" value={passwords.current} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">New Password</label>
            <Input type="password" name="newPass" value={passwords.newPass} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Confirm New Password</label>
            <Input type="password" name="confirmPass" value={passwords.confirmPass} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Update Password</Button>
            <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700">Logout</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
